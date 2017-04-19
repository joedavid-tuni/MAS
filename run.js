/**
 * Created by Joe David on 09-04-2017.
 */

var mysql = require('mysql');
var heartbeats = require('heartbeats');
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');
var Countdown = require('timepiece').Countdown;
var countdown = new Countdown();
const wait = 5000;
var pallet = [];
var pallet_C2Z1;

countdown.set(5);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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


app.post('/load', function(req,res){
    console.log('Request to Load received . .');
    connection.query("SELECT * FROM Pallets where Status = 'in_queue'", function(results,rows){

        if (rows.length ==0 ){
            console.log('No Pallets Ordered to Produce');
        }
        else{
            setTimeout(function(){
                var options = {
                    method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                    body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                    json: true,
                    url: "	http://localhost:3000/RTU/SimROB7/services/LoadPallet",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                //Print the result of the HTTP POST request
                request(options, function (err) {
                    if (err) {
                        console.log('Error Loading Pallet');
                    }
                });
            }, 1000);
            connection.query("UPDATE Pallets SET Status = 'processed' WHERE ProductID = ?", rows[0].ProductID, function(){
                console.log("Rows 'processed' Successfully");
            });
        }

    });
res.end();

});



//CLASS WORKSTATION
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
    // if(!((wsnumber == 1)||(wsnumber == 7))) {
    //     this.loadpen(wsnumber, capability);
    // }
};


//CLASS PALLET
var pallAgent= function pallAgent(id,ProductID,frameType,frameColour,screenType,screenColour,keyboardType,keyboardColour,palletId) {
    this.Orderid = id;
    this.ProductID = ProductID;
    this.frame = false;
    this.keyboard = false;
    this.screen = false;
    this.paper = false;
    if (frameType == 'Frame_1') { this.frameType =1 ;} else if (frameType == 'Frame_2') { this.frameType =2 ;}  else if (frameType == 'Frame_3') { this.frameType =3 ;}
    this.frameColour = frameColour;
    if (screenType == 'Screen_1'){this.screenType = 4;} else  if (screenType == 'Screen_2'){this.screenType = 5;} else if (screenType == 'Screen_3'){this.screenType = 6;}
    this.screenColour = screenColour ;
    if (keyboardType == 'Keyboard_1'){this.keyboardType = 7 ;} else if (keyboardType == 'Keyboard_2'){this.keyboardType = 8 ;} else if (keyboardType == 'Keyboard_3'){this.keyboardType = 9 ;}
    this.keyboardColour = keyboardColour;
    this.currentws = 7;
    this.currentzone = 3;
    this.palletID = palletId || 0;
    this.currentneed_ = 'paper';
};


// function index1(_palletID){
//     var index=0;
//     for (var i=0;i<pallet.length; i++){
//         if (pallet[i].palletID = _palletID){
//             index = i;
//             break;
//         }
//         return index;
//     }
//
// }

pallAgent.prototype.currentneed = function () {
    console.log('Requested for current need~~~~~~~~~~~~~~~~~~~~')
  return this.currentneed_;
};

// workstation.prototype.makeRequest= function(wsnumber, req){
//     var ref=this;
//     if (req == 'loadpaper'){
//         var options = {
//             method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
//             body: {"destUrl": "http://127.0.0.1"}, // Javascript object
//             json: true,
//             url: "	http://localhost:3000/RTU/SimROB"+wsnumber+"/services/LoadPaper",
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         };
//         //Print the result of the HTTP POST request
//         request(options, function (err, res, body) {
//             if (err) {
//                 console.log('Error Loading Pallet');
//             }
//             else {
//                 console.log(body);
//             }
//         });
//
//     }
//
// };


