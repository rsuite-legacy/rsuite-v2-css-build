# rsuite-css-build
Genarate css file use some paramer.

## Installation
```
npm install rsuite-css-build
```

## `transform(option)`
### `*option.output`
输出目录,必填
### `option.url`
`rsuite`的地址,默认为`http://t.hypers.com.cn/libs/rsuite/css/0.1.0/`
### `option.oldColor`
`rsuite`的原始基色，默认为`#00bcd4`
### `option.color`
输出主题的基色，默认为`#00bcd4`

## `pull(option)`
### `*option.output`
输出目录,必填
### `option.targets`
需要拉取的文件，可选值为`fonts`,`css`

### Usage examples

```javascript
var rsuiteCssBuild = require('./main');
var outPutDir = 'rsuite/css';

//拉取操作
rsuiteCssBuild.pull({
    output: outPutDir+'/pull',
    targets: ['fonts', 'css']
});
//输出css起别名
rsuiteCssBuild.transform({
    color: '#1b9451',
    output: outPutDir,
    alias: 'test2'
});
```
