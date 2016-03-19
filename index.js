var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var knownAgents = [];

fs.readFile('known_agents.json', 'utf8', function(err, data) {
  knownAgents = JSON.parse(data);
});

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

  if (knownAgents.indexOf(req.body.fingerprint) < 0) {
    var data = req.body;
    data["headers"] = req.headers;
    data["ip"] = req.connection.remoteAddress;

    fs.appendFile('logs.txt', JSON.stringify(data), function (err) {
      if (err) throw err;
    });
    knownAgents.push(req.body.fingerprint);
  }
  res.sendStatus(200);
});

var http = require('http').Server(app);

http.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(e) {
    console.log(knownAgents);
    fs.writeFileSync('known_agents.json', JSON.stringify(knownAgents), 'utf8');
    if (e) console.log(e.stack);
    process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null));