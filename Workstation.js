/**
 * Created by Joe David on 21-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var mysql = require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var workstation= function (wsnumber, capability) {
    this.wsnumber = wsnumber;
    this.capability = capability;
    this.zone1=false;
    this.zone2=false;
    this.zone3=false;
    this.zone4=false;
    this.zone5=false;
    this.flag =false;
    this.port  = 1234;
    this.url = "127.0.0.1";
    this.buffer = 'free';
    this.status = 'free';

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


workstation.prototype.requestconv = function (zone1,zone2) {
    var ref1=this;

    var options = {
        method: 'POST',
        body: {"destUrl": "http://127.0.0.1"}, // Javascript object
        json: true,
        url: "http://localhost:3000/RTU/SimCNV"+ref1.wsnumber+"/services/TransZone" +zone1 + zone2,
        headers: {'Content-Type': 'application/json'}
    };

    //Print the result of the HTTP POST request
    request(options, function (err) {
        if (err) {
            console.log('Error requesting to transfer zone in ' + ref1.wsnumber, err);
        }
        else {

            console.log('Requested to Transfer from ' + zone1 + 'to' + zone2 + 'in workstation ' + ref1.wsnumber);
            // res.end();
        }
    });
};

workstation.prototype.work= function (obj) {
    var ref =this;
    console.log('Work function Called, passed object:');
    console.log(obj);
    switch (this.wsnumber){

        case 1:
            if(obj.paperstatus == false) {
                var options7 = {
                    method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                    body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                    json: true,
                    url: "	http://localhost:3000/RTU/SimROB" + ref.wsnumber + "/services/LoadPaper",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                request(options7, function (err) {
                    if (err) {
                        console.log('Error Loading Paper');
                    }
                    else {
                        var sub = obj.port%10;
                        console.log(obj.port);
                        console.log(sub);
                        var options1= {
                            uri: 'http://localhost:'+obj.port+'/notifs/'+sub,
                            method: 'POST',
                            json: true,
                            body: {
                                "id": "update",
                                "payload":{ "attribute" :"paper",
                                    "value":true}
                            }
                        };
                        request(options1, function (error, response, body) {
                         if(error){
                             console.log('Error updating Paper Status');
                         }
                         else{
                             console.log('Successfully request to update paper');
                         }
                        });
                    }
                });
            }
            else
            {
                ref.transzone(3,5);
            }
            break;

        case 7:     //INSERT CODE FOR WORKSTATION 7

            break;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            if(!(obj.frame)){
                var findex;
                switch(obj.frameType){case "Frame_1":findex = 1; break; case "Frame_2":findex=2; break; case "Frame_3":findex=3}

                var options = {
                    method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                    body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                    json: true,
                    url: "	http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+findex,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                //Print the result of the HTTP POST request
                request(options, function () {
                    console.log('Requested to draw frame of type' + findex + ' and of colour ' + obj.frameColour );

                });
            }
            else if(!(obj.screen)){
                if (obj.currentneed==ref.capability){       //http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+pallet[index].screenType, function(req,res,err)
                    var sindex;
                    switch(obj.screenType){case "Screen_1":sindex = 4; break; case "Screen_2":sindex=5; break; case "Screen_3":sindex=6}
                    var options8 = {
                        method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                        body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                        json: true,
                        url: "	http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+sindex,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    //Print the result of the HTTP POST request
                    request(options8, function () {
                        console.log('Requested to draw Screen of type' + sindex + ' and of colour ' + obj.screenColour );
                        // }
                    });
                }
                else{
                    //HANDLE FLAGG
                    ref.requestconv(3, 5);
                    ref.flag=true;

                }

            }
            else if(!(obj.keyboard)){
                if (obj.currentneed==ref.capability){
                    var kindex;
                    switch(obj.keyboardType){case "Keyboard_1":kindex = 7; break; case "Keyboard_2":kindex=8; break; case "Keyboard_3":kindex=9; break;}
                    var options9 = {
                        method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                        body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                        json: true,
                        url: "	http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+kindex,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    //Print the result of the HTTP POST request
                    request(options9, function () {
                        console.log('Requested to draw Keyboard of type' + kindex + ' and of colour ' +obj.keyboardColour );
                    });
                }
                else{
                    //HANDLE FLAG
                        ref.requestconv(3, 5);
                        ref.flag=true;
                }

            }
            else if(obj.currentneed == 'complete'){
                ref.requestconv(3, 5);
                ref.flag=true;
            }
            break;
    }
};


workstation.prototype.runServer = function (port) {
    // this.port = port;
    var ref1 = this;
    var hostname = this.url;



    app.get('/'+ref1.wsnumber, function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am workstation ' + ref1.wsnumber);
        res.write('\nMy capability is: ' + ref1.capability);
        res.end('\nworkstation ' + ref1.wsnumber + ' is running.');
        console.log(ref1.wsnumber);
    });

    app.post('/notifs/'+ref1.wsnumber, function(req,res){

        // var ref = this;
        console.log(req.body);


        switch (req.body.id){

            case "Z1_Changed":

                //
                //
                if ((req.body.payload.PalletID != -1)) { //If new pallet is introduced and not leaving (as we receive notifications for both)
                            ref1.zone1 = true;
                    //
                    var palletID1 = req.body.payload.PalletID;
                    //
                    //
                    switch (req.body.senderID) {
                        //
                                    case "SimCNV1":

                                        if(ref1.buffer == 'free'){

                                            ref1.requestconv(1,2)


                                        }

                                        break;

                                    case "SimCNV2":

                                        options = {
                                            uri: 'http://localhost:9000/notifs',
                                            method: 'POST',
                                            json: true,
                                            body: {
                                                "id": "getport",
                                                "payload": {
                                                    "palletID": palletID1
                                                }
                                            }
                                        };

                                        request(options, function (error, response, body) {
                                            if (!error) {
                                                console.log('Port Number obtained as',response.body.pallport);
                                                console.log('Initiating Communication . .');
                                                var port1 = response.body.pallport;
                                                var sub = port1%10;

                                                var options1= {
                                                    uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                    method: 'POST',
                                                    json: true,
                                                    body: {
                                                        "id": "getstatus"
                                                    }
                                                }
                                            }
                                            else if(error){
                                                console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (1)');
                                            }
                                            request(options1, function (error, response, body) {
                                                if (!error) {
                                                    console.log('requested  status and obtained as', response.body);
                                                    if(response.body.currentneed == ref1.capability) {
                                                        if (ref1.status == 'free') {
                                                            ref1.requestconv(1, 2)
                                                        }
                                                        else{
                                                            if (((ws5.status == 'free') || (ws9.status == 'free') || (ws12.status == 'free'))) {
                                                                ref1.requestconv(1, 4)
                                                            }
                                                            else{
                                                                if(ref1.buffer == 'free'){
                                                                        ref1.requestconv(1, 2);
                                                                }
                                                                else{
                                                                    ref1.requestconv(1, 4);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else{
                                                        ref1.requestconv(1,4)
                                                    }
                                                }

                                                else{
                                                    console.log(error);
                                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting status(2)');
                                                }
                                            });


                                        });
                                        break;
                                    case "SimCNV3":
                                        options = {
                                            uri: 'http://localhost:9000/notifs',
                                            method: 'POST',
                                            json: true,
                                            body: {
                                                "id": "getport",
                                                "payload": {
                                                    "palletID": palletID1
                                                }
                                            }
                                        };
                                        request(options, function (error, response, body) {
                                            if (!error) {
                                                console.log('Port Number obtained as',response.body.pallport);
                                                console.log('Initiating Communication . .');
                                                var port1 = response.body.pallport;
                                                var sub = port1%10;

                                                var options1= {
                                                    uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                    method: 'POST',
                                                    json: true,
                                                    body: {
                                                        "id": "getstatus"
                                                    }
                                                }
                                            }
                                            else{
                                                console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (2)');
                                            }
                                            request(options1, function (error, response, body) {
                                                if (!error) {
                                                    console.log('requested  status and obtained as', response.body);
                                                    if(response.body.currentneed == ref1.capability) {
                                                        if (ref1.status == 'free') {
                                                            ref1.requestconv(1, 2)
                                                        }
                                                        else{
                                                            if((ws6.status == 'free')||(ws10.status == 'free')){
                                                                ref1.requestconv(1, 4)
                                                            }
                                                            else{
                                                                if(ref1.buffer == 'free'){
                                                                    ref1.requestconv(1, 2);
                                                                }
                                                                else{
                                                                    ref1.requestconv(1, 4);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else{
                                                        ref1.requestconv(1,4)
                                                    }
                                                }
                                                else{
                                                    console.log(error);
                                                }
                                            });
                                        });

                                        break;
                                    case "SimCNV4":
                                        options = {
                                            uri: 'http://localhost:9000/notifs',
                                            method: 'POST',
                                            json: true,
                                            body: {
                                                "id": "getport",
                                                "payload": {
                                                    "palletID": palletID1
                                                }
                                            }
                                        };
                                        request(options, function (error, response, body) {
                                            if (!error) {
                                                console.log('Port Number obtained as',response.body.pallport);
                                                console.log('Initiating Communication . .');
                                                var port1 = response.body.pallport;
                                                var sub = port1%10;

                                                var options1= {
                                                    uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                    method: 'POST',
                                                    json: true,
                                                    body: {
                                                        "id": "getstatus"
                                                    }
                                                }
                                            }
                                            else {
                                                console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (3)');
                                            }
                                            request(options1, function (error, response, body) {
                                                if (!error) {
                                                    console.log('requested  status and obtained as', response.body);
                                                    if(response.body.currentneed == ref1.capability) {
                                                        if (ref1.status == 'free') {
                                                            ref1.requestconv(1, 2)
                                                        }
                                                        else{
                                                            if((ws8.status == 'free')||(ws11.status == 'free')){
                                                                ref1.requestconv(1, 4)
                                                            }
                                                            else{
                                                                if(ref1.buffer == 'free'){
                                                                    ref1.requestconv(1, 2);
                                                                }
                                                                else{
                                                                    ref1.requestconv(1, 4);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else{
                                                        ref1.requestconv(1,4)
                                                    }
                                                }

                                                else{
                                                    console.log(error);
                                                }
                                            });


                                        });
                                        break;
                                    case "SimCNV5":
                                        options = {
                                            uri: 'http://localhost:9000/notifs',
                                            method: 'POST',
                                            json: true,
                                            body: {
                                                "id": "getport",
                                                "payload": {
                                                    "palletID": palletID1
                                                }
                                            }
                                        };
                                        request(options, function (error, response, body) {
                                            if (!error) {
                                                console.log('Port Number obtained as',response.body.pallport);
                                                console.log('Initiating Communication . .');
                                                var port1 = response.body.pallport;
                                                var sub = port1%10;

                                                var options1= {
                                                    uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                    method: 'POST',
                                                    json: true,
                                                    body: {
                                                        "id": "getstatus"
                                                    }
                                                }
                                            }
                                            else {
                                                console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (4)');
                                            }
                                            request(options1, function (error, response, body) {
                                                if (!error) {
                                                    console.log('requested  status and obtained as', response.body);
                                                    if(response.body.currentneed == ref1.capability) {
                                                        if (ref1.status == 'free') {
                                                            ref1.requestconv(1, 2)
                                                        }
                                                        else{
                                                            if((ws9.status == 'free')||(ws12.status == 'free')){
                                                                ref1.requestconv(1, 4)
                                                            }
                                                            else{
                                                                if(ref1.buffer == 'free'){
                                                                    ref1.requestconv(1, 2);
                                                                }
                                                                else{
                                                                    ref1.requestconv(1, 4);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else{
                                                        ref1.requestconv(1,4)
                                                    }
                                                }

                                                else{
                                                    console.log(error);
                                                }
                                            });


                                        });
                                        break;
                                    case "SimCNV6":
                                        options = {
                                            uri: 'http://localhost:9000/notifs',
                                            method: 'POST',
                                            json: true,
                                            body: {
                                                "id": "getport",
                                                "payload": {
                                                    "palletID": palletID1
                                                }
                                            }
                                        };
                                        request(options, function (error, response, body) {
                                            if (!error) {
                                                console.log('Port Number obtained as',response.body.pallport);
                                                console.log('Initiating Communication . .');
                                                var port1 = response.body.pallport;
                                                var sub = port1%10;

                                                var options1= {
                                                    uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                    method: 'POST',
                                                    json: true,
                                                    body: {
                                                        "id": "getstatus"
                                                    }
                                                }
                                            }
                                            else {
                                                console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (5)');
                                            }
                                            request(options1, function (error, response, body) {
                                                if (!error) {
                                                    console.log('requested  status and obtained as', response.body);
                                                    console.log('Capability of workstation'+ref1.wsnumber+'is'+ref1.capability);
                                                    console.log(response.body.currentneed);
                                                    if(response.body.currentneed == ref1.capability) {
                                                        console.log('Debug WS6 area1');
                                                        if (ref1.status == 'free') {
                                                            console.log('Debug WS6 area2');
                                                            ref1.requestconv(1, 2)
                                                        }
                                                        else{
                                                            if((ws10.status == 'free')){
                                                                console.log('Debug WS6 area3');
                                                                ref1.requestconv(1, 4)
                                                            }
                                                            else{
                                                                if(ref1.buffer == 'free'){
                                                                    console.log('Debug WS6 area4');
                                                                    ref1.requestconv(1, 2);
                                                                }
                                                                else{
                                                                    console.log('Debug WS6 area5');
                                                                    ref1.requestconv(1, 4);
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else{
                                                        console.log('Debug WS6 area6');
                                                        ref1.requestconv(1,4)
                                                    }
                                                }

                                                else{
                                                    console.log('Debug WS6 area7');
                                                    console.log(error);
                                                }
                                            });


                                        });
                                        break;
                                    case "SimCNV7":
                                        ref1.requestconv(1, 2);
                                        break;

                        case "SimCNV8":
                            options = {
                                uri: 'http://localhost:9000/notifs',
                                method: 'POST',
                                json: true,
                                body: {
                                    "id": "getport",
                                    "payload": {
                                        "palletID": palletID1
                                    }
                                }
                            };
                            request(options, function (error, response, body) {
                                if (!error) {
                                    console.log('Port Number obtained as',response.body.pallport);
                                    console.log('Initiating Communication . .');
                                    var port1 = response.body.pallport;
                                    var sub = port1%10;

                                    var options1= {
                                        uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                        method: 'POST',
                                        json: true,
                                        body: {
                                            "id": "getstatus"
                                        }
                                    }
                                }
                                else {
                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (6)');
                                }
                                request(options1, function (error, response, body) {
                                    if (!error) {
                                        console.log('requested  status and obtained as', response.body);
                                        if(response.body.currentneed == ref1.capability) {
                                            if (ref1.status == 'free') {
                                                ref1.requestconv(1, 2)
                                            }
                                            else{
                                                if(ws11.status == 'free'){
                                                    ref1.requestconv(1, 4)
                                                }
                                                else{
                                                    if(ref1.buffer == 'free'){
                                                        ref1.requestconv(1, 2);
                                                    }
                                                    else{
                                                        ref1.requestconv(1, 4);
                                                    }
                                                }
                                            }
                                        }
                                        else{
                                            ref1.requestconv(1,4)
                                        }
                                    }

                                    else{
                                        console.log(error);
                                    }
                                });


                            });
                            break;


                                case "SimCNV9":
                                    options = {
                                        uri: 'http://localhost:9000/notifs',
                                        method: 'POST',
                                        json: true,
                                        body: {
                                            "id": "getport",
                                            "payload": {
                                                "palletID": palletID1
                                            }
                                        }
                                    };
                                    request(options, function (error, response, body) {
                                        if (!error) {
                                            console.log('Port Number obtained as',response.body.pallport);
                                            console.log('Initiating Communication . .');
                                            var port1 = response.body.pallport;
                                            var sub = port1%10;

                                            var options1= {
                                                uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                method: 'POST',
                                                json: true,
                                                body: {
                                                    "id": "getstatus"
                                                }
                                            }
                                        }
                                        else {
                                            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (7)');
                                        }
                                        request(options1, function (error, response, body) {
                                            if (!error) {
                                                console.log('requested  status and obtained as', response.body);
                                                if(response.body.currentneed == ref1.capability) {
                                                    if (ref1.status == 'free') {
                                                        ref1.requestconv(1, 2)
                                                    }
                                                    else{
                                                        if ((ws12.status == 'free')) {
                                                            ref1.requestconv(1, 4)
                                                        }
                                                        else{
                                                            if(ref1.buffer == 'free'){
                                                                ref1.requestconv(1, 2);
                                                            }
                                                            else{
                                                                ref1.requestconv(1, 4);
                                                            }
                                                        }
                                                    }
                                                }
                                                else{
                                                    ref1.requestconv(1,4)
                                                }
                                            }

                                            else{
                                                console.log(error);
                                            }
                                        });


                                    });
                                    break;
                                case "SimCNV10":
                                    options = {
                                        uri: 'http://localhost:9000/notifs',
                                        method: 'POST',
                                        json: true,
                                        body: {
                                            "id": "getport",
                                            "payload": {
                                                "palletID": palletID1
                                            }
                                        }
                                    };
                                    request(options, function (error, response, body) {
                                        if (!error) {
                                            console.log('Port Number obtained as',response.body.pallport);
                                            console.log('Initiating Communication . .');
                                            var port1 = response.body.pallport;
                                            var sub = port1%10;

                                            var options1= {
                                                uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                method: 'POST',
                                                json: true,
                                                body: {
                                                    "id": "getstatus"
                                                }
                                            }
                                        }
                                        else {
                                            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (8)');
                                        }
                                        request(options1, function (error, response, body) {
                                            if (!error) {
                                                console.log('requested  status and obtained as', response.body);
                                                if(response.body.currentneed == ref1.capability) {
                                                    if (ref1.status == 'free') {
                                                        ref1.requestconv(1, 2)
                                                    }
                                                    else{
                                                        if(ref1.buffer == 'free'){
                                                                ref1.requestconv(1, 2);
                                                        }
                                                        else{
                                                              ref1.requestconv(1, 4);
                                                        }
                                                    }
                                                }
                                                else{
                                                    ref1.requestconv(1,4)
                                                }
                                            }
                                            else{
                                                console.log(error);
                                            }
                                        });


                                    });
                                    break;
                                case "SimCNV11":
                                    options = {
                                        uri: 'http://localhost:9000/notifs',
                                        method: 'POST',
                                        json: true,
                                        body: {
                                            "id": "getport",
                                            "payload": {
                                                "palletID": palletID1
                                            }
                                        }
                                    };
                                    request(options, function (error, response, body) {
                                        if (!error) {
                                            console.log('Port Number obtained as',response.body.pallport);
                                            console.log('Initiating Communication . .');
                                            var port1 = response.body.pallport;
                                            var sub = port1%10;

                                            var options1= {
                                                uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                method: 'POST',
                                                json: true,
                                                body: {
                                                    "id": "getstatus"
                                                }
                                            }
                                        }
                                        else {
                                            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (9)');
                                        }
                                        request(options1, function (error, response, body) {
                                            if (!error) {
                                                console.log('requested  status and obtained as', response.body);
                                                if(response.body.currentneed == ref1.capability) {
                                                    if (ref1.status == 'free') {
                                                        ref1.requestconv(1, 2)
                                                    }
                                                    else{
                                                        if(ref1.buffer == 'free'){
                                                            ref1.requestconv(1, 2);
                                                        }
                                                        else{
                                                            ref1.requestconv(1, 4);
                                                        }
                                                    }
                                                }
                                                else{
                                                    ref1.requestconv(1,4)
                                                }
                                            }
                                            else{
                                                console.log(error);
                                            }
                                        });


                                    });
                                    break;
                                case "SimCNV12":
                                    options = {
                                        uri: 'http://localhost:9000/notifs',
                                        method: 'POST',
                                        json: true,
                                        body: {
                                            "id": "getport",
                                            "payload": {
                                                "palletID": palletID1
                                            }
                                        }
                                    };
                                    request(options, function (error, response, body) {
                                        if (!error) {
                                            console.log('Port Number obtained as',response.body.pallport);
                                            console.log('Initiating Communication . .');
                                            var port1 = response.body.pallport;
                                            var sub = port1%10;

                                            var options1= {
                                                uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                                method: 'POST',
                                                json: true,
                                                body: {
                                                    "id": "getstatus"
                                                }
                                            }
                                        }
                                        else {
                                            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (10)');
                                        }
                                        request(options1, function (error, response, body) {
                                            if (!error) {
                                                console.log('requested  status and obtained as', response.body);
                                                if(response.body.currentneed == ref1.capability) {
                                                    if (ref1.status == 'free') {
                                                        ref1.requestconv(1, 2)
                                                    }
                                                    else{
                                                        if(ref1.buffer == 'free'){
                                                            ref1.requestconv(1, 2);
                                                        }
                                                        else{
                                                            ref1.requestconv(1, 4);
                                                        }
                                                    }
                                                }
                                                else{
                                                    ref1.requestconv(1,4)
                                                }
                                            }
                                            else{
                                                console.log(error);
                                            }
                                        });


                                    });
                                    break;

                        }
                    if ((req.body.payload.PalletID == -1)) {
                        ref1.zone1 = false;
                    }

                }

                    res.end();
                break;
            //
            case "Z2_Changed":
            //
                if ((req.body.payload.PalletID != -1)) {
                    ref1.buffer = 'occupied';
            //
                    switch (req.body.senderID) {
            //
            //
                        case "SimCNV1":
                        case "SimCNV7":
                            if(ref1.status == 'free') {
                                ref1.requestconv(2,3)
                            }
                            break;

                        case "SimCNV2":
                        case "SimCNV3":
                        case "SimCNV4":
                        case "SimCNV5":
                        case "SimCNV6":
                        case "SimCNV8":
                        case "SimCNV9":
                        case "SimCNV10":
                        case "SimCNV11":
                        case "SimCNV12":

                            if(ref1.status != 'busy'){
                                ref1.requestconv(2,3)
                            }

                            break;
                    }
            //
            //
                }
                if ((req.body.payload.PalletID == -1)) {
                    ref1.buffer = 'free';
                    switch (req.body.senderID) {
                        case "SimCNV1":
                        case "SimCNV7":
                            request.get("http://localhost:3000/RTU/SimCNV"+ref1.wsnumber+"/data/P1", function (req, res) {
                                var obj1 = JSON.parse(res.body);
                                var present = obj1.v;
                                if(present){
                                        ref1.requestconv(1,2)
                                }

                            });
                            break;
                    }

                }
                res.end();
                break;
            //
            //
            case "Z3_Changed":

                //IF A PALLET ARRIVES AT ZONE 3 AND THAT HAPPENS NOT AT ROBOT 7 (TO PREVENT SIMILAR CONDITIONS WHILE LOADING PALLET)
                if (req.body.payload.PalletID != -1) {
                    var palletID3 = req.body.payload.PalletID;

                    ref1.status = 'busy';

                     switch (req.body.senderID) {

                        case"SimCNV7":

                                break;
                        case "SimCNV1":

                            options = {
                                uri: 'http://localhost:9000/notifs',
                                method: 'POST',
                                json: true,
                                body: {
                                    "id": "getport",
                                    "payload": {
                                        "palletID": palletID3
                                    }
                                }
                            };
                            request(options, function (error, response, body) {
                                if (!error) {
                                    console.log('Port Number obtained as',response.body.pallport);
                                    console.log('Initiating Communication . .');
                                    var port1 = response.body.pallport;
                                    var sub = port1%10;

                                    var options1= {
                                        uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                        method: 'POST',
                                        json: true,
                                        body: {
                                            "id": "getstatus"
                                        }
                                    }
                                }
                                else {
                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (12)');
                                }
                                request(options1, function (error, response, body) {
                                    if (!error) {
                                        console.log('requested status and obtained as', response.body);
                                        if(response.body.currentneed == 'paper'){
                                           ref1.work(response.body)
                                        }

                                        else {
                                            console.log(error);
                                            ref1.requestconv(3,5)
                                        }
                                    }

                                    else{
                                        console.log(error);
                                    }
                                });


                            });
                            break;
                        case "SimCNV2":
                        case "SimCNV3":
                        case "SimCNV4":
                        case "SimCNV5":
                        case "SimCNV6":
                        case "SimCNV8":
                        case "SimCNV9":
                        case "SimCNV10":
                        case "SimCNV11":
                        case "SimCNV12":
                            options = {
                                uri: 'http://localhost:9000/notifs',
                                method: 'POST',
                                json: true,
                                body: {
                                    "id": "getport",
                                    "payload": {
                                        "palletID": palletID3
                                    }
                                }
                            };
                            request(options, function (error, response, body) {
                                if (!error) {
                                    console.log('Port Number obtained as',response.body.pallport);
                                    console.log('Initiating Communication . .');
                                    var port1 = response.body.pallport;
                                    var sub = port1%10;

                                    var options1= {
                                        uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                        method: 'POST',
                                        json: true,
                                        body: {
                                            "id": "getstatus"
                                        }
                                    }
                                }
                                else {
                                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (13)');
                                }
                                request(options1, function (error, response, body) {
                                    if (!error) {

                                            ref1.work(response.body)
                                    }

                                    else{
                                        console.log(error);
                                    }
                                });
                            });
                            break;
                    }
                }

                else if (req.body.payload.PalletID == -1) {
                    ref1.status = 'free';

                    if (ref1.buffer == 'occupied') {
                            ref1.requestconv(2,3);
                    }
                }
                // res.writeHead(202);
                res.end();

                break;

            case "Z4_Changed":
            //
            //
            //
                if ((req.body.payload.PalletID != -1)) {

                    if((ref1.flag == false)&&(ref1.zone5 == false)){
                        ref1.requestconv(4,5)
                    }
                }
            //
            //     else if ((req.body.payload.PalletID == -1)){
            //
            //         if(ref1.zone1 == true){
            //
            //
            //
            //         }
            //
            //     }
            //
            //
                res.end();
                break;
            //
            // case "Z5_Changed":
            //     if (req.body.payload.PalletID == -1) {
            //         ref1.zone5 = false;
            //
            //         switch (req.body.senderID) {
            //
            //             case "SimCNV2":
            //             case "SimCNV3":
            //             case "SimCNV4":
            //             case "SimCNV5":
            //             case "SimCNV6":
            //             case "SimCNV8":
            //             case "SimCNV9":
            //             case "SimCNV10":
            //             case "SimCNV11":
            //             case "SimCNV12":
            //
            //                 console.log(req.body);
            //
            //
            //                 ref1.flag = false;
            //
            //
            //                 setTimeout(function () {
            //
            //                 }, 1500);
            //
            //         }
            //     }
            //     else if (req.body.payload.PalletID != -1) {
            //         ref1.zone5 = true;
            //
            //     }
            //     res.end();
            //
            //     break;
            //
            case "DrawEndExecution":

                console.log('Completed Drawing Recipe' + req.body.payload.Recipe + 'of colour' + req.body.payload.Color);
                var index6;
                var options1;
                var port1;
                var sub;
                var palletID  = req.body.payload.PalletID;
                var options6 = {
                    uri: 'http://localhost:9000/notifs',
                    method: 'POST',
                    json: true,
                    body: {
                        "id": "getport",
                        "payload": {
                            "palletID": palletID
                        }
                    }
                };
                //GETTING THE PORT NUMBER
                request(options6, function (error, response, body) {
                    if (!error) {
                        console.log('Port Number obtained as',response.body.pallport);
                        console.log('Initiating Communication . .');
                        port1 = response.body.pallport;
                        sub = port1%10;

                    }
                    else {
                        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Error getting port (14)');
                    }

                if ((req.body.payload.Recipe > 0) && (req.body.payload.Recipe < 4)) {


                    options1 = {
                        uri: 'http://localhost:'+port1+'/notifs/'+sub,
                        method: 'POST',
                        json: true,
                        body: {
                            "id": "update",
                            "payload": {
                                "attribute": "frame",
                                "value": true
                            }
                        }
                    };
                }
                else if ((req.body.payload.Recipe > 3) && (req.body.payload.Recipe < 7)) {
                        options1 = {
                            uri:'http://localhost:'+port1+'/notifs/'+sub,
                            method: 'POST',
                            json: true,
                            body: {
                                "id": "update",
                                "payload": {
                                    "attribute": "screen",
                                    "value": true
                                }
                            }
                        };
                }
                if ((req.body.payload.Recipe > 6) && (req.body.payload.Recipe < 10)) {
                        options1 = {
                            uri: 'http://localhost:'+port1+'/notifs/'+sub,
                            method: 'POST',
                            json: true,
                            body: {
                                "id": "update",
                                "payload": {
                                    "attribute": "keyboard",
                                    "value": true
                                }
                            }
                        };
                    }
                    //UPDATE THE EXECUTION OF DRAWING
                    request(options1, function (error, response, body) {
                        if (!error) {
                            console.log('Requested Pallet to Update after Drawing ');
                            console.log('Going to continue drawing if anything left');
                            var options2= {
                                uri: 'http://localhost:'+port1+'/notifs/'+sub,
                                method: 'POST',
                                json: true,
                                body: {
                                    "id": "getstatus"
                                }
                            };
                            request(options2, function (error, response, body) {
                                ref1.work(response.body);
                            });
                        }
                        // res.writeHead(202);

                    });
                });
                res.end();
                break;

            case "PalletLoaded":

                var options = {
                    uri: 'http://localhost:9000/notifs',
                    method: 'POST',
                    json: true,
                    body: req.body
                };

                request(options, function (error, response, body) {
                    if (!error) {
                        console.log('Pallet Loaded information sent to Order Agent . '); // Print the shortened url.
                    }
                    else {
                        console.log(error);
                    }

                });
                res.writeHead(200);
                res.end();

                break;


            // case "PalletUnloaded":
            //
            //     break;
            case "PaperLoaded":

                ref1.requestconv(3, 5);

                break;
            // case "PaperUnloaded":
            //     request.get("http://localhost:3000/RTU/SimCNV2/data/P1", function (req, res) {
            //         var obj = JSON.parse(res.body);
            //         var present = obj.v;
            //         console.log('PRESENT VALUE IS~~~~~~~~~', present);
            //         if (!present) {
            //
            //
            //         }
            //
            //         if (present){
            //             setTimeout(function() {
            //
            //             },wait);
            //         }
            //     });
            //
            //     res.end();
            //     break;
            // }
            case "RequestTransfer":

                setTimeout(function(){
                    ref1.requestconv (req.body.payload.zone1,req.body.payload.zone2);
                },1000);
                res.writeHead(200);
                res.end();
                break;

        }

        //IF NEW PALLET IS INTRODUCED IN ALL ROBOTS

    });

    app.listen(port, hostname, function(){
        console.log('Server running at http'+hostname+'://:'+port);
    });

    if((ref1.wsnumber>0)&&(ref1.wsnumber<10)) {
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        if((ref1.wsnumber!=1)&&(ref1.wsnumber!=7))
        {
            request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
            request.post('http://localhost:3000/RTU/SimROB'+ref1.wsnumber+'/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:600"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        }

    }
    if((ref1.wsnumber>9)&&(ref1.wsnumber<13)) {
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.wsnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
        request.post('http://localhost:3000/RTU/SimROB'+ref1.wsnumber+'/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:60"+ref1.wsnumber+"/notifs/"+ref1.wsnumber}});
    }

};

workstation.prototype.loadpen = function () {
    var ref=this;
    var options;
    if (this.capability == "red") {
        options = {
            method: 'POST', //http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenRED
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+this.wsnumber+"/services/ChangePenRED",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    else if (this.capability == "green") {
        options = {
            method: 'POST',  //http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenGREEN
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object  	http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/Draw1
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+this.wsnumber+"/services/ChangePenGREEN",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    else if (this.capability == "blue") {
        options = {
            method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+this.wsnumber+"/services/ChangePenBLUE",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    //Print the result of the HTTP POST request
    request(options, function (err) {

        if (err) {
            console.log('Error loading pen', err);
        }


    });
    console.log('workstation ' + ref.wsnumber +' Pen Colour '  + ref.capability + ' loaded');
};

function subscriptions() {

    request.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/7"}}, function (err) {if (err) {} else{ console.log('subscribed to pallet load');}});
    request.post('http://localhost:3000/RTU/SimROB1/events/PaperLoaded/notifs', {form: {destUrl: "http://localhost:6001/notifs/1"}}, function (err) {if (err) {}});
    request.post('	http://localhost:3000/RTU/SimROB7/events/PalletUnloaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/7"}}, function (err) {if (err) {}});
}

var ws1 = new workstation(1,'paper');
var ws2 = new workstation(2,'red');
var ws3 = new workstation(3,'blue');
var ws4 = new workstation(4,'green');
var ws5 = new workstation(5,'red');
var ws6 = new workstation(6, 'blue');
var ws7 = new workstation(7,'loadpallet');
var ws8 = new workstation(8,'green');
var ws9 = new workstation(9,'red');
var ws10 = new workstation(10,'blue');
var ws11 = new workstation(11, 'green');
var ws12 = new workstation(12, 'red');


ws1.runServer(6001);
ws2.runServer(6002);
ws3.runServer(6003);
ws4.runServer(6004);
ws5.runServer(6005);
ws6.runServer(6006);
ws7.runServer(6007);
ws8.runServer(6008);
ws9.runServer(6009);
ws10.runServer(6010);
ws11.runServer(6011);
ws12.runServer(6012);

ws2.loadpen();
ws3.loadpen();
ws4.loadpen();
ws5.loadpen();
ws6.loadpen();
ws8.loadpen();
ws9.loadpen();
ws10.loadpen();
ws11.loadpen();
ws12.loadpen();

app.listen(5001, function(){
    console.log('Server Running on Port 5001');
    subscriptions();

});