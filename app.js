/**
 * Created by Joe David on 07-04-2017.
 */
var express = require('express');
var app = express();
var request = require('request');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var formidable = require('formidable');
var builder = require('xmlbuilder');
var validator = require('xsd-schema-validator');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, //Port number to connect to the db
    user: 'root', //The user name assigned to work with the database
    password: 'oracle', //password for the database
    database: 'dasdfinal' //Name of the database
});

var CustomerID;
var OrderID;
var SNo ;

//Connecting to the DATABASE
connection.connect(function (err) {
    if (!err) {

        console.log("Successfully Connected to Database :)");
        connection.query('delete from customers');
        connection.query('delete from products');
        connection.query('delete from orders');
        connection.query('ALTER TABLE Orders DROP OrderID', function(){
            connection.query('ALTER table Orders Add column OrderID Int(5) PRIMARY KEY AUTO_INCREMENT AFTER Sno', function(){
                connection.query(' ALTER TABLE Orders AUTO_INCREMENT=5000;')
            })
        });
        connection.query('ALTER TABLE customers DROP CustomerID', function(){
            connection.query('ALTER table customers Add column CustomerID Int(5) PRIMARY KEY AUTO_INCREMENT AFTER Sno', function(){
                connection.query(' ALTER TABLE Customers AUTO_INCREMENT=1000;')
            })
        });
        SNo =1;

    }
    else {
        console.log("Error during connection to the Database")
        console.log(err);
    }

});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/form.html'));
});

app.post('/submit', function(req, res) {

    var fieldvalues = [];   //Array to hold the values of the fields in the form
    new formidable.IncomingForm().parse(req).on('field', function (name, value) { //in the event a field in the form is encountered
        fieldvalues.push(value);    //storing the field values in an array
    })
        .on('end', function () { //in the event of end of the form data
            var random =  Math.floor(Math.random()*90000) + 10000;
            console.log(fieldvalues);
            var full_name = fieldvalues[0];
            var address = fieldvalues[1];
            var telephoneno = fieldvalues[2];
            var frame = fieldvalues[3];
            var frame_colour = fieldvalues[4];
            var screen_type = fieldvalues[5];
            var screen_colour = fieldvalues[6];
            var keyboard = fieldvalues[7];
            var keyboard_colour = fieldvalues[8];
            var order = fieldvalues[9];


            //Inserting relevant information into Table Products
            var sql = "INSERT INTO Products(SNo, ProductId, FrameType, FrameColour, ScreenType, ScreenColour, KeyboardType, KeyboardColour, Quantity) VALUES (?)";
            var values = [SNo, random, frame, frame_colour, screen_type, screen_colour, keyboard, keyboard_colour, order];
            connection.query(sql, [values], function (error) {
                if (error) {
                    console.log('Error while Performing Query');
                    console.log(error);
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.write("<html><head>");
                    res.write("<style>");
                    res.write("body {");
                    res.write("    background-image: url('https://s2.postimg.org/sbbwyyf55/Background2.jpg');");
                    res.write("    -webkit-background-size: cover;");
                    res.write("    -moz-background-size: cover;");
                    res.write("    -o-background-size: cover;");
                    res.write("    background-size: cover;}");
                    res.write("</style>");
                    res.write("</head><body><h1>Error While Placing Order</h1>");
                    res.write("<br><br>Please try again. To go back to the home screen Click <a href='/'>here</a></body></html>")
                    res.end();
                }
            });
            //INSERTING INTO  CUSTOMERS
            var sql1 = "INSERT INTO Customers(SNo, Name, Address, TelephoneNo) VALUES (?)";
            var values1 = [SNo, full_name, address, telephoneno];
            connection.query(sql1, [values1], function (error, results, fields) {
                if (error) {
                    console.log('Error while Performing Query');
                    console.log(error);
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.write("<html><head>");
                    res.write("<style>");
                    res.write("body {");
                    res.write("    background-image: url('https://s2.postimg.org/sbbwyyf55/Background2.jpg');");
                    res.write("    -webkit-background-size: cover;");
                    res.write("    -moz-background-size: cover;");
                    res.write("    -o-background-size: cover;");
                    res.write("    background-size: cover;}");
                    res.write("</style>");
                    res.write("</head><body><h1>Error While Placing Order</h1>");
                    res.write("<br><br>Please try again. To go back to the home screen Click <a href='/'>here</a></body></html>")
                    res.end();
                }
            });

            //INSERTING INTO PRODUCTS
            var sql2 = "INSERT INTO Orders(Sno, CustomerId, ProductID, Quantity) SELECT "+ SNo +", Customers.CustomerID, Products.ProductID, Products.Quantity FROM Customers, Products WHERE Customers.Sno="+ SNo +" AND Products.Sno="+ SNo +";";

            connection.query(sql2, function (error, results, fields) {
                if (error) {
                    console.log('Error while Performing Query');
                    console.log(error);
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.write("<html><head>");
                    res.write("<style>");
                    res.write("body {");
                    res.write("    background-image: url('https://s2.postimg.org/sbbwyyf55/Background2.jpg');");
                    res.write("    -webkit-background-size: cover;");
                    res.write("    -moz-background-size: cover;");
                    res.write("    -o-background-size: cover;");
                    res.write("    background-size: cover;}");
                    res.write("</style>");
                    res.write("</head><body><h1>Error While Placing Order</h1>");
                    res.write("<br><br>Please try again. To go back to the home screen Click <a href='/'>here</a></body></html>")
                    res.end();
                }
            });
            res.writeHead(200, {'Content-Type': 'text/html'});  //write the response header
            res.write("<html><head>");
            res.write("<style>");
            res.write("body {");
            res.write("    background-image: url('https://s2.postimg.org/sbbwyyf55/Background2.jpg');");
            res.write("    -webkit-background-size: cover;");
            res.write("    -moz-background-size: cover;");
            res.write("    -o-background-size: cover;");
            res.write("    background-size: cover;}");
            res.write("</style>");
            res.write("</head><body><h1>Thank you for your Order</h1>");
            res.write("<br><br>Order is placed. To go back to the home screen Click <a href='/'>here</a></body></html>");//link to go back to the home page
            setTimeout(function(){//giving a time of two seconds to end the response to prevent end before write scenario
                res.end();
                ++SNo
            }, 2000);



        });
});
var robAgent= function Agent(name, port, capability) {
    this._name = name;
    this.connections = [];
    //this.flagVisited = false;
    this.capability = capability;
    this.port = port;
    this.url = "127.0.0.1";
    this.runServer(port);
};

