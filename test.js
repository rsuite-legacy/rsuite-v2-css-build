/**
 * Created by Godfery on 2016/8/11 0011.
 */
var rsuiteCssBuild = require('./main');
var outPutDir = 'rsuite/css';

//拉取操作
rsuiteCssBuild.pull({
    output: outPutDir,
    targets: ['fonts', 'css']
});
//输出css
rsuiteCssBuild.transform({
    color: '#1b9451',
    output: outPutDir
});
//输出css起别名
rsuiteCssBuild.transform({
    color: '#1b9451',
    output: outPutDir,
    alias: 'green'
});
