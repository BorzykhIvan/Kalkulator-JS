// Konfiguracja math.js
math.config({
    number: 'BigNumber',
    precision: 64
  });
  
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
  
  // Funkcje pomocnicze
  function isValidKey(key) {
      return /^[0-9.]$/.test(key) || 
             ['+', '-', '*', '/', '^', 'Enter', 'Escape', 'Backspace', 'Delete'].includes(key);
  }
  
  function isOperator(key) {
      return ['+', '-', '*', '/', '^'].includes(key);
  }
  
  function formatNumber(num) {
      // Formatuje wynik, usuwając niepotrzebne zera dziesiętne
      const str = num.toString();
      if (str.indexOf('.') !== -1) {
          return str.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
      }
      return str;
  }
  
  // Obsługa liczb
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
  
  // Obliczenia z użyciem BigNumber
  function calculateResult() {
      if (firstNumber === '' || secondNumber === '' || currentOperator === '') return;
  
      try {
          const num1 = math.bignumber(firstNumber);
          const num2 = math.bignumber(secondNumber);
          let result;
  
          switch (currentOperator) {
              case '+':
                  result = math.add(num1, num2);
                  break;
              case '-':
                  result = math.subtract(num1, num2);
                  break;
              case '*':
                  result = math.multiply(num1, num2);
                  break;
              case '/':
                  result = math.divide(num1, num2);
                  break;
              case '^':
                  result = math.pow(num1, num2);
                  break;
              default:
                  return;
          }
  
          const resultNumber = parseFloat(result.toString());
          addHistoryEntry(firstNumber, currentOperator, secondNumber, resultNumber);
          clearHistoryBtn.classList.add('active');
  
          display.textContent = formatNumber(result.toString());
          firstNumber = result.toString();
          currentOperator = '';
          secondNumber = '';
      } catch (error) {
          display.textContent = 'Error';
          firstNumber = '';
          currentOperator = '';
          secondNumber = '';
      }
  }
  
  // Pozostałe funkcje pozostają bez zmian
  function addHistoryEntry(firstNum, operator, secondNum, result) {
      const historyItem = document.createElement('li');
      historyItem.textContent = `${firstNum} ${operator} ${secondNum} = ${formatNumber(result.toString())}`;
      historyItem.classList.add('history-item');
      historyList.appendChild(historyItem);
  }
  
  function clearCalculationHistory() {
      historyList.innerHTML = '';
      clearHistoryBtn.classList.remove('active');
  }
  
  function resetCalculator() {
      display.textContent = '';
      firstNumber = '';
      currentOperator = '';
      secondNumber = '';
  }
  
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
  
  // Inicjalizacja event listeners
  numberBtns.forEach(btn => {
      btn.addEventListener('click', () => handleNumberInput(btn.textContent));
  });
  
  operatorBtns.forEach(btn => {
      btn.addEventListener('click', () => handleOperator(btn.textContent));
  });
  
  equalsBtn.addEventListener('click', calculateResult);
  clearBtn.addEventListener('click', resetCalculator);
  clearHistoryBtn.addEventListener('click', clearCalculationHistory);
  document.addEventListener('keydown', handleKeyboardInput);