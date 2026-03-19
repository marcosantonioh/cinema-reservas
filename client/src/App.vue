<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import supabase from "./supabase";

// estado
const user = ref(null);
const email = ref("");
const password = ref("");
const seats = ref([]);

// 🔐 LOGIN
const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    alert("Erro no login");
  } else {
    user.value = data.user;
    loadSeats();
  }
};

// 🚪 LOGOUT
const logout = async () => {
  await supabase.auth.signOut();
  user.value = null;
};

// 🎬 BUSCAR ASSENTOS
const loadSeats = async () => {
  const res = await axios.get("http://localhost:3000/assentos");
  seats.value = res.data;
};

// 🎟️ RESERVAR
const reserve = async (id) => {
  await axios.post("http://localhost:3000/reserva", { id });
  loadSeats();
};

// ❌ CANCELAR
const cancel = async (id) => {
  await axios.post("http://localhost:3000/cancelar", { id });
  loadSeats();
};

// verifica se já está logado
onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    user.value = data.user;
    loadSeats();
  }
});
</script>
<template>
  <div id="app">
    <LoginForm 
      v-if="!autenticado && modoLogin"
      @login-sucesso="autenticado = true"
      @trocar-modo="modoLogin = false"
    />
    <RegisterForm 
      v-else-if="!autenticado && !modoLogin"
      @trocar-modo="modoLogin = true"
    />
    <AssentosList 
      v-else
      @logout="autenticado = false"
    />
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import AssentosList from './components/AssentosList.vue';

export default {
  components: {
    LoginForm,
    RegisterForm,
    AssentosList
  },
  data() {
    return {
      autenticado: !!localStorage.getItem('token'),
      modoLogin: true
    };
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
}
</style>