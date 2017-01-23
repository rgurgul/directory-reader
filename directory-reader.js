require('colors');
var fs = require("fs");
var express = require("express");
var app = express();
var settings = {
    dir: '',
    port: 3333,
    excluded: 'excluded',
    fileType: 'html'
};

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
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

function readDir(directory, result) {
    var items = fs.readdirSync(directory);
    items.forEach(function (val) {
        var link = directory + '/' + val;
        var isFile = fs.statSync(link).isFile();
        var isDir = fs.statSync(link).isDirectory();
        switch (true) {
            case isDir:
                !new RegExp(settings.excluded).test(val) && readDir(link, result);
                break;
            case isFile:
                new RegExp("." + settings.fileType).test(val) && result.push(link);
                break;
        }
    });
    return result;
}

app.get('/', function (req, res) {
    res.send(readDir(settings.dir, []));
});

app.listen(settings.port, function () {
    console.log("Serving at localhost:%s".green, settings.port);
});