/**
 * Created by Godfery on 2016/8/8 0008.
 */
var request = require('superagent');
var fs = require('fs');
var path = require('path');

function getFile(filePath, call) {
    if (isWebPath(filePath)) {
        request
            .get(filePath)
            .end(function(err, res) {
                if (Object.prototype.toString.call(call) === '[object Function]') {

                    call(res.text);
                }
            });
    }
}

function isWebPath(filePath) {
    return /^https?\:\/\//i.test(filePath);
}

var file = {
    getFile: getFile
};

module.exports = file;
