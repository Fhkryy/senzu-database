// Configuration
const CORRECT_PASSWORD = "your_password_here";  // Change this to your desired password
const GITHUB_TOKEN = "YOUR_GITHUB_TOKEN";       // Replace with your GitHub Personal Access Token
const OWNER = "Fhkryy";                        // Your GitHub username
const REPO = "number-database-website";         // Your repository name

// Check password
async function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    if (passwordInput === CORRECT_PASSWORD) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        await loadNumbers();
    } else {
        alert('Incorrect password!');
    }
}

// Add number to database
async function addNumber() {
    const numberInput = document.getElementById('number-input');
    const number = numberInput.value;
    
    if (number) {
        try {
            // Get current database content
            const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/database.json`);
            const data = await response.json();
            const content = JSON.parse(atob(data.content));
            
            // Add new number
            content.numbers.push(number);
            
            // Trigger GitHub Action to update database
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
                        message: `Add number: ${number}`
                    }
                })
            });
            
            numberInput.value = '';
            alert('Number added successfully!');
            
            // Wait a bit for GitHub Action to complete before reloading
            setTimeout(loadNumbers, 2000);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add number. Please try again.');
        }
    }
}

// Load numbers from database
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
        alert('Failed to load numbers. Please try again.');
    }
}