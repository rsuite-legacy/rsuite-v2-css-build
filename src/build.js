/**
 * Created by Godfery on 2016/8/8 0008.
 */
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var consoleColor = require('colors');
var util = require('util');
var fileTool = require('./tool/file');
var color = require('./tool/color');

var CONFIG = {
    domain: 'http://t.hypers.com.cn/',
    path: 'libs/rsuite/css/0.1.0/'
};


//缓存路径
var outputPath = '';

/**
 * 构建
 * @param option
 * @param {String} [option.url] - 下载路径
 * @param {String} [option.oldColor] - 原始颜色
 * @param {String} option.color - 基色
 * @param {String} option.output - 输出目录
 */
function build(option) {
    var _option = {
        url: CONFIG.domain + CONFIG.path,
        oldColor: '#00bcd4',
        color: '#00bcd4'
    };
    CONFIG.option = extend(_option, option);

    try {
        outputPath = option.output;
        if (!outputPath || outputPath.length === 0) {
            throw  'ERROR: [option.output] is required';
        }
    } catch (e) {
        console.log(e.red);
        return;
    }

    getOriginalData(_option.url + '/rsuite.min.css', (data)=> {
        var oldColors = color.calcColors(_option.oldColor);
        var colors = color.calcColors(_option.color);
        oldColors.forEach((color, index)=> {
            data = data.replace(new RegExp(color, 'g'), colors[index]);
        });
        mkCacheDir(function() {
            writeData2Cache(data);
            getFontFiles();
        });
    });
}

/**
 * 创建缓存文件夹
 */
function mkCacheDir(call) {
    fileTool.mkdirs(outputPath, call);
}


/**
 * 获取原始数据
 * @param url
 * @param call
 */
function getOriginalData(url, call) {
    fileTool.getFileText(url, call);
}

/**
 * 将数据写入临时目录
 */
function writeData2Cache(data) {
    fs.writeFile([outputPath, 'rsuite.min.css'].join(path.sep), data, (err)=> {
        if (err) {
            console.log("生成失败:" + err.red);
            return;
        }

        console.log("生成成功".green);
    });
}

/**
 * 获取font文件
 */
function getFontFiles() {
    var locationPath = [outputPath, '/fonts'].join(path.sep);
    var serverPath = CONFIG.option.url + '/fonts';
    var fileNames = ['fontawesome-webfont.eot', 'fontawesome-webfont.svg', 'fontawesome-webfont.ttf', 'fontawesome-webfont.woff', 'fontawesome-webfont.woff2', 'FontAwesome.otf', 'icomoon.eot', 'icomoon.svg', 'icomoon.ttf', 'icomoon.woff']
    fileTool.mkdirs(locationPath, ()=> {
        fileNames.forEach((fileName)=> {
            fileTool.getWebFile(`${serverPath}/${fileName}`, function(res) {
                // console.log(`开始下载:${fileName}`);
                var writer = fs.createWriteStream(`${locationPath}/${fileName}`);
                res.pipe(writer);
                // writer.on('finish', function() {
                //     console.log(`下载成功:${fileName}`);
                // });
            });
        })
    });


}


module.exports = build;
