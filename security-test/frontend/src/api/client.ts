import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // 쿠키 자동 전송 (요구사항 1)
  headers: {
    'Content-Type': 'application/json'
  }
});
