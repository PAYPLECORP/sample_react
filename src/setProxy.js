const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/react/api', {
            target: process.env.REACT_APP_REMOTE_HOSTNAME + '/react/api',
            changeOrigin: true,
        })
    );
};