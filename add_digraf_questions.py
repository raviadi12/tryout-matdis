import urllib.request
import json

url = 'https://milsxzovqaurhftzdpzc.supabase.co/rest/v1/questions'
headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbHN4em92cWF1cmhmdHpkcHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjg0MjMsImV4cCI6MjEwODkwNDQyM30.1Yo9R1lljfarXSNRdQUbuSJ5C1dkxHHXGub4e2A5ft4',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbHN4em92cWF1cmhmdHpkcHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjg0MjMsImV4cCI6MjEwODkwNDQyM30.1Yo9R1lljfarXSNRdQUbuSJ5C1dkxHHXGub4e2A5ft4',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

matrix_and_digraf_questions = [
    {
        'topic': 'Relasi Bagian 1',
        'question': 'Diberikan himpunan $A = \\{1, 2, 3\\}$ dan $B = \\{1, 2\\}$. Relasi $R$ dari $A$ ke $B$ didefinisikan dengan aturan: $a \\, R \\, b \\iff a > b$. Bentuk matriks representasi relasi $M_R$ (dengan baris $1, 2, 3$ dan kolom $1, 2$) adalah:\n\n[VISUAL:MATRIX:3x2:[[0,0],[1,0],[1,1]]]',
        'options': [
            {'key': 'A', 'text': '$\\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$'},
            {'key': 'B', 'text': '$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$'},
            {'key': 'C', 'text': '$\\begin{pmatrix} 0 & 1 \\\\ 1 & 1 \\\\ 0 & 0 \\end{pmatrix}$'},
            {'key': 'D', 'text': '$\\begin{pmatrix} 1 & 1 \\\\ 0 & 0 \\\\ 1 & 1 \\end{pmatrix}$'},
            {'key': 'E', 'text': '$\\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$'}
        ],
        'correct_answer': 'A',
        'explanation': 'Pasangan terurut yang memenuhi kondisi $a > b$ adalah:\n- Dari $1$: tidak ada elemen di $B$ yang $< 1$ $\\implies (0, 0)$\n- Dari $2$: $2 > 1$ $\\implies (2, 1) \\in R$, namun $2 \\ngtr 2 \\implies (1, 0)$\n- Dari $3$: $3 > 1$ dan $3 > 2$ $\\implies (3, 1), (3, 2) \\in R \\implies (1, 1)$\nSehingga himpunan relasi $R = \\{(2,1), (3,1), (3,2)\\}$, dan matriks representasinya adalah:\n$M_R = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$.'
    },
    {
        'topic': 'Relasi Bagian 1',
        'question': 'Perhatikan graf berarah (digraf) berikut pada himpunan simpul $V = \\{1, 2, 3, 4\\}$:\n\n[VISUAL:DIGRAF:4nodes:edges:1-1,1-3,2-1,2-3,2-4,3-1,3-2,4-1]\n\nBerdasarkan digraf di atas, manakah himpunan pasangan terurut relasi $R$ yang tepat?',
        'options': [
            {'key': 'A', 'text': '$R = \\{(1,1), (1,3), (2,1), (2,3), (2,4), (3,1), (3,2), (4,1)\\}$'},
            {'key': 'B', 'text': '$R = \\{(1,2), (2,3), (3,4), (4,1), (1,1)\\}$'},
            {'key': 'C', 'text': '$R = \\{(1,3), (2,1), (2,4), (3,2), (4,1)\\}$'},
            {'key': 'D', 'text': '$R = \\{(1,1), (2,2), (3,3), (4,4), (1,3), (3,1)\\}$'},
            {'key': 'E', 'text': '$R = \\{(1,4), (2,3), (3,2), (4,1)\\}$'}
        ],
        'correct_answer': 'A',
        'explanation': 'Mari telusuri busur panah dari setiap simpul pada digraf:\n- Simpul 1: memiliki self-loop ke dirinya sendiri $(1, 1)$ dan busur ke 3 $(1, 3)$.\n- Simpul 2: memiliki 3 busur keluar, yaitu ke 1 $(2, 1)$, ke 3 $(2, 3)$, dan ke 4 $(2, 4)$.\n- Simpul 3: memiliki busur ke 1 $(3, 1)$ dan busur ke 2 $(3, 2)$.\n- Simpul 4: memiliki busur keluar ke 1 $(4, 1)$.\nTotal pasangan pada relasi $R$ adalah $\\{(1,1), (1,3), (2,1), (2,3), (2,4), (3,1), (3,2), (4,1)\\}$.'
    },
    {
        'topic': 'Relasi Bagian 1',
        'question': 'Diberikan graf berarah (digraf) pada himpunan $\\{1, 2, 3, 4\\}$ berikut:\n\n[VISUAL:DIGRAF:4nodes:edges:1-2,2-3,3-4,4-1]\n\nManakah pernyataan yang BENAR mengenai sifat relasi dari digraf tersebut?',
        'options': [
            {'key': 'A', 'text': 'Bersifat refleksif karena semua simpul terhubung membentuk siklus'},
            {'key': 'B', 'text': 'Bersifat simetris karena setiap simpul memiliki derajat masuk dan keluar sama'},
            {'key': 'C', 'text': 'Bersifat irefleksif dan asimetris, serta tidak transitif'},
            {'key': 'D', 'text': 'Bersifat ekuivalensi'},
            {'key': 'E', 'text': 'Merupakan relasi terurut parsial (POSET)'}
        ],
        'correct_answer': 'C',
        'explanation': '1. **Irefleksif**: Tidak ada satu pun gelang (*self-loop*) pada setiap simpul, sehingga $(a,a) \\notin R$ untuk semua $a$.\n2. **Asimetris**: Jika ada busur dari $u$ ke $v$ (misal $1 \\to 2$), tidak pernah ada busur bolak-balik $2 \\to 1$.\n3. **Tidak Transitif**: Terdapat $1 \\to 2$ dan $2 \\to 3$, namun tidak ada busur langsung $1 \\to 3$.\nMaka relasi bersifat irefleksif dan asimetris, serta tidak transitif.'
    },
    {
        'topic': 'Relasi Bagian 2',
        'question': 'Diberikan matriks relasi $M_R = \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}$ dan $M_S = \\begin{pmatrix} 0 & 1 & 0 \\\\ 1 & 0 & 1 \\\\ 0 & 1 & 0 \\end{pmatrix}$. Hasil operasi gabungan relasi $R \\cup S$ dinyatakan oleh matriks boolean $M_{R \\cup S} = M_R \\lor M_S$, yaitu:\n\n[VISUAL:MATRIX:3x3:[[1,1,1],[1,1,1],[1,1,1]]]',
        'options': [
            {'key': 'A', 'text': '$\\begin{pmatrix} 1 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 1 \\end{pmatrix}$ (seluruh elemen bernilai $1$)'},
            {'key': 'B', 'text': '$\\begin{pmatrix} 0 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$'},
            {'key': 'C', 'text': '$\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$'},
            {'key': 'D', 'text': '$\\begin{pmatrix} 0 & 1 & 1 \\\\ 1 & 0 & 1 \\\\ 1 & 1 & 0 \\end{pmatrix}$'},
            {'key': 'E', 'text': '$\\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & 1 & 1 \\\\ 1 & 0 & 1 \\end{pmatrix}$'}
        ],
        'correct_answer': 'A',
        'explanation': 'Operasi gabungan relasi berkorespondensi dengan disjungsi bit demi bit (operasi boolean OR $\\lor$):\n$m_{ij}^{(R \\cup S)} = m_{ij}^R \\lor m_{ij}^S$.\n- Baris 1: $[1\\lor 0, 0\\lor 1, 1\\lor 0] = [1, 1, 1]$\n- Baris 2: $[0\\lor 1, 1\\lor 0, 0\\lor 1] = [1, 1, 1]$\n- Baris 3: $[1\\lor 0, 0\\lor 1, 1\\lor 0] = [1, 1, 1]$\nSehingga seluruh elemen pada matriks $M_{R \\cup S}$ bernilai 1.'
    },
    {
        'topic': 'Relasi Bagian 2',
        'question': 'Diketahui relasi $R$ pada himpunan $\\{1, 2, 3\\}$ memiliki matriks representasi $M_R = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$. Matriks representasi dari komposisi relasi dengan dirinya sendiri, $M_{R^2} = M_R \\odot M_R$, adalah:\n\n[VISUAL:MATRIX:3x3:[[0,0,1],[0,0,0],[0,0,0]]]',
        'options': [
            {'key': 'A', 'text': '$\\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$'},
            {'key': 'B', 'text': '$\\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$'},
            {'key': 'C', 'text': '$\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$'},
            {'key': 'D', 'text': '$\\begin{pmatrix} 0 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$'},
            {'key': 'E', 'text': '$\\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}$'}
        ],
        'correct_answer': 'A',
        'explanation': 'Perkalian boolean $M_R \\odot M_R$:\nRelasi $R = \\{(1, 2), (2, 3)\\}$.\nRantai jalan dengan panjang 2 menghubungkan $1 \\to 2 \\to 3$, yang berarti $(1, 3) \\in R^2$. Tidak ada rantai panjang 2 lainnya.\nOleh karena itu, satu-satunya elemen bernilai 1 pada $M_{R^2}$ adalah pada posisi baris 1 kolom 3 ($m_{13} = 1$), sedangkan posisi lainnya 0:\n$M_{R^2} = \\begin{pmatrix} 0 & 0 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$.'
    }
]

req = urllib.request.Request(url, data=json.dumps(matrix_and_digraf_questions).encode('utf-8'), headers=headers, method='POST')
with urllib.request.urlopen(req) as resp:
    print('Inserted new matrix & digraf questions! Status:', resp.status)

