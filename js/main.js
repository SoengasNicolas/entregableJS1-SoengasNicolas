const alertsContainer = document.getElementById("alerts");

document.getElementById("addTransactionBtn").addEventListener("click", addTransaction);

let transactions = [];
let balance = 0;

document.addEventListener("DOMContentLoaded", function() {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (savedTransactions) {
        transactions = savedTransactions;
        updateTransactions();
        calculateBalance();
    }
});

function addTransaction() {
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const detail = document.getElementById("detail").value;
    
    if (isNaN(amount) || amount <= 0) {
        showAlert("Por favor ingresa un monto válido.");
        return;
    }

    if (!detail) {
        showAlert("Por favor ingresa un detalle para la transacción.");
        return;
    }
    
    if (type === "gasto") {
        balance -= amount;
    } else {
        balance += amount;
    }

    transactions.push({ type, detail, amount });
    updateTransactions();
    updateBalance();
    saveTransactions();
    clearInputs();
}

function updateTransactions() {
    const transactionList = document.getElementById("transactionList");
    transactionList.innerHTML = "";

    transactions.forEach((transaction, index) => {
        const div = document.createElement("div");
        div.classList.add("transaction");
        div.classList.add(transaction.type === 'gasto' ? 'gasto' : 'ingreso');
        div.innerHTML = `
            <p><strong>${transaction.detail}</strong></p>
            <p>${transaction.type}</p>
            <p>${transaction.amount}</p>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        transactionList.appendChild(div);

        const deleteBtn = div.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", function() {
            deleteTransaction(index);
        });
    });
}

function updateBalance() {
    const balanceElement = document.getElementById("balance");
    balanceElement.textContent = `$ ${balance.toFixed(2)}`;
    if (balance < 0) {
        balanceElement.classList.remove("positive");
        balanceElement.classList.add("negative");
    } else {
        balanceElement.classList.remove("negative");
        balanceElement.classList.add("positive");
    }
}

function clearInputs() {
    document.getElementById("amount").value = "";
    document.getElementById("detail").value = "";
}

function deleteTransaction(index) {
    const deletedTransaction = transactions.splice(index, 1)[0];
    if (deletedTransaction.type === "ingreso") {
        balance -= deletedTransaction.amount;
    } else {
        balance += deletedTransaction.amount;
    }
    updateTransactions();
    updateBalance();
    saveTransactions();
}

function calculateBalance() {
    balance = 0;
    transactions.forEach(transaction => {
        if (transaction.type === "ingreso") {
            balance += transaction.amount;
        } else {
            balance -= transaction.amount;
        }
    });
    updateBalance();
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showAlert(message) {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert");
    alertDiv.textContent = message;
    alertsContainer.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}