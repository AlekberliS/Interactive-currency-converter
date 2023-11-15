document.addEventListener("DOMContentLoaded", function() {

  let amountInputs = document.querySelectorAll(".inp");
  let fromCurrencyButtons = document.querySelectorAll(".value1");
  let toCurrencyButtons = document.querySelectorAll(".value2");
  let fromCurrencyOptions = document.querySelectorAll('.val1 button');
  let toCurrencyOptions = document.querySelectorAll('.val2 button');

  let selectedFromCurrency = "RUB";
  let selectedToCurrency = "USD";



  function getExchangeRate(from, to, amount, outputInput) {
      fetch(`https://v6.exchangerate-api.com/v6/dc6ecdd0f8509ad3cf8a9ea6/latest/${from}`)
          .then(response => response.json())
          .then(data => {
              let exchangeRate = data.conversion_rates[to];
              let enteredAmount = parseFloat(amount);

              if (!isNaN(enteredAmount)) {
                  let convertedAmount = (enteredAmount * exchangeRate).toFixed(4);
                  outputInput.value = convertedAmount;

                  document.getElementById('rate1').innerText = `1 ${from} = ${exchangeRate.toFixed(4)} ${to}`;
                  document.getElementById('rate2').innerText = `1 ${to} = ${(1 / exchangeRate).toFixed(4)} ${from}`;
              } else {
               
              }
          })
          .catch(error => {
              console.log("Error fetching exchange rates:", error);
              alert("Internet connection is not available. Please check your connection and try again.");
     
          });
  }

  function updateCurrency(event) {
      if (event.target.classList.contains("v1")) {
          selectedFromCurrency = event.target.innerText;
          handleCurrencyOptionClick(event.target, 'val1');
      } else if (event.target.classList.contains("v2")) {
          selectedToCurrency = event.target.innerText;
          handleCurrencyOptionClick(event.target, 'val2');
      }
      getExchangeRate(selectedFromCurrency, selectedToCurrency, amountInputs[0].value, amountInputs[1]);
  }

  fromCurrencyButtons.forEach(button => {
      button.addEventListener("click", updateCurrency);
  });

  toCurrencyButtons.forEach(button => {
      button.addEventListener("click", updateCurrency);
  });

  amountInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        let trimmedValue = input.value.trim();
        let sanitizedValue = trimmedValue.replace(/[^\d.]/g, '');
        if (!sanitizedValue.includes('.') && sanitizedValue.length > 1) {
            sanitizedValue = sanitizedValue.replace(/^0+/, ''); 
        }


        if (sanitizedValue.length > 10) {
            sanitizedValue = sanitizedValue.slice(0, 10);
        }

        if (sanitizedValue.indexOf('.') !== -1) {
            const dotIndex = sanitizedValue.indexOf('.');
            const integerPart = sanitizedValue.slice(0, dotIndex);
            const decimalPart = sanitizedValue.slice(dotIndex + 1);
            sanitizedValue = `${integerPart}.${decimalPart}`;
        }

        input.value = sanitizedValue;

        if (index === 0) {
            getExchangeRate(selectedFromCurrency, selectedToCurrency, sanitizedValue, amountInputs[1]);
        } else {
            getExchangeRate(selectedToCurrency, selectedFromCurrency, sanitizedValue, amountInputs[0]);
        }
    });
});

  function handleCurrencyOptionClick(option, valClass) {
      const activeOptions = document.querySelectorAll(`.${valClass} .active`);

      if (!option.classList.contains('active')) {
          if (activeOptions.length > 0) {
              activeOptions[0].classList.remove('active');
          }
          option.classList.add('active');
          option.style.display = 'inline-block';
      }

      document.querySelectorAll(`.${valClass} button`).forEach(currencyButton => {
          if (currencyButton !== option && !currencyButton.classList.contains('active')) {
              currencyButton.style.display = 'inline-block';
          }
      });

      if (valClass === 'val1') {
          selectedFromCurrency = option.innerText;
      } else if (valClass === 'val2') {
          selectedToCurrency = option.innerText;
      }
  }

  fromCurrencyOptions.forEach(option => {
      option.addEventListener('click', function() {
          handleCurrencyOptionClick(option, 'val1');
          updateCurrency({ target: option });
      });
  });

  toCurrencyOptions.forEach(option => {
      option.addEventListener('click', function() {
          handleCurrencyOptionClick(option, 'val2');
          updateCurrency({ target: option });
      });
  });

  function setDefaultActiveOptions() {
      const defaultFromOption = document.querySelector('.ru1');
      const defaultToOption = document.querySelector('.us2');

      defaultFromOption.classList.add('active');
      defaultToOption.classList.add('active');
  }

  setDefaultActiveOptions();
});
