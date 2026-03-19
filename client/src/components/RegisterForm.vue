<template>
  <div class="register-container">
    <h2>Registrar</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <input 
          type="email" 
          v-model="email" 
          placeholder="Email"
          required
        >
      </div>
      <div>
        <input 
          type="password" 
          v-model="password" 
          placeholder="Senha"
          required
        >
      </div>
      <button type="submit">Registrar</button>
    </form>
    <p v-if="erro" class="erro">{{ erro }}</p>
    <p v-if="sucesso" class="sucesso">{{ sucesso }}</p>
    <p>
      Já tem conta? 
      <button @click="$emit('trocar-modo')">Login</button>
    </p>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      email: '',
      password: '',
      erro: '',
      sucesso: ''
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await api.post('/register', {
          email: this.email,
          password: this.password
        });
        
        this.sucesso = 'Registro realizado! Verifique seu email.';
        this.erro = '';
        this.email = '';
        this.password = '';
        
        setTimeout(() => {
          this.$emit('trocar-modo');
        }, 3000);
      } catch (error) {
        this.erro = error.response?.data?.error || 'Erro ao registrar';
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.erro {
  color: red;
  margin-top: 10px;
}
.sucesso {
  color: green;
  margin-top: 10px;
}
</style>