const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log("Server running at http://localhost:%d", port);


// function onRequest(request, response) {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.write('Hello Yogendra Singh');
//     response.end();
// }
// http.createServer(onRequest).listen(4200);

