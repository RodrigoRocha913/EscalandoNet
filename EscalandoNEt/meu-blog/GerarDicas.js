import fs from 'fs';
import fetch from 'node-fetch';

const OPENAI_API_KEY = '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';

// Gera o conteúdo do post
async function gerarPost() {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'Crie um post de blog com uma dica de finanças para iniciantes, com título e 3 parágrafos. Use HTML básico com <h1> e <p>.' }
      ],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

// Salva o post como arquivo HTML
async function salvarPost() {
  const conteudo = await gerarPost();
  const data = new Date().toISOString().slice(0, 10);
  const caminho = `public/posts/post-${data}.html`;

  fs.mkdirSync('public/posts', { recursive: true });
  fs.writeFileSync(caminho, conteudo);

  console.log(`Post salvo em ${caminho}`);

  atualizarIndex(data);
}
// Atualiza a homepage com links para os posts
function atualizarIndex(dataAtual) {
  const arquivos = fs.readdirSync('public/posts');
  const links = arquivos.map(arq => `<li><a href="posts/${arq}">${arq.replace('post-', '').replace('.html', '')}</a></li>`).join('\n');

  const html = `
    <html>
      <head><title>Blog de Finanças</title></head>
      <body>
        <h1>Posts Recentes</h1>
        <ul>${links}</ul>
      </body>
    </html>
  `;

  fs.writeFileSync('public/index.html', html);
  console.log('Index atualizado.');
}

salvarPost();
