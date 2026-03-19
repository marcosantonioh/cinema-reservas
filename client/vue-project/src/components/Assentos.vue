<template>
  <div class="assentos-container">
    <h2>Assentos Disponíveis</h2>
    <div class="grid-assentos">
      <div 
        v-for="assento in assentos" 
        :key="assento.id"
        class="assento"
        :class="{
          'vip': assento.categoria === 'VIP',
          'ocupado': assento.status,
          'disponivel': !assento.status
        }"
        @click="toggleAssento(assento)"
      >
        {{ assento.identificador }}
      </div>
    </div>
    
    <button @click="logout">Sair</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      assentos: []
    };
  },
  async mounted() {
    // Verificar se está logado
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/');
      return;
    }
    
    await this.carregarAssentos();
  },
  methods: {
    async carregarAssentos() {
      try {
        const response = await axios.get('http://localhost:3000/api/assentos');
        this.assentos = response.data;
      } catch (error) {
        console.error('Erro ao carregar assentos:', error);
      }
    },
    
    async toggleAssento(assento) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/');
        return;
      }
      
      try {
        const endpoint = assento.status ? '/api/cancelar' : '/api/reservar';
        
        await axios.post(
          `http://localhost:3000${endpoint}`,
          { identificador: assento.identificador },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Recarregar assentos após ação
        await this.carregarAssentos();
      } catch (error) {
        alert(error.response?.data?.error || 'Erro ao processar ação');
      }
    },
    
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.grid-assentos {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin: 20px 0;
}

.assento {
  padding: 20px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.vip {
  background-color: gold;
}

.ocupado {
  background-color: #ff6b6b;
  color: white;
  cursor: not-allowed;
}

.disponivel {
  background-color: #6bff6b;
  cursor: pointer;
}

.assento:hover:not(.ocupado) {
  opacity: 0.8;
}
</style>