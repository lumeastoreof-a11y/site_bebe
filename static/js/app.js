/**
 * app.js — Lógica do frontend do site do bebê
 * Faz chamadas à API do Flask para salvar e carregar dados.
 */

// ── Tabs ──────────────────────────────────────────────────────────────────────

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'gravidez') renderGravidez();
    if (btn.dataset.tab === 'enxoval') calcularTotais();
  });
});

// ── Família ───────────────────────────────────────────────────────────────────

document.getElementById('formFamilia').addEventListener('submit', async (e) => {
  e.preventDefault();
  const campos = ['nomePai', 'nomeMae', 'nomeBebe', 'sexoBebe', 'inicioGrav', 'previsaoNasc', 'mensagem'];
  const dados = {};
  campos.forEach(c => { dados[c] = e.target.elements[c]?.value || ''; });

  await fetch('/api/familia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  Object.assign(DADOS.familia, dados);
  document.getElementById('msgFamilia').textContent = '✓ Salvo!';
  setTimeout(() => document.getElementById('msgFamilia').textContent = '', 2500);
  atualizarHero(dados);
});

function atualizarHero(f) {
  // Atualiza o título com o nome do bebê
  const emoji = f.sexoBebe === 'menino' ? '💙' : f.sexoBebe === 'menina' ? '💗' : '💛';
  const tituloEl = document.querySelector('.hero-title');
  if (tituloEl) tituloEl.textContent = emoji + ' ' + (f.nomeBebe || 'Nosso Bebê') + ' ' + emoji;

  const subEl = document.querySelector('.hero-sub');
  if (subEl && f.nomePai && f.nomeMae)
    subEl.textContent = `Uma história de amor de ${f.nomePai} & ${f.nomeMae}`;

  // Formata data de previsão
  if (f.previsaoNasc) {
    const d = new Date(f.previsaoNasc + 'T12:00:00');
    const el = document.getElementById('previsaoFormatada');
    if (el) el.textContent = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

// Formata a data de previsão ao carregar a página
(function() {
  const prev = DADOS.familia?.previsaoNasc;
  if (prev) {
    const d = new Date(prev + 'T12:00:00');
    const el = document.getElementById('previsaoFormatada');
    if (el) el.textContent = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
})();

// ── Gravidez ──────────────────────────────────────────────────────────────────

function renderGravidez() {
  const f = DADOS.familia;
  const el = document.getElementById('gravidezContent');
  if (!el) return;

  if (!f?.inicioGrav) {
    el.innerHTML = '<p class="text-muted">Preencha a data de início da gravidez na aba Família.</p>';
    return;
  }

  const inicio = new Date(f.inicioGrav + 'T12:00:00');
  const agora  = new Date();
  const dias   = Math.floor((agora - inicio) / (1000 * 60 * 60 * 24));
  const semanas = Math.floor(dias / 7);
  const extra   = dias % 7;
  const pct     = Math.min(100, Math.round((semanas / 40) * 100));

  let fase = '';
  if (semanas < 13)      fase = '1º Trimestre — Formação dos órgãos';
  else if (semanas < 28) fase = '2º Trimestre — Crescimento e movimentos';
  else                   fase = '3º Trimestre — Amadurecimento e chegada!';

  let diasFaltamHTML = '';
  if (f.previsaoNasc) {
    const prev = new Date(f.previsaoNasc + 'T12:00:00');
    const faltam = Math.ceil((prev - agora) / (1000 * 60 * 60 * 24));
    diasFaltamHTML = faltam > 0
      ? `<p class="dias-faltam">🍼 Faltam <strong>${faltam}</strong> dias para a chegada!</p>`
      : `<p class="dias-faltam">🎉 O grande dia chegou!</p>`;
  }

  el.innerHTML = `
    <div class="semana-pill">✨ Semana ${semanas}, ${extra} dia${extra !== 1 ? 's' : ''}</div>
    <p class="fase-txt">${fase}</p>
    <div class="prog-wrap">
      <div class="prog-bar"><div class="prog-fill" style="width:${pct}%"></div></div>
      <div class="prog-labels"><span>Semana 0</span><span>${pct}%</span><span>Semana 40</span></div>
    </div>
    ${diasFaltamHTML}
  `;
}

// ── Registros de gravidez ─────────────────────────────────────────────────────

async function adicionarRegistro() {
  const semana = document.getElementById('regSemana').value;
  const nota   = document.getElementById('regNota').value.trim();
  if (!nota) { alert('Digite uma anotação!'); return; }

  const resp = await fetch('/api/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ semana, nota })
  });
  const reg = await resp.json();
  DADOS.registros.push(reg);

  const sem = document.getElementById('semRegistros');
  if (sem) sem.remove();

  const lista = document.getElementById('listaRegistros');
  const div = document.createElement('div');
  div.className = 'registro-item';
  div.dataset.id = reg.id;
  div.innerHTML = `
    <div class="reg-semana">${reg.semana ? 'Sem. ' + reg.semana : '—'}</div>
    <div class="reg-nota">${reg.nota}</div>
    <div class="reg-data">${reg.data}</div>
    <button class="btn-icon" onclick="deletarRegistro(${reg.id}, this)">✕</button>
  `;
  lista.appendChild(div);
  document.getElementById('regSemana').value = '';
  document.getElementById('regNota').value   = '';
}

async function deletarRegistro(id, btn) {
  await fetch('/api/registros/' + id, { method: 'DELETE' });
  btn.closest('.registro-item').remove();
  DADOS.registros = DADOS.registros.filter(r => r.id !== id);
}

// ── Enxoval ───────────────────────────────────────────────────────────────────

async function adicionarItem() {
  const nome = document.getElementById('iNome').value.trim();
  if (!nome) { alert('Digite o nome do item!'); return; }

  const item = {
    cat:   document.getElementById('iCat').value,
    nome,
    qtd:   parseFloat(document.getElementById('iQtd').value)   || 1,
    valor: parseFloat(document.getElementById('iValor').value) || 0,
    link:  document.getElementById('iLink').value.trim()
  };

  const resp = await fetch('/api/itens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  const novo = await resp.json();
  DADOS.itens.push(novo);

  // Limpa os campos
  ['iNome', 'iValor', 'iLink'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('iQtd').value = '1';

  // Adiciona à tabela (cria a categoria se não existir)
  const sem = document.getElementById('semItens');
  if (sem) sem.remove();
  adicionarLinhaTabela(novo);
  calcularTotais();
}

function adicionarLinhaTabela(item) {
  let tabelas = document.getElementById('enxovalTabelas');
  let catCard = tabelas.querySelector(`[data-cat="${item.cat}"]`);

  if (!catCard) {
    catCard = document.createElement('div');
    catCard.className = 'card cat-card';
    catCard.dataset.cat = item.cat;
    catCard.innerHTML = `
      <h3 class="cat-title">${item.cat}</h3>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th style="width:32px"></th>
            <th>Item</th>
            <th style="width:60px">Qtd</th>
            <th style="width:110px">Valor</th>
            <th style="width:80px">Link</th>
            <th style="width:36px"></th>
          </tr></thead>
          <tbody></tbody>
        </table>
      </div>`;
    tabelas.appendChild(catCard);
  }

  const tbody = catCard.querySelector('tbody');
  const tr = document.createElement('tr');
  tr.dataset.id = item.id;
  tr.innerHTML = `
    <td><input type="checkbox" class="check-item" onchange="toggleComprado(${item.id}, this)"></td>
    <td><input class="cell-input" value="${item.nome}" onchange="atualizarItem(${item.id}, 'nome', this.value)"></td>
    <td><input type="number" class="cell-input" value="${item.qtd}" onchange="atualizarItem(${item.id}, 'qtd', this.value)" style="width:55px"></td>
    <td><input type="number" class="cell-input" value="${item.valor}" step="0.01" onchange="atualizarItem(${item.id}, 'valor', this.value)" style="width:90px"></td>
    <td>${item.link ? `<a href="${item.link}" target="_blank" class="link-pill">Ver ↗</a>` : '—'}</td>
    <td><button class="btn-icon" onclick="deletarItem(${item.id}, this)">✕</button></td>
  `;
  tbody.appendChild(tr);
}

async function atualizarItem(id, campo, valor) {
  const payload = {};
  payload[campo] = ['qtd', 'valor'].includes(campo) ? parseFloat(valor) || 0 : valor;
  await fetch('/api/itens/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const item = DADOS.itens.find(i => i.id === id);
  if (item) Object.assign(item, payload);
  calcularTotais();
}

async function toggleComprado(id, checkbox) {
  const comprado = checkbox.checked;
  await fetch('/api/itens/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comprado })
  });
  const tr = checkbox.closest('tr');
  tr.classList.toggle('comprado', comprado);
  const item = DADOS.itens.find(i => i.id === id);
  if (item) item.comprado = comprado;
  calcularTotais();
}

async function deletarItem(id, btn) {
  if (!confirm('Remover este item?')) return;
  await fetch('/api/itens/' + id, { method: 'DELETE' });
  btn.closest('tr').remove();
  DADOS.itens = DADOS.itens.filter(i => i.id !== id);
  calcularTotais();
}

function calcularTotais() {
  const total     = DADOS.itens.length;
  const comprados = DADOS.itens.filter(i => i.comprado).length;
  const valorTotal = DADOS.itens.reduce((s, i) => s + ((i.valor || 0) * (i.qtd || 1)), 0);
  const valorGasto = DADOS.itens.filter(i => i.comprado).reduce((s, i) => s + ((i.valor || 0) * (i.qtd || 1)), 0);

  document.getElementById('totalItens').textContent     = total;
  document.getElementById('totalComprados').textContent = comprados;
  document.getElementById('totalValor').textContent     = 'R$ ' + valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  document.getElementById('totalGasto').textContent     = 'R$ ' + valorGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

// ── Álbum de fotos ────────────────────────────────────────────────────────────

async function adicionarFoto() {
  const arquivo = document.getElementById('fArquivo').files[0];
  if (!arquivo) { alert('Selecione uma foto!'); return; }

  const formData = new FormData();
  formData.append('arquivo', arquivo);
  formData.append('fase', document.getElementById('fFase').value);
  formData.append('desc', document.getElementById('fDesc').value);

  const resp = await fetch('/api/fotos', { method: 'POST', body: formData });
  const foto = await resp.json();
  DADOS.fotos.push(foto);

  document.getElementById('fArquivo').value = '';
  document.getElementById('fDesc').value   = '';

  const sem = document.getElementById('semFotos');
  if (sem) sem.remove();

  const grid = document.getElementById('photoGrid');
  const div  = document.createElement('div');
  div.className = 'photo-card';
  div.dataset.id = foto.id;
  div.innerHTML = `
    <img src="/static/uploads/${foto.arquivo}" alt="${foto.desc}">
    <div class="photo-info">
      <div class="photo-fase">${foto.fase}</div>
      ${foto.desc ? `<div class="photo-desc">${foto.desc}</div>` : ''}
      <div class="photo-data">${foto.data}</div>
      <button class="btn-icon" onclick="deletarFoto(${foto.id}, this)">✕ Remover</button>
    </div>`;
  grid.appendChild(div);
}

async function deletarFoto(id, btn) {
  if (!confirm('Remover esta foto?')) return;
  await fetch('/api/fotos/' + id, { method: 'DELETE' });
  btn.closest('.photo-card').remove();
  DADOS.fotos = DADOS.fotos.filter(f => f.id !== id);
}

// ── Inicialização ─────────────────────────────────────────────────────────────
calcularTotais();
renderGravidez();
