const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expenses = document.getElementById('expenses');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '' || isNaN(amount.value)) {
        alert('Please enter a valid text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const incomeTotal = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expenseTotal = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `$${total}`;
    income.innerText = `+$${incomeTotal}`;
    expenses.innerText = `-$${expenseTotal}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

form.addEventListener('submit', addTransaction);

init();
