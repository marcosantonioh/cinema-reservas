<script setup>
import { ref } from "vue";
import supabase from "./supabase";

const email = ref("");
const password = ref("");

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (!error) {
    alert("Logado!");
  } else {
    alert("Erro no login");
  }
};
</script>

<template>
  <h1>Login</h1>

  <input v-model="email" placeholder="Email" />
  <input v-model="password" type="password" placeholder="Senha" />

  <button @click="login">Entrar</button>
</template>