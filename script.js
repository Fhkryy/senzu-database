// Konfigurasi
const CORRECT_PASSWORD = "tes";  // Ganti dengan password Anda
const GITHUB_TOKEN = "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";  // Token GitHub Anda
const OWNER = "Fhkryy";
const REPO = "senzu-database";

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
    const passwordInput = document.getElementById('password-input');
    if (passwordInput && passwordInput.value === CORRECT_PASSWORD) {
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
    if (!numberInput) {
        alert('Error: Input field tidak ditemukan');
        return;
    }

    const number = numberInput.value;
    if (!number) {
        alert('Silakan masukkan nomor');
        return;
    }

    try {
        // Ambil konten database saat ini
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        
        // Update nomor
        content.nomor = number;
        
        // Trigger GitHub Action untuk update database
        const actionResponse = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
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
        
        numberInput.value = '';
        await loadNumbers();
        alert('Nomor berhasil diupdate!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Muat nomor dari database
async function loadNumbers() {
    try {
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        
        const numberList = document.getElementById('number-list');
        if (!numberList) {
            throw new Error('Element number-list tidak ditemukan');
        }
        
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