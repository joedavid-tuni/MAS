/**
 * Created by Joe David on 20-04-2017.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var robot= function (robnumber, capability) {
    this.robnumber = robnumber;
    this.capability = capability;
    this.port  = 1234;
    this.url = "127.0.0.1";
    this.status = 'free';

};



//METHOD RUNSERVER OF CLASS ROBOT
robot.prototype.runServer = function (port) {
    // this.port = port;
    var ref1 = this;
    var hostname = this.url;



    app.get('/'+ref1.robnumber, function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am ROBOT ' + ref1.robnumber);
        res.write('\nMy capability is: ' + ref1.capability);
        res.end('\nROBOT ' + ref1.robnumber + ' is running.');
        console.log(ref1.robnumber);
    });

    app.post('/notifs/'+ref1.robnumber, function(req,res){

        // var ref = this;
        console.log(req.body);
        // switch (req.body.SenderID) {

        //  case 'SimCNV8' || 'SimCNV9' || 'SimCNV10' || 'SimCNV11' || 'SimCNV12' || 'SimCNV2' || 'SimCNV3' || 'SimCNV4' || 'SimCNV5' || 'SimCNV6':

        switch (req.body.id){

            // case "Z1_Changed":
            //
            //
            //     if ((req.body.payload.PalletID != -1)) { //If new pallet is introduced and not leaving (as we receive notifications for both)
            //         ref1.zone1 = true;
            //
            //
            //
            //         switch (req.body.senderID) {
            //
            //             case "SimCNV1":
            //
            //                 if(ref1.buffer == 'free'){
            //
            //
            //                 }
            //
            //                 break;
            //
            //             case "SimCNV2":
            //
            //                 //CHECKING IF THE CURRENT ROBOT IS CAPABLE OF SERVING
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //             case "SimCNV3":
            //
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //             case "SimCNV4":
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //             case "SimCNV5": if(ref1.capability == pallet[index1].currentneed_) {
            //                 //CHECKING IF THE ROBOT IS  FREE
            //                 if(ref1.status == 'free'){
            //
            //
            //                 }
            //                 //IF ROBOT IS NOT FREE
            //                 else{
            //                     //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                     if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                     }
            //                     //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                     else {
            //                         // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                         if(ref1.buffer == 'free'){
            //
            //
            //                         }
            //                         //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                         else{
            //
            //                         }
            //                     }
            //                 }
            //             }
            //             //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //             else{
            //
            //             }
            //                 break;
            //             case "SimCNV6":
            //                 //CHECKING IF THE CURRENT ROBOT IS CAPABLE OF SERVING
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //                 break;
            //
            //             case "SimCNV7":
            //
            //                 break;
            //
            //             case "SimCNV8":
            //
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //
            //                 //IF ZONE 1 OF ROBOT 8 OCCURS AND THERE IS NO PALLET PRESENT IN ZONE 2 OF ROBOT 7
            //
            //
            //                 if(ws7.buffer == 'free') {
            //                     connection.query("SELECT * FROM Pallets where Status = 'in_queue'", function (results, rows) {
            //
            //                         if (rows.length == 0) {
            //                             console.log('No Pallets Ordered to Produce');
            //                         }
            //                         else {
            //                             setTimeout(function () {
            //                                 var options = {
            //                                     method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+robnumber+"/services/ChangePenBLUE
            //                                     body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            //                                     json: true,
            //                                     url: "	http://localhost:3000/RTU/SimROB7/services/LoadPallet",
            //                                     headers: {
            //                                         'Content-Type': 'application/json'
            //                                     }
            //                                 };
            //                                 //Print the result of the HTTP POST request
            //                                 request(options, function (err) {
            //                                     if (err) {
            //                                         console.log('Error Loading Pallet');
            //                                     }
            //                                 });
            //                                 connection.query("UPDATE Pallets SET Status = 'processed' WHERE ProductID = ?", rows[0].ProductID, function () {
            //                                     console.log("Rows 'processed' Successfully");
            //                                 });
            //                             }, 2000);
            //
            //                         }
            //
            //                     });
            //                 }
            //
            //                 break;
            //
            //             case "SimCNV9":
            //                 //CHECKING IF THE CURRENT ROBOT IS CAPABLE OF SERVING
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //             case "SimCNV10":
            //                 //CHECKING IF THE CURRENT ROBOT IS CAPABLE OF SERVING
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //             case "SimCNV11":
            //                 //CHECKING IF THE CURRENT ROBOT IS CAPABLE OF SERVING
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //             case "SimCNV12":
            //                 //CHECKING IF THE CURRENT ROBOT IS CAPABLE OF SERVING
            //                 if(ref1.capability == pallet[index1].currentneed_) {
            //                     //CHECKING IF THE ROBOT IS  FREE
            //                     if(ref1.status == 'free'){
            //
            //
            //                     }
            //                     //IF ROBOT IS NOT FREE
            //                     else{
            //                         //CHECKING IF THERE ARE OTHER ROBOTS WITH THE CAPABILITY THAT IS FREE
            //                         if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
            //
            //                         }
            //                         //IF NO OTHER ROBOTS WITH THE CAPABILITY ARE FREE
            //                         else {
            //                             // CHECKING IF THE BUFFER OS THE CURRENT ROBOT IS FREE
            //                             if(ref1.buffer == 'free'){
            //
            //
            //                             }
            //                             //IF THE BUFFER OF THE CURRENT ROBOT IS NOT FREE
            //                             else{
            //
            //                             }
            //                         }
            //                     }
            //                 }
            //                 //IF CURRENT ROBOT IS NOT CAPABLE OF SERVING
            //                 else{
            //
            //                 }
            //                 break;
            //
            //         }
            //     }
            //     if ((req.body.payload.PalletID == -1)) {
            //         ref1.zone1 = false;
            //
            //     }
            //
            //     res.end();
            //     break;
            //
            // case "Z2_Changed":
            //
            //     if ((req.body.payload.PalletID != -1)) {
            //         ref1.buffer = 'occupied';
            //
            //         switch (req.body.senderID) {
            //
            //
            //             case "SimCNV1":
            //             case"SimCNV7":
            //                 if(ref1.status == 'free') {
            //
            //                 }
            //                 break;
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
            //                 if(ref1.status != 'busy'){
            //
            //                 }
            //
            //                 break;
            //         }
            //
            //
            //     }
            //     if ((req.body.payload.PalletID == -1)) {
            //         ref1.buffer = 'free';
            //         switch (req.body.senderID) {
            //             case "SimCNV1":
            //             case "SimCNV7":
            //                 request.get("http://localhost:3000/RTU/SimCNV"+ref1.robnumber+"/data/P1", function (req, res) {
            //                     var obj = JSON.parse(res.body);
            //                     var present = obj.v;
            //                     if(present){
            //
            //                     }
            //
            //                 });
            //                 break;
            //         }
            //
            //     }
            //     res.end();
            //     break;
            //
            //
            // case "Z3_Changed":
            //
            //     //IF A PALLET ARRIVES AT ZONE 3 AND THAT HAPPENS NOT AT ROBOT 7 (TO PREVENT SIMILAR CONDITIONS WHILE LOADING PALLET)
            //     if (req.body.payload.PalletID != -1) {
            //
            //
            //         ref1.status = 'busy';
            //
            //         var palletID3 = req.body.payload.PalletID;
            //
            //
            //         switch (req.body.senderID) {
            //
            //             // case"SimCNV7":
            //             //     if (pallet[index3].currentneed_ == 'complete'){
            //             //
            //             //         var options = {
            //             //             method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+robnumber+"/services/ChangePenBLUE
            //             //             body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            //             //             json: true,
            //             //             url: "http://localhost:3000/RTU/SimROB7/services/UnloadPallet",
            //             //             headers: {
            //             //                 'Content-Type': 'application/json'
            //             //             }
            //             //         };
            //             //         //Print the result of the HTTP POST request
            //             //         request(options, function (err) {
            //             //             if (err) {
            //             //                 console.log('Error Unloading Pallet');
            //             //             }
            //             //
            //             //         });
            //             //
            //             //     }
            //             //
            //             //     else {
            //             //
            //             //
            //             //     }
            //             //     break;
            //
            //             case "SimCNV1":
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
            //                 break;
            //         }
            //     }
            //
            //     else if (req.body.payload.PalletID == -1) {
            //         ref1.status = 'free';
            //
            //         if (ref1.buffer == 'occupied') {
            //
            //         }
            //     }
            //     // res.writeHead(202);
            //     res.end();
            //
            //     break;
            //
            // case "Z4_Changed":
            //
            //
            //
            //     if ((req.body.payload.PalletID != -1)) {
            //
            //         if((ref1.flag == false)&&(ref1.zone5 == false)){
            //
            //         }
            //     }
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
            //     res.end();
            //     break;
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
            // case "DrawEndExecution":
            //
            //
            //
            //
            //     //
            //     // console.log('Completed Drawing Recipe' + req.body.payload.Recipe + 'of colour' + req.body.payload.Color);
            //     // var index6;
            //     //
            //     // var palletID1 = req.body.payload.PalletID;
            //     //
            //     // for (var i = 0; i < pallet.length; i++) {
            //     //     if (pallet[i].palletID == palletID1) {
            //     //
            //     //         break;
            //     //     }
            //     // }
            //     //
            //     // if ((req.body.payload.Recipe > 0) && (req.body.payload.Recipe < 4)) {
            //     //
            //     //     pallet[index6].frame = true;
            //     //     pallet[index6].currentneed_ = pallet[index6].screenColour;
            //     //     console.log('Setting Frame true and Screen as current need');
            //     //     // setTimeout(function() {
            //     //
            //     //     // },1000);
            //     // }
            //     //
            //     // if ((req.body.payload.Recipe > 3) && (req.body.payload.Recipe < 7)) {
            //     //     pallet[index6].screen = true;
            //     //     pallet[index6].currentneed_ = pallet[index6].keyboardColour;
            //     //     console.log('Setting Screen true and Keyboard as current need');
            //     //     // setTimeout(function() {
            //     //
            //     //     // },1000);
            //     // }
            //     //
            //     // if ((req.body.payload.Recipe > 6) && (req.body.payload.Recipe < 10)) {
            //     //     pallet[index6].keyboard = true;
            //     //     pallet[index6].currentneed_ = 'complete';
            //     //     console.log('Setting as complete');
            //     //     // setTimeout(function() {
            //     //     ref1.flag=true;
            //     //     //HANDLE FLAG
            //     //     setTimeout(function () {
            //     //
            //     //     }, 100);
            //     //
            //     // }
            //     // // res.writeHead(202);
            //     // res.end();
            //
            //     break;
            // // case "PaperLoaded":
            // //     request.get("http://localhost:3000/RTU/SimCNV2/data/P1", function (req, res, body) {
            // //         var obj = JSON.parse(res.body);
            // //         var present = obj.v;
            // //         if (!present) {
            // //             setTimeout(function() {
            // //                 ref1.transzone(3, 5);
            // //             },1000);
            // //         }
            // //
            // //         else {
            // //
            // //             //write code to invoke the above after 10 seconds
            // //         }
            // //     });
            // //
            // //     res.end();
            // //     break;
            case "PalletLoaded":

                var options = {
                    uri: 'http://localhost:9000/notifs',
                    method: 'POST',
                    json: true,
                    body: req.body
                };

                request(options, function (error, response, body) {
                    if (!error) {
                        console.log('Pallet Loaded information sent to Order Agent . ') // Print the shortened url.
                    }
                    else {
                        console.log(error);
                    }

                });




                break;


            // case "PalletUnloaded":
            //
            //     break;
            //
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
        }

        //   break;
        //  }

        //IF NEW PALLET IS INTRODUCED IN ALL ROBOTS

    });

    app.listen(port, hostname, function(){
        console.log('Server running at http'+hostname+'://:'+port);
    });

    if((ref1.robnumber>0)&&(ref1.robnumber<10)) {
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        if((ref1.robnumber!=1)&&(ref1.robnumber!=7))
        {
            request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:600"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
            request.post('http://localhost:3000/RTU/SimROB'+ref1.robnumber+'/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:600"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        }

    }
    if((ref1.robnumber>9)&&(ref1.robnumber<13)) {
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z1_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z2_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z3_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z4_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('	http://localhost:3000/RTU/SimCNV'+ref1.robnumber+'/events/Z5_Changed/notifs', {form: {destUrl: "http://localhost:60"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
        request.post('http://localhost:3000/RTU/SimROB'+ref1.robnumber+'/events/DrawEndExecution/notifs', {form: {destUrl: "http://localhost:60"+ref1.robnumber+"/notifs/"+ref1.robnumber}});
    }

};

robot.prototype.loadpen = function () {
    var ref=this;
    var options;
    if (this.capability == "red") {
        options = {
            method: 'POST', //http://127.0.0.1:3000/RTU/SimROB"+robnumber+"/services/ChangePenRED
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+this.robnumber+"/services/ChangePenRED",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    else if (this.capability == "green") {
        options = {
            method: 'POST',  //http://127.0.0.1:3000/RTU/SimROB"+robnumber+"/services/ChangePenGREEN
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object  	http://127.0.0.1:3000/RTU/SimROB"+robnumber+"/services/Draw1
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+this.robnumber+"/services/ChangePenGREEN",
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
    else if (this.capability == "blue") {
        options = {
            method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+robnumber+"/services/ChangePenBLUE
            body: {"destUrl": "http://127.0.0.1"}, // Javascript object
            json: true,
            url: "http://127.0.0.1:3000/RTU/SimROB"+this.robnumber+"/services/ChangePenBLUE",
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
    console.log('Robot ' + ref.robnumber +' Pen Colour '  + ref.capability + ' loaded');
};

function subscriptions() {

    request.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/7"}}, function (err) {if (err) {} else{ console.log('subscribed to pallet load');}});
    request.post('http://localhost:3000/RTU/SimROB1/events/PaperLoaded/notifs', {form: {destUrl: "http://localhost:6001/notifs/paperloaded"}}, function (err) {if (err) {}});
    request.post('	http://localhost:3000/RTU/SimROB7/events/PalletUnloaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/7"}}, function (err) {if (err) {}});
}


var rob1 = new robot(1,'paper');
var rob2 = new robot(2,'red');
var rob3 = new robot(3,'blue');
var rob4 = new robot(4,'green');
var rob5 = new robot(5,'red');
var rob6 = new robot(6, 'blue');
var rob7 = new robot(7,'loadpallet');
var rob8 = new robot(8,'green');
var rob9 = new robot(9, 'red');
var rob10 = new robot(10, 'blue');
var rob11 = new robot(11,  'green');
var rob12 = new robot(12,  'red');


rob1.runServer(6001);
rob2.runServer(6002);
rob3.runServer(6003);
rob4.runServer(6004);
rob5.runServer(6005);
rob6.runServer(6006);
rob7.runServer(6007);
rob8.runServer(6008);
rob9.runServer(6009);
rob10.runServer(6010);
rob11.runServer(6011);
rob12.runServer(6012);

rob2.loadpen();
rob3.loadpen();
rob4.loadpen();
rob5.loadpen();
rob6.loadpen();
rob8.loadpen();
rob9.loadpen();
rob10.loadpen();
rob11.loadpen();
rob12.loadpen();

app.listen(5001, function(){
    console.log('Server Running on Port 5001');
    subscriptions();

});