workstation.prototype.work= function (index) {
var ref =this;
    switch (this.wsnumber){

        case 1:
            if(pallet[index].currentneed_ == 'paper') {
                var options4 = {
                    method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                    body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                    json: true,
                    url: "	http://localhost:3000/RTU/SimROB" + this.wsnumber + "/services/LoadPaper",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                //Print the result of the HTTP POST request
                request(options4, function (err) {
                    if (err) {
                        console.log('Error Loading Paper');
                    }
                    else {

                        console.log('Debug 3~~~~~~~~~~~~~~~~~~~~~`');
                        pallet[index].currentneed_ = pallet[index].frameColour;
                        pallet[index].paper = true;
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
            var url="";
            if(!(pallet[index].frame)){
              //  if(pallet[index].frameType==1){url="http://localhost:3000/RTU/SimROB2/services/Draw1"};

                var options = {
                    method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                    body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                    json: true,
                    url: "	http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+pallet[index].frameType,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                //Print the result of the HTTP POST request
                request(options, function () {
                    // if (err){
                    //     console.log('Error drawing frame, Error:');
                    //     console.log(err);
                    // }
                    // else{
                        console.log('Requested to draw frame of type' + pallet[index].frameType + ' and of colour ' + pallet[index].frameColour );
                    // }
                });
        }
            else if(!(pallet[index].screen)){
                if (pallet[index].currentneed()==ref.capability){       //http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+pallet[index].screenType, function(req,res,err)
                    var options = {
                        method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                        body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                        json: true,
                        url: "	http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+pallet[index].screenType,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    //Print the result of the HTTP POST request
                    request(options, function () {
                        // if (err){
                        //     console.log('Error drawing frame, Error:');
                        //     console.log(err);
                        // }
                        // else{
                        console.log('Requested to draw Screen of type' + pallet[index].screenType + ' and of colour ' + pallet[index].screenColour );
                        // }
                    });
                }
                else{

                    //HANDLE FLAGG
                    if(!ref.flag) {
                        ref.transzone(3, 5);
                    }

                }

            }
            else if(!(pallet[index].keyboard)){
                if (pallet[index].currentneed()==ref.capability){ //http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+pallet[index].keyboardType
                    var options = {
                        method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                        body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                        json: true,
                        url: "	http://localhost:3000/RTU/SimROB"+ref.wsnumber+"/services/Draw"+pallet[index].keyboardType,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    //Print the result of the HTTP POST request
                    request(options, function () {
                        // if (err){
                        //     console.log('Error drawing frame, Error:');
                        //     console.log(err);
                        // }
                        // else{
                        console.log('Requested to draw Keyboard of type' + pallet[index].keyboardType + ' and of colour ' + pallet[index].keyboardColour );
                        // }
                    });
                }
                else{

                    //HANDLE FLAG
                 if(!ref.flag) {
                     ref.transzone(3, 5);
                 }


                }

            }
        break;



    }
};


//METHOD RUNSERVER OF CLASS WORKSTATION
workstation.prototype.runServer = function (port) {
    this.port = port;
    var ref1 = this;
    var hostname = this.url;



    app.get('/', function(req,res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.write('\nI am workstation ' + ref1.wsnumber);
        res.write('\nMy capability is: ' + ref1.capability);
        res.end('\nWorkstation ' + ref1.wsnumber + ' is running.');
    });

    app.post('/notifs/'+ref1.wsnumber, function(req,res){

       // var ref = this;
       console.log(req.body);
       // switch (req.body.SenderID) {

          //  case 'SimCNV8' || 'SimCNV9' || 'SimCNV10' || 'SimCNV11' || 'SimCNV12' || 'SimCNV2' || 'SimCNV3' || 'SimCNV4' || 'SimCNV5' || 'SimCNV6':

                switch (req.body.id){

                    case "Z1_Changed":


                      if ((req.body.payload.PalletID != -1)) { //If new pallet is introduced and not leaving (as we receive notifications for both)
                          ref1.zone1 = true;
                          console.log('\n\n~~~~~~~~~~Z1 CHANGED OF WORKSTATION'+ ref1.wsnumber + '~~~~~~~~~~');
                          console.log(pallet);
                          console.log('Pallet Size', pallet.length);
                          console.log('\n\n');
                          var index1 = 0;
                          //IF A PALLET IS INTRODUCED AT ZONE 1
                          // if ((req.body.payload.PalletID != -1)) { //If new pallet is introduced and not leaving (as we receive notifications for both)

                          var palletID = req.body.payload.PalletID;

                          for (var j = 0; j < pallet.length; j++) {
                              if (pallet[j].palletID == palletID) {
                                  index1 = j;
                                  console.log('Found at position', index1);
                                  break;
                              }

                          }

                          switch (req.body.senderID) {

                              case "SimCNV1":

                                  if(ref1.buffer == 'free'){

                                      setTimeout(function () {
                                          ref1.transzone(1, 2);
                                      }, 1000);
                                  }

                                  break;

                              case "SimCNV2":

                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          //CHECKING IF THERE ARE OTHER WORKSTATIONS WITH THE CAPABILITY THAT IS FREE
                                          if((ws5.status == 'free')||(ws9.status == 'free')||(ws12.status == 'free')){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                          //IF NO OTHER WORKSTATIONS WITH THE CAPABILITY ARE FREE
                                          else {
                                              // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                              if(ref1.buffer == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 2);
                                                  }, 1000);

                                              }
                                              //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                              else{
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);


                                  }
                                  break;
                              case "SimCNV3":

                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          //CHECKING IF THERE ARE OTHER WORKSTATIONS WITH THE CAPABILITY THAT IS FREE
                                          if((ws6.status == 'free')||(ws10.status == 'free')){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                          //IF NO OTHER WORKSTATIONS WITH THE CAPABILITY ARE FREE
                                          else {
                                              // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                              if(ref1.buffer == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 2);
                                                  }, 1000);

                                              }
                                              //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                              else{
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);


                                  }
                                  break;
                              case "SimCNV4":
                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          //CHECKING IF THERE ARE OTHER WORKSTATIONS WITH THE CAPABILITY THAT IS FREE
                                          if((ws8.status == 'free')||(ws11.status == 'free')){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                          //IF NO OTHER WORKSTATIONS WITH THE CAPABILITY ARE FREE
                                          else {
                                              // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                              if(ref1.buffer == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 2);
                                                  }, 1000);

                                              }
                                              //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                              else{
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);
                                  }

                                  break;
                              case "SimCNV5":
                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          //CHECKING IF THERE ARE OTHER WORKSTATIONS WITH THE CAPABILITY THAT IS FREE
                                          if((ws9.status == 'free')||(ws12.status == 'free')){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                          //IF NO OTHER WORKSTATIONS WITH THE CAPABILITY ARE FREE
                                          else {
                                              // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                              if(ref1.buffer == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 2);
                                                  }, 1000);

                                              }
                                              //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                              else{
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);
                                  }

                                  break;

                              case "SimCNV6":
                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          //CHECKING IF THERE ARE OTHER WORKSTATIONS WITH THE CAPABILITY THAT IS FREE
                                          if((ws10.status == 'free')){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                          //IF NO OTHER WORKSTATIONS WITH THE CAPABILITY ARE FREE
                                          else {
                                              // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                              if(ref1.buffer == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 2);
                                                  }, 1000);

                                              }
                                              //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                              else{
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);
                                  }

                                  break;

                              case "SimCNV7":
                                  setTimeout(function () {
                                      ref1.transzone(1, 2);
                                  }, 1000);

                                  break;

                              case "SimCNV8":

                                        //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                      if(ref1.capability == pallet[index1].currentneed_) {
                                            //CHECKING IF THE WORKSTATION IS  FREE
                                          if(ref1.status == 'free'){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 2);
                                              }, 1000);

                                          }
                                          //IF WORKSTATION IS NOT FREE
                                          else{
                                              //CHECKING IF THERE ARE OTHER WORKSTATIONS WITH THE CAPABILITY THAT IS FREE
                                              if(ws11.status == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                              //IF NO OTHER WORKSTATIONS WITH THE CAPABILITY ARE FREE
                                              else {
                                                  // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                                  if(ref1.buffer == 'free'){
                                                      setTimeout(function () {
                                                          ref1.transzone(1, 2);
                                                      }, 1000);

                                                  }
                                                  //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                                  else{
                                                      setTimeout(function () {
                                                          ref1.transzone(1, 4);
                                                      }, 1000);
                                                  }
                                              }
                                          }
                                      }
                                        //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                      else{

                                          setTimeout(function () {
                                              ref1.transzone(1, 4);
                                          }, 1000);


                                      }

                                  //IF ZONE 1 OF WORKSTATION 8 OCCURS AND THERE IS NO PALLET PRESENT IN ZONE 2 OF WORKSTATION 7


                                      if(ws7.buffer == 'free') {
                                          connection.query("SELECT * FROM Pallets where Status = 'in_queue'", function (results, rows) {

                                              if (rows.length == 0) {
                                                  console.log('No Pallets Ordered to Produce');
                                              }
                                              else {
                                                  setTimeout(function () {
                                                      var options = {
                                                          method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                                                          body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                                                          json: true,
                                                          url: "	http://localhost:3000/RTU/SimROB7/services/LoadPallet",
                                                          headers: {
                                                              'Content-Type': 'application/json'
                                                          }
                                                      };
                                                      //Print the result of the HTTP POST request
                                                      request(options, function (err) {
                                                          if (err) {
                                                              console.log('Error Loading Pallet');
                                                          }
                                                      });
                                                      connection.query("UPDATE Pallets SET Status = 'processed' WHERE ProductID = ?", rows[0].ProductID, function () {
                                                          console.log("Rows 'processed' Successfully");
                                                      });
                                                  }, 2000);

                                              }

                                          });
                                      }

                                  break;

                              case "SimCNV9":
                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          //CHECKING IF THERE ARE OTHER WORKSTATIONS WITH THE CAPABILITY THAT IS FREE
                                          if((ws12.status == 'free')){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                          //IF NO OTHER WORKSTATIONS WITH THE CAPABILITY ARE FREE
                                          else {
                                              // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                              if(ref1.buffer == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 2);
                                                  }, 1000);

                                              }
                                              //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                              else{
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);


                                  }

                                  break;
                              case "SimCNV10":
                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                              if(ref1.buffer == 'free'){
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 2);
                                                  }, 1000);

                                              }
                                              //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                              else{
                                                  setTimeout(function () {
                                                      ref1.transzone(1, 4);
                                                  }, 1000);
                                              }
                                          }
                                      }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);

                                  }

                                  break;
                              case "SimCNV11":
                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                          if(ref1.buffer == 'free'){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 2);
                                              }, 1000);

                                          }
                                          //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                          else{
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);

                                  }

                                  break;

                              case "SimCNV12":
                                  //CHECKING IF THE CURRENT WORKSTATION IS CAPABLE OF SERVING
                                  if(ref1.capability == pallet[index1].currentneed_) {
                                      //CHECKING IF THE WORKSTATION IS  FREE
                                      if(ref1.status == 'free'){
                                          setTimeout(function () {
                                              ref1.transzone(1, 2);
                                          }, 1000);

                                      }
                                      //IF WORKSTATION IS NOT FREE
                                      else{
                                          // CHECKING IF THE BUFFER OS THE CURRENT WORKSTATION IS FREE
                                          if(ref1.buffer == 'free'){
                                              setTimeout(function () {
                                                  ref1.transzone(1, 2);
                                              }, 1000);

                                          }
                                          //IF THE BUFFER OF THE CURRENT WORKSTATION IS NOT FREE
                                          else{
                                              setTimeout(function () {
                                                  ref1.transzone(1, 4);
                                              }, 1000);
                                          }
                                      }
                                  }
                                  //IF CURRENT WORKSTATION IS NOT CAPABLE OF SERVING
                                  else{

                                      setTimeout(function () {
                                          ref1.transzone(1, 4);
                                      }, 1000);

                                  }

                                  break;
                          }
                      }
                        if ((req.body.payload.PalletID == -1)) {
                          ref1.zone1 = false;

                        }

                        res.end();
                        break;

                    case "Z2_Changed":

                        if ((req.body.payload.PalletID != -1)) {
                            ref1.buffer = 'occupied';
                            console.log('\n\n~~~~~~~~~~Z2 CHANGED OF WORKSTATION'+ ref1.wsnumber + '~~~~~~~~~~');
                            console.log('Pallet Size', pallet.length);
                            console.log(pallet);

                            switch (req.body.senderID) {


                                case "SimCNV1":
                                case"SimCNV7":
                                    if(ref1.status == 'free') {
                                        setTimeout(function () {
                                            ref1.transzone(2, 3);
                                        }, 1000);
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
                                        setTimeout(function () {
                                            ref1.transzone(2, 3);
                                        }, 1000);
                                    }

                                    break;
                            }


                        }
                        if ((req.body.payload.PalletID == -1)) {
                            ref1.buffer = 'free';
                            switch (req.body.senderID) {
                                case "SimCNV1":
                                case "SimCNV7":
                                    request.get("http://localhost:3000/RTU/SimCNV"+ref1.wsnumber+"/data/P1", function (req, res) {
                                        var obj = JSON.parse(res.body);
                                        var present = obj.v;
                                    if(present){
                                        setTimeout(function () {ref1.transzone(1,2);
                                        }, 1000);
                                    }

                                    });
                                    break;
                            }

                        }
                        res.end();
                        break;


                    case "Z3_Changed":

                            //IF A PALLET ARRIVES AT ZONE 3 AND THAT HAPPENS NOT AT WORKSTATION 7 (TO PREVENT SIMILAR CONDITIONS WHILE LOADING PALLET)
                            if (req.body.payload.PalletID != -1) {
                                console.log('\n\n~~~~~~~~~~Z3 CHANGED OF WORKSTATION'+ ref1.wsnumber + '~~~~~~~~~~');
                                console.log(pallet);
                                console.log('Pallet Size', pallet.length);
                                var index3;
                                ref1.status = 'busy';

                                var palletID3 = req.body.payload.PalletID;
                                for (var i = 0; i < pallet.length; i++) {
                                    if (pallet[i].palletID == palletID3) {
                                        console.log("MATCH FOUND!!!!~~~~~~~~~!!!!! for");
                                        console.log('Match for : ', req.body.payload.PalletID);
                                        console.log('Found as', pallet[i].palletID);
                                        index3 = i;
                                        console.log(index3);
                                        break;

                                    }
                                }

                                switch (req.body.senderID) {

                                    case"SimCNV7":
                                           if (pallet[index3].currentneed_ == 'complete'){

                                               var options = {
                                                   method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                                                   body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                                                   json: true,
                                                   url: "http://localhost:3000/RTU/SimROB7/services/UnloadPallet",
                                                   headers: {
                                                       'Content-Type': 'application/json'
                                                   }
                                               };
                                               //Print the result of the HTTP POST request
                                               request(options, function (err) {
                                                   if (err) {
                                                       console.log('Error Unloading Pallet');
                                                   }

                                               });

                                           }

                                           else {
                                               setTimeout(function () {
                                                   ref1.transzone(3, 5);
                                               }, 1000);

                                           }
                                        break;

                                    case "SimCNV1":
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
                                        setTimeout(function() {
                                            ref1.work(index3);
                                        },1000);

                                        break;
                                }
                            }

                            else if (req.body.payload.PalletID == -1) {
                                ref1.status = 'free';

                                if (ref1.buffer == 'occupied') {
                                    setTimeout(function() {
                                    ref1.transzone(2, 3)
                                    },1500);
                                }
                        }
                        // res.writeHead(202);
                        res.end();

                        break;

                    case "Z4_Changed":



                        if ((req.body.payload.PalletID != -1)) {

                                   if((ref1.flag == false)&&(ref1.zone5 == false)){
                                       ref1.transzone(4, 5);
                                   }
                        }

                        else if ((req.body.payload.PalletID == -1)){

                            if(ref1.zone1 == true){

                                setTimeout(function () {
                                    ref1.transzone(1, 4);
                                }, 1500);

                            }

                        }


                        res.end();
                        break;

                    case "Z5_Changed":
                        if (req.body.payload.PalletID == -1) {
                            ref1.zone5 = false;

                        switch (req.body.senderID) {

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

                                console.log(req.body);


                                    ref1.flag = false;


                                    setTimeout(function () {
                                        ref1.transzone(4, 5);
                                    }, 1500);

                                }
                        }
                        else if (req.body.payload.PalletID != -1) {
                            ref1.zone5 = true;

                        }
                        res.end();

                        break;

                    case "DrawEndExecution":

                                console.log('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                                console.log(pallet);
                                // console.log('Completed Recipe ID:  ');
                               // console.log(req.body.payload.Recipe)
                                console.log('\n\n');



                        console.log('Completed Drawing Recipe' + req.body.payload.Recipe + 'of colour' + req.body.payload.Color);
                        var index6;

                        var palletID1 = req.body.payload.PalletID;

                        for (var i = 0; i < pallet.length; i++) {
                            if (pallet[i].palletID == palletID1) {
                                index6 = i;
                                break;
                            }
                        }

                            if ((req.body.payload.Recipe > 0) && (req.body.payload.Recipe < 4)) {

                                pallet[index6].frame = true;
                                pallet[index6].currentneed_ = pallet[index6].screenColour;
                                console.log('Setting Frame true and Screen as current need');
                                // setTimeout(function() {
                                    ref1.work(index6);
                                // },1000);
                            }

                            if ((req.body.payload.Recipe > 3) && (req.body.payload.Recipe < 7)) {
                                pallet[index6].screen = true;
                                pallet[index6].currentneed_ = pallet[index6].keyboardColour;
                                console.log('Setting Screen true and Keyboard as current need');
                                // setTimeout(function() {
                                    ref1.work(index6);
                                // },1000);
                            }

                            if ((req.body.payload.Recipe > 6) && (req.body.payload.Recipe < 10)) {
                                pallet[index6].keyboard = true;
                                pallet[index6].currentneed_ = 'complete';
                                console.log('Setting as complete');
                                // setTimeout(function() {
                                ref1.flag=true;
                                //HANDLE FLAG
                                setTimeout(function () {
                                    ref1.transzone(3, 5);
                                }, 100);

                            }
                        // res.writeHead(202);
                        res.end();

                        break;
                    // case "PaperLoaded":
                    //     request.get("http://localhost:3000/RTU/SimCNV2/data/P1", function (req, res, body) {
                    //         var obj = JSON.parse(res.body);
                    //         var present = obj.v;
                    //         if (!present) {
                    //             setTimeout(function() {
                    //                 ref1.transzone(3, 5);
                    //             },1000);
                    //         }
                    //
                    //         else {
                    //
                    //             //write code to invoke the above after 10 seconds
                    //         }
                    //     });
                    //
                    //     res.end();
                    //     break;
                    case "PalletLoaded":


                        var  palletID5 = req.body.payload.PalletID;
                        console.log('Pallet Loaded and Pallet ID is ',palletID5);
                        connection.query("SELECT * FROM Pallets where Status = 'processed'", function(results,rows) {

                            pallet.push(new pallAgent(rows[0].OrderID, rows[0].ProductID, rows[0].Frametype, rows[0].Framecolour, rows[0].Screentype, rows[0].Screencolour, rows[0].Keyboardtype, rows[0].Keyboardcolour, palletID5));
                            setTimeout(function() {
                                connection.query("UPDATE pallets SET PalletID = ? WHERE Status = 'processed'", palletID5, function (err) {
                                    if(!err){ console.log(' GOING TO LOAD~~~~~~~~~~~~');} else { console.log(err);}
                                    connection.query("UPDATE pallets SET Status= 'loaded' WHERE PalletID = ?",palletID5);
                                });
                            },1000);
                            console.log('Pallet of size' + pallet.length + ' Contents:');
                            for(var i=0; i<pallet.length;i++) {
                                console.log(pallet[i]);
                            }
                        });

                        setTimeout(function(){
                            console.log(req.body);
                            var options = {
                                method: 'POST',
                                body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                                json: true,
                                url: "http://localhost:3000/RTU/SimCNV7/services/TransZone35",
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            };

                            //Print the result of the HTTP POST request
                            request(options, function (err) {
                                if (err) {
                                    console.log('Error Accomplishing Initial Transfer');
                                }
                                else {
                                    console.log('Initial Transfer Completed');
                                }
                            });
                        }, 1000);
                        // res.writeHead(202);
                        res.end();
                        break;


                    case "PalletUnloaded":
                        console.log('PALLET UNLOADED!!!!!!!!!!!!!!!!!!!!');
                        request.get("http://localhost:3000/RTU/SimCNV"+ref1.wsnumber+"/data/P2", function (req, res) {
                            var obj = JSON.parse(res.body);
                            var present = obj.v;
                            connection.query("SELECT * FROM Pallets where Status = 'in_queue'", function(results,rows) {

                                if((!present)&&(rows.length>0)){
                                    console.log("Remaining Pallets in Queue: " + rows.length);


                                            setTimeout(function(){
                                                var options = {
                                                    method: 'POST', //  http://127.0.0.1:3000/RTU/SimROB"+wsnumber+"/services/ChangePenBLUE
                                                    body: {"destUrl": "http://127.0.0.1"}, // Javascript object
                                                    json: true,
                                                    url: "	http://localhost:3000/RTU/SimROB7/services/LoadPallet",
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    }
                                                };
                                                //Print the result of the HTTP POST request
                                                request(options, function (err) {
                                                    if (err) {
                                                        console.log('Error Loading Pallet');
                                                    }

                                                });
                                            }, 1000);
                                            connection.query("UPDATE Pallets SET Status = 'processed' WHERE ProductID = ?", rows[0].ProductID, function(){
                                                console.log("Rows 'processed' Successfully");
                                            });



                                }

                            });


                        });
                        res.end();
                        break;
                }

             //   break;
      //  }

        //IF NEW PALLET IS INTRODUCED IN ALL WORKSTATIONS

    });

    app.post('/notifs/paperloaded', function(req,res){
        console.log(req.body);
        request.get("http://localhost:3000/RTU/SimCNV2/data/P1", function (req, res) {
            var obj = JSON.parse(res.body);
            var present = obj.v;
            console.log('PRESENT VALUE IS~~~~~~~~~', present);
            if (!present) {

                    ref1.transzone(3, 5);

            }

            if (present){
                setTimeout(function() {
                    ref1.transzone(3, 5);
                },wait);
            }
        });

        res.end();


    });
    app.listen(port, hostname, function(){
        console.log(` Server running at http://${hostname}:${port}/`);
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


//METHOD LOAD PEN OF CLASS ROBOT
workstation.prototype.loadpen = function () {
    ref=this;
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
    console.log('Robot ' + ref.wsnumber +' Pen Colour '  + ref.capability + ' loaded');
};

//CREATING THE AGENTS
var ws1 = new workstation(1,'paper');
var ws2 = new workstation(2,'red');
var ws3 = new workstation(3,'blue');
var ws4 = new workstation(4,'green');
var ws5 = new workstation(5,'red');
var ws6 = new workstation(6, 'blue');
var ws7 = new workstation(7,'loadpallet');
var ws8 = new workstation(8,'green');
var ws9 = new workstation(9, 'red');
var ws10 = new workstation(10, 'blue');
var ws11 = new workstation(11,  'green');
var ws12 = new workstation(12,  'red');



//HANDLES SUBMIT AFTER MAKING ORDER
app.get('/submit', function(res){
var rows_;
countdown.reset();
    countdown.start();
    var counter = 0;

    connection.query("SELECT * FROM Products INNER JOIN Orders ON Products.ProductID = Orders.ProductID WHERE Products.status = 'ordered'", function(results,rows){
          //  console.log(rows);
           // console.log('Size: ' + rows.length);
            var length = rows.length;
          //  console.log(rows[0].Quantity);
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

        setTimeout(function(){
            request.post('http://localhost:5001/load');

        },2000);




        for (rows_ = 0; rows_ < rows.length; rows_++) {
            connection.query("UPDATE Products SET Status = 'processed' WHERE ProductID = ?", rows[0].ProductID, function(){
                console.log('Rows updated Successfully');
            });
        }

            //                pallet[qty] = new pallAgent(rows[0].OrderID,rows[0].OrderID,rows[0].FrameType,rows[0].FrameColour,rows[0].ScreenType,rows[0].ScreenColour,rows[0].KeyboardType,rows[0].KeyboardColour);
            //TO HANDLE THE NEXT ENTRY

        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     //TO PRINT THE CURRENT MADE OBJECTS IN ARRAY
        // for (var i=0; i<pallet.length; i++){
        //         console.log("----------------------------------------");
        //     console.log('value is', pallet[i]);
        // }
        // console.log('No. of Pallets created is: ' + pallet.length);
        // // request.post('http://127.0.0.1:6011/releasepallet', function(){
        // //     console.log('requesting to release pallet . .')
        // // })
    });
res.end()

});






//METHOD OF CLASS CONVEYOR TO TRANSFER ZONES
workstation.prototype.transzone = function (zone1,zone2) {
    var ref = this; // "http://localhost:3000/RTU/SimCNV"+ref.currentws+"/services/TransZone"+zone1+zone2
    var options = {
        method: 'POST',
        body: {"destUrl": "http://127.0.0.1"}, // Javascript object
        json: true,
        url: "http://localhost:3000/RTU/SimCNV" + ref.wsnumber+ "/services/TransZone" +zone1 + zone2,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    //Print the result of the HTTP POST request
    request(options, function (err) {
        if (err) {
            console.log('Error requesting to transfer zone in ' + ref.wsnumber, err);
        }
        else {

            console.log('Requested to Transfer from ' + zone1 + 'to' + zone2 + 'in workstation ' + ref.wsnumber);
            // res.end();
        }
    });

    // if (zone2 = 5) {
    //     ref.zone = 1
    //     ref.currentws  = currentws +1;
    // }
    // else{
    //     ref.currentzone = zone2;
    // }
};



//SUBSCRIBES TO ALL EVENTS FROM THE SIMULATOR
function subscriptions() {

    request.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/7"}}, function (err) {if (err) {} else{ console.log('subscribed to pallet load');}});
    request.post('http://localhost:3000/RTU/SimROB1/events/PaperLoaded/notifs', {form: {destUrl: "http://localhost:6001/notifs/paperloaded"}}, function (err) {if (err) {}});
    request.post('	http://localhost:3000/RTU/SimROB7/events/PalletUnloaded/notifs', {form: {destUrl: "http://localhost:6007/notifs/7"}}, function (err) {if (err) {}});
}


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

//EXPRESS LISTENING CODE TO RUN 'THIS' SERVER
app.listen(5001, function(){
    console.log('Server Running on Port 5001');
    subscriptions();
});