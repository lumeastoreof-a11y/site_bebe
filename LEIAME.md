# 🍼 Site do Bebê — Guia Passo a Passo

## O que é este projeto?

Um site completo para acompanhar a chegada do bebê, com:
- Informações da família (pai, mãe, nome do bebê)
- Evolução da gravidez semana a semana
- Lista de enxoval com preços e links
- Álbum de fotos

---

## PASSO 1 — Instalar o Python

Se ainda não tem o Python instalado:

1. Acesse: https://www.python.org/downloads/
2. Baixe a versão mais recente (3.11 ou superior)
3. Durante a instalação, marque "Add Python to PATH"
4. Para verificar, abra o terminal e digite:
   ```
   python --version
   ```

---

## PASSO 2 — Abrir o terminal na pasta do projeto

### Windows:
- Abra a pasta `bebe_site` no Explorer
- Segure Shift + clique com botão direito
- Selecione "Abrir janela do PowerShell aqui"

### Mac/Linux:
- Abra o Terminal
- Digite: `cd caminho/para/bebe_site`

---

## PASSO 3 — Instalar as dependências

No terminal, dentro da pasta `bebe_site`, execute:

```bash
pip install flask
```

Aguarde instalar (aparecerá "Successfully installed flask").

---

## PASSO 4 — Rodar o site localmente

```bash
python app.py
```

Você verá:
```
🍼  Site do bebê rodando em: http://localhost:5000
```

Abra o navegador e acesse: **http://localhost:5000**

Para parar o servidor: pressione `Ctrl + C` no terminal.

---

## PASSO 5 — Colocar na internet (deploy gratuito)

### Opção A: Railway (recomendado, mais simples)

1. Crie uma conta gratuita em: https://railway.app
2. Instale o Git: https://git-scm.com
3. No terminal:
   ```bash
   git init
   git add .
   git commit -m "Site do bebê"
   ```
4. No Railway, clique em "New Project" → "Deploy from GitHub"
5. Conecte sua conta GitHub e faça o upload
6. O Railway gera um link público automaticamente!

### Opção B: Render (também gratuito)

1. Crie uma conta em: https://render.com
2. Crie o arquivo `Procfile` na pasta (já incluído abaixo)
3. Faça upload pelo GitHub
4. Selecione "Web Service" e aponte para seu repositório

---

## Estrutura dos arquivos

```
bebe_site/
├── app.py              ← Servidor Python (cérebro do site)
├── requirements.txt    ← Lista de dependências
├── dados.json          ← Seus dados salvos (criado automaticamente)
├── templates/
│   └── index.html      ← Página HTML do site
└── static/
    ├── css/
    │   └── style.css   ← Estilos visuais
    ├── js/
    │   └── app.js      ← Lógica do navegador
    └── uploads/        ← Fotos que você enviar
```

---

## Como o Python funciona aqui?

- **Flask** é uma biblioteca que transforma o Python num servidor web
- `app.py` define as "rotas" (endereços como `/api/itens`)
- Quando você clica em "Adicionar item", o navegador envia os dados para o Python
- O Python salva tudo no arquivo `dados.json`
- Quando você abre o site, o Python lê o `dados.json` e monta a página

---

## Dúvidas frequentes

**O site some quando fecho o terminal?**
Sim, enquanto for local. Na internet (Railway/Render) fica sempre online.

**Como faço backup dos dados?**
Copie o arquivo `dados.json` — ele tem tudo.

**Posso mudar as cores?**
Sim! Edite o arquivo `static/css/style.css`.

---

Feito com 💗 para a família que está chegando!
