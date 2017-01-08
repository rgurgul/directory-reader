#!/usr/bin/env node

require('colors');
var fs = require("fs");
var express = require("express");
var app = express();
var list = [];
var settings = {
    dir: '',
    port: 3333,
    excluded: 'excluded',
    fileType: 'html'
};

process.argv.forEach(function (value, index) {
    switch (value) {
        case '-d':
            settings.dir = process.argv[index + 1];
            break;
        case '-p':
            settings.port = process.argv[index + 1];
            break;
        case '-e':
            settings.excluded = process.argv[index + 1];
            break;
        case '-f':
            settings.fileType = process.argv[index + 1];
            break;
    }
});

function readDir(directory) {
    var items = fs.readdirSync(directory);
    items.forEach(function (val) {
        var isFile = fs.lstatSync(directory + '/' + val).isFile();
        var isDir = fs.lstatSync(directory + '/' + val).isDirectory();
        switch (true) {
            case isDir:
                !new RegExp(settings.excluded).test(val) && readDir(directory + '/' + val);
                break;
            case isFile:
                new RegExp("." + settings.fileType).test(val) && list.push(directory + '/' + val);
                break;
        }
    });
    return list;
}

app.get('/', function (req, res) {
    list = [];
    res.send(readDir(settings.dir));
});

app.listen(settings.port, function () {
    console.log("Serving at localhost: %s".green, settings.port);
});
