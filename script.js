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
    fetchAllNews();
};

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
        newsDataArr = allNews.flat();
        displayNews(newsDataArr);
    }).catch(error => {
        console.error("Error loading all news:", error);
        newsdetails.innerHTML = '<div class="card"><div class="card-body">Failed to load news</div></div>';
    });
}

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

    // Make the container horizontally scrollable
    newsdetails.style.display = "flex";
    newsdetails.style.overflowX = "auto";
    newsdetails.style.gap = "12px";
    newsdetails.style.padding = "10px";
    newsdetails.style.scrollSnapType = "x mandatory";

    newsArray.forEach(news => {
        const newsCard = document.createElement("div");
        newsCard.style.flex = "0 0 auto"; // important for horizontal scroll
        newsCard.style.width = "300px";
        newsCard.style.background = "#f9f9f9";
        newsCard.style.borderRadius = "12px";
        newsCard.style.padding = "10px";
        newsCard.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
        newsCard.style.display = "flex";
        newsCard.style.flexDirection = "column";
        newsCard.style.scrollSnapAlign = "start";

        const img = document.createElement("img");
        img.src = news.urlToImage;
        img.alt = "News";
        img.style.width = "100%";
        img.style.height = "150px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "8px";
        img.style.marginBottom = "8px";

        const title = document.createElement("h6");
        title.innerText = news.title;
        title.style.fontSize = "1rem";
        title.style.fontWeight = "600";
        title.style.margin = "0 0 6px 0";

        const desc = document.createElement("p");
        desc.innerText = news.description;
        desc.style.fontSize = "0.85rem";
        desc.style.margin = "0 0 6px 0";
        desc.style.color = "#444";

        const link = document.createElement("a");
        link.href = news.url;
        link.innerText = "Read More";
        link.style.fontSize = "0.85rem";
        link.style.color = "#007bff";
        link.style.textDecoration = "none";

        link.addEventListener("mouseover", () => link.style.textDecoration = "underline");
        link.addEventListener("mouseout", () => link.style.textDecoration = "none");

        newsCard.appendChild(img);
        newsCard.appendChild(title);
        newsCard.appendChild(desc);
        newsCard.appendChild(link);

        newsdetails.appendChild(newsCard);
    });
}



