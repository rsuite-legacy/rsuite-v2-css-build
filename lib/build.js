/**
 * Created by Godfery on 2016/8/8 0008.
 */
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var fileTool = require('./tool/file');
var color = require('./tool/color');

//根目录
var rootPath = path.resolve(__dirname, '..');
//缓存文件目录
var cacheDirName = '.cache';
//缓存路径
var cachePath = [rootPath, cacheDirName].join(path.sep);

/**
 * 构建
 * @param option
 * @param {String} [option.url] - 下载路径
 */
function build(option) {
    var _option = {
        url: 'http://t.hypers.com.cn/libs/rsuite/css/0.1.0/rsuite.min.css',
        oldColor: '#00bcd4'
    };
    extend(_option, option);

    getOriginalData(_option.url, (data)=> {
        var oldColors = color.calcColors(_option.oldColor);
        var colors = color.calcColors(_option.color);
        oldColors.forEach((color, index)=> {
            data = data.split(color).join(colors[index]);
        });
        mkCacheDir();
        writeData2Cache(data);
    });
}

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
 * 获取原始数据
 * @param url
 * @param call
 */
function getOriginalData(url, call) {
    fileTool.getFile(url, call);
}

/**
 * 将数据写入临时目录
 */
function writeData2Cache(data) {
    fs.writeFile([cachePath, 'rsuite.min.css'].join(path.sep), data, (err)=> {
        if (err) {
            console.log("写入文件失败:" + err);
            return;
        }

        console.log("写入文件成功");
    });
}


module.exports = build;
