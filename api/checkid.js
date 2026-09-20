export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const id = req.query.id;

    if (!id || !/^\d{8,12}$/.test(id)) {
        return res.status(400).json({
            status: 0,
            error_msg: "Invalid ID format"
        });
    }

    const MERCHANT_ID = "M260920AIDD4241FF";
    const SIGNATURE   = "2cdeddb5a7d199c2712de0f6bb2806e7";

    const url = "https://v1.apigames.id/merchant/" + MERCHANT_ID +
                "/cek-username/freefire?user_id=" + encodeURIComponent(id) +
                "&signature=" + SIGNATURE;

    try {
        const r = await fetch(url);
        const data = await r.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            status: 0,
            error_msg: err.message
        });
    }
}
