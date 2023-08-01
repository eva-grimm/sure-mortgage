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

function cleanSlate () {
    const paymentTitle = document.getElementById('payment-title');
    const paymentAmount = document.getElementById('payment-amount');
    const principalTitle = document.getElementById('principal-title')
    const totalPrincipalPaid = document.getElementById('total-principal');
    const interestTitle = document.getElementById('interest-title');
    const totalInterestPaid = document.getElementById('total-interest');
    const costTitle = document.getElementById('cost-title');
    const totalCost = document.getElementById('total-cost');

    document.getElementById('payment-breakdown-div').classList.add('d-none')
    document.getElementById('payment-breakdown-table').innerText = '';
    paymentTitle.innerText = '';
    paymentAmount.innerText = '';
    principalTitle.classList.add('d-none');
    totalPrincipalPaid.innerText = '';
    interestTitle.classList.add('d-none');
    totalInterestPaid.innerText = '';
    costTitle.classList.add('d-none');
    totalCost.innerText = '';
}

function regex(input) {
    const outputColumn = document.getElementById('output-column');
    const paymentTitle = document.getElementById('payment-title');
    const paymentAmount = document.getElementById('payment-amount');
    const pattern = /[^0-9]/g;

    let numbers = input.replace(pattern, '')
    if (numbers == '') {
        outputColumn.querySelector('img').classList.add('d-none');
        outputColumn.classList.add('alert-danger')
        paymentTitle.innerText = 'You need to provide valid inputs';
        paymentAmount.innerHTML += `'${input}' is not a valid entry<br>`
        return false;
    } else return numbers;
}

function convertToUSD(number) {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    numberToNearestCent = Math.round((number + Number.EPSILON) * 100) / 100;

    return USDollar.format(numberToNearestCent)
}

function calculate(loanAmount, termMonths, interestRate) {
    let balance = loanAmount;
    let totalInterest = 0;
    let totalMonthlyPayment = loanAmount * ((interestRate / 1200) / (1 - ((1 + interestRate / 1200)) ** -(termMonths)))

    for (i = 0; i < termMonths; i++) {
        let interestPayment = balance * (interestRate / 1200);
        totalInterest += interestPayment;

        let principalPayment = totalMonthlyPayment - interestPayment;
        balance -= principalPayment;
        populateTable(i + 1, totalMonthlyPayment, principalPayment, interestPayment, totalInterest, balance);
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
    const paymentTitle = document.getElementById('payment-title');
    const paymentAmount = document.getElementById('payment-amount');
    const principalTitle = document.getElementById('principal-title')
    const totalPrincipalPaid = document.getElementById('total-principal');
    const interestTitle = document.getElementById('interest-title');
    const totalInterestPaid = document.getElementById('total-interest');
    const costTitle = document.getElementById('cost-title');
    const totalCost = document.getElementById('total-cost');

    // wipe potential earlier failure message 
    outputColumn.classList.remove('alert-danger')

    // hide graphic and show table
    outputColumn.querySelector('img').classList.add('d-none');
    document.getElementById('payment-breakdown-div').classList.remove('d-none')

    paymentTitle.innerText = 'Your Monthly Payments';
    paymentAmount.innerText = `${convertToUSD(totalMonthlyPayment)}`;

    principalTitle.classList.remove('d-none');
    totalPrincipalPaid.innerText = convertToUSD(loanAmount);

    interestTitle.classList.remove('d-none');
    totalInterestPaid.innerText = convertToUSD(totalInterest);

    costTitle.classList.remove('d-none');
    totalCost.innerText = convertToUSD(loanAmount + totalInterest);
}