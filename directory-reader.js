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

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

process.argv.forEach(function (key, index) {
    var value = process.argv[index + 1];
    switch (key) {
        case '-d':
            settings.dir = value;
            break;
        case '-p':
            settings.port = value;
            break;
        case '-e':
            settings.excluded = value;
            break;
        case '-f':
            settings.fileType = value;
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
    console.log("Serving at localhost:%s".green, settings.port);
});
