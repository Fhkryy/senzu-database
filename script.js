// Konfigurasi
const CORRECT_PASSWORD = "Fhkryy";  // Ganti dengan password yang diinginkan
const GITHUB_TOKEN = "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";       // Ganti dengan GitHub Personal Access Token Anda
const OWNER = "Fhkryy";                        // Username GitHub Anda
const REPO = "senzu-database";                 // Nama repository Anda

// Update nomor di database
async function addNumber() {
    const numberInput = document.getElementById('number-input');
    const number = numberInput.value;
    
    if (number) {
        try {
            // Ambil konten database saat ini
            const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28'
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
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28',
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
                const errorText = await actionResponse.text();
                throw new Error(`GitHub Action Error: ${actionResponse.status}\n${errorText}`);
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
        const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        
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