function getTerms() {
    let loanAmountInput = document.getElementById('loan-amount').value;
    let loanAmount = parseFloat(regex(loanAmountInput));

    let termMonthsInput = document.getElementById('term-months').value;
    let termMonths = parseInt(regex(termMonthsInput));

    let interestRateInput = document.getElementById('interest-rate').value;
    let interestRate = parseFloat(regex(interestRateInput));

    isNaN(loanAmount) || isNaN(termMonths) || isNaN(interestRate) ? '' : calculate(loanAmount, termMonths, interestRate)
    // displayTotals()
}

function regex(input) {
    const outputColumn = document.getElementById('output-column');
    const paymentTitle = document.getElementById('payment-title');
    const paymentAmount = document.getElementById('payment-amount');
    const principalTitle = document.getElementById('principal-title')
    const totalPrincipalPaid = document.getElementById('total-principal');
    const interestTitle = document.getElementById('interest-title');
    const totalInterestPaid = document.getElementById('total-interest');
    const costTitle = document.getElementById('cost-title');
    const totalCost = document.getElementById('total-cost');
    const pattern = /[^0-9]/g;

    // clear any earlier successes
    paymentTitle.innerText = '';
    paymentAmount.innerText = '';
    principalTitle.classList.add('d-none');
    totalPrincipalPaid.innerText = '';
    interestTitle.classList.add('d-none');
    totalInterestPaid.innerText = '';
    costTitle.classList.add('d-none');
    totalCost.innerText = '';

    let numbers = input.replace(pattern, '')
    if (numbers == '') {
        outputColumn.querySelector('img').classList.add('d-none');
        outputColumn.classList.add('alert-danger')
        paymentTitle.innerText = 'You need to provide valid inputs';
        paymentAmount.innerText = `'${input}' is not a valid entry`
        return false;
    } else return numbers;
}

function roundToCents(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100
}

function calculate(loanAmount, termMonths, interestRate) {
    let balance = loanAmount;
    let totalInterest = 0;
    let totalMonthlyPayment = loanAmount * ((interestRate / 1200) / (1 - ((1 + interestRate / 1200)) ** -(termMonths)))
    totalMonthlyPayment = roundToCents(totalMonthlyPayment);

    for (i = 0; i < termMonths; i++) {
        let interestPayment = balance * (interestRate / 1200);
        interestPayment = roundToCents(interestPayment);
        totalInterest = roundToCents(totalInterest + interestPayment);

        let principalPayment = roundToCents(totalMonthlyPayment - interestPayment);
        balance = roundToCents(balance - principalPayment);
        // if (i == termMonths - 1 && balance != 0)
        populateTable(i + 1, totalMonthlyPayment, principalPayment, interestPayment, totalInterest, balance);
    }
    displayTotals(loanAmount, totalMonthlyPayment, totalInterest)
}

function populateTable(month, payment, principal, interest, totalInterest, balance) {
    const paymentBreakdownTable = document.getElementById('payment-breakdown-table')
    const tableRowTemplate = document.getElementById('table-row-template');
    let tableRowCopy = tableRowTemplate.content.cloneNode(true);
    tableRowCopy.querySelector('[data-id="month"]').innerText = month;
    tableRowCopy.querySelector('[data-id="payment"]').innerText = payment;
    tableRowCopy.querySelector('[data-id="principal"]').innerText = principal;
    tableRowCopy.querySelector('[data-id="interest"]').innerText = interest;
    tableRowCopy.querySelector('[data-id="totalInterest"]').innerText = totalInterest;
    tableRowCopy.querySelector('[data-id="balance"]').innerText = balance;
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
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    // wipe potential earlier failure message 
    outputColumn.classList.remove('alert-danger')

    // hide graphic and show table
    outputColumn.querySelector('img').classList.add('d-none');
    document.getElementById('payment-breakdown-div').classList.remove('d-none')

    paymentTitle.innerText = 'Your Monthly Payments';
    paymentAmount.innerText = `${totalMonthlyPayment}`;

    principalTitle.classList.remove('d-none');
    totalPrincipalPaid.innerText = USDollar.format(loanAmount);

    interestTitle.classList.remove('d-none');
    totalInterestPaid.innerText = USDollar.format(totalInterest);

    costTitle.classList.remove('d-none');
    totalCost.innerText = USDollar.format(loanAmount + totalInterest);
}