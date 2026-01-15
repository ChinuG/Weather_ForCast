const API_KEY = "API_KEY";

/* ELEMENTS */
const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const errorMsg = document.getElementById("errorMsg");

const searchCards = document.getElementById("searchCards");
const popularCards = document.getElementById("popularCards");

/* CAROUSEL BUTTONS */
const searchLeft = document.getElementById("searchLeft");
const searchRight = document.getElementById("searchRight");
const popularLeft = document.getElementById("popularLeft");
const popularRight = document.getElementById("popularRight");

/* STATE */
let searchedCities = [];
let searchScroll = 0;
let popularScroll = 0;

/* SEARCH CITY */
searchBtn.addEventListener("click", () => {
    const city = input.value.trim();
    errorMsg.innerText = "";

    if (!city) return;

    fetchWeather(city, true);
});

/* FETCH WEATHER */
function fetchWeather(city, isSearch) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                errorMsg.innerText = "City not found ❌";
                return;
            }

            if (isSearch) {
                if (searchedCities.includes(data.name)) {
                    input.value = "";
                    return;
                }
                searchedCities.push(data.name);
                addCard(data, searchCards);
                applyTheme(data);
                input.value = "";
            } else {
                addCard(data, popularCards);
            }
        });
}

/* CREATE CARD */
function addCard(data, container) {
    const card = document.createElement("div");
    card.className = "weather-card";

    card.innerHTML = `
        <div class="emoji">${getEmoji(data.weather[0].main)}</div>
        <h3>${data.name}</h3>
        <div class="temp">${Math.round(data.main.temp)}°C</div>
        <p>${data.weather[0].description}</p>
    `;

    container.appendChild(card);
}

/* EMOJI LOGIC */
function getEmoji(type) {
    const t = type.toLowerCase();
    if (t.includes("clear")) return "☀️";
    if (t.includes("cloud")) return "☁️";
    if (t.includes("rain")) return "🌧️";
    if (t.includes("snow")) return "❄️";
    if (t.includes("thunder")) return "⛈️";
    return "🌤️";
}

/* SEARCH CAROUSEL */
searchLeft.onclick = () => {
    searchScroll = Math.max(0, searchScroll - 220);
    searchCards.scrollLeft = searchScroll;
};
searchRight.onclick = () => {
    searchScroll += 220;
    searchCards.scrollLeft = searchScroll;
};

/* POPULAR CITIES (INDIA) */
const popularIndianCities = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Kolkata", "Surat",
    "Indore", "Bhopal", "Nagpur", "Noida", "Gurgaon"
];

popularIndianCities.forEach(city => fetchWeather(city, false));

popularLeft.onclick = () => {
    popularScroll = Math.max(0, popularScroll - 220);
    popularCards.scrollLeft = popularScroll;
};
popularRight.onclick = () => {
    popularScroll += 220;
    popularCards.scrollLeft = popularScroll;
};

/* THEME */
function applyTheme(data) {
    document.body.className = "";

    const temp = data.main.temp;
    const main = data.weather[0].main.toLowerCase();

    if (main.includes("rain")) document.body.classList.add("theme-rainy");
    else if (main.includes("cloud")) document.body.classList.add("theme-cloudy");
    else if (temp <= 10) document.body.classList.add("theme-cold");
    else if (temp >= 30) document.body.classList.add("theme-sunny");
}
