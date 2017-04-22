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

var counter = 0;
var iterator = 0;

var orderAgent= function orderAgent() {
   this.orderelement =[];
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

orderAgent.prototype.setport = function (port1,pallid) {
    var ref1 = this;
    for (var i=0;i<ref1.orderelement.length; i++) {
        if (ref1.orderelement[i].palletID == pallid) {
            console.log('Matching Pallet Id found and port set');
            ref1.orderelement[i].port = port1;

        }
    }
};


orderAgent.prototype.runServer = function (port) {
    this.port = port;
    var ref = this;
    var hostname = this.url;

    app.get('/', function(req,res){

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am the Order Agent');
        res.write('\n');
        res.write(ref.orderelement.toString());
        res.write('\n');

        res.end('\nI am alive and running on port' , port);
        console.log(ref.orderelement);

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

            },1000);
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
                ref.orderelement.push({orderID: results[i].OrderID,productID:results[i].ProductID,palletID: 0, frameType: results[i].Frametype,frameColour: results[i].Framecolour,
                    screenType: results[i].Screentype, screenColour: results[i].Screencolour, keyboardType: results[i].Keyboardtype, keyboardColour: results[i].Keyboardcolour,
                    orderStatus: 'processing',port: 1234});
            }


        });


    });

    app.post('/notifs', function(req,res){


     switch (req.body.id){

         case "PalletLoaded":
             res.writeHead(200);
             res.end();

             var palletID = req.body.payload.PalletID;
             ref.orderelement[counter].palletID = palletID;
             var options = {
                 uri: 'http://localhost:8000/notifs',
                 method: 'POST',
                 json: true,
                 body: {
                         "id": "createpallet",
                         "payload": {   "frameType":ref.orderelement[pallcounter_].frameType,
                             "frameColour": ref.orderelement[pallcounter_].frameColour,
                             "screenType":ref.orderelement[pallcounter_].screenType,
                             "screenColour":ref.orderelement[pallcounter_].screenColour,
                             "keyboardType":ref.orderelement[pallcounter_].keyboardType,
                             "keyboardColour":ref.orderelement[pallcounter_].keyboardColour,
                             "palletID": req.body.payload.PalletID
                     }
                 }
             };

             request(options, function (error, response, body) {


                 if (!error) {
                     console.log('Pallet Details sent to Pallet Agent');
                     console.log(response.body);
                     var pallport = response.body.pallport;
                     var pallid = response.body.palletID;
                     ref.setport(pallport,palletID);
                     pallcounter_++
                 }
                 else {
                     console.log(error);
                 }
             });

             break;

         case "getport":

            console.log('Port Identification requested');
            var flag;
             var palletID1= req.body.payload.palletID;
             for (var i=0;i<ref.orderelement.length; i++){
                 if (ref.orderelement[i].palletID == palletID1){
                     console.log('Match for port found.!!');
                     res.writeHead(200, {'Content-Type': 'application/json'});
                     res.write(JSON.stringify({ pallport: ref.orderelement[i].port}));
                     flag=1;
                     res.end();
                 }
             }
             if(flag==0){
                 console.log('Match not found');
             }

             break;


     }


    });

    app.listen(port, hostname, function(){
        console.log(' Order Server Running on port' + port);
    });


};

var order = new orderAgent();
order.runServer(9000);