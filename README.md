# 👶 Site do Bebê — Guia Completo

## O que está neste projeto

```
bebe_site/
├── app.py              ← servidor Python (Flask)
├── requirements.txt    ← bibliotecas necessárias
├── data.json           ← seus dados (criado automaticamente)
├── templates/
│   └── index.html      ← o site completo
└── static/             ← imagens, CSS extra (se precisar)
```

---

## PASSO 1 — Instalar Python

Se ainda não tem Python instalado:
- Windows: https://python.org/downloads → marque "Add to PATH"
- Mac: já vem instalado, ou instale pelo Homebrew: `brew install python`
- Linux: `sudo apt install python3 python3-pip`

Verifique: abra o terminal e digite:
```
python --version
```

---

## PASSO 2 — Baixar os arquivos

Extraia o ZIP em uma pasta, ex: `C:\MeusBebe` ou `~/bebe_site`

---

## PASSO 3 — Instalar as dependências

No terminal, entre na pasta do projeto:
```bash
cd bebe_site
pip install -r requirements.txt
```

---

## PASSO 4 — Rodar localmente

```bash
python app.py
```

Abra o navegador em: http://localhost:5000

---

## PASSO 5 — Colocar na internet (grátis!)

### Opção A: Render.com (mais fácil, recomendado)

1. Crie conta gratuita em https://render.com
2. Crie um arquivo `render.yaml` (já incluso)
3. Suba os arquivos no GitHub (passo 5B)
4. No Render: New → Web Service → conecte o GitHub → deploy!
5. Em minutos você terá um link tipo: https://bebe-nome.onrender.com

### Opção B: Subir no GitHub

1. Crie conta em https://github.com
2. Crie repositório novo (ex: "bebe-site")
3. Faça upload dos arquivos
4. Conecte ao Render

---

## Como funciona o código

- **app.py**: é o "servidor" — recebe as ações do site (salvar, deletar) e guarda em data.json
- **templates/index.html**: é o site em si — HTML + CSS + JavaScript
- **data.json**: arquivo onde ficam todas as suas informações salvas
- **Flask**: biblioteca Python que transforma seu código em um servidor web

