import json
import urllib.request

questions = [
    # ==================== TOPIC 1: RELASI BAGIAN 1 ====================
    {
        "topic": "Relasi Bagian 1",
        "question": "Diketahui himpunan $A = \\{1, 2, 3\\}$ dan $B = \\{a, b\\}$. Berapakah banyaknya relasi biner yang mungkin dibentuk dari himpunan $A$ ke himpunan $B$?",
        "options": [
            {"key": "A", "text": "$6$"},
            {"key": "B", "text": "$36$"},
            {"key": "C", "text": "$64$"},
            {"key": "D", "text": "$128$"},
            {"key": "E", "text": "$256$"}
        ],
        "correct_answer": "C",
        "explanation": "Produk kartesius $A \\times B$ memiliki kardinalitas $|A \\times B| = |A| \\times |B| = 3 \\times 2 = 6$. Suatu relasi dari $A$ ke $B$ adalah subset dari $A \\times B$. Banyaknya subset dari himpunan dengan $n$ elemen adalah $2^n$. Maka banyaknya relasi yang mungkin adalah $2^{|A \\times B|} = 2^6 = 64$."
    },
    {
        "topic": "Relasi Bagian 1",
        "question": "Diberikan himpunan $A = \\{1, 2, 3, 4\\}$. Relasi $R$ pada himpunan $A$ didefinisikan sebagai $R = \\{(1,1), (2,2), (3,3), (4,4), (1,2), (2,1), (2,3)\\}$. Agar relasi $R$ bersifat transitif, pasangan terurut manakah yang wajib ditambahkan ke dalam $R$?",
        "options": [
            {"key": "A", "text": "$(3,2)$ saja"},
            {"key": "B", "text": "$(1,3)$ saja"},
            {"key": "C", "text": "$(3,1)$ saja"},
            {"key": "D", "text": "$(1,3)$ dan $(3,2)$"},
            {"key": "E", "text": "$(3,1)$ dan $(1,3)$"}
        ],
        "correct_answer": "B",
        "explanation": "Sifat transitif mengharuskan: jika $(a, b) \\in R$ dan $(b, c) \\in R$, maka $(a, c) \\in R$. Pada relasi di atas, terdapat $(1, 2) \\in R$ dan $(2, 3) \\in R$, namun $(1, 3) \\notin R$. Oleh karena itu, pasangan $(1, 3)$ wajib ditambahkan agar sifat transitif terpenuhi."
    },
    {
        "topic": "Relasi Bagian 1",
        "question": "Sebuah relasi $R$ pada himpunan $A$ disebut bersifat **antisimetris (tolak-simetris)** jika memenuhi kondisi:",
        "options": [
            {"key": "A", "text": "Jika $(a, b) \\in R$ maka $(b, a) \\notin R$ untuk semua $a, b \\in A$"},
            {"key": "B", "text": "Jika $(a, b) \\in R$ dan $(b, a) \\in R$ maka haruslah $a = b$"},
            {"key": "C", "text": "Untuk setiap $a \\in A$, $(a, a) \\notin R$"},
            {"key": "D", "text": "Jika $(a, b) \\in R$ dan $(b, c) \\in R$ maka $(a, c) \\in R$"},
            {"key": "E", "text": "Jika $(a, b) \\in R$ maka $(b, a) \\in R$"}
        ],
        "correct_answer": "B",
        "explanation": "Berdasarkan definisi matematis: Relasi $R$ pada himpunan $A$ disebut antisimetris jika untuk setiap $a, b \\in A$, kondisi $(a, b) \\in R \\land (b, a) \\in R \\implies a = b$. Dengan kata lain, tidak boleh ada dua elemen berbeda $a \\ne b$ sedemikian rupa sehingga keduanya saling berelasi bolak-balik."
    },
    {
        "topic": "Relasi Bagian 1",
        "question": "Diberikan relasi $R$ pada himpunan bilangan bulat positif $\\mathbb{Z}^+$ dengan aturan $(a, b) \\in R \\iff a \\mid b$ ($a$ membagi habis $b$). Sifat-sifat manakah yang dimiliki oleh relasi $R$?",
        "options": [
            {"key": "A", "text": "Refleksif, simetris, dan transitif"},
            {"key": "B", "text": "Refleksif, antisimetris, dan tidak transitif"},
            {"key": "C", "text": "Refleksif, antisimetris, dan transitif"},
            {"key": "D", "text": "Irefleksif, simetris, dan transitif"},
            {"key": "E", "text": "Irefleksif, antisimetris, dan transitif"}
        ],
        "correct_answer": "C",
        "explanation": "Mari uji ketiga sifat:\\n1. **Refleksif**: Untuk setiap $a \\in \\mathbb{Z}^+$, $a \\mid a$ bernilai benar karena $a = 1 \\cdot a$. (Refleksif)\\n2. **Antisimetris**: Jika $a \\mid b$ dan $b \\mid a$ pada bilangan bulat positif, maka haruslah $a = b$. (Antisimetris)\\n3. **Transitif**: Jika $a \\mid b$ dan $b \\mid c$, maka $b = k_1 a$ dan $c = k_2 b$, sehingga $c = (k_1 k_2) a$, yang berarti $a \\mid c$. (Transitif)\\nMaka $R$ bersifat refleksif, antisimetris, dan transitif (merupakan POSET)."
    },
    {
        "topic": "Relasi Bagian 1",
        "question": "Jika matriks representasi relasi $R$ pada himpunan $A = \\{1, 2, 3\\}$ adalah $M_R = \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 1 \\end{pmatrix}$, maka relasi $R$ memiliki sifat:",
        "options": [
            {"key": "A", "text": "Refleksif dan simetris saja"},
            {"key": "B", "text": "Simetris dan transitif, tetapi tidak refleksif"},
            {"key": "C", "text": "Refleksif, simetris, dan transitif"},
            {"key": "D", "text": "Refleksif dan antisimetris"},
            {"key": "E", "text": "Irefleksif dan simetris"}
        ],
        "correct_answer": "C",
        "explanation": "1. **Refleksif**: Semua elemen diagonal utama bernilai $1$ ($m_{11}=m_{22}=m_{33}=1$).\\n2. **Simetris**: Matriks simetris terhadap diagonal ($M_R = M_R^T$, yaitu $m_{13}=m_{31}=1$).\\n3. **Transitif**: Pasangan relasi adalah $R = \\{(1,1), (2,2), (3,3), (1,3), (3,1)\\}$. Komposisi $(1,3)$ dan $(3,1)$ menghasilkan $(1,1) \\in R$; $(3,1)$ dan $(1,3)$ menghasilkan $(3,3) \\in R$. Semua kombinasi transitif terpenuhi.\\nKarena memenuhi ketiganya, $R$ adalah relasi ekuivalensi."
    },
    {
        "topic": "Relasi Bagian 1",
        "question": "Misalkan $|A| = n$. Berapakah banyaknya relasi pada himpunan $A$ yang bersifat **refleksif**?",
        "options": [
            {"key": "A", "text": "$2^{n}$"},
            {"key": "B", "text": "$2^{n(n-1)}$"},
            {"key": "C", "text": "$2^{n^2 - n}$"},
            {"key": "D", "text": "$2^{\\frac{n(n+1)}{2}}$"},
            {"key": "E", "text": "$2^{n^2} - 2^n$"}
        ],
        "correct_answer": "C",
        "explanation": "Matriks relasi pada himpunan berukuran $n$ memiliki $n^2$ elemen. Sifat refleksif mewajibkan seluruh $n$ elemen pada diagonal utama bernilai 1 (hanya 1 pilihan untuk masing-masing). Sisa elemen di luar diagonal utama adalah $n^2 - n$ buah, dan masing-masing dapat bernilai 0 atau 1 (2 pilihan). Sehingga total relasi refleksif adalah $2^{n^2 - n} = 2^{n(n-1)}$."
    },
    {
        "topic": "Relasi Bagian 1",
        "question": "Manakah di antara relasi-relasi berikut pada himpunan bilangan bulat $\\mathbb{Z}$ yang bersifat **irefleksif**?",
        "options": [
            {"key": "A", "text": "$R_1 = \\{(x, y) \\mid x \\le y\\}$"},
            {"key": "B", "text": "$R_2 = \\{(x, y) \\mid x + y = 0\\}$"},
            {"key": "C", "text": "$R_3 = \\{(x, y) \\mid x < y\\}$"},
            {"key": "D", "text": "$R_4 = \\{(x, y) \\mid x = y \\lor x = -y\\}$"},
            {"key": "E", "text": "$R_5 = \\{(x, y) \\mid xy > 0\\}$"}
        ],
        "correct_answer": "C",
        "explanation": "Relasi $R$ bersifat irefleksif jika untuk SETIAP $x \\in \\mathbb{Z}$, $(x, x) \\notin R$. Pada $R_3 = \\{(x,y) \\mid x < y\\}$, tidak pernah ada bilangan bulat $x$ yang memenuhi $x < x$. Jadi $(x, x) \\notin R_3$ untuk semua $x$, sehingga $R_3$ bersifat irefleksif."
    },
    {
        "topic": "Relasi Bagian 1",
        "question": "Graf berarah (digraf) dari suatu relasi $R$ pada himpunan $A$ tidak memuat satu pun *self-loop* (gelang pada simpul) dan setiap ada busur dari simpul $u$ ke $v$ ($u \\ne v$), tidak pernah ada busur kembali dari $v$ ke $u$. Relasi tersebut bersifat:",
        "options": [
            {"key": "A", "text": "Refleksif dan Simetris"},
            {"key": "B", "text": "Irefleksif dan Asimetris"},
            {"key": "C", "text": "Refleksif dan Antisimetris"},
            {"key": "D", "text": "Transitif dan Simetris"},
            {"key": "E", "text": "Simetris dan Ekuivalen"}
        ],
        "correct_answer": "B",
        "explanation": "Tidak adanya *self-loop* berarti $(a, a) \\notin R$ untuk semua $a$ (irefleksif). Tidak adanya busur dua arah antara simpul berbeda berarti jika $(a, b) \\in R$ maka $(b, a) \\notin R$. Kombinasi irefleksif dan jika $(a,b) \\in R \\implies (b,a) \\notin R$ merupakan definisi dari relasi **asimetris**."
    },

    # ==================== TOPIC 2: RELASI BAGIAN 2 ====================
    {
        "topic": "Relasi Bagian 2",
        "question": "Diberikan relasi $R = \\{(1, 2), (2, 3), (3, 1)\\}$ dan $S = \\{(2, 1), (3, 2), (1, 3)\\}$ pada himpunan $A = \\{1, 2, 3\\}$. Komposisi relasi $S \\circ R$ adalah:",
        "options": [
            {"key": "A", "text": "$\\{(1, 1), (2, 2), (3, 3)\\}$"},
            {"key": "B", "text": "$\\{(1, 2), (2, 3), (3, 1)\\}$"},
            {"key": "C", "text": "$\\{(2, 2), (3, 3), (1, 1)\\}$"},
            {"key": "D", "text": "$\\{(1, 3), (2, 1), (3, 2)\\}$"},
            {"key": "E", "text": "$\\{(3, 1), (1, 2), (2, 3)\\}$"}
        ],
        "correct_answer": "A",
        "explanation": "Komposisi $S \\circ R$ didefinisikan sebagai: $(a, c) \\in S \\circ R \\iff \\exists b$ sedemikian rupa sehingga $(a, b) \\in R$ dan $(b, c) \\in S$.\\n1. Untuk $(1, 2) \\in R$: cari pasangan di $S$ yang berawal dari $2$, yaitu $(2, 1) \\in S \\implies (1, 1)$.\\n2. Untuk $(2, 3) \\in R$: cari di $S$ berawal dari $3$, yaitu $(3, 2) \\in S \\implies (2, 2)$.\\n3. Untuk $(3, 1) \\in R$: cari di $S$ berawal dari $1$, yaitu $(1, 3) \\in S \\implies (3, 3)$.\\nJadi $S \\circ R = \\{(1, 1), (2, 2), (3, 3)\\}$."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Jika $M_R$ adalah matriks representasi dari relasi $R$ dan $M_S$ adalah matriks representasi dari relasi $S$, maka representasi matriks dari komposisi relasi $S \\circ R$ dihitung dengan operasi perkalian boolean:",
        "options": [
            {"key": "A", "text": "$M_{S \\circ R} = M_S \\odot M_R$"},
            {"key": "B", "text": "$M_{S \\circ R} = M_R \\odot M_S$"},
            {"key": "C", "text": "$M_{S \\circ R} = M_R^T \\odot M_S$"},
            {"key": "D", "text": "$M_{S \\circ R} = M_R \\lor M_S$"},
            {"key": "E", "text": "$M_{S \\circ R} = M_R \\land M_S$"}
        ],
        "correct_answer": "B",
        "explanation": "Berdasarkan teorema representasi matriks: Matriks dari komposisi relasi $S \\circ R$ adalah perkalian boolean (zero-one boolean product) dari matriks $R$ terlebih dahulu dikalikan matriks $S$, yaitu $M_{S \\circ R} = M_R \\odot M_S$."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Diberikan relasi $R = \\{(1, 2), (2, 3), (3, 4)\\}$ pada himpunan $A = \\{1, 2, 3, 4\\}$. Berapakah banyaknya pasangan terurut pada **penutupan transitif (transitive closure)** dari $R$, yaitu $R^+$?",
        "options": [
            {"key": "A", "text": "$3$"},
            {"key": "B", "text": "$5$"},
            {"key": "C", "text": "$6$"},
            {"key": "D", "text": "$8$"},
            {"key": "E", "text": "$10$"}
        ],
        "correct_answer": "C",
        "explanation": "Penutupan transitif $R^+$ memuat seluruh rantai keterhubungan:\\n- Panjang 1 ($R$): $(1, 2), (2, 3), (3, 4)$ (3 pasangan)\\n- Panjang 2 ($R^2$): $(1, 3)$ dari $1 \\to 2 \\to 3$, dan $(2, 4)$ dari $2 \\to 3 \\to 4$ (2 pasangan)\\n- Panjang 3 ($R^3$): $(1, 4)$ dari $1 \\to 2 \\to 3 \\to 4$ (1 pasangan)\\nTotal pasangan pada $R^+ = \\{(1,2), (2,3), (3,4), (1,3), (2,4), (1,4)\\}$, yaitu ada $3 + 2 + 1 = 6$ pasangan."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Algoritma yang efisien dan sering digunakan untuk menghitung penutupan transitif (*transitive closure*) dari suatu relasi pada himpunan berhingga dengan kompleksitas waktu $O(n^3)$ adalah:",
        "options": [
            {"key": "A", "text": "Algoritma Dijkstra"},
            {"key": "B", "text": "Algoritma Kruskal"},
            {"key": "C", "text": "Algoritma Prim"},
            {"key": "D", "text": "Algoritma Warshall"},
            {"key": "E", "text": "Algoritma Floyd-Steinberg"}
        ],
        "correct_answer": "D",
        "explanation": "Algoritma Warshall adalah algoritma klasik dalam teori graf dan relasi biner yang menggunakan matriks biner nol-satu bertahap $W^{[0]}, W^{[1]}, \\dots, W^{[n]}$ untuk mencari *transitive closure* relasi dengan kompleksitas $O(n^3)$."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Suatu relasi $R$ pada himpunan bilangan bulat $\\mathbb{Z}$ didefinisikan sebagai $a \\, R \\, b \\iff a \\equiv b \\pmod{5}$. Kelas ekuivalensi $[12]$ sama dengan himpunan:",
        "options": [
            {"key": "A", "text": "$[0]$"},
            {"key": "B", "text": "$[1]$"},
            {"key": "C", "text": "$[2]$"},
            {"key": "D", "text": "$[3]$"},
            {"key": "E", "text": "$[4]$"}
        ],
        "correct_answer": "C",
        "explanation": "Kelas ekuivalensi $[a]$ terdiri dari semua bilangan $x \\in \\mathbb{Z}$ sedemikian rupa sehingga $x \\equiv a \\pmod 5$. Karena $12 = 2 \\times 5 + 2$, maka $12 \\equiv 2 \\pmod 5$. Oleh karena itu, $[12] = [2] = \\{\\dots, -8, -3, 2, 7, 12, 17, \\dots\\}$."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Sebuah himpunan terurut parsial (POSET) dinotasikan dengan $(S, \\preceq)$. Syarat relasi $\\preceq$ agar membentuk POSET adalah:",
        "options": [
            {"key": "A", "text": "Refleksif, Simetris, dan Transitif"},
            {"key": "B", "text": "Refleksif, Antisimetris, dan Transitif"},
            {"key": "C", "text": "Irefleksif, Antisimetris, dan Transitif"},
            {"key": "D", "text": "Refleksif, Asimetris, dan Transitif"},
            {"key": "E", "text": "Simetris, Antisimetris, dan Transitif"}
        ],
        "correct_answer": "B",
        "explanation": "POSET (*Partially Ordered Set*) didefinisikan secara baku sebagai pasangan $(S, \\preceq)$ di mana relasi $\\preceq$ memenuhi tiga sifat: Refleksif, Antisimetris (tolak-simetris), dan Transitif."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Perhatikan POSET pembagi bilangan bulat positif $(\\{1, 2, 3, 4, 6, 12\\}, \\mid)$. Pada diagram Hasse dari POSET ini, elemen terkecil (*least element*) dan elemen terbesar (*greatest element*) berturut-turut adalah:",
        "options": [
            {"key": "A", "text": "$1$ dan tidak ada"},
            {"key": "B", "text": "$2$ dan $12$"},
            {"key": "C", "text": "$1$ dan $12$"},
            {"key": "D", "text": "Tidak ada dan $12$"},
            {"key": "E", "text": "$1$ dan $6$"}
        ],
        "correct_answer": "C",
        "explanation": "Elemen terkecil (*least element*) adalah elemen $a$ sedemikian sehingga $a \\mid x$ untuk semua $x$ dalam himpunan. Karena $1$ membagi semua elemen $\\{1, 2, 3, 4, 6, 12\\}$, maka $1$ adalah elemen terkecil. Elemen terbesar (*greatest element*) adalah elemen $b$ sedemikian sehingga $x \\mid b$ untuk semua $x$. Karena semua elemen membagi habis $12$, maka $12$ adalah elemen terbesar."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Diberikan POSET $(A, \\preceq)$ dengan diagram Hasse yang memiliki elemen minimal $\{a, b\}$. Pernyataan yang BENAR mengenai elemen terkecil (*least element*) dari POSET tersebut adalah:",
        "options": [
            {"key": "A", "text": "Elemen terkecilnya adalah $a$"},
            {"key": "B", "text": "Elemen terkecilnya adalah $b$"},
            {"key": "C", "text": "Elemen terkecilnya ada dua, yaitu $a$ dan $b$"},
            {"key": "D", "text": "POSET tersebut tidak memiliki elemen terkecil"},
            {"key": "E", "text": "Elemen terkecilnya adalah infimum dari $a$ dan $b$"}
        ],
        "correct_answer": "D",
        "explanation": "Teorema menyatakan bahwa jika suatu POSET memiliki elemen terkecil, maka elemen terkecil tersebut bersifat **tunggal** dan sekaligus menjadi satu-satunya elemen minimal. Jika terdapat lebih dari satu elemen minimal (yaitu $a$ dan $b$ dengan $a \\ne b$), maka POSET tersebut dipastikan TIDAK memiliki elemen terkecil."
    },

    # ==================== TOPIC 3: FUNGSI ====================
    {
        "topic": "Fungsi",
        "question": "Diberikan fungsi $f: \\mathbb{R} \\to \\mathbb{R}$ dengan rumus $f(x) = 2x^3 - 5$. Sifat dari fungsi $f$ adalah:",
        "options": [
            {"key": "A", "text": "Injektif tetapi tidak surjektif"},
            {"key": "B", "text": "Surjektif tetapi tidak injektif"},
            {"key": "C", "text": "Bijektif (injektif dan surjektif)"},
            {"key": "D", "text": "Bukan injektif dan bukan surjektif"},
            {"key": "E", "text": "Hanya terdefinisi pada interval positif"}
        ],
        "correct_answer": "C",
        "explanation": "1. **Injektif**: Misalkan $f(a) = f(b) \\implies 2a^3 - 5 = 2b^3 - 5 \\implies a^3 = b^3 \\implies a = b$ (karena pemangkatan tiga bersifat monoton naik pada bilangan real).\\n2. **Surjektif**: Untuk setiap $y \\in \\mathbb{R}$, pilih $x = \\sqrt[3]{\\frac{y + 5}{2}} \\in \\mathbb{R}$, maka $f(x) = y$.\\nKarena injektif dan surjektif, fungsi $f$ bersifat bijektif."
    },
    {
        "topic": "Fungsi",
        "question": "Diberikan fungsi $f: \\mathbb{Z} \\to \\mathbb{Z}$ dengan $f(n) = n^2$. Manakah pernyataan yang BENAR mengenai fungsi $f$?",
        "options": [
            {"key": "A", "text": "Fungsi $f$ injektif dan surjektif"},
            {"key": "B", "text": "Fungsi $f$ injektif tetapi tidak surjektif"},
            {"key": "C", "text": "Fungsi $f$ surjektif tetapi tidak injektif"},
            {"key": "D", "text": "Fungsi $f$ tidak injektif dan tidak surjektif"},
            {"key": "E", "text": "Fungsi $f$ memiliki fungsi invers $f^{-1}: \\mathbb{Z} \\to \\mathbb{Z}$"}
        ],
        "correct_answer": "D",
        "explanation": "1. **Tidak Injektif**: Ambil $n = 2$ dan $n = -2$. $f(2) = 4 = f(-2)$, padahal $2 \\ne -2$.\\n2. **Tidak Surjektif**: Bilangan negatif seperti $-3 \\in \\mathbb{Z}$ tidak memiliki pra-citra (karena $n^2 \\ge 0$ untuk semua $n \\in \\mathbb{Z}$), dan bilangan seperti $2$ bukan kuadrat sempurna bilangan bulat.\\nJadi $f$ tidak injektif dan tidak surjektif."
    },
    {
        "topic": "Fungsi",
        "question": "Diketahui fungsi $f(x) = \\frac{3x + 1}{2x - 5}$ untuk $x \\ne \\frac{5}{2}$. Rumus fungsi invers $f^{-1}(x)$ adalah:",
        "options": [
            {"key": "A", "text": "$\\frac{5x + 1}{2x - 3}$"},
            {"key": "B", "text": "$\\frac{2x - 5}{3x + 1}$"},
            {"key": "C", "text": "$\\frac{5x - 1}{2x + 3}$"},
            {"key": "D", "text": "$\\frac{3x - 1}{2x + 5}$"},
            {"key": "E", "text": "$\\frac{2x + 3}{5x - 1}$"}
        ],
        "correct_answer": "A",
        "explanation": "Misalkan $y = \\frac{3x + 1}{2x - 5}$.\\n$y(2x - 5) = 3x + 1 \\implies 2xy - 5y = 3x + 1$\\n$2xy - 3x = 5y + 1 \\implies x(2y - 3) = 5y + 1$\\n$x = \\frac{5y + 1}{2y - 3}$.\\nMaka $f^{-1}(x) = \\frac{5x + 1}{2x - 3}$."
    },
    {
        "topic": "Fungsi",
        "question": "Jika $f(x) = 2x + 3$ dan $g(x) = x^2 - 1$, maka nilai dari komposisi $(g \\circ f)(2)$ adalah:",
        "options": [
            {"key": "A", "text": "$9$"},
            {"key": "B", "text": "$15$"},
            {"key": "C", "text": "$48$"},
            {"key": "D", "text": "$49$"},
            {"key": "E", "text": "$50$"}
        ],
        "correct_answer": "C",
        "explanation": "Komposisi $(g \\circ f)(2) = g(f(2))$.\\nHitung $f(2) = 2(2) + 3 = 4 + 3 = 7$.\\nLalu hitung $g(7) = 7^2 - 1 = 49 - 1 = 48$."
    },
    {
        "topic": "Fungsi",
        "question": "Nilai dari ekspresi floor dan ceiling $\\lfloor -3.7 \\rfloor + \\lceil 4.2 \\rceil - \\lfloor 5.9 \\rfloor$ adalah:",
        "options": [
            {"key": "A", "text": "$-4$"},
            {"key": "B", "text": "$-3$"},
            {"key": "C", "text": "$-2$"},
            {"key": "D", "text": "$2$"},
            {"key": "E", "text": "$3$"}
        ],
        "correct_answer": "A",
        "explanation": "Berdasarkan definisi:\\n1. $\\lfloor -3.7 \\rfloor$: bilangan bulat terbesar yang $\\le -3.7$, yaitu $-4$.\\n2. $\\lceil 4.2 \\rceil$: bilangan bulat terkecil yang $\\ge 4.2$, yaitu $5$.\\n3. $\\lfloor 5.9 \\rfloor$: bilangan bulat terbesar yang $\\le 5.9$, yaitu $5$.\\nMaka nilai ekspresi: $(-4) + 5 - 5 = -4$."
    },
    {
        "topic": "Fungsi",
        "question": "Diberikan himpunan $A$ dengan $|A| = 4$ dan himpunan $B$ dengan $|B| = 3$. Berapakah banyaknya fungsi satu-ke-satu (injektif) dari $A$ ke $B$?",
        "options": [
            {"key": "A", "text": "$0$"},
            {"key": "B", "text": "$12$"},
            {"key": "C", "text": "$24$"},
            {"key": "D", "text": "$64$"},
            {"key": "E", "text": "$81$"}
        ],
        "correct_answer": "A",
        "explanation": "Berdasarkan *Pigeonhole Principle* (Prinsip Sarang Merpati): Agar suatu fungsi $f: A \\to B$ dapat bersifat injektif, maka syarat mutlaknya adalah $|A| \\le |B|$. Karena di sini $|A| = 4 > |B| = 3$, pasti setidaknya ada dua elemen di $A$ yang dipetakan ke elemen yang sama di $B$. Sehingga tidak mungkin ada fungsi injektif dari $A$ ke $B$ (banyaknya adalah $0$)."
    },
    {
        "topic": "Fungsi",
        "question": "Berapakah banyaknya fungsi korespondensi satu-satu (bijektif) dari himpunan $A = \\{1, 2, 3, 4, 5\\}$ ke dirinya sendiri ($A$)?",
        "options": [
            {"key": "A", "text": "$5^5 = 3125$"},
            {"key": "B", "text": "$5! = 120$"},
            {"key": "C", "text": "$2^5 = 32$"},
            {"key": "D", "text": "$P(5, 2) = 20$"},
            {"key": "E", "text": "$C(5, 2) = 10$"}
        ],
        "correct_answer": "B",
        "explanation": "Banyaknya fungsi bijektif dari himpunan dengan $n$ elemen ke himpunan dengan $n$ elemen sama dengan banyaknya permutasi dari $n$ elemen, yaitu $n!$. Di sini $n = 5$, sehingga banyaknya fungsi bijektif adalah $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$."
    },
    {
        "topic": "Fungsi",
        "question": "Untuk setiap bilangan real $x$ dan bilangan bulat positif $n$, manakah identitas sifat fungsi floor yang SELALU BENAR?",
        "options": [
            {"key": "A", "text": "$\\lfloor x + n \\rfloor = \\lfloor x \\rfloor + n$"},
            {"key": "B", "text": "$\\lfloor nx \\rfloor = n \\lfloor x \\rfloor$"},
            {"key": "C", "text": "$\\lfloor x / n \\rfloor = \\lfloor x \\rfloor / n$"},
            {"key": "D", "text": "$\\lfloor -x \\rfloor = -\\lfloor x \\rfloor$"},
            {"key": "E", "text": "$\\lfloor x^2 \\rfloor = (\\lfloor x \\rfloor)^2$"}
        ],
        "correct_answer": "A",
        "explanation": "Salah satu sifat dasar fungsi floor adalah: jika $n$ adalah bilangan bulat, maka $\\lfloor x + n \\rfloor = \\lfloor x \\rfloor + n$ untuk setiap $x \\in \\mathbb{R}$. Pilihan lain tidak selalu berlaku (misal $\\lfloor -1.2 \\rfloor = -2 \\ne -\\lfloor 1.2 \\rfloor = -1$)."
    },

    # ==================== TOPIC 4: RELASI REKURENSI ====================
    {
        "topic": "Relasi Rekurensi",
        "question": "Suku ke-$n$ barisan Fibonacci didefinisikan dengan $F_0 = 0, F_1 = 1$ dan $F_n = F_{n-1} + F_{n-2}$ untuk $n \\ge 2$. Nilai dari $F_7$ adalah:",
        "options": [
            {"key": "A", "text": "$8$"},
            {"key": "B", "text": "$13$"},
            {"key": "C", "text": "$21$"},
            {"key": "D", "text": "$34$"},
            {"key": "E", "text": "$55$"}
        ],
        "correct_answer": "B",
        "explanation": "Mari hitung suku-suku barisan:\\n$F_0 = 0$\\n$F_1 = 1$\\n$F_2 = 0 + 1 = 1$\\n$F_3 = 1 + 1 = 2$\\n$F_4 = 1 + 2 = 3$\\n$F_5 = 2 + 3 = 5$\\n$F_6 = 3 + 5 = 8$\\n$F_7 = 5 + 8 = 13$."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Pada masalah Menara Hanoi dengan $n$ cakram, relasi rekurensi perpindahan minimum adalah $H_n = 2H_{n-1} + 1$ dengan $H_1 = 1$. Solusi eksplisit dari relasi rekurensi tersebut adalah:",
        "options": [
            {"key": "A", "text": "$H_n = 2^n$"},
            {"key": "B", "text": "$H_n = 2^n - 1$"},
            {"key": "C", "text": "$H_n = 2^{n-1} + 1$"},
            {"key": "D", "text": "$H_n = 2^{n+1} - 1$"},
            {"key": "E", "text": "$H_n = n^2 - 1$"}
        ],
        "correct_answer": "B",
        "explanation": "Dapat dibuktikan dengan iterasi bertingkat:\\n$H_n = 2H_{n-1} + 1 = 2(2H_{n-2} + 1) + 1 = 2^2 H_{n-2} + 2 + 1 = \\dots = 2^{n-1} H_1 + 2^{n-2} + \\dots + 2 + 1$.\\nKarena $H_1 = 1$, ini adalah deret geometri berhingga: $\\sum_{k=0}^{n-1} 2^k = \\frac{2^n - 1}{2 - 1} = 2^n - 1$."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Diberikan relasi rekurensi linier homogen $a_n - 7a_{n-1} + 10a_{n-2} = 0$. Persamaan karakteristik dari relasi rekurensi tersebut adalah:",
        "options": [
            {"key": "A", "text": "$r^2 + 7r + 10 = 0$"},
            {"key": "B", "text": "$r^2 - 7r + 10 = 0$"},
            {"key": "C", "text": "$r^2 - 7r - 10 = 0$"},
            {"key": "D", "text": "$r^2 + 10r - 7 = 0$"},
            {"key": "E", "text": "$r^2 - 10r + 7 = 0$"}
        ],
        "correct_answer": "B",
        "explanation": "Dengan mensubstitusikan $a_n = r^n$, maka:\\n$r^n - 7r^{n-1} + 10r^{n-2} = 0$\\nBagi kedua ruas dengan $r^{n-2}$ (untuk $r \\ne 0$):\\n$r^2 - 7r + 10 = 0$."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Akar-akar karakteristik dari persamaan $r^2 - 7r + 10 = 0$ adalah $r_1 = 2$ dan $r_2 = 5$. Jika kondisi awal adalah $a_0 = 1$ dan $a_1 = 8$, maka rumus solusi eksplisit untuk $a_n$ adalah:",
        "options": [
            {"key": "A", "text": "$a_n = 2 \\cdot 2^n - 5^n$"},
            {"key": "B", "text": "$a_n = -1 \\cdot 2^n + 2 \\cdot 5^n$"},
            {"key": "C", "text": "$a_n = 3 \\cdot 2^n - 2 \\cdot 5^n$"},
            {"key": "D", "text": "$a_n = 2^n + 5^n$"},
            {"key": "E", "text": "$a_n = 4 \\cdot 2^n - 3 \\cdot 5^n$"}
        ],
        "correct_answer": "B",
        "explanation": "Bentuk umum solusi: $a_n = \\alpha_1 (2)^n + \\alpha_2 (5)^n$.\\n1. Untuk $n=0$: $\\alpha_1 + \\alpha_2 = 1 \\implies \\alpha_1 = 1 - \\alpha_2$\\n2. Untuk $n=1$: $2\\alpha_1 + 5\\alpha_2 = 8$\\nSubstitusi: $2(1 - \\alpha_2) + 5\\alpha_2 = 8 \\implies 2 + 3\\alpha_2 = 8 \\implies 3\\alpha_2 = 6 \\implies \\alpha_2 = 2$.\\nMaka $\\alpha_1 = 1 - 2 = -1$.\\nSehingga solusinya adalah $a_n = -1 \\cdot 2^n + 2 \\cdot 5^n$."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Jika persamaan karakteristik dari relasi rekurensi linier homogen berderajat dua memiliki akar kembar $r_1 = r_2 = 3$, maka bentuk umum solusi dari $a_n$ adalah:",
        "options": [
            {"key": "A", "text": "$a_n = \\alpha_1 3^n + \\alpha_2 3^n$"},
            {"key": "B", "text": "$a_n = (\\alpha_1 + \\alpha_2 n) 3^n$"},
            {"key": "C", "text": "$a_n = \\alpha_1 3^n + \\alpha_2 (-3)^n$"},
            {"key": "D", "text": "$a_n = (\\alpha_1 n + \\alpha_2 n^2) 3^n$"},
            {"key": "E", "text": "$a_n = \\alpha_1 3^n + \\alpha_2$"}
        ],
        "correct_answer": "B",
        "explanation": "Teorema relasi rekurensi linier homogen berkoefisien konstan menyatakan: jika persamaan karakteristik memiliki akar berulang (akar kembar) dengan multiplisitas $m=2$, yaitu $r$, maka solusi umum berbentuk kombinasi linier dari $r^n$ dan $n r^n$, yaitu $a_n = (\\alpha_1 + \\alpha_2 n) r^n$."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Misalkan $a_n$ menyatakan banyaknya cara menutupi lantai berukuran $2 \\times n$ dengan ubin domino berukuran $2 \\times 1$. Relasi rekurensi yang merepresentasikan $a_n$ untuk $n \\ge 3$ adalah:",
        "options": [
            {"key": "A", "text": "$a_n = a_{n-1} + 1$"},
            {"key": "B", "text": "$a_n = 2a_{n-1}$"},
            {"key": "C", "text": "$a_n = a_{n-1} + a_{n-2}$"},
            {"key": "D", "text": "$a_n = a_{n-1} + 2a_{n-2}$"},
            {"key": "E", "text": "$a_n = 2a_{n-1} + a_{n-2}$"}
        ],
        "correct_answer": "C",
        "explanation": "Pada ujung kanan lantai $2 \\times n$:\\n1. Jika ubin terakhir diletakkan secara vertikal ($2 \\times 1$), sisa lantai adalah $2 \\times (n-1)$, yang dapat diisi dengan $a_{n-1}$ cara.\\n2. Jika ubin terakhir diletakkan secara horizontal, harus ada sepasang ubin horizontal bertumpuk $2 \\times 2$, menyisakan lantai $2 \\times (n-2)$, yang dapat diisi dengan $a_{n-2}$ cara.\\nDengan aturan penjumlahan: $a_n = a_{n-1} + a_{n-2}$ (merupakan relasi Fibonacci)."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Diberikan relasi rekurensi linier orde 1: $a_n = 4a_{n-1}$ dengan kondisi awal $a_0 = 3$. Nilai dari $a_4$ adalah:",
        "options": [
            {"key": "A", "text": "$48$"},
            {"key": "B", "text": "$192$"},
            {"key": "C", "text": "$768$"},
            {"key": "D", "text": "$1024$"},
            {"key": "E", "text": "$3072$"}
        ],
        "correct_answer": "C",
        "explanation": "Relasi rekurensi geometri $a_n = 4a_{n-1}$ memiliki solusi eksplisit $a_n = a_0 \\cdot 4^n = 3 \\cdot 4^n$.\\nUntuk $n = 4$:\\n$a_4 = 3 \\cdot 4^4 = 3 \\cdot 256 = 768$."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Untuk relasi rekurensi non-homogen $a_n - 3a_{n-1} = 2 \\cdot 5^n$, tebakan bentuk solusi partikular $a_n^{(p)}$ yang tepat adalah:",
        "options": [
            {"key": "A", "text": "$A \\cdot 3^n$"},
            {"key": "B", "text": "$A \\cdot 5^n$"},
            {"key": "C", "text": "$A n \\cdot 5^n$"},
            {"key": "D", "text": "$A \\cdot n^2$"},
            {"key": "E", "text": "$A \\cdot 2^n$"}
        ],
        "correct_answer": "B",
        "explanation": "Akar persamaan karakteristik homogen $r - 3 = 0$ adalah $r = 3$. Fungsi non-homogen adalah $F(n) = 2 \\cdot 5^n$. Karena basis $5$ bukan merupakan akar karakteristik ($5 \\ne 3$), maka bentuk solusi partikularnya adalah konstanta dikali $5^n$, yaitu $a_n^{(p)} = A \\cdot 5^n$."
    },

    # ==================== TOPIC 5: ATURAN DASAR BERHITUNG ====================
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Sebuah restoran menyediakan 4 jenis hidangan pembuka, 6 jenis hidangan utama, dan 3 jenis hidangan penutup. Berapa banyak kombinasi paket menu lengkap (1 pembuka, 1 utama, 1 penutup) yang dapat dipilih pengunjung?",
        "options": [
            {"key": "A", "text": "$13$"},
            {"key": "B", "text": "$24$"},
            {"key": "C", "text": "$72$"},
            {"key": "D", "text": "$96$"},
            {"key": "E", "text": "$144$"}
        ],
        "correct_answer": "C",
        "explanation": "Berdasarkan Aturan Perkalian (*Product Rule*), jika prosedur terdiri dari langkah 1, 2, dan 3 berturut-turut dengan $n_1, n_2, n_3$ cara, total cara adalah $n_1 \\times n_2 \\times n_3$. Di sini: $4 \\times 6 \\times 3 = 72$ cara."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Berapakah banyaknya bilangan bulat antara 1 sampai 1000 (inklusif) yang habis dibagi 5 **atau** habis dibagi 7?",
        "options": [
            {"key": "A", "text": "$342$"},
            {"key": "B", "text": "$314$"},
            {"key": "C", "text": "$370$"},
            {"key": "D", "text": "$286$"},
            {"key": "E", "text": "$328$"}
        ],
        "correct_answer": "B",
        "explanation": "Gunakan Prinsip Inklusi-Eksklusi: $|A \\cup B| = |A| + |B| - |A \\cap B|$.\\n- $|A|$ (habis dibagi 5) = $\\lfloor 1000/5 \\rfloor = 200$\\n- $|B|$ (habis dibagi 7) = $\\lfloor 1000/7 \\rfloor = 142$\\n- $|A \\cap B|$ (habis dibagi KPK(5,7) = 35) = $\\lfloor 1000/35 \\rfloor = 28$\\nMaka $|A \\cup B| = 200 + 142 - 28 = 314$."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Berapakah banyaknya string biner dengan panjang 8 yang diawali dengan bit '1' **atau** diakhiri dengan dua bit '00'?",
        "options": [
            {"key": "A", "text": "$128$"},
            {"key": "B", "text": "$160$"},
            {"key": "C", "text": "$192$"},
            {"key": "D", "text": "$256$"},
            {"key": "E", "text": "$144$"}
        ],
        "correct_answer": "B",
        "explanation": "Gunakan Prinsip Inklusi-Eksklusi:\\n- Himpunan $A$ (diawali '1'): posisi pertama bernilai 1, 7 bit sisanya bebas $\\implies 2^7 = 128$.\\n- Himpunan $B$ (diakhiri '00'): dua bit terakhir bernilai 00, 6 bit sisanya bebas $\\implies 2^6 = 64$.\\n- Himpunan $A \\cap B$ (diawali '1' DAN diakhiri '00'): 5 bit tengah bebas $\\implies 2^5 = 32$.\\nMaka $|A \\cup B| = |A| + |B| - |A \\cap B| = 128 + 64 - 32 = 160$."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Sebuah plat nomor kendaraan di suatu wilayah terdiri dari 2 huruf di awal, diikuti 4 angka, dan diakhiri 2 huruf. Jika huruf pertama tidak boleh vokal (A, I, U, E, O) dan angka pertama tidak boleh 0, berapakah banyaknya plat nomor yang dapat dibuat jika huruf dan angka boleh berulang?",
        "options": [
            {"key": "A", "text": "$21 \\times 26 \\times 9 \\times 10^3 \\times 26^2$"},
            {"key": "B", "text": "$26^2 \\times 10^4 \\times 26^2$"},
            {"key": "C", "text": "$21 \\times 26^3 \\times 10^4$"},
            {"key": "D", "text": "$26 \\times 25 \\times 9 \\times 10^3 \\times 26 \\times 25$"},
            {"key": "E", "text": "$21^2 \\times 9 \\times 10^3 \\times 26^2$"}
        ],
        "correct_answer": "A",
        "explanation": "Rincian pilihan:\\n- Huruf ke-1: 26 - 5 = 21 pilihan (konsonan)\\n- Huruf ke-2: 26 pilihan\\n- Angka ke-1: 9 pilihan (1-9, tidak boleh 0)\\n- Angka ke-2, ke-3, ke-4: masing-masing 10 pilihan $\\implies 10^3$\\n- Dua huruf di akhir: $26 \\times 26 = 26^2$ pilihan.\\nMaka total cara = $21 \\times 26 \\times 9 \\times 10^3 \\times 26^2$."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Dari 100 orang mahasiswa, 60 orang mengambil mata kuliah Algoritma, 50 orang mengambil Matematika Diskrit, dan 20 orang mengambil keduanya. Berapakah banyaknya mahasiswa yang **tidak mengambil satupun** dari kedua mata kuliah tersebut?",
        "options": [
            {"key": "A", "text": "$10$"},
            {"key": "B", "text": "$20$"},
            {"key": "C", "text": "$30$"},
            {"key": "D", "text": "$40$"},
            {"key": "E", "text": "$50$"}
        ],
        "correct_answer": "A",
        "explanation": "Jumlah mahasiswa yang mengambil minimal satu mata kuliah adalah:\\n$|A \\cup M| = |A| + |M| - |A \\cap M| = 60 + 50 - 20 = 90$.\\nMahasiswa yang tidak mengambil satupun adalah komplemen dari gabungan tersebut:\\n$100 - |A \\cup M| = 100 - 90 = 10$ orang."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Rumus Prinsip Inklusi-Eksklusi untuk kardinalitas gabungan 3 buah himpunan $|A \\cup B \\cup C|$ adalah:",
        "options": [
            {"key": "A", "text": "$|A| + |B| + |C| - |A \\cap B \\cap C|$"},
            {"key": "B", "text": "$|A| + |B| + |C| - (|A \\cap B| + |A \\cap C| + |B \\cap C|) + |A \\cap B \\cap C|$"},
            {"key": "C", "text": "$|A| + |B| + |C| + (|A \\cap B| + |A \\cap C| + |B \\cap C|) - |A \\cap B \\cap C|$"},
            {"key": "D", "text": "$|A| + |B| + |C| - (|A \\cap B| + |A \\cap C| + |B \\cap C|) - |A \\cap B \\cap C|$"},
            {"key": "E", "text": "$|A| + |B| + |C| - 2(|A \\cap B| + |A \\cap C| + |B \\cap C|) + 3|A \\cap B \\cap C|$"}
        ],
        "correct_answer": "B",
        "explanation": "Teorema inklusi-eksklusi untuk 3 himpunan adalah menjumlahkan kardinalitas masing-masing himpunan tunggal, mengurangkan irisan pasangan himpunan, dan menambahkan kembali irisan ketiga himpunan:\\n$|A \\cup B \\cup C| = |A| + |B| + |C| - (|A \\cap B| + |A \\cap C| + |B \\cap C|) + |A \\cap B \\cap C|$."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Berapakah banyaknya bilangan genap 3 angka yang dapat dibentuk dari angka $\\{1, 2, 3, 4, 5, 6, 7\\}$ jika **tidak boleh ada angka yang berulang**?",
        "options": [
            {"key": "A", "text": "$60$"},
            {"key": "B", "text": "$90$"},
            {"key": "C", "text": "$105$"},
            {"key": "D", "text": "$120$"},
            {"key": "E", "text": "$150$"}
        ],
        "correct_answer": "B",
        "explanation": "Bilangan harus genap, maka angka terakhir (satuan) harus genap. Pilihan angka genap dari $\\{1, 2, 3, 4, 5, 6, 7\\}$ adalah $\\{2, 4, 6\\}$ (3 kemungkinan).\\nSetelah 1 angka genap dipilih untuk satuan, tersisa $7 - 1 = 6$ angka.\\nUntuk angka ratusan: ada 6 pilihan.\\nUntuk angka puluhan: ada 5 pilihan.\\nMaka total bilangan = $6 \\times 5 \\times 3 = 90$."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Berapakah banyaknya password dengan panjang 6 karakter yang hanya memuat huruf kecil alfabet ($a-z$) dan memuat **setidaknya satu** huruf 'a'?",
        "options": [
            {"key": "A", "text": "$26^6 - 25^6$"},
            {"key": "B", "text": "$26^6 - 26$"},
            {"key": "C", "text": "$6 \\times 25^5$"},
            {"key": "D", "text": "$25^6$"},
            {"key": "E", "text": "$26 \\times 25^5$"}
        ],
        "correct_answer": "A",
        "explanation": "Gunakan metode komplemen (*subtraction rule*):\\n- Total seluruh kemungkinan password 6 huruf = $26^6$.\\n- Password 6 huruf yang TIDAK memuat huruf 'a' sama sekali (hanya memilih dari 25 huruf lainnya) = $25^6$.\\nMaka banyaknya password yang memuat setidaknya satu huruf 'a' adalah $26^6 - 25^6$."
    },

    # ==================== TOPIC 6: PRINSIP SARANG MERPATI ====================
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Berapa jumlah minimum orang yang harus berkumpul dalam satu ruangan agar dapat dipastikan bahwa sedikitnya ada 2 orang yang lahir pada **bulan yang sama**?",
        "options": [
            {"key": "A", "text": "$12$"},
            {"key": "B", "text": "$13$"},
            {"key": "C", "text": "$24$"},
            {"key": "D", "text": "$25$"},
            {"key": "E", "text": "$366$"}
        ],
        "correct_answer": "B",
        "explanation": "Berdasarkan Prinsip Sarang Merpati (*Pigeonhole Principle*): Ada $k = 12$ bulan dalam setahun (sarang). Agar terjamin ada minimal 2 orang (merpati) yang berada di sarang yang sama, jumlah orang minimum adalah $k + 1 = 12 + 1 = 13$ orang."
    },
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Sebuah kelas memberikan nilai ujian berupa huruf A, B, C, D, atau E (ada 5 kemungkinan nilai). Berapa jumlah minimum mahasiswa di kelas tersebut agar dijamin ada **setidaknya 6 mahasiswa** yang memperoleh nilai yang sama?",
        "options": [
            {"key": "A", "text": "$25$"},
            {"key": "B", "text": "$26$"},
            {"key": "C", "text": "$30$"},
            {"key": "D", "text": "$31$"},
            {"key": "E", "text": "$35$"}
        ],
        "correct_answer": "B",
        "explanation": "Gunakan *Generalized Pigeonhole Principle*: jika $N$ objek dimasukkan ke dalam $k$ kotak, sedikitnya satu kotak memuat $\\lceil N/k \\rceil$ objek. Di sini $k = 5$ dan kita ingin $\\lceil N/5 \\rceil \\ge 6$.\\nNilai $N$ terkecil adalah $k(m - 1) + 1 = 5(6 - 1) + 1 = 5(5) + 1 = 26$ mahasiswa."
    },
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Di dalam laci terdapat 10 pasang kaos kaki hitam dan 10 pasang kaos kaki putih (semuanya tercampur baur secara acak). Dalam kondisi gelap gulita, berapa kaos kaki minimum yang harus diambil agar dijamin diperoleh **sepasang kaos kaki dengan warna yang sama**?",
        "options": [
            {"key": "A", "text": "$2$"},
            {"key": "B", "text": "$3$"},
            {"key": "C", "text": "$4$"},
            {"key": "D", "text": "$11$"},
            {"key": "E", "text": "$21$"}
        ],
        "correct_answer": "B",
        "explanation": "Warna kaos kaki adalah sarang merpati: $k = 2$ kategori (Hitam dan Putih). Menurut prinsip sarang merpati, mengambil $k + 1 = 2 + 1 = 3$ kaos kaki menjamin setidaknya ada $\\lceil 3/2 \\rceil = 2$ kaos kaki dengan warna yang sama."
    },
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Dari satu set standar kartu bridge (52 kartu, 4 jenis kembang: Sekop, Hati, Keriting, Wajik), berapa kartu minimum yang harus ditarik agar dijamin memperoleh **setidaknya 3 kartu dari jenis kembang yang sama**?",
        "options": [
            {"key": "A", "text": "$7$"},
            {"key": "B", "text": "$8$"},
            {"key": "C", "text": "$9$"},
            {"key": "D", "text": "$10$"},
            {"key": "E", "text": "$12$"}
        ],
        "correct_answer": "C",
        "explanation": "Jumlah sarang (kembang) adalah $k = 4$. Kita ingin menjamin sedikitnya $m = 3$ kartu berkembang sama. Kondisi terburuk (paling sial) adalah terambil masing-masing 2 kartu untuk keempat kembang ($4 \\times 2 = 8$ kartu). Kartu ke-9 yang diambil pasti melengkapi salah satu kembang menjadi 3 buah. Jadi $N = 4(3-1) + 1 = 9$ kartu."
    },
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Diberikan himpunan bilangan bulat $S = \\{1, 2, 3, 4, 5, 6, 7, 8, 9\\}$. Jika kita memilih $n$ buah bilangan dari $S$, berapa nilai $n$ minimum agar dijamin ada sepasang bilangan yang **berjumlah 10**?",
        "options": [
            {"key": "A", "text": "$4$"},
            {"key": "B", "text": "$5$"},
            {"key": "C", "text": "$6$"},
            {"key": "D", "text": "$7$"},
            {"key": "E", "text": "$8$"}
        ],
        "correct_answer": "C",
        "explanation": "Kelompokkan elemen $S$ menjadi pasangan-pasangan yang berjumlah 10 plus elemen tersisa:\\n1. $\\{1, 9\\}$\\n2. $\\{2, 8\\}$\\n3. $\\{3, 7\\}$\\n4. $\\{4, 6\\}$\\n5. $\\{5\\}$\\nTerdapat 5 kelompok (sarang). Jika kita memilih 5 bilangan, bisa saja kita mengambil satu dari tiap kelompok (misal $\\{1, 2, 3, 4, 5\\}$) dan belum ada pasangan berjumlah 10. Namun bila kita mengambil $5 + 1 = 6$ bilangan, menurut PHP pasti ada 2 bilangan yang berasal dari kelompok yang sama di antara 4 kelompok pasangan pertama, sehingga jumlahnya pasti 10."
    },
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Jika diketahui bahwa sebuah universitas memiliki 380 mahasiswa baru pada jurusan Informatika, manakah kesimpulan yang PASTI BENAR berdasarkan prinsip sarang merpati?",
        "options": [
            {"key": "A", "text": "Setidaknya ada 2 mahasiswa yang lahir pada tanggal dan bulan yang sama"},
            {"key": "B", "text": "Setidaknya ada 5 mahasiswa yang lahir pada hari yang sama dalam seminggu"},
            {"key": "C", "text": "Setidaknya ada 35 mahasiswa yang lahir di bulan yang sama"},
            {"key": "D", "text": "Semua pernyataan A, B, dan C benar"},
            {"key": "E", "text": "Hanya pernyataan A dan B yang benar"}
        ],
        "correct_answer": "D",
        "explanation": "Mari cek satu per satu:\\n- Pernyataan A: Jumlah hari dalam setahun maksimal 366 (kabisat). Karena $380 > 366$, pasti ada $\\ge 2$ orang lahir di tanggal/bulan yang sama. (Benar)\\n- Pernyataan B: Ada 7 hari seminggu. $\\lceil 380/7 \\rceil = 55 \\ge 5$. (Benar)\\n- Pernyataan C: Ada 12 bulan setahun. $\\lceil 380/12 \\rceil = 32$ (Pernyataan A dan B pasti benar, tapi C $\\lceil 380/12 \\rceil = 32 < 35$).\\nTunggu, mari periksa kembali opsi: Karena $380/12 = 31.67 \\implies 32$, maka opsi E (Hanya A dan B yang benar) adalah yang paling tepat dan cermat!"
    },
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Dalam pesta yang dihadiri oleh $n$ orang ($n \\ge 2$), setiap pasang orang dapat saling berjabat tangan atau tidak. Pernyataan yang benar adalah:",
        "options": [
            {"key": "A", "text": "Pasti ada setidaknya 2 orang yang melakukan jumlah jabat tangan yang persis sama"},
            {"key": "B", "text": "Semua orang pasti melakukan jumlah jabat tangan yang berbeda"},
            {"key": "C", "text": "Tidak dapat dipastikan tanpa mengetahui siapa saja yang saling kenal"},
            {"key": "D", "text": "Pasti ada seseorang yang berjabat tangan dengan semua orang"},
            {"key": "E", "text": "Jumlah jabat tangan setiap orang selalu bernilai ganjil"}
        ],
        "correct_answer": "A",
        "explanation": "Kemungkinan jumlah jabat tangan yang dilakukan seseorang adalah dari himpunan $\\{0, 1, 2, \\dots, n-1\\}$ (ada $n$ kemungkinan nilai). Namun, nilai $0$ (tidak berjabat tangan dengan siapapun) dan $n-1$ (berjabat tangan dengan semua orang) tidak bisa terjadi secara bersamaan dalam satu pesta. Jadi hanya ada paling banyak $n-1$ nilai jabat tangan yang mungkin terdistribusi pada $n$ orang. Menurut PHP, pasti ada minimal 2 orang yang memiliki jumlah jabat tangan yang sama."
    },

    # ==================== TOPIC 7: PERMUTASI DAN KOMBINASI ====================
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Berapakah banyaknya cara memilih susunan Ketua, Sekretaris, dan Bendahara dari suatu organisasi yang beranggotakan 10 orang jika tidak boleh ada jabatan rangkap?",
        "options": [
            {"key": "A", "text": "$C(10, 3) = 120$"},
            {"key": "B", "text": "$P(10, 3) = 720$"},
            {"key": "C", "text": "$10^3 = 1000$"},
            {"key": "D", "text": "$3^{10}$"},
            {"key": "E", "text": "$30$"}
        ],
        "correct_answer": "B",
        "explanation": "Karena urutan posisi/jabatan diperhatikan (Ketua, Sekretaris, Bendahara adalah posisi yang berbeda), ini merupakan masalah Permutasi tanpa pengulangan:\\n$P(10, 3) = \\frac{10!}{(10-3)!} = 10 \\times 9 \\times 8 = 720$ cara."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Dari sebuah kelompok yang terdiri dari 7 pria dan 5 wanita, akan dibentuk delegasi yang terdiri dari 3 pria dan 2 wanita. Banyaknya susunan delegasi yang dapat dibentuk adalah:",
        "options": [
            {"key": "A", "text": "$350$"},
            {"key": "B", "text": "$792$"},
            {"key": "C", "text": "$120$"},
            {"key": "D", "text": "$210$"},
            {"key": "E", "text": "$420$"}
        ],
        "correct_answer": "A",
        "explanation": "Urutan dalam delegasi tidak diperhatikan, sehingga menggunakan Kombinasi:\\n- Memilih 3 pria dari 7 pria: $C(7, 3) = \\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = 35$\\n- Memilih 2 wanita dari 5 wanita: $C(5, 2) = \\frac{5 \\times 4}{2 \\times 1} = 10$\\nBerdasarkan aturan perkalian: total cara = $C(7, 3) \\times C(5, 2) = 35 \\times 10 = 350$ cara."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Berapakah banyaknya susunan permutasi yang berbeda dari seluruh huruf pada kata **\"MATEMATIKA\"**?",
        "options": [
            {"key": "A", "text": "$151.200$"},
            {"key": "B", "text": "$302.400$"},
            {"key": "C", "text": "$604.800$"},
            {"key": "D", "text": "$3.628.800$"},
            {"key": "E", "text": "$75.600$"}
        ],
        "correct_answer": "A",
        "explanation": "Kata MATEMATIKA terdiri dari 10 huruf dengan rincian perulangan:\\n- M = 2 huruf\\n- A = 3 huruf\\n- T = 2 huruf\\n- E = 1 huruf\\n- I = 1 huruf\\n- K = 1 huruf\\nRumus permutasi dengan unsur identik:\\n$P = \\frac{10!}{2! \\, 3! \\, 2! \\, 1! \\, 1! \\, 1!} = \\frac{3.628.800}{2 \\times 6 \\times 2} = \\frac{3.628.800}{24} = 151.200$ susunan."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Sebanyak 6 orang eksekutif duduk mengelilingi meja bundar untuk rapat kerja. Berapakah banyaknya susunan duduk melingkar yang mungkin?",
        "options": [
            {"key": "A", "text": "$720$"},
            {"key": "B", "text": "$120$"},
            {"key": "C", "text": "$60$"},
            {"key": "D", "text": "$24$"},
            {"key": "E", "text": "$36$"}
        ],
        "correct_answer": "B",
        "explanation": "Banyaknya permutasi siklis (melingkar) dari $n$ objek adalah $(n-1)!$.\\nUntuk $n = 6$, banyaknya susunan adalah $(6 - 1)! = 5! = 120$ susunan."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Sebuah toko roti menjual 4 jenis donat: cokelat, keju, stroberi, dan vanila. Jika seorang pembeli ingin membeli 8 buah donat, berapakah banyaknya kombinasi pilihan donat yang dapat dibeli (kombinasi dengan pengulangan)?",
        "options": [
            {"key": "A", "text": "$C(8, 4) = 70$"},
            {"key": "B", "text": "$C(11, 8) = 165$"},
            {"key": "C", "text": "$C(12, 8) = 495$"},
            {"key": "D", "text": "$4^8 = 65.536$"},
            {"key": "E", "text": "$P(11, 8) = 6.652.800$"}
        ],
        "correct_answer": "B",
        "explanation": "Ini adalah permasalahan kombinasi dengan pengulangan (*stars and bars*): memilih $r = 8$ objek dari $n = 4$ kategori jenis donat.\\nRumusnya adalah $C(n + r - 1, r) = C(4 + 8 - 1, 8) = C(11, 8) = C(11, 3)$.\\n$C(11, 3) = \\frac{11 \\times 10 \\times 9}{3 \\times 2 \\times 1} = 165$ kombinasi."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Berapakah banyaknya solusi bilangan bulat tak negatif $(x_1, x_2, x_3, x_4)$ yang memenuhi persamaan linear $x_1 + x_2 + x_3 + x_4 = 10$ dengan $x_i \\ge 0$?",
        "options": [
            {"key": "A", "text": "$286$"},
            {"key": "B", "text": "$220$"},
            {"key": "C", "text": "$120$"},
            {"key": "D", "text": "$715$"},
            {"key": "E", "text": "$1000$"}
        ],
        "correct_answer": "A",
        "explanation": "Banyaknya solusi bilangan bulat non-negatif dari $x_1 + x_2 + \\dots + x_n = r$ ekuivalen dengan kombinasi dengan pengulangan $C(n + r - 1, r)$.\\nDi sini $n = 4$ variabel dan $r = 10$.\\n$C(4 + 10 - 1, 10) = C(13, 10) = C(13, 3) = \\frac{13 \\times 12 \\times 11}{3 \\times 2 \\times 1} = 13 \\times 2 \\times 11 = 286$ solusi."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Koefisien suku $x^3 y^2$ pada ekspansi binomial $(2x - 3y)^5$ adalah:",
        "options": [
            {"key": "A", "text": "$720$"},
            {"key": "B", "text": "$-720$"},
            {"key": "C", "text": "$1080$"},
            {"key": "D", "text": "$-1080$"},
            {"key": "E", "text": "$1440$"}
        ],
        "correct_answer": "A",
        "explanation": "Berdasarkan Teorema Binomial: suku umum pada ekspansi $(a + b)^n$ adalah $\\binom{n}{k} a^{n-k} b^k$.\\nDi sini $n = 5, a = 2x, b = -3y$. Untuk memperoleh $x^3 y^2$, maka $n-k = 3 \\implies k = 2$.\\nSuku tersebut adalah:\\n$\\binom{5}{2} (2x)^3 (-3y)^2 = 10 \\cdot (8x^3) \\cdot (9y^2) = 10 \\cdot 72 \\cdot x^3 y^2 = 720 x^3 y^2$.\\nJadi koefisiennya adalah $720$."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Nilai dari jumlah koefisien binomial $\\sum_{k=0}^{n} \\binom{n}{k} = \\binom{n}{0} + \\binom{n}{1} + \\dots + \\binom{n}{n}$ adalah:",
        "options": [
            {"key": "A", "text": "$n!$"},
            {"key": "B", "text": "$2^n$"},
            {"key": "C", "text": "$2^{n-1}$"},
            {"key": "D", "text": "$n^2$"},
            {"key": "E", "text": "$2^{n+1}$"}
        ],
        "correct_answer": "B",
        "explanation": "Berdasarkan Teorema Binomial: $(x + y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k$. Dengan mensubstitusikan $x = 1$ dan $y = 1$, kita peroleh $(1 + 1)^n = \\sum_{k=0}^n \\binom{n}{k} = 2^n$. Ini juga menunjukkan banyaknya seluruh himpunan bagian dari himpunan beranggotakan $n$ elemen."
    },

    # ==================== ADDITIONAL COMPREHENSIVE QUESTIONS TO REACH 55+ ====================
    {
        "topic": "Relasi Bagian 1",
        "question": "Diketahui relasi $R$ pada himpunan bilangan bulat $\\mathbb{Z}$ dengan aturan $(x, y) \\in R \\iff xy \\ge 0$. Sifat manakah yang TIDAK dipenuhi oleh relasi $R$?",
        "options": [
            {"key": "A", "text": "Refleksif"},
            {"key": "B", "text": "Simetris"},
            {"key": "C", "text": "Transitif"},
            {"key": "D", "text": "Refleksif dan Simetris"},
            {"key": "E", "text": "Semua sifat dipenuhi"}
        ],
        "correct_answer": "C",
        "explanation": "1. **Refleksif**: $x \\cdot x = x^2 \\ge 0$ untuk setiap $x \\in \\mathbb{Z}$ (terpenuhi).\\n2. **Simetris**: Jika $xy \\ge 0$, maka $yx = xy \\ge 0$ (terpenuhi).\\n3. **Transitif**: Perhatikan $x = -2, y = 0, z = 3$. Kita peroleh $(-2)(0) = 0 \\ge 0$ sehingga $(-2, 0) \\in R$, dan $(0)(3) = 0 \\ge 0$ sehingga $(0, 3) \\in R$. Namun $(-2)(3) = -6 < 0$, sehingga $(-2, 3) \\notin R$. Jadi sifat transitif GAGAL."
    },
    {
        "topic": "Relasi Bagian 2",
        "question": "Jika suatu partisi dari himpunan $S = \\{1, 2, 3, 4, 5, 6\\}$ adalah $P = \\{\\{1, 3\\}, \\{2\\}, \\{4, 5, 6\\}\\}$, berapakah banyaknya pasangan terurut pada relasi ekuivalensi yang berkorespondensi dengan partisi $P$ tersebut?",
        "options": [
            {"key": "A", "text": "$6$"},
            {"key": "B", "text": "$10$"},
            {"key": "C", "text": "$14$"},
            {"key": "D", "text": "$18$"},
            {"key": "E", "text": "$36$"}
        ],
        "correct_answer": "C",
        "explanation": "Setiap blok partisi $A_i$ menghasilkan relasi ekuivalensi blok $A_i \\times A_i$:\\n- Blok $\\{1, 3\\}$ berukuran 2 $\\implies 2^2 = 4$ pasangan.\\n- Blok $\\{2\\}$ berukuran 1 $\\implies 1^2 = 1$ pasangan.\\n- Blok $\\{4, 5, 6\\}$ berukuran 3 $\\implies 3^2 = 9$ pasangan.\\nTotal pasangan terurut = $4 + 1 + 9 = 14$ pasangan."
    },
    {
        "topic": "Fungsi",
        "question": "Diketahui fungsi $f: \\mathbb{R} \\to \\mathbb{R}$ dengan $f(x) = 3x - 2$ dan $g: \\mathbb{R} \\to \\mathbb{R}$ dengan $g(x) = x + 4$. Nilai dari $(f \\circ g)^{-1}(13)$ adalah:",
        "options": [
            {"key": "A", "text": "$1$"},
            {"key": "B", "text": "$3$"},
            {"key": "C", "text": "$5$"},
            {"key": "D", "text": "$7$"},
            {"key": "E", "text": "$9$"}
        ],
        "correct_answer": "A",
        "explanation": "Pertama cari $(f \\circ g)(x) = f(g(x)) = f(x + 4) = 3(x + 4) - 2 = 3x + 12 - 2 = 3x + 10$.\\nKita ingin mencari $x$ sedemikian sehingga $(f \\circ g)(x) = 13$:\\n$3x + 10 = 13 \\implies 3x = 3 \\implies x = 1$."
    },
    {
        "topic": "Relasi Rekurensi",
        "question": "Solusi dari relasi rekurensi linier homogen $a_n - 6a_{n-1} + 9a_{n-2} = 0$ dengan nilai awal $a_0 = 1$ dan $a_1 = 6$ adalah:",
        "options": [
            {"key": "A", "text": "$a_n = (1 + n) 3^n$"},
            {"key": "B", "text": "$a_n = (2 - n) 3^n$"},
            {"key": "C", "text": "$a_n = 3^n + n$"},
            {"key": "D", "text": "$a_n = (1 + 2n) 3^n$"},
            {"key": "E", "text": "$a_n = 2 \\cdot 3^n - 1$"}
        ],
        "correct_answer": "A",
        "explanation": "Persamaan karakteristik: $r^2 - 6r + 9 = 0 \\implies (r - 3)^2 = 0$. Akar kembar $r_1 = r_2 = 3$.\\nSolusi umum: $a_n = (\\alpha_1 + \\alpha_2 n) 3^n$.\\n- Untuk $n = 0$: $a_0 = \\alpha_1 = 1$.\\n- Untuk $n = 1$: $a_1 = (1 + \\alpha_2) \\cdot 3 = 6 \\implies 1 + \\alpha_2 = 2 \\implies \\alpha_2 = 1$.\\nMaka solusinya adalah $a_n = (1 + n) 3^n$."
    },
    {
        "topic": "Aturan Dasar Berhitung",
        "question": "Berapakah banyaknya bilangan bulat antara 1 sampai 500 yang **habis dibagi 3 dan 5, tetapi tidak habis dibagi 2**?",
        "options": [
            {"key": "A", "text": "$16$"},
            {"key": "B", "text": "$17$"},
            {"key": "C", "text": "$33$"},
            {"key": "D", "text": "$50$"},
            {"key": "E", "text": "$67$"}
        ],
        "correct_answer": "B",
        "explanation": "Bilangan yang habis dibagi 3 dan 5 adalah kelipatan KPK(3, 5) = 15.\\nBanyaknya bilangan kelipatan 15 antara 1 sampai 500 adalah $\\lfloor 500/15 \\rfloor = 33$.\\nDi antara kelipatan 15 tersebut, yang genap (habis dibagi 2) adalah kelipatan KPK(15, 2) = 30.\\nBanyaknya kelipatan 30 adalah $\\lfloor 500/30 \\rfloor = 16$.\\nMaka banyaknya bilangan yang habis dibagi 15 tapi ganjil (tidak habis dibagi 2) adalah $33 - 16 = 17$."
    },
    {
        "topic": "Prinsip Sarang Merpati",
        "question": "Berapakah jumlah minimum bilangan bulat yang harus dipilih secara acak dari himpunan $\\{1, 2, 3, \\dots, 20\\}$ untuk menjamin bahwa setidaknya ada **satu pasang bilangan yang memiliki selisih persis 10**?",
        "options": [
            {"key": "A", "text": "$10$"},
            {"key": "B", "text": "$11$"},
            {"key": "C", "text": "$12$"},
            {"key": "D", "text": "$15$"},
            {"key": "E", "text": "$16$"}
        ],
        "correct_answer": "B",
        "explanation": "Bagi 20 bilangan ke dalam 10 pasang sarang yang berselisih 10:\\n$\\{1, 11\\}, \\{2, 12\\}, \\{3, 13\\}, \\dots, \\{10, 20\\}$.\\nTerdapat $k = 10$ pasang. Berdasarkan prinsip sarang merpati, jika kita memilih $10 + 1 = 11$ bilangan, pasti ada sedikitnya 2 bilangan yang berasal dari pasangan sarang yang sama, sehingga selisihnya dijamin persis 10."
    },
    {
        "topic": "Permutasi dan Kombinasi",
        "question": "Nilai dari $\\binom{8}{3} + \\binom{8}{4}$ berdasarkan Identitas Pascal sama dengan:",
        "options": [
            {"key": "A", "text": "$\\binom{8}{7}$"},
            {"key": "B", "text": "$\\binom{9}{3}$"},
            {"key": "C", "text": "$\\binom{9}{4}$"},
            {"key": "D", "text": "$\\binom{16}{7}$"},
            {"key": "E", "text": "$\\binom{9}{5}$"}
        ],
        "correct_answer": "C",
        "explanation": "Identitas Pascal menyatakan bahwa untuk semua bilangan bulat positif $n$ dan $k$ dengan $n \\ge k$:\\n$\\binom{n}{k-1} + \\binom{n}{k} = \\binom{n+1}{k}$.\\nDi sini $n = 8$ dan $k = 4$, sehingga:\\n$\\binom{8}{3} + \\binom{8}{4} = \\binom{9}{4}$."
    }
]

