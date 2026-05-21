from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
DATA_FILE = 'data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'familia': {}, 'itens': [], 'registros': [], 'fotos': []}

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    return render_template('index.html', data=load_data())

@app.route('/api/familia', methods=['POST'])
def salvar_familia():
    data = load_data()
    data['familia'] = request.json
    save_data(data)
    return jsonify({'ok': True})

@app.route('/api/registros', methods=['POST'])
def adicionar_registro():
    data = load_data()
    reg = request.json
    reg['id'] = str(uuid.uuid4())
    reg['data'] = datetime.now().strftime('%d/%m/%Y')
    data['registros'].append(reg)
    save_data(data)
    return jsonify({'ok': True, 'registro': reg})

@app.route('/api/registros/<id>', methods=['DELETE'])
def deletar_registro(id):
    data = load_data()
    data['registros'] = [r for r in data['registros'] if r.get('id') != id]
    save_data(data)
    return jsonify({'ok': True})

@app.route('/api/itens', methods=['POST'])
def adicionar_item():
    data = load_data()
    item = request.json
    item['id'] = str(uuid.uuid4())
    item['comprado'] = False
    data['itens'].append(item)
    save_data(data)
    return jsonify({'ok': True, 'item': item})

@app.route('/api/itens/<id>', methods=['PUT'])
def atualizar_item(id):
    data = load_data()
    for item in data['itens']:
        if item.get('id') == id:
            item.update(request.json)
            break
    save_data(data)
    return jsonify({'ok': True})

@app.route('/api/itens/<id>', methods=['DELETE'])
def deletar_item(id):
    data = load_data()
    data['itens'] = [it for it in data['itens'] if it.get('id') != id]
    save_data(data)
    return jsonify({'ok': True})

@app.route('/api/fotos', methods=['POST'])
def adicionar_foto():
    data = load_data()
    foto = request.json
    foto['id'] = str(uuid.uuid4())
    foto['data'] = datetime.now().strftime('%d/%m/%Y')
    data['fotos'].append(foto)
    save_data(data)
    return jsonify({'ok': True, 'foto': foto})

@app.route('/api/fotos/<id>', methods=['DELETE'])
def deletar_foto(id):
    data = load_data()
    data['fotos'] = [f for f in data['fotos'] if f.get('id') != id]
    save_data(data)
    return jsonify({'ok': True})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
