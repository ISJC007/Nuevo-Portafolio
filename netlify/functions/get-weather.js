exports.handler = async (event) => {

  
    const API_KEY = process.env.OPENWEATHER_API_KEY; 

  const city = event.queryStringParameters.city || 'Caracas';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error en la función Netlify:", error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Fallo al obtener datos del clima.' }) };
  }
};