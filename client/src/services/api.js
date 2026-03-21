import axios from "axios";
import supabase from "../supabase";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();

  console.log("INTERCEPTOR");
  console.log("TOKEN:", session?.access_token);

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default api;