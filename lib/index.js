'use strict'

const React = require('react');
const ReactDOM = require('react-dom');
const qr = require('qr.js');

function getBackingStorePixelRatio(ctx) {
    return (
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1
    );
}

let getDOMNode;
if (/^0\.14/.test(React.version)) {
    getDOMNode = function(ref) {
        return ref;
    }
} else {
    getDOMNode = function(ref) {
        return ReactDOM.findDOMNode(ref);
    }
}

let QRCode = React.createClass({
    propTypes: {
        value: React.PropTypes.string.isRequired,
        size: React.PropTypes.number,
        bgColor: React.PropTypes.string,
        fgColor: React.PropTypes.string,
        logo: React.PropTypes.string,
        logoWidth: React.PropTypes.number,
        logoHeight: React.PropTypes.number,
        text: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            size: 128,
            bgColor: '#FFFFFF',
            fgColor: '#000000',
            value: 'https://github.com/git9378',
            text: 'git9378'
        };
    },

    shouldComponentUpdate: function(nextProps) {
        let that = this;
        return Object.keys(QRCode.propTypes).some(function(k) {
            return that.props[k] !== nextProps[k];
        });
    },

    componentDidMount: function() {
        this.update();
    },

    componentDidUpdate: function() {
        this.update();
    },

    utf16to8: function(str) {
        let out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },

    update: function() {
        let value = this.utf16to8(this.props.value);
        let qrcode = qr(value);
        let canvas = getDOMNode(this.refs.canvas);

        let ctx = canvas.getContext('2d');
        let cells = qrcode.modules;
        let tileW = this.props.size / cells.length;
        let tileH = this.props.size / cells.length;
        let scale = window.devicePixelRatio / getBackingStorePixelRatio(ctx);
        canvas.height = canvas.width = this.props.size * scale;
        ctx.scale(scale, scale);

        cells.forEach(function(row, rdx) {
            row.forEach(function(cell, cdx) {
                ctx.fillStyle = cell ? this.props.fgColor : this.props.bgColor;
                let w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
                let h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
                ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
            }, this);
        }, this);

        if (this.props.logo) {
            this.drawImg(ctx, this.props.logo)
        }

        if (this.props.text) {
            let canvas = document.createElement('canvas');
            canvas.width = this.props.textWidth ? this.props.textWidth : 116;
            canvas.height = this.props.textHeight ? this.props.textHeight : 50;
            let palette = canvas.getContext("2d");
            /**
             * [ 绘制圆角矩形 ]
             * @param  {[type]} x [起始X轴]
             * @param  {[type]} y [起始Y轴]
             * @param  {[type]} w [矩形的宽度]
             * @param  {[type]} h [矩形的高度]
             * @param  {[type]} r [矩形圆角的半径]
             * 减去lineWidth
             */
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.fillStyle = 'white';
                this.fill();
                this.closePath();
                return this;
            }
            palette.lineWidth = 2;
            palette.strokeStyle = "#000";
            palette.roundRect(2, 2, canvas.width - 2 * 2, canvas.height - 2 * 2, 30).stroke();

            /**
             * 居中显示文字
             * fillText(文字，绘制文字的X轴起始位置，绘制文字的Y轴起始位置*画布高度的一半加上字体大小高度的一半*)
             */

            palette.font = "20px Conrier New";
            palette.fillStyle = "black";
            palette.textAlign = 'center';
            palette.fillText(this.props.text, canvas.width / 2, canvas.height / 2 + 10);
            this.drawImg(ctx, canvas.toDataURL("image/png", 1.0))
        }
    },
    /**
     * [绘制logo]
     * @param  {[type]} qrObj   [ctx 生成的二维码canvas对象（2D）]
     * @param  {[type]} logoObj [logo地址或文字转成的base64]
     * @return {[type]}         [description]
     */
    drawImg: function(qrObj, logoObj) {
        console.log(qrObj)
        let self = this;
        let size = this.props.size;
        let image = document.createElement('img');
        image.src = logoObj;
        image.onload = function() {
            let dwidth = self.props.logoWidth || size * 0.2;
            let dheight = self.props.logoHeight || image.height / image.width * dwidth;
            let dx = (size - dwidth) / 2;
            let dy = (size - dheight) / 2;
            image.width = dwidth;
            image.height = dheight;
            qrObj.drawImage(image, dx, dy, dwidth, dheight);
        }
    },

    render: function() {
        return React.createElement('canvas', {
            style: {
                height: this.props.size,
                width: this.props.size
            },
            height: this.props.size,
            width: this.props.size,
            ref: 'canvas'
        });
    }
});

module.exports = QRCode;
/**
 * <QRCode className='qrcode' 
        value=''              -------------网址
        size={300}            -------------二维码大小
        fgColor='black'       -------------前景色
        bgColor='white'       -------------背景色
        logo=''               -------------logo地址
        logoWidth={116}       -------------logo宽度
        logoHeight={50}       -------------logo高度
        text=''               -------------文字
    />
 */