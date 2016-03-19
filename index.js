var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.set('port', process.env.PORT || 8080);
app.set('views', '.');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
  var headers = req.headers;
  console.log(headers);
  console.log(req.connection.remoteAddress);
  res.render('index.html', {headers: headers, 
                            remoteip: req.connection.remoteAddress});
});

app.post('/print', function(req, res){
  console.log(req.body);

  var headers = req.getAllResponseHeaders().toLowerCase();
  console.log(headers);

  fs.appendFile('logs.txt', req.body, function (err) {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });

});

var http = require('http').Server(app);

http.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});