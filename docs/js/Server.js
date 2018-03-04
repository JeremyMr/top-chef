//Load HTTP module
var http = require("http");

//Create the server HTTP on the port 80
http.createServer(function (req, res) {

	//Set the response
    res.writeHead(200, {'Content-Type': 'text/plain'});

    //Send Hello world
    res.write('Hello world');
    res.end();
    
}).listen(80);