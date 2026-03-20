<template>
  <div class="assentos-container">
    <div class="header">
      <div class="header-left">
        <h1>Sala 3 — IMAX</h1>
        <p class="subtitulo">Selecione seu assento</p>
      </div>
      <button @click="logout" class="btn-sair">Sair</button>
    </div>

    <div class="tela-wrap">
      <div class="tela"></div>
    </div>

    <div class="grade">
      <div v-for="row in rows" :key="row" class="row">
        <span class="row-label">{{ row }}</span>
        <div class="assentos-row">
          <button
            v-for="assento in assentosPorRow(row)"
            :key="assento.id"
            class="assento"
            :class="{
              // Se status for true, aplica 'ocupado'. Se for false, 'disponivel'
              'ocupado': assento.status === true,
              'disponivel': assento.status === false,
              'vip': assento.categoria === 'vip',
              'selecionado': assentoSelecionado?.id === assento.id
            }"
            @click="selecionarAssento(assento)"
          >
            {{ assento.col }}
          </button>
        </div>
        <div class="spacer"></div>
      </div>
    </div>

    

    <div v-if="assentoSelecionado" class="painel">
      <div class="painel-header">
        <div class="painel-id">Assento {{ assentoSelecionado.identificador }}</div>
      </div>
      <div class="painel-meta">
        <span class="badge" :class="assentoSelecionado.categoria">{{ assentoSelecionado.categoria }}</span>
        <span class="badge" :class="assentoSelecionado.status === 'disponivel' ? 'status-disp' : 'status-ocup'">
          {{ assentoSelecionado.status ? 'Indisponível' : 'Disponível' }}
        </span>
      </div>
      <button
        v-if="assentoSelecionado.status === 'disponivel'"
        class="btn-acao btn-reservar"
        @click="reservarAssento"
      >
        Confirmar reserva
      </button>
      <button
        v-else
        class="btn-acao btn-cancelar"
        @click="cancelarReserva"
      >
        Cancelar reserva
      </button>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

const VIP_ROWS = ['A', 'B'];