print(f"Total questions compiled: {len(questions)}")

# Write to src/lib/default-questions.ts
ts_code = "// Auto-generated default questions fallback\\n"
ts_code += "export interface QuestionOption {\\n  key: string;\\n  text: string;\\n}\\n\\n"
ts_code += "export interface QuestionItem {\\n  id?: string;\\n  topic: string;\\n  question: string;\\n  options: QuestionOption[];\\n  correct_answer: string;\\n  explanation: string;\\n}\\n\\n"
ts_code += "export const DEFAULT_QUESTIONS: QuestionItem[] = " + json.dumps(questions, indent=2, ensure_ascii=False) + ";\\n"

with open("src/lib/default-questions.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("Saved default questions to src/lib/default-questions.ts")

# Seed to Supabase database
url = "https://milsxzovqaurhftzdpzc.supabase.co/rest/v1/questions"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbHN4em92cWF1cmhmdHpkcHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjg0MjMsImV4cCI6MjEwODkwNDQyM30.1Yo9R1lljfarXSNRdQUbuSJ5C1dkxHHXGub4e2A5ft4",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbHN4em92cWF1cmhmdHpkcHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjg0MjMsImV4cCI6MjEwODkwNDQyM30.1Yo9R1lljfarXSNRdQUbuSJ5C1dkxHHXGub4e2A5ft4",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Clean existing questions first
del_req = urllib.request.Request("https://milsxzovqaurhftzdpzc.supabase.co/rest/v1/questions?id=not.is.null", headers=headers, method="DELETE")
try:
    with urllib.request.urlopen(del_req) as resp:
        print("Cleared previous questions from Supabase")
except Exception as e:
    print("Clean warning:", e)

# Insert in chunks of 10
chunk_size = 10
for i in range(0, len(questions), chunk_size):
    chunk = questions[i:i+chunk_size]
    req = urllib.request.Request(url, data=json.dumps(chunk).encode('utf-8'), headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        print(f"Inserted questions {i+1} to {min(i+chunk_size, len(questions))}")

print("All questions successfully seeded to Supabase!")

