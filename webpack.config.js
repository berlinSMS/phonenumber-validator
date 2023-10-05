const path = require('path');

module.exports = {
    entry: {
        files: [
            './node_modules/@berlinsms/overlay/src/bsms-overlay.css',
            './node_modules/@berlinsms/overlay/src/bsms-overlay.js',
            './node_modules/@berlinsms/code-picker/src/bsms-code-picker.css',
            './node_modules/@berlinsms/code-picker/src/bsms-code-picker.js',
            './node_modules/@berlinsms/country-picker/src/bsms-country-picker.css',
            './node_modules/@berlinsms/country-picker/src/bsms-country-picker.js',
            './node_modules/@berlinsms/captcha-wrapper/src/bsms-captcha-wrapper.js',
            './src/bsms-phonenumber-validator.css',
            './src/bsms-phonenumber-validator.js',
        ]
    },
    output: {
        filename: 'bsms-phonenumber-validator.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};