var cnvAgent= function Agent(name, port) {
    this._name = name;
    this.connections = [];
    //this.flagVisited = false;
    this.zone1=0;
    this.zone2=0;
    this.zone3=0;
    this.zone4=0;
    this.zone5=0;
    this.port = port;
    this.url = "127.0.0.1";
    this.runServer(port);
};
var pallAgent= function Agent(id) {
    this.id = id;
    this.frame = false;
    this.keyboard = false;
    this.screen = false;
    this.frameColour = "";
    this.frameType = "";
    this.keyboardColour = "";
    this.keyboardType = "";
    this.screen = "";
    this.screenType = "";

};



    robAgent.prototype.runServer = function (port) {
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


cnvAgent.prototype.runServer = function (port) {
    var ref = this;
    this.port = port;
    var myServer = http.createServer(function (req, res) {
        if(req.method == 'GET'){
            //Handle GET method.
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.write('\nAgent ' + ref._name + ' is running. \n\n');
            res.write('\nStatus of Zone 1:' +  ref.zone1);
            res.write('\nStatus of Zone 2:' +  ref.zone2);
            res.write('\nStatus of Zone 3:' +  ref.zone3);
            res.write('\nStatus of Zone 4:' +  ref.zone4);
            res.write('\nStatus of Zone 5:' +  ref.zone5);
            res.end();
        }
    });

    myServer.listen(port, "127.0.0.1", function() {
        console.log('Agent server ' + ref._name + ' is running at http://127.0.0.1:' + port);

    });
};


robAgent.prototype.makeRequest = function (whoToAsk, req) {

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
cnvAgent.prototype.makeRequest = function (whoToAsk, req) {

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

var rob_1 = new robAgent('rob_1', 6011, "red");
var cnv_1 = new cnvAgent('cnv_1', 6012);
var rob_2 = new robAgent('rob_2', 6021, "blue");
var cnv_2 = new cnvAgent('cnv_2', 6022);
var rob_3 = new robAgent('rob_3', 6031,  "green");
var cnv_3 = new cnvAgent('cnv_3', 6032);
var rob_4 = new robAgent('rob_4', 6041, "red");
var cnv_4 = new cnvAgent('cnv_4', 6042);
var rob_5 = new robAgent('rob_5', 6051,  "blue");
var cnv_5 = new cnvAgent('cnv_5', 6052);
var rob_6 = new robAgent('rob_6', 6061,  "green");
var cnv_6 = new cnvAgent('cnv_6', 6062);
var rob_7 = new robAgent('rob_7', 6071,  "red");
var cnv_7 = new cnvAgent('cnv_7', 6072);
var rob_8 = new robAgent('rob_8', 6081,  "blue");
var cnv_8 = new cnvAgent('cnv_8', 6082);
var rob_9 = new robAgent('rob_9', 6091, "green");
var cnv_9 = new cnvAgent('cnv_9', 6092);
var rob_10= new robAgent('rob_10', 6101, "red");
var cnv_10 = new cnvAgent('cnv_10', 6102);


app.listen(5000, function(){
    console.log('Server Running on Port 5000');
});