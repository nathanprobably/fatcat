//get the values from the user input
function getValues() {
    //get the values
    loanAmount = document.getElementById('loanAmount').value; //<--these are getting the values from the input

    loanTerm = document.getElementById('loanTerm').value;   //<--these are getting the values from the input

    interestRate = document.getElementById('interestRate').value; //<--these are getting the values from the input

    //turn them into usable numbers
    loanAmount = parseInt(loanAmount);//<--these are turning the values into numbers I can use
    loanTerm = parseInt(loanTerm);
    interestRate = parseFloat(interestRate);

    //validate the values
    if (isNaN(loanAmount) || isNaN(loanTerm) ||isNaN(interestRate)
    || loanAmount <= 0 || loanTerm <=0 || interestRate < 0) {
        Swal.fire({
            icon: `error`,
            backdrop: false,
            title: `OOPS!`,
            text: `Please enter valid number for your loan.`
        });
    } else { //<--if the numbers aren't NAN...
        let totals = paymentCalc(loanAmount, loanTerm, interestRate);

        displaySummaryInfo(totals);
        displayLoanData(totals);
    }
}

//calculate the monthly  payments for each month in the term
function paymentCalc(loanAmount, loanTerm, interestRate) {
    //calc monthly payment using the given equation
    let monthlyPay = loanAmount * (interestRate / 1200) / (1 - (1 + interestRate / 1200) ** -loanTerm);

    //make an array to holf the objects when they've been calculated
    let loan = [];

    //create an object to hold the various calculation elements, starting at 0 because we have yet to look at any specific data in our array, this lets us start at the first in our for loop
    let loanCalc = {
        month: 0,
        monthlyPay: 0,
        principal: 0,
        interest: 0,
        totalPrin: 0,
        totalInt: 0,
        balance: loanAmount
    };

    for (i = 0; i <= loanTerm; i++) { //<--for loop go go through the months and compound the values so that moviing forward the values change as the number of months paid increases
        if (i > 0) { //<--if the index is above zero, the loop will continue
            let month = i;
            let remainingBalance = loan[i - 1].balance; //<-- remaining balance is the balance - 1 month of payments, which compounds as the loop returns each time.
            let interest = remainingBalance * interestRate / 1200;
            let principal = monthlyPay - interest;
            let totalPrin = loan[i - 1].totalPrin + principal;
            let totalInt = loan[i - 1].totalInt + interest;

            remainingBalance -= principal; //subtracting the principal payment from the remaining balance

            loanCalc = { //<--changing the object values from the 0s above the loop to the new object values from the looping
                month: month,
                monthlyPay: monthlyPay,
                principal: principal,
                interest: interest,
                totalPrin: totalPrin,
                totalInt: totalInt,
                balance: remainingBalance
            };
        }

        loan.push(loanCalc); //<--pushing the objects from loanCalc into the loan array
    }

    let finalMonth = loan[loanTerm]; //<--final month is the array of the loan with duration of the loan term

    let finalSummary = { //<--makes an object of the summary and the final values from the given loanTerm to put into the summary function later
        monthlyPay: finalMonth.monthlyPay,
        totalPrin: finalMonth.totalPrin,
        totalInt: finalMonth.totalInt,
        fullLoanAmount: finalMonth.totalPrin + finalMonth.totalInt
    }

    let fullLoanCalc = { //<--a master object with all the other objects from this loop held within for recalling in my other function
        loanVars: loanAmount, loanTerm, interestRate,
        finalSummary: finalSummary,
        loan: loan
    }

    return fullLoanCalc;
}

//creat a table from the template and display the accurate information
function displayLoanData(loan) {
let payStuffVar = loan.loan;

    const loanDataBody = document.getElementById('loanDataBody');

    loanDataBody.innerHTML = '';

    for (let i = 1; i < payStuffVar.length; i++) { //<--for loop designed to go through and place items on the table, making sure to do sequential months as well as it adds more rows
        let loanInfo = payStuffVar[i];

        let tableRow = document.createElement('tr') //<--creates the element for the row in HTML that we will be appending info into

        let month = document.createElement('td'); //<--creates the elements of TD in which we will put each piece of corresponding info
        month.innerHTML = loanInfo.month.toLocaleString();
        tableRow.appendChild(month);

        let monthlyPay = document.createElement('td');
        monthlyPay.innerHTML = 
        loanInfo.monthlyPay.toLocaleString(`en-us`, { //<--entering this in the LocaleString rounds the number to two decimal places and displays it as a currency value on the page
            style: 'currency',
            currency: 'USD'
        });
        tableRow.appendChild(monthlyPay);

        let principal = document.createElement('td');
        principal.innerHTML = 
        loanInfo.principal.toLocaleString(`en-us`, {
            style: 'currency',
            currency: 'USD'
        });
        tableRow.appendChild(principal);

        let interest = document.createElement('td');
        interest.innerHTML = 
        loanInfo.interest.toLocaleString(`en-us`, {
            style: 'currency',
            currency: 'USD'
        });
        tableRow.appendChild(interest);

        let totalInterest = document.createElement('td');
        totalInterest.innerHTML = 
        loanInfo.totalInt.toLocaleString(`en-us`, {
            style: 'currency',
            currency: 'USD'
        });
        tableRow.appendChild(totalInterest);

        let remainBalance = document.createElement('td');
        remainBalance.innerHTML = 
        loanInfo.balance.toLocaleString(`en-us`, {
            style: 'currency',
            currency: 'USD'
        });
        tableRow.appendChild(remainBalance);

        loanDataBody.appendChild(tableRow);//<--take all the rows and populate the tbody by appendChild, pushing the rows into the id of the table body
    }
    
}

//display the summary in the top right of the page in the summary section
function displaySummaryInfo(loan) {
    let summary = loan.finalSummary;

    let monthlyPayAmt = document.getElementById('monthlyPayAmt');
    monthlyPayAmt.innerText = 
    summary.monthlyPay.toLocaleString(`en-us`, {
        style: 'currency',
        currency: 'USD'
    });

    let totalPrin = document.getElementById('totalPrin');
    totalPrin.innerText = 
    summary.totalPrin.toLocaleString(`en-us`, {
        style: 'currency',
        currency: 'USD'
    });

    let totalInterest = document.getElementById('totalInterest');
    totalInterest.innerText = 
    summary.totalInt.toLocaleString(`en-us`, {
        style: 'currency',
        currency: 'USD'
    });

    let totalCost = document.getElementById('totalCost');
    totalCost.innerText = 
    summary.fullLoanAmount.toLocaleString(`en-us`, {
        style: 'currency',
        currency: 'USD'
    });
}