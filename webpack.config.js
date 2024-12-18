const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        ['register']: './src/pages/register.js',
        ['register2']: './src/pages/register2.js',
        ['register3']: './src/pages/register3.js',
        ['login']: './src/pages/login.js',
        ['admin-dashboard']: './src/pages/admin-dashboard.js',
        ['user-dashboard']: './src/pages/user-dashboard.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        globalObject: 'this',
        umdNamedDefine: true,
        clean: true,
    },
};
