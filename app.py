from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/api/collatz', methods=['POST'])
def collatz():
    data = request.get_json()
    try:
        n = int(data.get('number', 0))
    except (ValueError, TypeError):
        return jsonify({'error': 'Input tidak valid'}), 400
        
    if n <= 0:
        return jsonify({'error': 'Masukkan bilangan bulat positif'}), 400
        
    sequence = [n]
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        sequence.append(n)
        
    return jsonify({
        'sequence': sequence,
        'peak': max(sequence),
        'stopping_time': len(sequence) - 1
    })

@app.route('/api/quiz/generate', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    level = int(data.get('level', 1))
    
    questions = []
    
    for i in range(3):
        seq = []
        q_type = 'text'
        options = []
        ans = ""
        
        # Determine number of options based on level (starts at 3, max 6)
        num_options = min(6, 3 + (level - 1) // 3)

        if level % 10 == 0:
            q_type = 'drag'
            types = ['alphabet', 'emoji']
            t = random.choice(types)
            if t == 'alphabet':
                start = random.randint(65, 80)
                step = random.randint(1, 3)
                seq = [chr(start + j*step) for j in range(5)]
                
                options = [seq[j] for j in range(5)]
                while len(options) < num_options:
                    distractor = chr(start + random.randint(-5, 10)*step)
                    if distractor not in options and 65 <= ord(distractor) <= 90:
                        options.append(distractor)
            else:
                emojis = ['🌞', '🌙', '⭐', '☁️', '⚡', '❄️']
                offset = random.randint(0, len(emojis)-1)
                seq = [emojis[(j+offset)%3] for j in range(5)]
                
                options = list(set(seq))
                while len(options) < num_options:
                    distractor = random.choice(emojis)
                    if distractor not in options:
                        options.append(distractor)
                        
        elif level <= 3:
            q_type = 'drag'
            
            # Level 1: Konstan (A-A-A-A-A)
            # Level 2: Selang-seling 2 elemen (A-B-A-B-A)
            # Level 3: Pengulangan 3 elemen (A-B-C-A-B)
            
            groups = [
                ['Senang', 'Sedih', 'Marah'],
                ['Pagi', 'Siang', 'Malam'],
                ['Titik', 'Garis', 'Segitiga'],
                ['Matahari', 'Bulan', 'Bintang'],
                ['Satu', 'Dua', 'Tiga']
            ]
            
            group = random.choice(groups)
            
            if level == 1:
                word = random.choice(group)
                seq = [word for _ in range(5)]
            elif level == 2:
                w1, w2 = random.sample(group, 2)
                seq = [w1, w2, w1, w2, w1]
            else:
                # Untuk level 3, pertahankan urutan logis
                offset = random.randint(0, 2)
                seq = [group[(j+offset)%3] for j in range(5)]
                
            options = list(set(seq))
            
            # Tambahkan distractor dari grup lain agar masuk akal
            while len(options) < num_options:
                other_group = random.choice([g for g in groups if g != group])
                distractor = random.choice(other_group)
                if distractor not in options:
                    options.append(distractor)
                    
        else:
            q_type = 'text'
            complexity = (level - 1) // 3
            
            if level == 4:
                # Level 4: Pengenalan angka awal, selalu urutan +1 (misal 1, 2, 3, 4, 5)
                start = random.randint(1, 3)
                seq = [start + j for j in range(5)]
            elif complexity == 1:
                # Level 5-6: Aritmatika dasar angka kecil (di bawah 20)
                # Level 5 khusus positif ('up'), Level 6 baru acak
                t = 'up' if level == 5 else random.choice(['up', 'down'])
                if t == 'up':
                    start = random.randint(1, 5)
                    diff = random.randint(2, 3)
                    seq = [start + j*diff for j in range(5)]
                else:
                    start = random.randint(10, 20)
                    diff = random.randint(1, 3)
                    seq = [start - j*diff for j in range(5)]
            elif complexity == 2:
                # Level 7-9: Geometri ringan atau pola 2 fase (1,4,7, 2,5,8)
                t = random.choice(['geom', 'two_phase_6'])
                if t == 'geom':
                    start = random.randint(2, 5)
                    mult = random.randint(2, 3)
                    seq = [start * (mult**j) for j in range(5)]
                else:
                    # Pola 2 fase (6 elemen) seperti 1,4,7, 2,5,8
                    start1 = random.randint(1, 3)
                    diff = random.randint(2, 4)
                    start2 = start1 + 1
                    seq = [start1 + j*diff for j in range(3)] + [start2 + j*diff for j in range(3)]
            else:
                # Level 11+, Fibonacci, Alternate, atau pola 2 fase (8 elemen)
                t = random.choice(['fib', 'alt', 'two_phase_8'])
                if t == 'fib':
                    a = random.randint(1, 3)
                    b = random.randint(1, 3)
                    seq = [a, b, a+b, a+2*b, 2*a+3*b, 3*a+5*b, 5*a+8*b] # 7 elemen
                elif t == 'alt':
                    start = random.randint(10, 20)
                    add = random.randint(2, 5)
                    sub = random.randint(1, 3)
                    seq = [start, start+add, start+add-sub, start+2*add-sub, start+2*add-2*sub, start+3*add-2*sub] # 6 elemen
                else:
                    # Pola seperti 1,3,5,7, 2,4,6,8
                    start1 = random.randint(1, 2)
                    diff = random.randint(2, 3)
                    start2 = start1 + 1 if start1 == 1 else start1 - 1
                    seq = [start1 + j*diff for j in range(4)] + [start2 + j*diff for j in range(4)]

        seq = [str(x) for x in seq]
        missing_idx = random.randint(0, len(seq) - 1)
        ans = seq[missing_idx]
        seq[missing_idx] = "?"
        
        if q_type == 'drag':
            options = [str(o) for o in options]
            random.shuffle(options)
            
        questions.append({
            "id": i, 
            "type": q_type,
            "sequence": seq, 
            "options": options,
            "answer": ans.lower() if q_type == 'drag' else ans
        })
                
    return jsonify({"questions": questions})

if __name__ == '__main__':
    # Hosting agar bisa diakses di jaringan LAN
    app.run(host='0.0.0.0', port=5000, debug=True)
