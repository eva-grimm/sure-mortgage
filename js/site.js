function getTerms() {
    cleanSlate()

    let loanAmountInput = document.getElementById('loan-amount').value;
    let loanAmount = parseFloat(regex(loanAmountInput));

    let termMonthsInput = document.getElementById('term-months').value;
    let termMonths = parseInt(regex(termMonthsInput));

    let interestRateInput = document.getElementById('interest-rate').value;
    let interestRate = parseFloat(regex(interestRateInput));

    isNaN(loanAmount) || isNaN(termMonths) || isNaN(interestRate) ? '' : calculate(loanAmount, termMonths, interestRate)
}

function cleanSlate() {
    const paymentBreakdownDiv = document.getElementById('payment-breakdown-div');
    const paymentBreakdownTable = document.getElementById('payment-breakdown-table');
    const paymentAmount = document.getElementById('payment-amount');
    const totalPrincipalPaid = document.getElementById('total-principal');
    const totalInterestPaid = document.getElementById('total-interest');
    const totalCost = document.getElementById('total-cost');
    const alert = document.getElementById('alert');
    const errorMessage = document.getElementById('error-message');
    const results = document.getElementById('results');

    alert.classList.add('d-none');
    results.classList.add('d-none');
    paymentBreakdownDiv.classList.add('d-none')
    paymentBreakdownTable.innerText = '';
    errorMessage.innerHTML = '';
    paymentAmount.innerText = '';
    totalPrincipalPaid.innerText = '';
    totalInterestPaid.innerText = '';
    totalCost.innerText = '';
}

function regex(input) {
    const pattern = /[^0-9\-]/g;
    let numbers = input.replace(pattern, '')
    if (numbers == '' || numbers <= 0) {
        const outputColumn = document.getElementById('output-column');
        const errorMessage = document.getElementById('error-message');
        const alert = document.getElementById('alert');

        outputColumn.querySelector('img').classList.add('d-none');
        alert.classList.remove('d-none')
        outputColumn.querySelector('.alert').classList.add('alert-danger')
        errorMessage.innerHTML += `'${input}' is not a valid entry<br>`;
    } else return numbers;
}

function calculate(loanAmount, termMonths, interestRate) {
    let balance = loanAmount;
    let totalInterest = 0;
    let totalMonthlyPayment = loanAmount * ((interestRate / 1200) / (1 - (1 + interestRate / 1200) ** -(termMonths)))

    for (i = 1; i <= termMonths; i++) {
        let interestPayment = balance * (interestRate / 1200);
        totalInterest += interestPayment;

        let principalPayment = totalMonthlyPayment - interestPayment;
        balance -= principalPayment;
        populateTable(i, totalMonthlyPayment, principalPayment, interestPayment, totalInterest, balance);
    }
    displayTotals(loanAmount, totalMonthlyPayment, totalInterest)
}

function populateTable(month, payment, principal, interest, totalInterest, balance) {
    const paymentBreakdownTable = document.getElementById('payment-breakdown-table')
    const tableRowTemplate = document.getElementById('table-row-template');

    let tableRowCopy = tableRowTemplate.content.cloneNode(true);
    tableRowCopy.querySelector('[data-id="month"]').innerText = month;
    tableRowCopy.querySelector('[data-id="payment"]').innerText = convertToUSD(payment);
    tableRowCopy.querySelector('[data-id="principal"]').innerText = convertToUSD(principal);
    tableRowCopy.querySelector('[data-id="interest"]').innerText = convertToUSD(interest);
    tableRowCopy.querySelector('[data-id="totalInterest"]').innerText = convertToUSD(totalInterest);
    if (balance < 0) tableRowCopy.querySelector('[data-id="balance"]').innerText = '$0.00';
    else tableRowCopy.querySelector('[data-id="balance"]').innerText = convertToUSD(balance);

    paymentBreakdownTable.appendChild(tableRowCopy);
}

function displayTotals(loanAmount, totalMonthlyPayment, totalInterest) {
    const outputColumn = document.getElementById('output-column');
    const results = document.getElementById('results');
    const paymentBreakdownDiv = document.getElementById('payment-breakdown-div');
    const paymentAmount = document.getElementById('payment-amount');
    const totalPrincipalPaid = document.getElementById('total-principal');
    const totalInterestPaid = document.getElementById('total-interest');
    const totalCost = document.getElementById('total-cost');

    // hide app logo, show results and table
    outputColumn.querySelector('img').classList.add('d-none');
    results.classList.remove('d-none')
    paymentBreakdownDiv.classList.remove('d-none')

    paymentAmount.innerText = convertToUSD(totalMonthlyPayment);
    totalPrincipalPaid.innerText = convertToUSD(loanAmount);
    totalInterestPaid.innerText = convertToUSD(totalInterest);
    totalCost.innerText = convertToUSD(loanAmount + totalInterest);
}

function convertToUSD(number) {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    let numberToNearestCent = number.toFixed(2);
    return USDollar.format(numberToNearestCent)
}