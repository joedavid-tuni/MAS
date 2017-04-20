/**
 * Created by Joe David on 20-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

var pallet = [];
var pallcounter=0;
var pallport = 8001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var pallAgent= function (frameType,  frameColour, screenType,screenColour,keyboardType,keyboardColour,palletID, port, palletnumber) {
    this.frame = false;
    this.keyboard = false;
    this.screen = false;
    this.paper = false;
    this.palletID = palletID;
    this.currentws = 7;
    this.port = port;
    this.palletnumber = palletnumber;
    this.hostname = "127.0.0.1";
    this.currentneed  = 'paper'

};

pallAgent.prototype.currentneed = function (ws,zone1,zone2) {



};

pallAgent.prototype.requestconv = function (ws,zone1,zone2) {
var options;
    if((ws>0)&&(ws<10)) {
        options = {
            uri: 'http://localhost:700'+ws+'/notifs/' + ws,
            method: 'POST',
            json: true,
            body: {
                "id": "RequestTransfer",
                "payload": {
                    "zone1": zone1,
                    "zone2": zone2,
                    "workstation": ws
                }
            }
        };
    }

    else if(ws>10) {
        options = {
            uri: 'http://localhost:70'+ws+'/notifs/' + ws,
            method: 'POST',
            json: true,
            body: {
                "id": "RequestTransfer",
                "payload": {
                    "zone1": zone1,
                    "zone2": zone2,
                    "workstation": ws
                }
            }
        };
    }
    request(options, function (error, response, body) {
        if (!error) {
            console.log('Requested Conveyor to Transfer Zones');
        }

    });

};
pallAgent.prototype.runServer = function (port) {
    // this.port = port;
    var ref = this;
    // this.port = port;



    app.get('/'+ref.palletnumber, function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am Pallet ' + ref.palletnumber);
        res.write('\nFollowing are my properties');
        res.write('\nPallet Number:'+ref.palletnumber);
        res.write('\nFrame Type:'+ref.frameType);
        res.write('\nFrame Colour'+ref.frameColour);
        res.write('\nScreen Type'+ref.screenType);
        res.write('\nScreen Colour'+ref.screenColour);
        res.write('\nKeyboard Type'+ref.keyboardType);
        res.write('\nKeyboard Colour'+ref.keyboardColour);
        res.end('\nPallet' + ref.palletnumber+ ' is running.');
    });


    app.post('/notifs/'+ref.palletnumber, function(req,res) {


        switch (req.body.id) {

            case "currentneed":

                for(var i = 0; i<pallet.length; i++){

                }





        }
    });
    app.listen(port, ref.hostname, function(){
        console.log('Pallet'+ ref.palletnumber + ' running at http://'+ref.hostname+':'+port+'/'+ref.palletnumber);
    });



};

app.post('/notifs', function(req,res){
var pallnum = pallcounter+1;
    switch(req.body.id) {

        case "PalletInformation":
            console.log('New Pallet Information Received');
            pallet.push(new pallAgent(req.body.payload.frameType, req.body.payload.frameColour, req.body.payload.screenType,
                req.body.payload.screenColour, req.body.payload.keyboardType, req.body.payload.keyboardColour, req.body.payload.palletID, pallport, pallnum));
            pallet[pallcounter].requestconv(7,3,5, function(){
                console.log('Requesting Conveyor. .');

            });
            pallet[pallcounter].runServer(pallport);
            setTimeout(function(){
                pallcounter++;
                pallport++;
            });
            res.writeHead(200);
            res.end();



            break;



    }


});


app.listen(8000, function(){
    console.log('Pallet Server Running on Port 8000');


});