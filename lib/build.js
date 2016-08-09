/**
 * Created by Godfery on 2016/8/8 0008.
 */
var fileTool = require('./tool/file');
var fs = require('fs');
var path = require('path');

//根目录
var rootPath = path.resolve(__dirname, '..');
//缓存文件目录
var cacheDirName = '.cache';
//缓存路径
var cachePath = [rootPath, cacheDirName].join(path.sep);

mkCacheDir();
writeFile2Cache();

/**
 * 创建缓存文件夹
 */
function mkCacheDir() {
    fs.exists(cachePath, (result)=> {
        if (!result) {
            fs.mkdir(cachePath, (err)=> {
                if (err) {
                    return console.error(err);
                }
            });
            return;
        }
    });
}

/**
 * 将源文件写入临时目录
 */
function writeFile2Cache() {
    fileTool.getFile('http://t.hypers.com.cn/libs/rsuite/css/0.1.0/rsuite.min.css', function(data) {
        fs.writeFile([cachePath, 'rsuite.min.css'].join(path.sep), data, function(err) {
            if (err) {
                console.log("写入文件失败:" + err);
                return;
            }

            console.log("写入文件成功");
        });
    });
}
