import axios from 'axios';

const API_BASE = 'https://bharosa-credit.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export const analyzeFile = async (file: File, amount: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('loan_amount', amount.toString());
  
  const response = await api.post('/analyze', formData);
  return response.data;
};

export const analyzeSample = async (type: string) => {
  const response = await api.post(`/analyze/sample/${type}`);
  return response.data;
};

export const analyzeStatement = async (data: { 
  requested_amount: number; 
  reference_number?: string; 
  transactions?: any[] 
}) => {
  const response = await api.post('/analyze', data);
  return response.data;
};

export const testDomainBoundary = async (domain: string) => {
  const response = await api.post('/analyze/domain-check', { domain });
  return response.data;
};

// Error handling helper
export const handleApiError = (error: any) => {
  if (error.response) {
    return error.response.data.detail || 'The orchestrator encountered an issue.';
  } else if (error.request) {
    return 'Backend services are offline. Please start local server.';
  }
  return error.message;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/api/register', userData);
  return response.data;
};

export const sendOtp = async (phone: string) => {
  const response = await api.post('/api/sms/send-otp', { phone });
  return response.data;
};

export const verifyOtp = async (phone: string, otp: string, sessionId: string) => {
  const response = await api.post('/api/sms/verify-otp', { phone, otp, session_id: sessionId });
  return response.data;
};

export const analyzeCustom = async (data: {
  goal: string;
  current_cibil: number;
  loan_amount: number;
  monthly_income: number;
  profession: string;
  full_name?: string;
}) => {
  const response = await api.post('/analyze/custom', data);
  return response.data;
};

export default api;
