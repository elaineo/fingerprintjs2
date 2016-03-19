var express = require('express');
var path = require('path');
var cors = require('cors');
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
app.use(cors());

app.get('/', function(req, res){
  var headers = req.headers;
  console.log(headers);
  console.log(req.connection.remoteAddress);
  res.render('index.html', {headers: headers, 
                            remoteip: req.connection.remoteAddress});
});

app.post('/print', function(req, res){
  console.log(req.body);

  var data = req.body;
  data["headers"] = req.headers;
  data["ip"] = req.connection.remoteAddress;

  fs.appendFile('logs.txt', JSON.stringify(data), function (err) {
    if (err) throw err;
  });

});

var http = require('http').Server(app);

http.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});