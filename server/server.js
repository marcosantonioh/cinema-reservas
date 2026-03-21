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




// 2. Reservar assento
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




// 3. Rota de Cancelar
app.post('/assentos/:id/cancelar', async (req, res) => {
  const id = Number(req.params.id);
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  console.log(`--- Tentativa de cancelamento no assento ID: ${id} ---`);

  // 🔎 Validação do ID
  if (isNaN(id)) {
    console.log("❌ ID inválido");
    return res.status(400).json({ error: 'ID inválido' });
  }

  // 🔎 Verifica token
  if (!authHeader) {
    console.log("❌ Header Authorization não enviado");
    return res.status(401).json({ error: 'Header Authorization não fornecido' });
  }

  if (!token) {
    console.log("❌ Token mal formatado");
    return res.status(401).json({ error: 'Token inválido' });
  }

  console.log("Token recebido:", token);

  // 🔐 Autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError) {
    console.error("❌ Erro ao validar token:", authError);
    return res.status(401).json({ error: authError.message });
  }

  if (!user) {
    console.log("❌ Usuário não encontrado");
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  console.log("Usuário autenticado:", user.id);

  // 🔎 Buscar assento
  const { data: assento, error: findError } = await supabase
    .from('assentos')
    .select('*')
    .eq('id', id)
    .single();

  if (findError) {
    console.error("❌ Erro ao buscar assento:", findError);
    return res.status(404).json({ error: 'Assento não encontrado' });
  }

  console.log("Assento encontrado:", assento);

  // 🔒 Verifica dono
  if (assento.user_id !== user.id) {
    console.log("❌ Usuário não é dono do assento");
    return res.status(403).json({ error: 'Sem permissão para cancelar' });
  }

  // 🔎 Verifica se já está livre
  if (assento.status === true) {
    console.log("⚠️ Assento já está disponível");
    return res.status(400).json({ error: 'Assento já está disponível' });
  }

  // 🔄 Atualiza
  const { data, error: updateError } = await supabase
    .from('assentos')
    .update({
      status: true,
      user_id: null
    })
    .eq('id', id)
    .eq('user_id', user.id) // evita conflito
    .select();

  if (updateError) {
    console.error("❌ Erro no update:", updateError);
    return res.status(500).json({ error: updateError.message });
  }

  if (!data || data.length === 0) {
    console.log("❌ Nenhuma linha atualizada (conflito)");
    return res.status(400).json({ error: 'Não foi possível cancelar (conflito)' });
  }

  console.log("✅ Cancelamento realizado com sucesso!");
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