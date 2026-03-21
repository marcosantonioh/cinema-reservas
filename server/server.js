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
  const id = Number(req.params.id);
  const token = req.headers.authorization?.split(' ')[1];

  console.log(`--- Tentativa de reserva no assento ID: ${id} ---`);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Não autorizado' });

  // 1. Busca o assento
  const { data: assento, error: findError } = await supabase
    .from('assentos')
    .select('*')
    .eq('id', id)
    .single();

  if (findError) {
    console.error("Erro ao buscar assento no banco:", findError);
    return res.status(404).json({ error: 'Assento não encontrado' });
  }
  
  if (assento.status === false) {
    return res.status(400).json({ error: 'Assento já está ocupado' });
  }

  // 2. Tenta atualizar
  const { data, error: updateError } = await supabase
    .from('assentos')
    .update({ 
      status: false,
      user_id: user.id 
    })
    .eq('id', id)
    .eq('status', true)
    .select();

  if (updateError) {
    // ESTE LOG VAI NOS DIZER O MOTIVO REAL NO TERMINAL
    console.error("ERRO DETALHADO DO SUPABASE:", updateError);
    return res.status(500).json({ error: updateError.message });
  }

  if (!data || data.length === 0) {
    return res.status(400).json({ error: 'Assento não disponível (conflito)' });
  }

  console.log("✅ Reserva concluída com sucesso!");
  res.json({ message: 'Reserva realizada', assento: data[0] });
});

// 3. Rota de Cancelar (Ajustada)
app.post('/assentos/:id/cancelar', async (req, res) => {
  const id = Number(req.params.id); // <--- CONVERSÃO PARA NÚMERO AQUI
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Não autorizado' });

  // 1. Busca o assento
  const { data: assento, error: findError } = await supabase
    .from('assentos')
    .select('*')
    .eq('id', id)
    .single();

  if (findError || !assento) return res.status(404).json({ error: 'Assento não encontrado' });

  // Segurança: Só permite cancelar se o assento pertencer a quem está logado
  if (assento.user_id !== user.id) {
    return res.status(403).json({ error: 'Você não tem permissão para cancelar este assento' });
  }

  // 2. Libera o assento (status true, user_id null)
  const { data, error } = await supabase
    .from('assentos')
    .update({ 
      status: true,
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