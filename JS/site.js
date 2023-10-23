//STEPS TO COMPLETE:
// extend the table to show sequential months
//get the info to display in the top right of screen as well
//round the numbers to two decimals
//insert money sign before number
//clen up the look of the page

//get the values from the page
function getValues() {
    //get the values
    let loanAmount = document.getElementById('loanAmount').value;

    let loanTerm = document.getElementById('loanTerm').value;   //<--these are getting the values from the input

    let interestRate = document.getElementById('interestRate').value;

    //turn them into usable numbers
    loanAmount = parseInt(loanAmount);//<--these are turning the values into numbers I can use
    loanTerm = parseInt(loanTerm);
    interestRate = parseFloat(interestRate);

    let loan = paymentCalc(loanAmount, loanTerm, interestRate); //<--creating an array in this scope from the paymentCalc function

    document.getElementById('monthlyPay').innerHTML = Math.round(loan.monthlyPay).toLocaleString()//<--these are all putting the info into the table from the specific objects in the array
    document.getElementById('principal').innerHTML = Math.round(loan.principal).toLocaleString();
    document.getElementById('interest').innerHTML = Math.round(loan.intPayment).toLocaleString();
    document.getElementById('totalInterest').innerHTML = Math.round(loan.intPayment).toLocaleString();
    document.getElementById('remainBalance').innerHTML = Math.round(loan.remainingBalance).toLocaleString();
    document.getElementById('monthlyPayAmt').innerHTML = Math.round(loan.monthlyPay).toLocaleString();
}

//calculate the monthly  payments
function paymentCalc(loanAmount, loanTerm, interestRate) {

    //equation should be: (amount loaned) * (rate/1200) / (1- (1 + rate/1200) ^ (-number of months))
    let monthlyPay = loanAmount * (interestRate / 1200) / (1 - (1 + interestRate / 1200) ** (-loanTerm));
    let previousBalance = loanAmount;
    let intPayment = previousBalance * interestRate / 1200;
    let principal = monthlyPay - intPayment;
    let remainingBalance = previousBalance - principal;

    let payInfo = {
        previousBalance: previousBalance,
        intPayment: intPayment,
        principal: principal,
        remainingBalance: remainingBalance,
        monthlyPay: monthlyPay
    }

    return payInfo;
}

