const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Configure proxy middleware
const apiProxy = createProxyMiddleware('/api', {
  target: 'https://mockgpt.wiremockapi.cloud',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/v1', // Adjust this based on your OpenAI API path
  },
});
// const apiProxy = createProxyMiddleware('/api', {
//   target: 'https://api.openai.com',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api': '/v1/completions/chat/completions', // Adjust this based on your OpenAI API path
//   },
// });

// Use the proxy middleware for requests starting with /api
app.use('/api', apiProxy);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
