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
    this.frameType = frameType;
    this.frameColour = frameColour;
    this.screenType = screenType;
    this.screenColour = screenColour;
    this.keyboardType = keyboardType;
    this.keyboardColour = keyboardColour;
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
            uri: 'http://localhost:600'+ws+'/notifs/' + ws,
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
            uri: 'http://localhost:60'+ws+'/notifs/' + ws,
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
    setTimeout(function(){
    request(options, function (error, response, body) {
        if (!error) {
            console.log('Requested Workstation to Transfer Zones');
        }
    });
    },1000);

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
        res.write('\nPallet ID:'+ref.palletID);
        res.write('\nFrame Type:'+ref.frameType);
        res.write('\nFrame Colour'+ref.frameColour);
        res.write('\nScreen Type'+ref.screenType);
        res.write('\nScreen Colour'+ref.screenColour);
        res.write('\nKeyboard Type'+ref.keyboardType);
        res.write('\nKeyboard Colour'+ref.keyboardColour);
        res.write('\nMy Current need is'+ref.currentneed);
        res.write('\nI can be contacted at port'+ref.port);
        res.end('\nPallet' + ref.palletnumber+ ' is running.');

    });


    app.post('/notifs/'+ref.palletnumber, function(req,res) {


        switch (req.body.id) {

            case "update":
                    console.log('UPDATE AREA REACHED');
                if(req.body.payload.attribute == 'paper'){
                    console.log('Received Request to update current need and paper status');
                    ref.paper =req.body.payload.value;
                    ref.currentneed = ref.frameColour;
                    res.writeHead(200);
                    res.end();
                }
                else if (req.body.payload.attribute == 'frame'){
                    console.log('Received Request to update current need and frame status');
                    ref.frame =req.body.payload.value;
                    ref.currentneed = ref.screenColour;
                    res.writeHead(200);
                    res.end();
                }
                else if (req.body.payload.attribute == 'screen'){
                    console.log('Received Request to update current need and screen status');
                    ref.screen =req.body.payload.value;
                    ref.currentneed = ref.keyboardColour;
                    res.writeHead(200);
                    res.end();
                }
                else if (req.body.payload.attribute == 'keyboard'){
                    console.log('Received Request to update complete status');
                    ref.keyboard =req.body.payload.value;
                    ref.currentneed = 'complete';
                    res.writeHead(200);
                    res.end();
                }

                else {
                    console.log('Unknown update attribute')
                }
                break;
            case "currentneed":

                for(var i = 0; i<pallet.length; i++){

                }
                break;
            case "getstatus":
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({ paperstatus: ref.paper, frame: ref.frame, screen: ref.screen, keyboard: ref.keyboard, frameType: ref.frameType,
                    frameColour:ref.frameColour,screenType:ref.screenType,screenColour:ref.screenColour,keyboardType:ref.keyboardType,keyboardColour:ref.keyboardColour,
                    palletID:ref.palletID,port:ref.port,currentneed:ref.currentneed}));
                res.end();
                break;

        }
    });
    app.listen(port, ref.hostname, function(){
        console.log('Pallet'+ ref.palletnumber + ' running at http://'+ref.hostname+':'+port+'/'+ref.palletnumber);
    });



};

app.post('/notifs', function(req,res){
var pallnum = pallcounter+1;
    switch(req.body.id) {

        case "createpallet":

            console.log('New Pallet Created');
            //RESPONDING BACK TO THE ORDER AGENT
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({ pallport: pallport, palletID: req.body.payload.palletID}));
            res.end();
            //CREATING NEW PALLET AGENT
            pallet.push(new pallAgent(req.body.payload.frameType, req.body.payload.frameColour, req.body.payload.screenType,
                req.body.payload.screenColour, req.body.payload.keyboardType, req.body.payload.keyboardColour, req.body.payload.palletID, pallport, pallnum));
            //PALLET REQUESTING THE WORKSTATION AGENT TO MOVE FROM ZONE 3 TO ZONE 5
            pallet[pallcounter].requestconv(7,3,5, function(){
                console.log('Requesting Conveyor. .');
            });
            pallet[pallcounter].runServer(pallport);
            setTimeout(function(){
                pallcounter++;
                pallport++
            },1000);
            break;
    }
});


app.listen(8000, function(){
    console.log('Pallet Server Running on Port 8000');


});