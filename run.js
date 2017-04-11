/**
 * Created by Joe David on 09-04-2017.
 */
var validator = require('xsd-schema-validator');
var mysql = require('mysql');
var heartbeats = require('heartbeats');
var express = require('express');
var app = express();
var http = require('http');
var fifo =require('fifo')();
var on_line = require('fifo')();
var bodyParser = require('body-parser');
var request = require('request');
fifo.clear();

var on_line=0;
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, //Port number to connect to the db
    user: 'root', //The user name assigned to work with the database
    password: 'oracle', //password for the database
    database: 'dasdfinal' //Name of the database
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connection.connect(function (err) {
    if (!err){
        console.log('Successfully connected to Database');
    }

});


var workstation= function workstation(wsnumber, capability) {
    this.wsname = wsnumber || 0;
    this.capability = capability || 'I am a conveyor and i have no special capability';
};
var robAgent= function robAgent(wsnumber, name, port, capability) {
    this.base = workstation;
    this.base( wsnumber,capability);
    this.name = name;
    this.url = "127.0.0.1";
    //this.connections = [];
    this.runServer(port);
    if(!((wsnumber == 1)||(wsnumber == 7))) {
        this.loadpen(wsnumber, capability);
    }
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
//
app.get('/submit', function(){
var rows_;
    var pallet_ = [];

    connection.query("SELECT * FROM Products INNER JOIN Orders ON Products.ProductID = Orders.ProductID WHERE Products.status = 'ordered'", function(results,rows){
            console.log(rows);
            console.log('Size: ' + rows.length);
            var length = rows.length;
            console.log(rows[0].Quantity);
            counter= 0;
            counter++;

            for (rows_ = 0; rows_ < rows.length; rows_++) {   //if using dynamic form revert to rows.length instead if ++counter
                for (var qty = 0; qty < rows[0].Quantity; qty++) {
                    var pallet = new pallAgent(rows[0].OrderID,rows[0].ProductID,rows[0].FrameType,rows[0].FrameColour,rows[0].ScreenType,rows[0].ScreenColour,rows[0].KeyboardType,rows[0].KeyboardColour);
                   fifo.push(pallet);
                }
            }
        for (rows_ = 0; rows_ < rows.length; rows_++) {
            connection.query("UPDATE Products SET Status = 'processed' WHERE ProductID = ?", rows[0].ProductID, function(){
                console.log('Rows updated Successfully');
            });
        }
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        for (var node = fifo.node; node; node = fifo.next(node)) {
                console.log("----------------------------------------");
            console.log('value is', node.value)
        }
        console.log('No. of Pallets created is: ' + fifo.length)
        request.get('http://127.0.0.1/releasepallet')
    });


});



var cnvAgent= function cnvAgent(wsname, name, port) {
    this.base = workstation;
    this.base( wsname);
    this.name = name;
    this.zone1=false;
    this.zone2=false;
    this.zone3=false;
    this.zone4=false;
    this.zone5=false;
    this.url = "127.0.0.1";
//this.connections = [];
    this.runServer(port)
};

cnvAgent.prototype = new workstation;

var pallAgent= function pallAgent(id,ProductID,frameType,frameColour,screenType,screenColour,keyboardType,keyboardColour) {
    this.Orderid = id;
    this.ProductID = ProductID;
    this.frame = false;
    this.keyboard = false;
    this.screen = false;
    this.paper = false;
    this.frameType =frameType ;
    this.frameColour = frameColour;
    this.screenType = screenType;
    this.screenColour = screenColour ;
    this.keyboardType = keyboardType ;
    this.keyboardColour = keyboardColour;
};

robAgent.prototype.loadpen = function (wsnumber, capability) {
    ref=this;
    var options;
    if (capability === "red") {
         options = {
            method: 'POST', //http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenRED
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenRED",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    else if (capability === "green") {
         options = {
            method: 'POST',  //http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenGREEN
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object  	http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/Draw1
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenGREEN",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    else if (capability === "blue") {
         options = {
            method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    //Print the result of the HTTP POST request
    request(options, function (err, res, body) {
        if (err) {
            console.log('Error loading pen', err);
        }
        else {
            console.log(body);
            console.log('Robot ' + wsnumber +' Pen Colour '  + capability + ' loaded');

        }
    });
};

workstation.prototype.isfree = function (wsnumber, zonenumber) {

    var options = {
        method: 'post',
        body: req, // Javascript object
        url: "http://127.0.0.1:3000/RTU/SimCNV"+wsnumber+"/data/P"+zonenumber,
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    //Print the result of the HTTP POST request
    request(options, function (err, res, body) {
        if (err) {
            console.log('Error checking is free');
        }
        else {
            return res.body.v;

        }
    });

};
app.get('/releasepallet',function(){
    on_line.push(fifo.remove(node));

});

cnvAgent.prototype.transzone = function (zone1,zone2) {
ref = this;
    var options = {
        method: 'post',
        body: req, // Javascript object
        url: "http://localhost:3000/RTU/SimCNV"+ref.wsnumber+"/services/TransZone"+zone1+zone2,
        headers: {
            'Content-Type': 'text/plain'
        }
    };

    //Print the result of the HTTP POST request
    request(options, function (err, res, body) {
        if (err) {
            console.log('Error requesting to transfer zone in ' + ref.wsnumber, err);
        }
        else {
            console.log(body);
            console.log('Requested to Transer from ' + zone1 + 'to' + zone2 +  'in workstation ' + ref.wsnumber);
        }
    });

};

var rob_1 = new robAgent(1, 'rob_1', 6011);
var cnv_1 = new cnvAgent(1, 'cnv_1', 6012);
var rob_2 = new robAgent(2,'rob_2', 6021, "blue");
var cnv_2 = new cnvAgent(2,'cnv_2', 6022);
var rob_3 = new robAgent(3,'rob_3', 6031,  "green");
var cnv_3 = new cnvAgent(3,'cnv_3', 6032);
var rob_4 = new robAgent(4,'rob_4', 6041, "red");
var cnv_4 = new cnvAgent(4,'cnv_4', 6042);
var rob_5 = new robAgent(5,'rob_5', 6051,  "blue");
var cnv_5 = new cnvAgent(5,'cnv_5', 6052);
var rob_6 = new robAgent(6,'rob_6', 6061,  "green");
var cnv_6 = new cnvAgent(6,'cnv_6', 6062);
var rob_7 = new robAgent(7,'rob_7', 6071);
var cnv_7 = new cnvAgent(7,'cnv_7', 6072);
var rob_8 = new robAgent(8,'rob_8', 6081,  "blue");
var cnv_8 = new cnvAgent(8,'cnv_8', 6082);
var rob_9 = new robAgent(9,'rob_9', 6091, "green");
var cnv_9 = new cnvAgent(9,'cnv_9', 6092);
var rob_10= new robAgent(10,'rob_10', 6101, "red");
var cnv_10 = new cnvAgent(10,'cnv_10', 6102);
var rob_11= new robAgent(11,'rob_11', 6111, "red");
var cnv_11 = new cnvAgent(11,'cnv_11', 6112);
var rob_12= new robAgent(12,'rob_12', 6121, "red");
var cnv_12 = new cnvAgent(12,'cnv_12', 6122);

// rob_1.runServer(6011);


app.post('/notifs', function(req, res){

    if(req.body.id == 'PalletLoaded'){
        cnv_7.transzone(3,5);
    }

console.log(req.body);

});

function subscriptions() {
    flag=0;
    request.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', {form: {destUrl: "http://localhost:5001/notifs"}}, function (err) {if (err) {flag=1;}});

    for(var i=1; i<13; i++)
    { for(var j=1; j<6; j++){
        if((( i == 1)&&(j==4))||((i==7)&&(j==4))){
            continue;
        }
        else {
            request.post('	http://localhost:3000/RTU/SimCNV'+i+'/events/Z'+j+'_Changed/notifs', {form: {destUrl: "http://localhost:5001/notifs"}}, function (err) {if (err) {flag=1;}});
        }
    }}
    if(!flag){
        console.log('All subscriptions made without any errors');
    }
}
app.listen(5001, function(){
    console.log('Server Running on Port 5000');
    subscriptions();
});