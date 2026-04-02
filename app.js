// ==============================
// GLOBAL ELEMENTS
// ==============================

const loader = document.getElementById("loader");

// ==============================
// COUNTRY DATA (currency map)
// ==============================

const countryList = {
  USD: "US",
  INR: "IN",
  EUR: "FR",
  GBP: "GB",
  AUD: "AU",
  CAD: "CA",
  JPY: "JP",
  CNY: "CN",
  RUB: "RU",
  BRL: "BR",
  ZAR: "ZA",
  AED: "AE",
  SGD: "SG"
};

// ==============================
// DROPDOWN SETUP
// ==============================

const dropdowns = document.querySelectorAll(".currency-select");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }
    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
}

// ==============================
// UPDATE FLAG
// ==============================

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");

  img.src = `https://flagsapi.com/${countryCode}/flat/32.png`;
};

// ==============================
// CURRENCY CONVERTER
// ==============================

const convertBtn = document.querySelector(".convert-btn");

convertBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  loader.classList.remove("hidden");

  let amount = document.querySelector(".amount-input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const fromCurr = document.querySelector("[name='from']").value;
  const toCurr = document.querySelector("[name='to']").value;

  try {
    let res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurr}`);
    let data = await res.json();

    let rate = data.rates[toCurr];
    let finalAmount = amtVal * rate;

    document.querySelector(".result-value").innerText =
      `${amtVal} ${fromCurr} = ${finalAmount.toFixed(2)} ${toCurr}`;

  } catch (err) {
    document.querySelector(".result-value").innerText = "Conversion failed";
  }

  loader.classList.add("hidden");
});

// ==============================
// COUNTRY SEARCH (REST API)
// ==============================

const quickInput = document.querySelector(".country-input");
const quickBtn = document.querySelector(".search-btn");
const quickResult = document.querySelector(".result-container");
const quickSkeleton = document.getElementById("quick-skeleton");

quickBtn.addEventListener("click", async () => {
  let name = quickInput.value.trim();

  if (!name) {
    quickResult.innerHTML = "Enter a country name";
    return;
  }

  loader.classList.remove("hidden");
  quickSkeleton.classList.remove("hidden");

  try {
    let res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    let data = await res.json();
    let c = data[0];

    let currency = Object.keys(c.currencies)[0];

    quickResult.innerHTML = `
      <div class="country-card">
        <h3>${c.name.common}</h3>
        <p>Capital: ${c.capital?.[0] || "N/A"}</p>
        <p>Currency: ${currency}</p>
      </div>
    `;

  } catch {
    quickResult.innerHTML = "Country not found";
  }

  loader.classList.add("hidden");
  quickSkeleton.classList.add("hidden");
});

// ==============================
// COUNTRY DETAILS (WIKI)
// ==============================

const searchBtn = document.getElementById("btn");
const skeleton = document.getElementById("country-skeleton");

searchBtn.addEventListener("click", () => {
  let country = document.getElementById("countryInput").value.trim();

  if (!country) {
    alert("Enter country name");
    return;
  }

  getCountryData(country);
});

const getCountryData = async (country) => {
  loader.classList.remove("hidden");
  skeleton.classList.remove("hidden");

  try {
    let res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${country}`
    );
    let data = await res.json();

    if (data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
      throw new Error("Not found");
    }

    document.getElementById("title").innerText = data.title || "";
    document.getElementById("desc").innerText = data.extract || "";
    document.getElementById("flag").src = data.thumbnail?.source || "";

  } catch {
    document.getElementById("title").innerText = "Country not found";
    document.getElementById("desc").innerText = "";
    document.getElementById("flag").src = "";
  }

  loader.classList.add("hidden");
  skeleton.classList.add("hidden");
};

// ==============================
// THEME SWITCH (IMPROVED)
// ==============================

const colorBtn = document.getElementById("colorBtn");

const themes = [
  "linear-gradient(135deg, #0f172a, #1e293b)",
  "linear-gradient(135deg, #1e3a8a, #0ea5e9)",
  "linear-gradient(135deg, #064e3b, #10b981)",
  "linear-gradient(135deg, #7c2d12, #f97316)"
];

colorBtn.addEventListener("click", () => {
  const random = themes[Math.floor(Math.random() * themes.length)];
  document.body.style.background = random;
});