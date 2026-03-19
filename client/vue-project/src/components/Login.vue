<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div>
        <label>Senha:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Entrar</button>
    </form>
    <p v-if="erro" class="erro">{{ erro }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      erro: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password
        });
        
        // Salvar token e usuário
        localStorage.setItem('token', response.data.session.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirecionar para assentos
        this.$router.push('/assentos');
      } catch (error) {
        this.erro = error.response?.data?.error || 'Erro ao fazer login';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.erro {
  color: red;
}
</style>