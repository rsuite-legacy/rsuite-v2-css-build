# rsuite-css-build
Genarate css file use some paramer.

## Installation
```
npm install rsuite-css-build
```

## Option
### url
`rsuite`的地址,默认为`http://t.hypers.com.cn/libs/rsuite/css/0.1.0/`
### oldColor
`rsuite`的原始基色，默认为`#00bcd4`
### color
输出主题的基色，默认为`#00bcd4`
### *output
输出目录,必填

### Usage examples

```javascript
var build = require('./main');
build({
    color: '#1b9451',
    output: 'rsuite/css'
});
```
