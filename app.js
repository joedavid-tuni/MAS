/**
 * Created by Joe David on 07-04-2017.
 */
var express = require('express');
var app = express();
var request = require('request');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/form.html'));
});


app.listen(3000);