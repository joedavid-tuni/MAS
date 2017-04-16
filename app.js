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
var bodyParser = require('body-parser')

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




app.use("/css", express.static(__dirname + '/css'));
app.use("/script", express.static(__dirname + '/script'));
app.use("/img", express.static(__dirname + '/img'));


//Connecting to the DATABASE
connection.connect(function (err) {
    if (!err) {

        console.log("Successfully Connected to Database :)");
        connection.query('delete from customers');
        connection.query('delete from products');
        connection.query('delete from orders');
        connection.query('delete from pallets');
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
    res.sendFile(path.join(__dirname + '/form1.html'));
});

app.post('/submit', function(req, res) {

    var fieldvalues = [];   //Array to hold the values of the fields in the form
    new formidable.IncomingForm().parse(req).on('field', function (name, value) { //in the event a field in the form is encountered
        fieldvalues.push(value);    //storing the field values in an array
    })
        .on('end', function () { //in the event of end of the form data

            console.log(fieldvalues);
            var rows = fieldvalues.length;
            console.log(rows);
            for(var i =0; i< rows; i+=10) {
                var random =  Math.floor(Math.random()*90000) + 10000;
                var full_name = fieldvalues[i];
                var address = fieldvalues[i+1];
                var telephoneno = fieldvalues[i+2];
                var frame = fieldvalues[i+3];
                var frame_colour = fieldvalues[i+4];
                var screen_type = fieldvalues[i+5];
                var screen_colour = fieldvalues[i+6];
                var keyboard = fieldvalues[i+7];
                var keyboard_colour = fieldvalues[i+8];
                var order = fieldvalues[i+9];


                //Inserting relevant information into Table Products
                var sql = "INSERT INTO Products(SNo, ProductId, FrameType, FrameColour, ScreenType, ScreenColour, KeyboardType, KeyboardColour, Quantity) VALUES (?)";
                var values = [SNo, random, frame, frame_colour, screen_type, screen_colour, keyboard, keyboard_colour, order];
                connection.query(sql, [values], function (error) {
                    if (error) {

                        console.log('Error while writing into products table');
                        console.log(error);
                        res.end();
                    }
                });
                //INSERTING INTO  CUSTOMERS
                var sql1 = "INSERT INTO Customers(SNo, Name, Address, TelephoneNo) VALUES (?)";
                var values1 = [SNo, full_name, address, telephoneno];
                connection.query(sql1, [values1], function (error, results, fields) {
                    if (error) {
                        console.log('Error while writing into customers table');
                        console.log(error);

                        res.end();
                    }
                });

                //INSERTING INTO ORDERS
                var sql2 = "INSERT INTO Orders(Sno, CustomerId, ProductID, Quantity) SELECT "+ SNo +", Customers.CustomerID, Products.ProductID, Products.Quantity FROM Customers, Products WHERE Customers.Sno="+ SNo +" AND Products.Sno="+ SNo +";";

                connection.query(sql2, function (error, results, fields) {
                    if (error) {
                        console.log('Error while writing into orders table');
                        console.log(error);
                        res.end();
                    }
                });
                ++SNo;

                    res.end();



            }
            setTimeout(function(){

                request({
                    url: 'http://127.0.0.1:6001/Submit',
                    method: "GET"
                }, function(){
                    console.log('Requested :)');
                })
            }, 2000);
        });
});

app.listen(5000, function(){
    console.log('Server Running on Port 5000');
});