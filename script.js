// Set your password here
const CORRECT_PASSWORD = "Fhkry";

// Check if password is correct
function checkPassword() {
    const passwordInput = document.getElementById('password-input').value;
    if (passwordInput === CORRECT_PASSWORD) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        loadNumbers();
    } else {
        alert('Incorrect password!');
    }
}

// Add a new number to storage
function addNumber() {
    const numberInput = document.getElementById('number-input');
    const number = numberInput.value;
    
    if (number) {
        const numbers = getStoredNumbers();
        numbers.push(number);
        localStorage.setItem('numbers', JSON.stringify(numbers));
        numberInput.value = '';
        loadNumbers();
    }
}

// Get numbers from localStorage
function getStoredNumbers() {
    const numbers = localStorage.getItem('numbers');
    return numbers ? JSON.parse(numbers) : [];
}

// Display numbers in the list
function loadNumbers() {
    const numberList = document.getElementById('number-list');
    const numbers = getStoredNumbers();
    
    numberList.innerHTML = '';
    numbers.forEach(number => {
        const li = document.createElement('li');
        li.textContent = number;
        numberList.appendChild(li);
    });
              }
