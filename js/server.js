var http = require('http') 
var url = require('url');
var server=http.createServer( 
    function(request,response){
        console.log("Am primit o cerere..");
        console.log(request.url);
        response.writeHead(200, {
            "Content-Type" : "text/html",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Headers" : "*"
        });

        var scor = -1;
        var url = new URL("http://localhost:8080" + request.url);
        //console.log("url: ", url);
        var search_params = url.searchParams;
        //console.log("search: ", search_params);
        if(search_params.has("scor"))
        {
            scor = search_params.get("scor");
        }

        console.log(scor);
        response.end('Felicitari!<br>Ai raspuns corect la ' + scor + ' intrebari!');
});
server.listen(8080);
console.log ('Serverul creat asteapta cereri la http://localhost:8080');