const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ========== ROTAS ==========

// 1. Listar todos os assentos
app.get('/api/assentos', async (req, res) => {
  const { data, error } = await supabase
    .from('assentos')
    .select('*')
    .order('identificador');
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Reservar assento (precisa de autenticação)
app.post('/api/reservar', async (req, res) => {
  const { identificador } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Verificar usuário autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Verificar se assento existe e está disponível
  const { data: assento, error: findError } = await supabase
    .from('assentos')
    .select('*')
    .eq('identificador', identificador)
    .single();

  if (findError || !assento) {
    return res.status(404).json({ error: 'Assento não encontrado' });
  }

  if (assento.status) {
    return res.status(400).json({ error: 'Assento já está ocupado' });
  }

  // Reservar assento
  const { data, error } = await supabase
    .from('assentos')
    .update({ status: true })
    .eq('identificador', identificador)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  
  res.json({ message: 'Reserva realizada com sucesso', assento: data[0] });
});

// 3. Cancelar reserva (precisa de autenticação)
app.post('/api/cancelar', async (req, res) => {
  const { identificador } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Verificar usuário autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Verificar se assento existe e está ocupado
  const { data: assento, error: findError } = await supabase
    .from('assentos')
    .select('*')
    .eq('identificador', identificador)
    .single();

  if (findError || !assento) {
    return res.status(404).json({ error: 'Assento não encontrado' });
  }

  if (!assento.status) {
    return res.status(400).json({ error: 'Assento já está disponível' });
  }

  // Cancelar reserva
  const { data, error } = await supabase
    .from('assentos')
    .update({ status: false })
    .eq('identificador', identificador)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  
  res.json({ message: 'Cancelamento realizado com sucesso', assento: data[0] });
});

// 4. Login (retorna token)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(401).json({ error: error.message });
  
  res.json({ 
    user: data.user,
    session: data.session
  });
});

// 5. Registro (opcional, útil para testes)
app.post('/api/registro', async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) return res.status(400).json({ error: error.message });
  
  res.json({ 
    user: data.user,
    message: 'Usuário criado com sucesso'
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});