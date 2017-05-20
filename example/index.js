let QRCode = require('../lib/index.js');
let React = require('react');
let ReactDOM = require('react-dom');

let App = React.createClass({
    getInitialState: function() {
        return {
            
        }
    },

    render: function() {
        return (
            <div className='application'>
                <QRCode className='qrcode' 
                    size={300}
                    fgColor='black'
                    bgColor='white'
                    logoWidth={116}
                    logoHeight={50}
                    />
            </div>
        );
    }
});


ReactDOM.render(
    <App/>,
    document.getElementById('demo')
);
