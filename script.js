// Konfigurasi
const CORRECT_PASSWORD = "Fhkryy";  // Ganti dengan password yang diinginkan
const GITHUB_TOKEN = "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";       // Ganti dengan GitHub Personal Access Token Anda
const OWNER = "Fhkryy";                        // Username GitHub Anda
const REPO = "senzu-database";                 // Nama repository Anda

// Cek password
async function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    if (passwordInput === CORRECT_PASSWORD) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        await loadNumbers();
    } else {
        alert('Password salah!');
    }
}

// Tambah angka ke database
async function addNumber() {
    const numberInput = document.getElementById('number-input');
    const number = numberInput.value;
    
    if (number) {
        try {
            // Ambil konten database saat ini
            const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`);
            const data = await response.json();
            const content = JSON.parse(atob(data.content));
            
            // Tambah angka baru
            content.numbers.push(number);
            
            // Trigger GitHub Action untuk update database
            await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    event_type: 'update-database',
                    client_payload: {
                        data: JSON.stringify(content, null, 2),
                        message: `Tambah angka: ${number}`
                    }
                })
            });
            
            numberInput.value = '';
            alert('Angka berhasil ditambahkan!');
            
            // Tunggu sebentar untuk GitHub Action selesai sebelum memuat ulang
            setTimeout(loadNumbers, 2000);
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal menambahkan angka. Silakan coba lagi.');
        }
    }
}

// Muat angka dari database
async function loadNumbers() {
    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`);
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        
        const numberList = document.getElementById('number-list');
        numberList.innerHTML = '';
        
        content.numbers.forEach(number => {
            const li = document.createElement('li');
            li.textContent = number;
            numberList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal memuat daftar angka. Silakan coba lagi.');
    }
}
