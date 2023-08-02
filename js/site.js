function getTerms() {
    cleanSlate()
    let loan = {}

    loan.loanAmount = document.getElementById('loan-amount').value;
    loan.loanAmount = parseFloat(loan.loanAmount);

    loan.termMonths = document.getElementById('term-months').value;
    loan.termMonths = parseInt(loan.termMonths);

    loan.interestRate = document.getElementById('interest-rate').value;
    loan.interestRate = parseFloat(loan.interestRate);

    if (isNaN(loan.loanAmount) || isNaN(loan.termMonths) || isNaN(loan.interestRate)
        || loan.loanAmount <= 0 || loan.termMonths <= 0 || loan.interestRate <= 0) {
        Swal.fire({
            title: 'Oops!',
            text: 'Sorry, but there\'s a problem with your inputs. Please only use numbers greater than 0.',
            icon: 'error',
            backdrop: false
        });
    } else {
        loan = calculateTotals(loan);
        loan = calculateBreakdown(loan);
        displayResults();
    }
}

function cleanSlate() {
    const largeLogo = document.getElementById('large-logo');
    const paymentBreakdownDiv = document.getElementById('payment-breakdown-div');
    const paymentBreakdownTable = document.getElementById('payment-breakdown-table');
    const paymentAmount = document.getElementById('payment-amount');
    const totalPrincipalPaid = document.getElementById('total-principal');
    const totalInterestPaid = document.getElementById('total-interest');
    const totalCost = document.getElementById('total-cost');
    const results = document.getElementById('results');

    largeLogo.classList.remove('d-none');
    paymentBreakdownDiv.classList.add('d-none')
    paymentBreakdownTable.innerText = '';
    paymentAmount.innerText = '';
    totalPrincipalPaid.innerText = '';
    totalInterestPaid.innerText = '';
    totalCost.innerText = '';
    results.classList.add('d-none');
}

function calculateTotals(loan) {
    loan.totalMonthlyPayment = loan.loanAmount * ((loan.interestRate / 1200) / (1 - (1 + loan.interestRate / 1200) ** -(loan.termMonths)))
    loan.totalCost = loan.totalMonthlyPayment * loan.termMonths;
    loan.totalInterest = loan.totalCost - loan.loanAmount;
    populateTotals(loan);
    return loan;
}

function populateTotals(loan) {
    const paymentAmount = document.getElementById('payment-amount');
    const totalPrincipalPaid = document.getElementById('total-principal');
    const totalInterestPaid = document.getElementById('total-interest');
    const totalCostPaid = document.getElementById('total-cost');

    paymentAmount.innerText = convertToUSD(loan.totalMonthlyPayment);
    totalPrincipalPaid.innerText = convertToUSD(loan.loanAmount);
    totalInterestPaid.innerText = convertToUSD(loan.totalInterest);
    totalCostPaid.innerText = convertToUSD(loan.totalCost);
}

function calculateBreakdown(loan) {
    let balance = loan.loanAmount;
    for (i = 1; i <= loan.termMonths; i++) {
        let interestPayment = balance * (loan.interestRate / 1200);
        let principalPayment = loan.totalMonthlyPayment - interestPayment;
        balance -= principalPayment;
        populateBreakdown(i, loan, principalPayment, interestPayment, balance);
    }
    return loan;
}

function populateBreakdown(month, loan, principalPayment, interestPayment, balance) {
    const tableRowTemplate = document.getElementById('table-row-template');
    const paymentBreakdownTable = document.getElementById('payment-breakdown-table');

    let tableRowCopy = tableRowTemplate.content.cloneNode(true);
    tableRowCopy.querySelector('[data-id="month"]').innerText = month;
    tableRowCopy.querySelector('[data-id="payment"]').innerText = convertToUSD(loan.totalMonthlyPayment);
    tableRowCopy.querySelector('[data-id="principal"]').innerText = convertToUSD(principalPayment);
    tableRowCopy.querySelector('[data-id="interest"]').innerText = convertToUSD(interestPayment);
    tableRowCopy.querySelector('[data-id="totalInterest"]').innerText = convertToUSD(loan.totalInterest);
    if (balance < 0) tableRowCopy.querySelector('[data-id="balance"]').innerText = '$0.00';
    else tableRowCopy.querySelector('[data-id="balance"]').innerText = convertToUSD(balance);

    paymentBreakdownTable.appendChild(tableRowCopy)
}

function displayResults() {
    const largeLogo = document.getElementById('large-logo');
    const results = document.getElementById('results');
    const paymentBreakdownDiv = document.getElementById('payment-breakdown-div');

    largeLogo.classList.add('d-none');
    results.classList.remove('d-none')
    paymentBreakdownDiv.classList.remove('d-none')
}

function convertToUSD(number) {
    const USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    let numberToNearestCent = number.toFixed(2);
    return USDollar.format(numberToNearestCent)
}