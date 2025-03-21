const themeBtn = document.querySelector("#theme");
let currentMode = "Dark";
const root = document.documentElement;
const resetBtn = document.querySelector("#reset");

const from = document.querySelector(".from select");
const to = document.querySelector(".to select");
const btn = document.querySelector("form button");
const exgBtn = document.querySelector("form i");
const key = "YOUR_API_KEY";
const dropdowns = document.querySelectorAll(".dropdown select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    let latestFrom = from.value;
    let latestTo = to.value;
    let apiURL = `https://v6.exchangerate-api.com/v6/${key}/latest/${latestFrom}`;

    let response = await fetch(apiURL);
    let data = await response.json();

    if (data.result !== "success") {
        msg.style.visibility = "visible";
        msg.innerText = "Error fetching exchange rates!";
        return;
    }

    let exgValue = data.conversion_rates[latestTo];
    let finalAmount = (amtVal * exgValue).toFixed(2);

    msg.style.visibility = "visible";
    msg.innerText = `${amtVal} ${latestFrom} = ${finalAmount} ${latestTo}`;
};

const exchangeSelect = () => {
    let temp = from.value;
    from.value = to.value;
    to.value = temp;
    updateFlag(from);
    updateFlag(to);
    updateExchangeRate();
};

const themechange = () => {
    if (currentMode === "Dark") {
        currentMode = "Light";
        root.style.setProperty("--color1", "#fefefe");
        root.style.setProperty("--color2", "#282727");
        root.style.setProperty("--color3", "green");
        themeBtn.innerText = "Light";
    } else {
        currentMode = "Dark";
        root.style.setProperty("--color1", "#282727");
        root.style.setProperty("--color2", "#fefefe");
        root.style.setProperty("--color3", "green");
        themeBtn.innerText = "Dark";
    }
};

const reset = () => {
    let amount = document.querySelector(".amount input");
    amount.value = 1;
    from.value = "USD";
    to.value = "INR";
    updateFlag(from);
    updateFlag(to)
    updateExchangeRate();
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

exgBtn.addEventListener("click", () => {
    exchangeSelect();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});

resetBtn.addEventListener("click",reset);
themeBtn.addEventListener("click", themechange);