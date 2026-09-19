import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const ADMIN_PASS = "kenzo123";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        try {
            const email = await redis.get("ress_email");
            const nama  = await redis.get("ress_name");
            return res.status(200).json({
                email: email || "medikaputra5@gmail.com",
                nama:  nama  || "RESS KENZO"
            });
        } catch(e) {
            return res.status(200).json({
                email: "medikaputra5@gmail.com",
                nama:  "RESS KENZO"
            });
        }
    }

    if (req.method === "POST") {
        let d = req.body;
        if (typeof d === "string") d = JSON.parse(d);

        if (!d || d.password !== ADMIN_PASS) {
            return res.status(401).json({
                success: false,
                error: "Password admin salah!"
            });
        }

        try {
            if (d.email) await redis.set("ress_email", d.email);
            if (d.nama)  await redis.set("ress_name",  d.nama);

            return res.status(200).json({
                success: true,
                email: d.email,
                nama:  d.nama
            });
        } catch(e) {
            return res.status(500).json({
                success: false,
                error: e.message
            });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
