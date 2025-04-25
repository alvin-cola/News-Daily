const generalBtn = document.getElementById("general");
const worldBtn = document.getElementById("world");
const politicsBtn = document.getElementById("politics");
const businessBtn = document.getElementById("business");
const sportsBtn = document.getElementById("sport");
const entertainmentBtn = document.getElementById("entertainment");
const technologyBtn = document.getElementById("technology");
const searchBtn = document.getElementById("searchBtn");
const menuToggle = document.getElementById("menuToggle");

const newsQuery = document.getElementById("newsQuery");
const newsType = document.getElementById("newsType");
const newsdetails = document.getElementById("newsdetails");

let newsDataArr = [];

// Initialize the page with general news
window.onload = function () {
    newsType.innerHTML = "<h4>General News</h4>";
    fetchAllNews();
};

// Event listeners for category buttons
generalBtn.addEventListener("click", () => {
    newsType.innerHTML = "<h4>General News</h4>";
    fetchAllNews();
});

worldBtn.addEventListener("click", () => setCategory("world", "World News"));
politicsBtn.addEventListener("click", () => setCategory("politics", "Politics News"));
businessBtn.addEventListener("click", () => setCategory("business", "Business News"));
sportsBtn.addEventListener("click", () => setCategory("sports", "Sports News"));
entertainmentBtn.addEventListener("click", () => setCategory("entertainment", "Entertainment News"));
technologyBtn.addEventListener("click", () => setCategory("technology", "Technology News"));

// Event listener for search functionality
searchBtn.addEventListener("click", () => {
    const query = newsQuery.value.trim().toLowerCase();
    if (!query) return; // Prevent empty searches
    searchNews(query);
});

// Event listener for mobile menu toggle
menuToggle.addEventListener("click", () => {
    const navMenu = document.querySelector(".header__nav .nav-bar__list");
    navMenu.classList.toggle("nav-bar__list--mobile-active");
});

// Function to set the news category and fetch news
function setCategory(category, title) {
    newsType.innerHTML = `<h4>${title}</h4>`;
    newsdetails.innerHTML = '<div class="news-card news-card--loading">Loading news...</div>'; // Show loading state

    fetchCategoryNews(category)
        .then((data) => {
            newsDataArr = data;
            displayNews(data);
        })
        .catch((error) => {
            console.error(`Error loading ${category} news:`, error);
            newsdetails.innerHTML = '<div class="news-card news-card--error">Failed to load news. Please try again later.</div>';
        });
}

// Function to fetch all news categories
function fetchAllNews() {
    const categories = ["general", "world", "politics", "business", "sports", "entertainment", "technology"];
    const allNewsPromises = categories.map((category) => fetchCategoryNews(category));

    Promise.all(allNewsPromises)
        .then((allNews) => {
            newsDataArr = allNews.flat();
            displayNews(newsDataArr);
        })
        .catch((error) => {
            console.error("Error loading all news:", error);
            newsdetails.innerHTML = '<div class="news-card news-card--error">Failed to load news. Please try again later.</div>';
        });
}

// Function to fetch news by category
function fetchCategoryNews(category) {
    return fetch(`data/${category}.json`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error(`Error loading ${category} news:`, error);
            return []; // Return an empty array to avoid breaking the Promise.all
        });
}

// Function to search news
function searchNews(query) {
    const filteredNews = newsDataArr.filter((news) =>
        news.title.toLowerCase().includes(query) || news.description.toLowerCase().includes(query)
    );
    displayNews(filteredNews);
}

// Function to display news articles
function displayNews(newsArray) {
    newsdetails.innerHTML = ""; // Clear previous news

    if (newsArray.length === 0) {
        newsdetails.innerHTML = '<div class="news-card news-card--empty">No news available.</div>';
        return;
    }

    const newsCards = newsArray.map((news) => {
        const card = document.createElement("article");
        card.classList.add("news-card");

        const img = document.createElement("img");
        img.src = news.urlToImage;
        img.alt = news.title; // Use title as alt text (improve if possible)
        img.classList.add("news-card__image");

        const content = document.createElement("div");
        content.classList.add("news-card__content");

        const title = document.createElement("h2");
        title.textContent = news.title;
        title.classList.add("news-card__title");

        const description = document.createElement("p");
        description.textContent = news.description;
        description.classList.add("news-card__description");

        const link = document.createElement("a");
        link.href = news.url;
        link.textContent = "Read More";
        link.classList.add("news-card__link");

        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(link);

        card.appendChild(img);
        card.appendChild(content);

        return card;
    });

    newsdetails.append(...newsCards);
}
