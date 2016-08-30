/**
 * Created by Godfery on 2016/8/8 0008.
 */
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var consoleColor = require('colors');
var Q = require('q');
var util = require('util');
var fileTool = require('./tool/file');
var color = require('./tool/color');

/**
 *
 * @constructor
 */
function Main() {
    var T = this;

    T.CONFIG = {
        domain: 'http://t.hypers.com.cn/',
        path: 'libs/rsuite/css/0.1.0/',
        fileList: {
            fonts: {
                path: 'fonts/',
                files: ['fontawesome-webfont.eot', 'fontawesome-webfont.svg', 'fontawesome-webfont.ttf', 'fontawesome-webfont.woff', 'fontawesome-webfont.woff2', 'FontAwesome.otf', 'icomoon.eot', 'icomoon.svg', 'icomoon.ttf', 'icomoon.woff']
            },
            css: {
                path: '',
                files: ['rsuite.min.css', 'loading.min.css']
            }
        }
    };

    //缓存路径
    T.outputPath = '';

    /**
     * 初始化参数
     * @param option
     */
    function init(option) {
        var _option = {
            url: T.CONFIG.domain + T.CONFIG.path,
            oldColor: '#00bcd4',
            color: '#00bcd4',
            files: ['css', 'font']
        };
        T.CONFIG.option = extend(_option, option);

        try {
            T.outputPath = option.output;
            if (!T.outputPath || T.outputPath.length === 0) {
                throw  'ERROR: [option.output] is required';
            }
        } catch (e) {
            console.log(e.red);
            return;
        }
    }

    /**
     * 构建
     * @param option
     * @param {String} [option.url] - 下载路径
     * @param {String} [option.oldColor] - 原始颜色
     * @param {String} option.color - 基色
     * @param {String} option.output - 输出目录
     * @param {String} [option.alias] - 输出文件名(无需后缀名)
     */
    function transform(option) {
        init(option);

        T.CONFIG.fileList.css.files.forEach((fileName)=> {
            getOriginalData([T.CONFIG.option.url, fileName].join(path.sep), (data)=> {
                var oldColors = color.calcColors(T.CONFIG.option.oldColor);
                var colors = color.calcColors(T.CONFIG.option.color);
                oldColors.forEach((color, index)=> {
                    data = data.replace(new RegExp(color, 'g'), colors[index]);
                });

                mkCacheDir(()=> {
                    var alias = T.CONFIG.option.alias || 'rsuite.min';
                    var ext = path.extname(fileName);
                    if (alias === 'rsuite.min') {
                        fileName = fileName;
                    } else {

                        fileName = fileName === 'rsuite.min.css' ? `${alias}${ext}` : `${alias}.${fileName}`;
                    }
                    fileName = path.normalize([T.outputPath, fileName].join(path.sep));
                    writeData2Dir(fileName, data);
                });
            });
        });
    }

    /**
     * 获取字体文件
     * @param option
     * @param {String} option.output - 输出目录
     * @param {String []} option.targets - 拉取的目标
     */
    function pull(option) {
        init({
            output: option.output
        });
        if (!util.isArray(option.targets)) {
            console.log('ERROR: [option.targets] is required');
            return;
        }

        mkCacheDir(()=> {
            getOriginalFiles(option.targets);
        });
    }

    /**
     * 创建缓存文件夹
     */
    function mkCacheDir(call) {
        fileTool.mkdirs(T.outputPath, call);
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
     * 将数据写入输出目录
     */
    function writeData2Dir(filePath, data) {
        fs.writeFile(filePath, data, (err)=> {
            if (err) {
                console.log("生成失败:" + err.red);
                return;
            }
            console.log(`${filePath}` + '【成功】'.green);
        });
    }


    /**
     * 获取源文件文件
     * @param {fonts|css} targets
     */
    function getOriginalFiles(targets) {
        var fileNames = T.CONFIG.fileList;

        var defferds = [];

        targets.forEach((type)=> {
            //一组文件的defer
            var defer = Q.defer();
            defferds.push(defer.promise);
            var fileInfo = fileNames[type];
            var fileLocationPath = path.normalize([T.outputPath, fileInfo.path].join(path.sep));
            fileTool.mkdirs(fileLocationPath, ()=> {
                var fileDeffer = [];
                fileInfo.files.forEach(function(fileName, i) {
                    var fileUrl = `${T.CONFIG.option.url}${fileInfo.path}${fileName}`;
                    var fileExt = path.extname(fileName);
                    var fileLocationFullPath = path.normalize(`${fileLocationPath}/${path.basename(fileUrl)}`);
                    //单个文件的defer
                    var fileDefer = Q.defer();
                    fileDeffer.push(fileDefer.promise);
                    if (fileExt === '.css') {
                        fileTool.getFileText(fileUrl, function(text) {
                            fs.writeFile(fileLocationFullPath, text, (err)=> {
                                if (err) {
                                    console.log("生成失败:" + err.red);
                                    return;
                                }
                                fileDefer.resolve();
                            });
                        });
                    }
                    else if (fileExt === '.svg') {
                        fileTool.getFileData(fileUrl, function(data) {
                            fs.writeFile(fileLocationFullPath, data, 'binary', (err)=> {
                                if (err) {
                                    console.log("生成失败:" + err.red);
                                    return;
                                }
                                fileDefer.resolve();
                            });
                        });
                    }
                    else {
                        fileTool.getWebFile(fileUrl, function(res) {
                            res.pipe(fs.createWriteStream(fileLocationFullPath));
                            fileDefer.resolve();
                        });
                    }

                    promisesResolve(fileDeffer, ()=> {
                        defer.resolve();
                    });
                });
            });
        });

        promisesResolve(defferds, ()=> {
            console.log(`[${targets.join(',')}]拉取 ` + '【成功】'.green);
        });
    }

    /**
     * 拉取文件
     * @type {getFont}
     */
    this.pull = pull;

    /**
     * 获取css文件
     * @type {transform}
     */
    this.transform = transform;
}


function promisesResolve(promises, call) {
    promises.reduce((previous, current, index)=> {
        return previous.then(current);
    }).then(()=> {
        if (util.isFunction(call)) {
            call();
        }
    });
}

/**
 *
 * @param option
 * @returns {*}
 */
module.exports.transform = (option)=> {
    new Main().transform(option);
    return module.exports;
};

/**
 *
 * @param output
 * @returns {*}
 */
module.exports.pull = (output)=> {
    new Main().pull(output);
    return module.exports;
};
