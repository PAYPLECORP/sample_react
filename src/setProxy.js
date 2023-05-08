const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/api', {
            target: process.env.REACT_APP_HOSTNAME + 'api',
            changeOrigin: true,
        })
    );
};