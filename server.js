const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); // Import the cors middleware

const app = express();

// Enable CORS for all routes
app.use(cors());

// Configure proxy middleware
const apiProxy = createProxyMiddleware('/api/chat/completions', {
  target: 'https://api.openai.com',
  // target: 'https://mockgpt.wiremockapi.cloud',
  changeOrigin: true,
  pathRewrite: {
    '^/api/chat/completions': '/v1/chat/completions', // Adjust this based on your OpenAI API path
  },
  // onProxyReq: (proxyReq) => {
  //   proxyReq.setHeader('Authorization', `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`);
  // }
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
