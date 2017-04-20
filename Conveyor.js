/**
 * Created by Joe David on 20-04-2017.
 */
/**
 * Created by Joe David on 20-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var conveyor= function (number) {
    this.cnvnumber = number;
    this.zone1 =false;
    this.zone2 = false;
    this.zone3= false;
    this.zone4 = false;
    this.zone5 = false;
    this.url = "127.0.0.1"
};

conveyor.prototype.transzone= function (zone1,zone2) {
    var ref1=this;

    var options = {
        method: 'POST',
        body: {"destUrl": "http://127.0.0.1"}, // Javascript object
        json: true,
        url: "http://localhost:3000/RTU/SimCNV"+ref1.cnvnumber+"/services/TransZone" +zone1 + zone2,
        headers: {'Content-Type': 'application/json'}
    };

    //Print the result of the HTTP POST request
    request(options, function (err) {
        if (err) {
            console.log('Error requesting to transfer zone in ' + ref1.cnvnumber, err);
        }
        else {

            console.log('Requested to Transfer from ' + zone1 + 'to' + zone2 + 'in workstation ' + ref1.cnvnumber);
            // res.end();
        }
    });

};

conveyor.prototype.runServer = function (port) {
    // this.port = port;
    var ref = this;
    var hostname = this.url;



    app.get('/'+ref.cnvnumber, function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am Conveyor ' + ref.cnvnumber);
        res.end('\nConveyor ' + ref.cnvnumber+ ' is running.');
    });
    
    
    app.post('/notifs/'+ref.cnvnumber, function(req,res) {


        switch (req.body.id) {

            case "RequestTransfer":

                setTimeout(function(){
                    ref.transzone(req.body.payload.zone1,req.body.payload.zone2);
                },1000);


                break;


        }
    });
        app.listen(port, hostname, function(){
            console.log('Server running at http://'+hostname+':'+port);
        });



};



var cnv1 = new conveyor(1);
var cnv2 = new conveyor(2);
var cnv3 = new conveyor(3);
var cnv4 = new conveyor(4);
var cnv5 = new conveyor(5);
var cnv6 = new conveyor(6);
var cnv7 = new conveyor(7);
var cnv8 = new conveyor(8);
var cnv9 = new conveyor(9);
var cnv10 = new conveyor(10);
var cnv11 = new conveyor(11);
var cnv12 = new conveyor(12);


cnv1.runServer(7001);
cnv2.runServer(7002);
cnv3.runServer(7003);
cnv4.runServer(7004);
cnv5.runServer(7005);
cnv6.runServer(7006);
cnv7.runServer(7007);
cnv8.runServer(7008);
cnv9.runServer(7009);
cnv10.runServer(7010);
cnv11.runServer(7011);
cnv12.runServer(7012);



// app.listen(7000, function(){
//     console.log('Conveyor Server Running on Port 7000');
//
//
// });