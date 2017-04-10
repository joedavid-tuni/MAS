/**
 * Created by Joe David on 09-04-2017.
 */
var validator = require('xsd-schema-validator');
var mysql = require('mysql');
var heartbeats = require('heartbeats');
var express = require('express');
var app = express();
var http = require('http');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, //Port number to connect to the db
    user: 'root', //The user name assigned to work with the database
    password: 'oracle', //password for the database
    database: 'dasdfinal' //Name of the database
});

connection.connect(function (err) {
    if (!err){
        console.log('Successfully connected to Database');
    }

});


var workstation= function workstation(wsname, capability) {
    this.wsname = wsname || '';
    this.capability = capability || 'I am a conveyor and i have no special capability';
};
var robAgent= function robAgent(wsname, name, port, capability) {
    this.base = workstation;
    this.base( wsname,capability);
    this.name = name;
    this.url = "127.0.0.1";
    //this.connections = [];
    this.runServer(port)
};
robAgent.prototype = new workstation;

workstation.prototype.runServer = function (port) {
    this.port = port;
    var ref = this;

    var myServer = http.createServer(function (req, res) {
        if(req.method == 'GET'){
            //Handle GET method.
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.write('\nI belong to : ' + ref.wsname);
            res.write('\nMy name is' + ref.name);
            res.write('\nMy capability is: ' + ref.capability)
            res.end('\nAgent ' + ref.name + ' is running.');
        }
    });

    myServer.listen(port, "127.0.0.1", function() {
        console.log('Agent server ' + ref.name + ' is running at http://127.0.0.1:' + port);

    });
};

// app.get('/submit', function(){
var rows_;
    var pallet_ = [];

    connection.query("SELECT * FROM Products INNER JOIN Orders ON Products.ProductID = Orders.ProductID", function(results,rows){
            console.log(rows);
            console.log('Size: ' + rows.length);
            var length = rows.length;
            console.log(rows[0].Quantity);

            for (rows_ = 0; rows_ < rows.length; rows_++) {
                for (var qty = 0; qty < rows[0].Quantity; qty++) {
                    var pallet = new pallAgent(rows[0].OrderID,rows[0].ProductID);
                    pallet_.push(pallet);
                }
            }
            console.log('Printing Contents: ');

            console.log(pallet_);


    });

// });



var cnvAgent= function cnvAgent(wsname, name, port) {
    this.base = workstation;
    this.base( wsname);
    this.name = name;
    this.zone1=0;
    this.zone2=0;
    this.zone3=0;
    this.zone4=0;
    this.zone5=0;
    this.url = "127.0.0.1";
//this.connections = [];
    this.runServer(port)
};

cnvAgent.prototype = new workstation;

var pallAgent= function pallAgent(id,ProductID) {
    this.Orderid = id;
    this.ProductID = ProductID;
    this.frame = false;
    this.keyboard = false;
    this.screen = false;
    this.paper = false;
    this.frameColour = "";
    this.frameType = "";
    this.keyboardColour = "";
    this.keyboardType = "";
    this.screen = "";
    this.screenType = "";
};


workstation.prototype.makeRequest = function (whoToAsk, req) {

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
        }
        else {
            console.log(body);
            console.log('Request made  by' + this._name + 'to ' + whoToAsk );

        }
    });

};


pallAgent.prototype.makeRequest = function (whoToAsk, req) {

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
        }
        else {
            console.log(body);
            console.log('Request made  by' + this._name + 'to ' + whoToAsk );
        }
    });

};

var rob_1 = new robAgent('WS1', 'rob_1', 6011,"red");
var cnv_1 = new cnvAgent('WS1', 'cnv_1', 6012);
var rob_2 = new robAgent('WS2','rob_2', 6021, "blue");
var cnv_2 = new cnvAgent('WS2','cnv_2', 6022);
var rob_3 = new robAgent('WS3','rob_3', 6031,  "green");
var cnv_3 = new cnvAgent('WS3','cnv_3', 6032);
var rob_4 = new robAgent('WS4','rob_4', 6041, "red");
var cnv_4 = new cnvAgent('WS4','cnv_4', 6042);
var rob_5 = new robAgent('WS5','rob_5', 6051,  "blue");
var cnv_5 = new cnvAgent('WS5','cnv_5', 6052);
var rob_6 = new robAgent('WS6','rob_6', 6061,  "green");
var cnv_6 = new cnvAgent('WS6','cnv_6', 6062);
var rob_7 = new robAgent('WS7','rob_7', 6071);
var cnv_7 = new cnvAgent('WS7','cnv_7', 6072);
var rob_8 = new robAgent('WS8','rob_8', 6081,  "blue");
var cnv_8 = new cnvAgent('WS8','cnv_8', 6082);
var rob_9 = new robAgent('WS9','rob_9', 6091, "green");
var cnv_9 = new cnvAgent('WS9','cnv_9', 6092);
var rob_10= new robAgent('WS10','rob_10', 6101, "red");
var cnv_10 = new cnvAgent('WS10','cnv_10', 6102);
var rob_11= new robAgent('WS11','rob_11', 6111, "red");
var cnv_11 = new cnvAgent('WS11','cnv_11', 6112);
var rob_12= new robAgent('WS12','rob_12', 6121, "red");
var cnv_12 = new cnvAgent('WS12','cnv_12', 6122);

// rob_1.runServer(6011);


app.listen(5001, function(){
    console.log('Server Running on Port 5000');
});