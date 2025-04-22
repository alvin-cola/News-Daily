const generalBtn = document.getElementById("general");
const worldBtn = document.getElementById("world");
const politicsBtn = document.getElementById("politics");
const businessBtn = document.getElementById("business");
const sportsBtn = document.getElementById("sport");
const entertainmentBtn = document.getElementById("entertainment");
const technologyBtn = document.getElementById("technology");
const searchBtn = document.getElementById("searchBtn");

const newsQuery = document.getElementById("newsQuery");
const newsType = document.getElementById("newsType");
const newsdetails = document.getElementById("newsdetails");

let newsDataArr = [];

window.onload = function () {
    newsType.innerHTML = "<h4>General News</h4>";
    fetchAllNews();  // Fetch all news at once when the page loads
};

// Event listeners for category buttons
generalBtn.addEventListener("click", () => {
    newsType.innerHTML = "<h4>General News</h4>";
    fetchAllNews();  // Fetch all news (merged from all categories)
});
worldBtn.addEventListener("click", () => setCategory("world", "World News"));
politicsBtn.addEventListener("click", () => setCategory("politics", "Politics News"));
businessBtn.addEventListener("click", () => setCategory("business", "Business News"));
sportsBtn.addEventListener("click", () => setCategory("sports", "Sports News"));
entertainmentBtn.addEventListener("click", () => setCategory("entertainment", "Entertainment News"));
technologyBtn.addEventListener("click", () => setCategory("technology", "Technology News"));

searchBtn.addEventListener("click", () => {
    const query = newsQuery.value.trim().toLowerCase();
    if (query.length === 0) return;
    const filteredNews = newsDataArr.filter(news =>
        news.title.toLowerCase().includes(query) ||
        news.description.toLowerCase().includes(query)
    );
    displayNews(filteredNews);
});

function setCategory(category, title) {
    newsType.innerHTML = `<h4>${title}</h4>`;
    newsdetails.innerHTML = '<div class="card"><div class="card-body">Loading news...</div></div>';

    fetchCategoryNews(category).then(data => {
        newsDataArr = data;
        displayNews(data);
    });
}

function fetchAllNews() {
    const categories = ["general", "world", "politics", "business", "sports", "entertainment", "technology"];
    const allNewsPromises = categories.map(category => fetchCategoryNews(category));

    Promise.all(allNewsPromises).then(allNews => {
        newsDataArr = allNews.flat();  // Merge all the category news into one array
        displayNews(newsDataArr);      // Display all mixed news
    }).catch(error => {
        console.error("Error loading all news:", error);
        newsdetails.innerHTML = '<div class="card"><div class="card-body">Failed to load news</div></div>';
    });
}

// Just fetch and return data (DO NOT display here)
function fetchCategoryNews(category) {
    return fetch(`data/${category}.json`)
        .then(response => response.json())
        .catch(error => {
            console.error(`Error loading ${category} news:`, error);
            return [];
        });
}


function displayNews(newsArray = []) {
    newsdetails.innerHTML = '';

    if (newsArray.length === 0) {
        newsdetails.innerHTML = '<div class="card"><div class="card-body">No news available</div></div>';
        return;
    }

    newsArray.forEach(news => {
        let newsHTML =
            `<div class="col-12 mb-2">
                <div class="d-flex align-items-start bg-light rounded p-2 shadow-sm">
                    <img src="${news.urlToImage}" alt="News" class="me-2" style="width: 150px; height: 90px; object-fit: cover; border-radius: 8px;">
                    <div class="flex-grow-1">
                        <h6 class="mb-1" style="font-size: 1rem; font-weight: 600;">${news.title}</h6>
                        <p class="mb-1" style="font-size: 0.85rem;">${news.description}</p>
                        <a href="${news.url}" class="text-primary" style="font-size: 0.85rem;" >Read More</a>
                    </div>
                </div>
            </div>`;

        newsdetails.innerHTML += newsHTML;
    });
}
