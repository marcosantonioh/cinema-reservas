<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import supabase from "./supabase";
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import AssentosList from './components/AssentosList.vue';

// --- ESTADOS (Variáveis) ---
const autenticado = ref(false);
const modoLogin = ref(true);
const seats = ref([]);

// --- FUNÇÕES ---

// 1. Buscar Assentos no seu Servidor Node
const loadSeats = async () => {
  try {
    const res = await axios.get("http://localhost:3000/assentos");
    seats.value = res.data;
  } catch (err) {
    console.error("Erro ao carregar assentos:", err);
  }
};

// 2. Reservar (Enviando a "Pulseira"/Token)
const reserve = async (id) => {
  try {
    // Pegamos o token atual do Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    // Enviamos para a sua rota do Node (ajustada para o padrão /assentos/id/reservar)
    await axios.post(`http://localhost:3000/assentos/${id}/reservar`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert("Assento reservado!");
    await loadSeats(); // Atualiza a lista na tela
  } catch (err) {
    alert(err.response?.data?.error || "Erro ao reservar");
  }
};

// 3. Logout
const logout = async () => {
  await supabase.auth.signOut(); // Encerra a sessão no Supabase
  autenticado.value = false;     // Muda a tela para o Login
  localStorage.removeItem('token');
};

// 4. Verificar se já estava logado ao abrir a página
onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    autenticado.value = true;
    loadSeats();
  }
});
</script>

<template>
  <div id="app">
    <LoginForm 
      v-if="!autenticado && modoLogin"
      @login-sucesso="autenticado = true; loadSeats()"
      @trocar-modo="modoLogin = false"
    />
    
    <RegisterForm 
      v-else-if="!autenticado && !modoLogin"
      @trocar-modo="modoLogin = true"
    />
    
    <AssentosList 
      v-else
      :seats="seats"
      @reservar="reserve"
      @logout="logout"
    />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #1a1a1a; /* Cor mais "Cinema" */
  color: white;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>