import axios from "axios";
import supabase from "../supabase"; // Certifique-se de que o caminho para o seu arquivo supabase está correto

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor: Adiciona o token em todas as requisições automaticamente
api.interceptors.request.use(async (config) => {
  // 1. Busca a sessão atual do Supabase
  const { data: { session } } = await supabase.auth.getSession();
  
  // 2. Se existir um token, adiciona no Header Authorization
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;