const http = require('http');

const data = JSON.stringify({
  jugador_id: 1,
  fecha_torneo: "Fecha 1"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/votar-jugador',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
