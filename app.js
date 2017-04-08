/**
 * Created by Joe David on 07-04-2017.
 */
var express = require('express');
var app = express();
var request = require('request');
var http = require('http');
var path = require('path');


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/form.html'));
});



var Agent= function Agent(name, port, capability) {
    this._name = name;
    this.connections = [];
    //this.flagVisited = false;
    this.capability = capability;
    this.port = port;
    this.url = "127.0.0.1";
    this.runServer(port);
};



    Agent.prototype.runServer = function (port) {
    this.port = port;
    var ref = this;

    var myServer = http.createServer(function (req, res) {
        if(req.method == 'GET'){
            //Handle GET method.
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Agent ' + ref._name + ' is running.');
        }
    });

    myServer.listen(port, "127.0.0.1", function() {
        console.log('Agent server ' + ref._name + ' is running at http://127.0.0.1:' + port);

});
};


Agent.prototype.makeRequest = function (whoToAsk, req) {

    var options = {
        method: 'post',
        body: req, // Javascript object
        url: "http://127.0.0.1:" + whoToAsk,
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    //Print the result of the HTTP POST request
    request(options, function (err, res, body) {
        if (err) {
            console.log('Error making request by' + this._name + 'to ' + whoToAsk + ', detail:', err);
            return;
        }
        else {
            console.log(body);
            console.log('Request made  by' + this._name + 'to ' + whoToAsk );
            //Process response
            //res.write("OK");
            //    res.end("OK");
        }
    });

};

var rob_1 = new Agent('rob_1', 6011, "red");
var cnv_1 = new Agent('cnv_1', 6012, "");
var rob_2 = new Agent('rob_2', 6021, "blue");
var cnv_2 = new Agent('cnv_2', 6022, "");
var rob_3 = new Agent('rob_3', 6031,  "green");
var cnv_3 = new Agent('cnv_3', 6032, "");
var rob_4 = new Agent('rob_4', 6041, "red");
var cnv_4 = new Agent('cnv_4', 6042, "");
var rob_5 = new Agent('rob_5', 6051,  "blue");
var cnv_5 = new Agent('cnv_5', 6052, "");
var rob_6 = new Agent('rob_6', 6061,  "green");
var cnv_6 = new Agent('cnv_6', 6062, "");
var rob_7 = new Agent('rob_7', 6071,  "red");
var cnv_7 = new Agent('cnv_7', 6072, "");
var rob_8 = new Agent('rob_8', 6081,  "blue");
var cnv_8 = new Agent('cnv_8', 6082, "");
var rob_9 = new Agent('rob_9', 6091, "green");
var cnv_9 = new Agent('cnv_9', 6092, "");
var rob_10= new Agent('rob_10', 6101, "red");
var cnv_10 = new Agent('cnv_10', 6102, "");


app.listen(5000, function(){
    console.log('Server Running on Port 5000');
});