export default {
  data() {
    return {
      rows: ['A', 'B', 'C', 'D', 'E'],
      assentos: [],
      assentoSelecionado: null,
    };
  },
  mounted() {
    this.carregarAssentos();
  },
  methods: {
    assentosPorRow(row) {
      return this.assentos.filter(a => a.row === row);
    },
    async carregarAssentos() {
      try {
        const response = await api.get('/assentos');
        // Adiciona as propriedades row e col se o backend não as retornar
        this.assentos = response.data.map(a => ({
          ...a,
          row: a.identificador[0],
          col: parseInt(a.identificador.slice(1)),
        }));
      } catch (error) {
        alert('Erro ao carregar assentos');
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },
    selecionarAssento(assento) {
      if (this.assentoSelecionado?.id === assento.id) {
        this.assentoSelecionado = null;
      } else {
        this.assentoSelecionado = assento;
      }
    },
    async reservarAssento() {
      try {
        // Agora o endpoint bate com o backend corrigido
        const response = await api.post(`/assentos/${this.assentoSelecionado.id}/reservar`);
        
        // Atualiza a lista local sem precisar recarregar tudo do servidor (mais rápido)
        const index = this.assentos.findIndex(a => a.id === this.assentoSelecionado.id);
        this.assentos[index].status = 'ocupado';
        
        this.assentoSelecionado = null;
        alert('Reserva realizada com sucesso!');
      } catch (error) {
        alert(error.response?.data?.error || 'Erro ao reservar');
      }
    },
    async cancelarReserva() {
      try {
        await api.post(`/assentos/${this.assentoSelecionado.id}/cancelar`);
        
        // Atualiza o estado local
        const index = this.assentos.findIndex(a => a.id === this.assentoSelecionado.id);
        this.assentos[index].status = 'disponivel';
        
        this.assentoSelecionado = null;
        alert('Reserva cancelada com sucesso!');
      } catch (error) {
        alert(error.response?.data?.error || 'Erro ao cancelar');
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$emit('logout');
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --cinema-bg: #0a0a0f;
  --surface: #13131a;
  --surface2: #1c1c28;
  --gold: #c9a84c;
  --gold-light: #e8c97a;
  --green: #2ecc8a;
  --red: #e55353;
  --text: #f0eee8;
  --muted: #7a7a8c;
}

.assentos-container {
  font-family: 'DM Sans', sans-serif;
  background: var(--cinema-bg);
  color: var(--text);
  min-height: 100vh;
  padding: 32px 28px 40px;
  max-width: 680px;
  margin: 0 auto;
}

/* ── Header ───────────────────────────────────── */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left h1 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--text);
  margin: 0;
}

.subtitulo {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.btn-sair {
  background: transparent;
  border: 0.5px solid #3a3a4a;
  color: var(--muted);
  font-size: 12px;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}

.btn-sair:hover {
  border-color: var(--red);
  color: var(--red);
}

/* ── Tela ─────────────────────────────────────── */
.tela-wrap {
  margin-bottom: 36px;
}

.tela {
  width: 65%;
  margin: 0 auto;
  height: 5px;
  background: linear-gradient(90deg, transparent, rgba(201, 168, 76, 0.6), transparent);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(201, 168, 76, 0.25), 0 0 60px rgba(201, 168, 76, 0.08);
  position: relative;
}

.tela::after {
  content: 'TELA';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 3px;
}

/* ── Grade ────────────────────────────────────── */
.grade {
  margin-top: 36px;
}

.row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  justify-content: center;
}

.row-label {
  font-size: 11px;
  color: var(--muted);
  width: 16px;
  text-align: right;
  flex-shrink: 0;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.spacer {
  width: 16px;
}

.assentos-row {
  display: flex;
  gap: 6px;
}

/* ── Assentos ─────────────────────────────────── */
.assento {
  width: 36px;
  height: 30px;
  border-radius: 5px 5px 3px 3px;
  border: none;
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.18s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.2px;
}

.assento::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 2px;
  right: 2px;
  height: 3px;
  border-radius: 0 0 3px 3px;
}

.assento.disponivel {
  background: var(--surface2);
  color: #5a7a70;
  border: 0.5px solid #2a3a34;
}

.assento.disponivel::after {
  background: #1e2e28;
}

.assento.disponivel:hover {
  background: #1e3a30;
  border-color: var(--green);
  color: var(--green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 138, 0.15);
}

.assento.disponivel.vip {
  background: #1e1a10;
  color: #7a6020;
  border: 0.5px solid #3a2e10;
}

.assento.disponivel.vip::after {
  background: #2a2010;
}

.assento.disponivel.vip:hover {
  background: #2a2010;
  border-color: var(--gold);
  color: var(--gold);
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.2);
}

.assento.ocupado {
  background: #1a1214;
  color: #3a2028;
  border: 0.5px solid #2a1820;
  cursor: not-allowed;
}

.assento.ocupado::after {
  background: #140c10;
}

.assento.selecionado {
  background: #1a3060 !important;
  border-color: #4a80d0 !important;
  color: #7ab0f0 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(74, 128, 208, 0.25) !important;
}

.assento.selecionado.vip {
  background: #2a2010 !important;
  border-color: var(--gold) !important;
  color: var(--gold-light) !important;
  box-shadow: 0 4px 16px rgba(201, 168, 76, 0.3) !important;
}

/* ── Legenda ──────────────────────────────────── */
.legenda {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 0.5px solid #1e1e2a;
  flex-wrap: wrap;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.3px;
}

.leg-box {
  width: 16px;
  height: 13px;
  border-radius: 3px 3px 2px 2px;
  border: 0.5px solid;
}

.leg-box.disponivel { background: var(--surface2); border-color: #2a3a34; }
.leg-box.ocupado    { background: #1a1214;          border-color: #2a1820; }
.leg-box.vip        { background: #1e1a10;          border-color: #3a2e10; }
.leg-box.selecionado{ background: #1a3060;          border-color: #4a80d0; }

/* ── Painel de seleção ────────────────────────── */
.painel {
  margin-top: 20px;
  background: var(--surface);
  border: 0.5px solid #2a2a3a;
  border-radius: 12px;
  padding: 18px 20px;
  animation: fadeUp 0.25s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}

.painel-header {
  margin-bottom: 14px;
}

.painel-id {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.painel-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.badge.vip {
  background: rgba(201, 168, 76, 0.12);
  color: var(--gold);
  border: 0.5px solid rgba(201, 168, 76, 0.3);
}

.badge.normal {
  background: rgba(120, 120, 160, 0.12);
  color: var(--muted);
  border: 0.5px solid rgba(120, 120, 160, 0.2);
}

.badge.status-disp {
  background: rgba(46, 204, 138, 0.1);
  color: var(--green);
  border: 0.5px solid rgba(46, 204, 138, 0.2);
}

.badge.status-ocup {
  background: rgba(229, 83, 83, 0.1);
  color: var(--red);
  border: 0.5px solid rgba(229, 83, 83, 0.2);
}

.btn-acao {
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}

.btn-reservar {
  background: rgba(46, 204, 138, 0.15);
  color: var(--green);
  border: 0.5px solid rgba(46, 204, 138, 0.3);
}

.btn-reservar:hover {
  background: rgba(46, 204, 138, 0.22);
  box-shadow: 0 0 20px rgba(46, 204, 138, 0.1);
}

.btn-cancelar {
  background: rgba(229, 83, 83, 0.12);
  color: var(--red);
  border: 0.5px solid rgba(229, 83, 83, 0.25);
}

.btn-cancelar:hover {
  background: rgba(229, 83, 83, 0.18);
}
</style>