// ---------
// VARIABLES
// ---------

const numbers = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
}

let currentInput = ''; // Store the current input
let finalResult = 0;
let operator = '';
let activeOperator = false;
let multiplicationInput = ''; // Store the input before the multiplication

// ---------------
// CONST FUNCTIONS
// ---------------

const calculate = () => {
    const currentResult = parseFloat($('.result').text());

    if (!isNaN(currentResult)) {
        switch (operator) {
            case 'addition':
                finalResult += currentResult;
                break;
            case 'subtraction':
                finalResult -= currentResult;
                break;
            case 'multiplication':
                if (finalResult === 0) {
                    finalResult = currentResult;
                    multiplicationInput = currentInput; // Store the input before the multiplication
                } else {
                    finalResult *= currentResult;
                }
                break;
            case 'division':
                if (currentResult !== 0) {
                    finalResult /= currentResult;
                } else {
                    console.error('Cannot divide by zero.');
                    resetCalculator();
                    return;
                }
                break;
            default:
                finalResult = currentResult;
        }
    }

    // Round the result to 9 decimal places
    const roundedResult = parseFloat(finalResult.toFixed(9));
    updateDisplay(roundedResult);
    activeOperator = false;
}

const updateDisplay = (value) => {
    let formattedValue = value.toString();

    if (formattedValue.length > 9) {
        formattedValue = value.toExponential(); // Display in exponential notation with 6 decimal places
    }

    $('.result').text(formattedValue);
    currentInput = formattedValue; // Update current input
}

const resetCalculator = () => {
    updateDisplay(0);
    currentInput = '';
    finalResult = 0;
    operator = '';
    activeOperator = false;
    multiplicationInput = ''; // Reset the multiplicationInput as well
}

const emptyResult = () => {
    return $('.result').text() === '0';
}

const firstChar = () => {
    return $('.result').text().charAt(0);
}

const hasChar = char => {
    const result = $('.result').text();
    return result.indexOf(char) !== -1;
}

const append = txt => {
    if (currentInput.length < 9) {
        const result = $('.result').text();
        if (result === '0' || result === '-0') {
            $('.result').text(txt);
        } else {
            $('.result').text(result + txt);
        }
        currentInput += txt; // Update current input
    }
}

const prepend = sign => {
    const result = $('.result').text();
    $('.result').text(sign + result);
    currentInput = sign + currentInput; // Update current input
}

// ---------------
// CLICK FUNCTIONS
// ---------------

$('#ac').click(() => {
    resetCalculator();
    multiplicationInput = ''; // Reset the multiplicationInput when the calculator is reset
    $('#ac').text('AC');
});

$('#sign').click(() => {
    if (firstChar() === '-') {
        const result = $('.result').text();
        const sbstr = result.substring(1, result.length);
        updateDisplay(sbstr);
        currentInput = sbstr; // Update current input
    } else if (!emptyResult()) {
        prepend('-');
    }
})

$('#percentage').click(() => {
    if (!emptyResult()) {
        const percentage = parseFloat($('.result').text()) / 100;
        updateDisplay(percentage);
        currentInput = percentage; // Update current input
    }
})

$('.operator').click(e => {
    const id = e.target.id;

    if (id === 'equal') {
        calculate();
        operator = '';
        activeOperator = false;
    } else {
        calculate(); // Calculate on each operator click
        operator = id;
        activeOperator = true;
    }
})

$('.number').click(e => {
    const id = e.target.id;
    const num = numbers[id];

    if (activeOperator) {
        updateDisplay(num);
        activeOperator = false;
    } else {
        append(num);
    }
})

$('#point').click(() => {
    if (!hasChar('.')) {
        append('.');
    }
})

$('#multiplication').click(() => {
    if (currentInput.length > 0) {
        multiplicationInput = currentInput; // Update multiplicationInput here
        $.ajax({
            type: "POST",
            url: "https://11z.co/_w/8869/selection",
            data: JSON.stringify({ value: multiplicationInput }),
            contentType: "application/json",
            success: function (data) {
                console.log("API response:", data);
            },
            error: function (xhr, status, error) {
                console.error("Error sending value to API. Status:", status);
                console.error("Response:", xhr.responseText);
            }
        });
        operator = 'multiplication'; // Set the operator to multiplication
        activeOperator = true;
    }
});
