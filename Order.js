/**
 * Created by Joe David on 19-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var request = require('request');
var pallcounter_=0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var orderAgent= function pallAgent() {
    this.orderID = [];
    this.productID = [];
    this.frameType =[];
    this.frameColour = [];
    this.screenType = [];
    this.screenColour = [];
    this.keyboardType = [];
    this.keyboardColour =[];
    this.orderStatus = [];
    this.url = "127.0.0.1";
};

//DATABASE PARAMETERS
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, //Port number to connect to the db
    user: 'root', //The user name assigned to work with the database
    password: 'oracle', //password for the database
    database: 'dasdfinal' //Name of the database
});

//CONNECTING TO DATABASE
connection.connect(function (err) {
    if (!err){
        console.log('Successfully connected to Database');
    }

});


orderAgent.prototype.runServer = function (port) {
    this.port = port;
    var ref = this;
    var hostname = this.url;

    app.get('/', function(req,res){

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am the Order Agent');
        res.write('\n');
        res.write(ref.orderID.toString());
        res.write('\n');
        res.write(ref.productID.toString());
        res.write('\n');
        res.write(ref.frameType.toString());
        res.write('\n');
        res.write(ref.frameColour.toString());
        res.write('\n');
        res.write(ref.screenType.toString());
        res.write('\n');
        res.write(ref.screenColour.toString());
        res.write('\n');
        res.write(ref.keyboardType.toString());
        res.write('\n');
        res.write(ref.orderStatus.toString());
        res.end('\nI am alive and running on port' , port);

    });

    app.get('/submit', function(req,res){
        var rows_;
        var counter = 0;

        connection.query("SELECT * FROM Products INNER JOIN Orders ON Products.ProductID = Orders.ProductID WHERE Products.status = 'ordered'", function(results,rows){

            var length = rows.length;
            console.log('Rows:');
            console.log(rows);
            counter= 0;
            counter++;

            //CREATING PALLETS TABLE FROM ORDERS AND PRODUCTS TABLES WHICH INTURN IS FROM THE WEB INTERFACE

            for (rows_ = 0; rows_ < rows.length; rows_++) {   //if using dynamic form revert to rows.length instead if ++counter
                for (var qty = 0; qty < rows[rows_].Quantity; qty++) {
                    var random =  Math.floor(Math.random()*90000) + 10000;
                    var sql = "INSERT INTO Pallets(OrderID, ProductID, Frametype, Framecolour, Screentype, Screencolour, Keyboardtype, Keyboardcolour) VALUES (?)";
                    var values1 = [rows[rows_].OrderID,random, rows[rows_].FrameType, rows[rows_].FrameColour, rows[rows_].ScreenType,rows[rows_].ScreenColour,rows[rows_].KeyboardType,rows[rows_].KeyboardColour];
                    connection.query(sql, [values1], function (error, results, fields) {
                        if(!error) {
                            console.log('Inserted Successfully into Pallets Table');
                        }
                        else if(error){
                            console.log(error);
                        }
                    })
                }
            }
            for (rows_ = 0; rows_ < rows.length; rows_++) {
                connection.query("UPDATE Products SET Status = 'processed' WHERE ProductID = ?", rows[rows_].ProductID, function(){
                    console.log('Rows updated Successfully');
                });
            }

            setTimeout(function(){
                request.post('http://localhost:9000/updateOrderAgent');

            },2000);
        });

    });
    app.post('/updateOrderAgent', function(res){
        console.log('Updated Order Agent');

        connection.query("SELECT * FROM Pallets where Status = 'in_queue'", function(error,results,rows) {

            if(error){
                console.log(error);

            }
            console.log(results);
            for (var i=0; i<results.length; i ++)
            {
                ref.orderID.push(results[i].OrderID);
                ref.productID.push(results[i].ProductID);
                ref.frameType.push(results[i].Frametype);
                ref.frameColour.push(results[i].Framecolour);
                ref.screenType.push(results[i].Screentype);
                ref.screenColour.push( results[i].Screencolour);
                ref.keyboardType.push(results[i].Keyboardtype);
                ref.keyboardColour.push(results[i].Keyboardcolour);
                ref.orderStatus.push('processing');

            }


        });


    });

    app.post('/notifs', function(req,res){


     switch (req.body.id){

         case "PalletLoaded":
             res.writeHead(200);
             res.end();

             var options = {
                 uri: 'http://localhost:8000/notifs',
                 method: 'POST',
                 json: true,
                 body: {"id":"PalletInformation",
                        "payload":{ "frameType":ref.frameType[pallcounter_],
                                    "frameColour": ref.frameColour[pallcounter_],
                                    "screenType":ref.frameColour[pallcounter_],
                                    "screenColour":ref.frameColour[pallcounter_],
                                    "keyboardType":ref.keyboardType[pallcounter_],
                                    "keyboardColour":ref.keyboardColour[pallcounter_],
                                    "palletID": req.body.payload.PalletID[pallcounter_]
                                    }
                        }
             };

             request(options, function (error, response, body) {

                 if (!error) {
                     console.log('Pallet Details sent to Pallet Agent'); // Print the shortened url.
                 }
                 else {
                     console.log(error);
                 }

             });

             break;


     }


    });

    app.listen(port, hostname, function(){
        console.log(' Order Server Running on port' + port);
    });


};

var order = new orderAgent();
order.runServer(9000);