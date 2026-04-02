const dropdowns = document.querySelectorAll(".currency-select");


for (let select of dropdowns) {
  select.innerHTML = "";

  for (let currCode in countryList) {
    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "IND") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newsrc = `https://flagsapi.com/${countryCode}/flat/32.png`;

  let img = element.parentElement.querySelector("img");
  img.src = newsrc;
};
const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const btn = document.querySelector(".convert-btn");

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector(".amount-input");
  let amtVal = amount.value;

  // validation
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // get selected currencies
  const fromCurr = document.querySelector("[name='from']").value;
  const toCurr = document.querySelector("[name='to']").value;

  // API call
  const URL = `${BASE_URL}/${fromCurr}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    let rate = data.rates[toCurr];
    let finalAmount = amtVal * rate;

    // display result
    document.querySelector(".result-value").innerText =
      `${amtVal} ${fromCurr} = ${finalAmount.toFixed(2)} ${toCurr}`;

  } catch (error) {
    console.error("Error:", error);
  }
});


const input = document.querySelector(".country-input");
const searchBtn = document.querySelector(".search-btn");
const result = document.querySelector(".result-container");

const searchCountry = async () => {
  let countryName = input.value.trim();

  if (!countryName) {
    result.innerText = "Please enter a country name";
    return;
  }

  try {
    let response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    let data = await response.json();
    let country = data[0];

    let currencyObj = country.currencies;
    let code = Object.keys(currencyObj)[0];
    let name = currencyObj[code].name;
    let symbol = currencyObj[code].symbol;

    result.innerHTML = `
      <h3>${country.name.common}</h3>
      <p>Capital: ${country.capital?.[0] || "N/A"}</p>
      <p>Currency: ${code} (${name}) ${symbol}</p>
    `;

  } catch (error) {
    result.innerText = "Country not found";
  }
};

// use correct variable
searchBtn.addEventListener("click", searchCountry);

const searchButton = document.querySelector("#btn");

searchButton.addEventListener("click", () => {
    let country = document.querySelector("#countryInput").value.trim();
    if (!country) return alert("Please enter a country name");
    getCountryData(country);
});

const getCountryData = async (country) => {
    try {
        let res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${country}`);
        let data = await res.json();

        if (data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
            document.getElementById("title").innerText = "Country not found";
            document.getElementById("desc").innerText = "";
            document.getElementById("flag").src = "";
            return;
        }

        document.getElementById("title").innerText = data.title || "";
        document.getElementById("desc").innerText = data.extract || "";
        document.getElementById("flag").src = data.thumbnail?.source || "";
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("title").innerText = "Error fetching data";
        document.getElementById("desc").innerText = "";
        document.getElementById("flag").src = "";
    }
};


const colorBtn = document.querySelector("#colorBtn");

const colors = ["#f0f2f5", "#121212", "#e0f0ff", "#e6ffe6", "#ffd6d6", "#fff0e6"];

colorBtn.addEventListener("click", () => {
    // Pick a random color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
});