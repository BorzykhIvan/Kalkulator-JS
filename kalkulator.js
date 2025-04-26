const display = document.querySelector('.current-value');
const numberBtns = document.querySelectorAll('.btn-number');
const operatorBtns = document.querySelectorAll('.btn-operator');
const equalsBtn = document.querySelector('.btn-equals');
const clearBtn = document.querySelector('.btn-clear');
const historyList = document.querySelector('.history-list');
const clearHistoryBtn = document.querySelector('.btn-clear-history');

let firstNumber = '';
let currentOperator = '';
let secondNumber = '';

// Sprawdzanie czy klawisz jest dozwolony
function isValidKey(key) {
    return /^[0-9.]$/.test(key) || 
           ['+', '-', '*', '/', '^', 'Enter', 'Escape', 'Backspace', 'Delete'].includes(key);
}

function isOperator(key) {
    return ['+', '-', '*', '/', '^'].includes(key);
}

// Obsługa wprowadzania liczb
function handleNumberInput(number) {
    if (currentOperator !== '') {
        secondNumber += number;
        display.textContent = `${firstNumber} ${currentOperator} ${secondNumber}`;
    } else {
        if (number === '.' && display.textContent.includes('.')) return;
        if (number === '.' && display.textContent === '') {
            display.textContent = '0.';
            firstNumber = '0.';
            return;
        }
        firstNumber += number;
        display.textContent = firstNumber;
    }
}

// Obsługa operatorów
function handleOperator(operator) {
    if (display.textContent === '' && operator === '-') {
        firstNumber = '-';
        display.textContent = '-';
        return;
    }

    if (display.textContent === '') return;

    if (currentOperator !== '') {
        calculateResult();
        firstNumber = display.textContent; 
        currentOperator = operator;
        secondNumber = ''; 
        display.textContent = `${firstNumber} ${currentOperator}`;
    } else {
        firstNumber = display.textContent;
        currentOperator = operator;
        display.textContent = `${firstNumber} ${currentOperator}`;
        secondNumber = ''; 
    }
}

// Obliczanie wyniku
function calculateResult() {
    if (firstNumber === '' || secondNumber === '' || currentOperator === '') return;

    let result;
    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(secondNumber);

    switch (currentOperator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
        case '^':
            result = Math.pow(num1, num2);
            break;
        default:
            return;
    }

    // Zaokrąglenie do 12 miejsc po przecinku 
    result = Math.round(result * 1e12) / 1e12;
    
    // Usunięcie niepotrzebnych zer na końcu
    result = parseFloat(result.toFixed(12));

    addHistoryEntry(firstNumber, currentOperator, secondNumber, result);
    clearHistoryBtn.classList.add('active');

    display.textContent = result;
    firstNumber = result.toString();
    currentOperator = '';
    secondNumber = '';
}

// Dodawanie wpisu do historii
function addHistoryEntry(firstNum, operator, secondNum, result) {
    const historyItem = document.createElement('li');
    historyItem.textContent = `${firstNum} ${operator} ${secondNum} = ${result}`;
    historyItem.classList.add('history-item');
    historyList.appendChild(historyItem);
}

// Czyszczenie historii
function clearCalculationHistory() {
    historyList.innerHTML = '';
    clearHistoryBtn.classList.remove('active');
}

// Resetowanie kalkulatora
function resetCalculator() {
    display.textContent = '';
    firstNumber = '';
    currentOperator = '';
    secondNumber = '';
}

// Obsługa backspace
function handleBackspace() {
    if (currentOperator !== '') {
        if (secondNumber.length > 0) {
            secondNumber = secondNumber.slice(0, -1);
            display.textContent = `${firstNumber} ${currentOperator} ${secondNumber}`;
        } else {
            currentOperator = '';
            display.textContent = firstNumber;
        }
    } else if (firstNumber.length > 0) {
        firstNumber = firstNumber.slice(0, -1);
        display.textContent = firstNumber;
    }
    
    if (display.textContent === '') {
        resetCalculator();
    }
}

// Obsługa klawiatury
function handleKeyboardInput(e) {
    if (!isValidKey(e.key)) return;
    e.preventDefault();
    
    switch (true) {
        case /^[0-9.]$/.test(e.key):
            handleNumberInput(e.key);
            break;
        case isOperator(e.key):
            handleOperator(e.key);
            break;
        case e.key === 'Enter':
            calculateResult();
            break;
        case e.key === 'Escape':
            resetCalculator();
            break;
        case e.key === 'Backspace' || e.key === 'Delete':
            handleBackspace();
            break;
    }
}

// Nasłuchiwanie zdarzeń przycisków
numberBtns.forEach(btn => {
    btn.addEventListener('click', () => handleNumberInput(btn.textContent));
});

operatorBtns.forEach(btn => {
    btn.addEventListener('click', () => handleOperator(btn.textContent));
});

equalsBtn.addEventListener('click', calculateResult);
clearBtn.addEventListener('click', resetCalculator);
clearHistoryBtn.addEventListener('click', clearCalculationHistory);

// Nasłuchiwanie zdarzeń klawiatury
document.addEventListener('keydown', handleKeyboardInput);