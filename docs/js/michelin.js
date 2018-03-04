//You can find the description of the project at the TOP of the README.md

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


var count = 0;

//Make a json file with all the rstaurants
function get() {
    var url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
    var json = { "restaurants": [] };
    var index = 0;
    var tab = new Array();
    number_pages(url, function (number) {
        for (let i = 1; i <= number; i++) {
            if (i != 1) {
                url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i;
            }
            get_restaurants_urls(url, function (urls_array) {
                urls_array.forEach(function (element) {
                    get_page(element, function (restaurant) {
                        json.restaurants.push(restaurant);
                        index++;
                        tab.push(restaurant);
                        if (index <= count) {
                            fs.writeFile('michelin.json', JSON.stringify(json.restaurants, null, 4), 'utf8', function (error) { });
                            console.log(JSON.stringify(json.restaurants, null, 4));                            
                        }
                    });
                });
            });
        }
    });
}

//Find the urls of the restaurants
function get_restaurants_urls(url, callback) {
    var urls_tab = [];
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            $('a[class=poi-card-link]').each(function (i, element) {
                urls_tab.push('https://restaurant.michelin.fr' + $(element).attr('href'));
                count++;
            });
            callback(urls_tab);
        }
    });
}


//Find the information of a restaurant
function get_page(url, callback) {
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var title = $('.poi_intro-display-title').first().text();
            var stars = $('.michelin-poi-distinctions-list').children('li').first().children('.content-wrapper').text()[0];
            var address = $('.thoroughfare').first().text();
            var city = $('.locality').first().text();
            var postal_code = $('.postal-code').first().text();            
            var type = $('.poi_intro-display-cuisines, .opt-upper__cuisines-info').first().text();            
            var chef = $('.field--name-field-chef').children('.field__items').children('.field__item').first().text()

            var restaurant = {
                "title": normalize(title),
                "stars":stars,
                "address": address,
                "city": city,
                "postal_code": postal_code,                
                "type": normalize(type),                
                "chef": chef,
                "url": url
            };
            callback(restaurant);
        }
    });
}

//There is spaces in the title and the type so we have to delete them
function normalize(item) {
    let newItem = "";
    let count = 0;
    for (let i = 2; i < item.length; i++) {
        if (item[i] != ' ') {
            if (count == 1) {
                newItem += " ";
            }
            newItem += item[i];
            count = 0;
        }
        if (item[i] == ' ') {
            count++;
        }
    }
    return newItem;
}

//Count the number of pages
function number_pages(url, callback) {
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var total = $('.mr-pager-item').eq(-4).text();
            callback(total);
        }
    });
}

module.exports.get = get;
