# qrcode-react

A React component to generate [QRCode](http://en.wikipedia.org/wiki/QR_code) with logo.
Inspired by [zpao/qrcode.react](https://github.com/zpao/qrcode.react), also support chinese.

## Installation

```sh
npm install qrcode-react
```

## Usage

```js
var React = require('react');
var ReactDOM = require('react-dom');
var QRCode = require('qrcode-react');

ReactDOM.render(
  <QRCode value="http://facebook.github.io/react/" />,
  mountNode
);
```

## Available Props

prop         | type                 | default value
-------------|----------------------|-----------------------------------
`value`      | `string`             | `https://github.com/git9378`
`size`       | `number`             | `128`
`bgColor`    | `string` (CSS color) | `"#FFFFFF"`
`fgColor`    | `string` (CSS color) | `"#000000"`
`logo`       | `string` (URL / PATH)|
`logoWidth`  | `number`             | `size * 0.2`
`logoHeight` | `number`             | Proportional scaling to `logoWidth`
`text`       | `string`             | `git9378`

<img src="qrcode.png" height="256" width="256">

在原有组件的基础上添加参数，可以填入文字，实现的方法是将文字用canvas画出来，转成base64文件，然后绘制到到二维码canvas的中间，

如果文字出现乱码，meta标签设置为utf-8
`<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />`

<img src="git9378.png" height="256" width="256">
