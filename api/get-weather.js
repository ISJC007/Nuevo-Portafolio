const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    // 1. Validar que la ciudad haya sido enviada desde el front-end
    if (!city) {
        return res.status(400).json({ error: "Ciudad es requerida" });
    }

    // 2. Validar que la API Key esté configurada en las variables de entorno
    if (!apiKey) {
        return res.status(500).json({ error: "API Key no configurada en el servidor" });
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );
        
        const data = await response.json();
        
        // 3. Devolver la respuesta de OpenWeather directamente al front-end
        res.status(200).json(data);
        
    } catch (error) {
        // En caso de fallo de red o error de fetch
        res.status(500).json({ error: "Fallo al obtener el clima de forma segura" });
    }
};