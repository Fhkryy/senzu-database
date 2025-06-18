// Konfigurasi
const CORRECT_PASSWORD = "Fhkryy";  // Ganti dengan password yang diinginkan
const GITHUB_TOKEN = "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";       // Ganti dengan GitHub Personal Access Token Anda
const OWNER = "Fhkryy";                        // Username GitHub Anda
const REPO = "senzu-database";                 // Nama repository Anda

// Cek status login saat halaman dimuat
window.onload = async function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        await loadNumbers();
    }
}

// Cek password
async function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    if (passwordInput === CORRECT_PASSWORD) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        localStorage.setItem('isLoggedIn', 'true');
        await loadNumbers();
    } else {
        alert('Password salah!');
    }
}

// Fungsi logout
function logout() {
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('password-input').value = '';
    localStorage.removeItem('isLoggedIn');
}

// Update nomor di database
async function addNumber() {
    const numberInput = document.getElementById('number-input');
    const number = numberInput.value;
    
    if (number) {
        try {
            alert('Memulai proses update...');
            // Ambil konten database saat ini
            const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`);
            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }
            alert('Berhasil mengambil database');
            
            const data = await response.json();
            const content = JSON.parse(atob(data.content));
            
            // Update nomor
            content.nomor = number;
            
            alert('Mengirim update ke GitHub...');
            // Trigger GitHub Action untuk update database
            const actionResponse = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    event_type: 'update-database',
                    client_payload: {
                        data: JSON.stringify(content, null, 2),
                        message: `Update nomor: ${number}`
                    }
                })
            });

            if (!actionResponse.ok) {
                throw new Error(`GitHub Action Error: ${actionResponse.status}`);
            }
            
            alert('Update berhasil!');
            numberInput.value = '';
            await loadNumbers();
        } catch (error) {
            alert('Error detail: ' + error.message);
        }
    }
}

// Muat nomor dari database
async function loadNumbers() {
    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`);
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        
        const numberList = document.getElementById('number-list');
        numberList.innerHTML = '';
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${content.nomor}</span>
            <span class="number-index">Current Number</span>
        `;
        numberList.appendChild(li);
    } catch (error) {
        alert('Error saat memuat nomor: ' + error.message);
    }
}

// Enter key untuk submit password
document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Enter key untuk submit angka
document.getElementById('number-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addNumber();
    }
});