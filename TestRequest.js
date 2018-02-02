var http = require('http');
var https = require('https');
const rp = require('request-promise');
const cheerio = require('cheerio');

var i = 1;
do{
	const options = {
  		uri: `https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-`+i.toString(),
  		transform: function (body) {
    		return cheerio.load(body);
  		}
	};

	rp(options)
  	.then(($) => {
    	console.log($('.poi_card-display-title').text());
  	})
  	.catch((err) => {
    	console.log(err);
  	});
	i++;
}while(i<5) //Condition si on a plus de réponse (à faire)


/*http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Test');
    res.end();
}).listen(80);*/