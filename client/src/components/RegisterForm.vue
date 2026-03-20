<template>
  <div class="register-container">
    <div class="logo-wrap">
      <div class="logo-tela"></div>
      <h1 class="logo-title">Sala 3 — IMAX</h1>
      <p class="logo-sub">Crie sua conta</p>
    </div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label class="form-label" for="email">E-mail</label>
        <input
          id="email"
          type="email"
          class="form-input"
          v-model="email"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="senha">Senha</label>
        <input
          id="senha"
          type="password"
          class="form-input"
          v-model="password"
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" class="btn-registrar-submit">Criar conta</button>
    </form>

    <p v-if="erro" class="erro">{{ erro }}</p>

    <p v-if="sucesso" class="sucesso">
      <span class="sucesso-icon">✓</span> {{ sucesso }}
    </p>

    <hr class="divider" />

    <p class="rodape">
      Já tem conta?
      <button class="btn-login" @click="$emit('trocar-modo')">Entrar</button>
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
      sucesso: '',
    };
  },
  methods: {
    async handleRegister() {
      this.erro = '';
      this.sucesso = '';
      try {
        await api.post('/register', {
          email: this.email,
          password: this.password,
        });

        this.sucesso = 'Registro realizado! Verifique seu e-mail.';
        this.email = '';
        this.password = '';

        setTimeout(() => {
          this.$emit('trocar-modo');
        }, 3000);
      } catch (error) {
        this.erro = error.response?.data?.error || 'Erro ao registrar';
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

.register-container {
  font-family: 'DM Sans', sans-serif;
  background: #0a0a0f;
  color: #f0eee8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* ── Logo / cabeçalho ─────────────────────────── */
.logo-wrap {
  text-align: center;
  margin-bottom: 36px;
  width: 100%;
  max-width: 360px;
}

.logo-tela {
  width: 48px;
  height: 3px;
  background: rgba(201, 168, 76, 0.7);
  border-radius: 2px;
  margin: 0 auto 14px;
}

.logo-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #f0eee8;
  margin: 0;
}

.logo-sub {
  font-size: 11px;
  color: #7a7a8c;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 4px;
}

/* ── Formulário ───────────────────────────────── */
form {
  width: 100%;
  max-width: 360px;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  font-size: 11px;
  color: #7a7a8c;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  box-sizing: border-box;
  background: #13131a;
  border: 0.5px solid #2a2a3a;
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #f0eee8;
  outline: none;
  transition: border-color 0.2s;
  color-scheme: dark;
  -webkit-text-fill-color: #f0eee8;
}

.form-input::placeholder {
  color: #3a3a50;
  -webkit-text-fill-color: #3a3a50;
}

.form-input:focus {
  border-color: #c9a84c;
}

.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #13131a inset;
  -webkit-text-fill-color: #f0eee8;
  transition: background-color 9999s ease;
}

/* ── Botão principal ──────────────────────────── */
.btn-registrar-submit {
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  padding: 12px;
  background: rgba(201, 168, 76, 0.12);
  color: #c9a84c;
  border: 0.5px solid rgba(201, 168, 76, 0.3);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  letter-spacing: 0.3px;
}

.btn-registrar-submit:hover {
  background: rgba(201, 168, 76, 0.2);
  border-color: rgba(201, 168, 76, 0.5);
}

.btn-registrar-submit:active {
  transform: scale(0.98);
}

/* ── Feedback ─────────────────────────────────── */
.erro {
  width: 100%;
  max-width: 360px;
  font-size: 12px;
  color: #e55353;
  margin-top: 10px;
  text-align: center;
  background: rgba(229, 83, 83, 0.08);
  border: 0.5px solid rgba(229, 83, 83, 0.2);
  border-radius: 6px;
  padding: 8px;
}

.sucesso {
  width: 100%;
  max-width: 360px;
  font-size: 12px;
  color: #2ecc8a;
  margin-top: 10px;
  text-align: center;
  background: rgba(46, 204, 138, 0.08);
  border: 0.5px solid rgba(46, 204, 138, 0.2);
  border-radius: 6px;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sucesso-icon {
  font-weight: 600;
  font-size: 13px;
  line-height: 1;
}

/* ── Rodapé ───────────────────────────────────── */
.divider {
  border: none;
  border-top: 0.5px solid #1e1e2a;
  margin: 28px 0 20px;
  width: 100%;
  max-width: 360px;
}

.rodape {
  font-size: 12px;
  color: #7a7a8c;
  text-align: center;
  width: 100%;
  max-width: 360px;
}

.btn-login {
  background: none;
  border: none;
  color: #c9a84c;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-login:hover {
  opacity: 0.75;
}
</style>