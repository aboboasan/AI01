const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const app = express();
const API_BASE_URL = 'https://api.deepseek.com/v1';
const API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-4c27205edf134b53b269485c766f08d5';

// 启用CORS
app.use(cors());
app.use(express.json());

// 请求速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
  timeout: 60000
});

app.post('/api/chat', async (req, res) => {
  try {
    const { endpoint, data } = req.body;
    const response = await api.post(endpoint, data);
    res.json(response.data);
  } catch (error) {
    console.error('API代理错误:', error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || '服务器错误'
    });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`代理服务器运行在端口 ${PORT}`);
}); 