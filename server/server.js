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
app.get('/assentos', async (req, res) => {
  const { data, error } = await supabase
    .from('assentos')
    .select('*')
    .order('identificador');
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.post('/assentos/:id/reservar', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Não autorizado' });

  // Busca o assento pelo ID (numérico/uuid) em vez do identificador (A1, A2)
  const { data: assento, error: findError } = await supabase
    .from('assentos')
    .select('*')
    .eq('id', id)
    .single();

  if (findError || !assento) return res.status(404).json({ error: 'Assento não encontrado' });
  if (assento.status === 'ocupado') return res.status(400).json({ error: 'Assento já está ocupado' });

  // Atualiza para ocupado e salva quem reservou (user_id)
  const { data, error } = await supabase
    .from('assentos')
    .update({ 
      status: 'ocupado',
      user_id: user.id // Importante para o cancelamento seguro
    })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Reserva realizada', assento: data[0] });
});

// 3. Cancelar reserva
app.post('/assentos/:id/cancelar', async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(' ')[1];

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Não autorizado' });

  const { data: assento } = await supabase.from('assentos').select('*').eq('id', id).single();

  // Opcional: Validar se o usuário que está cancelando é o dono da reserva
  // if (assento.user_id !== user.id) return res.status(403).json({ error: 'Proibido cancelar reserva de terceiros' });

  const { data, error } = await supabase
    .from('assentos')
    .update({ 
      status: 'disponivel',
      user_id: null 
    })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Cancelamento realizado', assento: data[0] });
});
// 4. Login (retorna token)
app.post('/login', async (req, res) => {
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


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});