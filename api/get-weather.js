const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ error: "Ciudad es requerida" });
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );
        const data = await response.json();
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Fallo al obtener el clima" });
    }
};