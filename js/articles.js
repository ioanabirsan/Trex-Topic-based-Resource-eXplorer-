/*  Resources:
    1. https://www.rss2json.com/
    2. https://www.developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
    3. https://css-tricks.com/snippets/css/complete-guide-grid/
    4. https://css-tricks.com/snippets/javascript/get-url-and-url-parts-in-javascript/
*/

// Test limited view api words: aaaaa || aaaa || aaa

var pathArray = window.location.pathname.split('/');
var getCurrentURL = window.location.protocol + "//" + window.location.host + "/" + pathArray[1];
var displayType = 'grid-view';
var feedStart = 0;
var feedNext = 0;
var FeedButtonDisplay = function (display) {
    document.getElementsByClassName('feed-button')[0].style.display = display;
};

function registerArticlesEventHandlers() {
    var input = document.getElementById('search-bar-articles');

    input.addEventListener('keydown', function (event) {
        handleEnterKeyForArticlesSearchBar(event);
    });
}

function handleEnterKeyForArticlesSearchBar(event) {
    if (event.keyCode === 13) {
        getDefaultRSS('newFeed');
    }
}

function getDefaultRSS(requestedFeed) {
    var newSearch = false;
    var searchTermsBar = document.getElementById('search-bar-articles').value;
    var uri;
    if (requestedFeed === "newFeed") {
        clearDisplayedArticles();
        if (searchTermsBar.trim() !== "")
            helpMe("loading");
        newSearch = true;
        feedStart = 0;
        feedNext = 0;
    }
    if (searchTermsBar.trim() === "") {
        FeedButtonDisplay("none");
        helpMe("defaultMessage");
        return;
    } else {
        feedStart = feedNext;
        feedNext += 15;
        uri = getSearchUri();
    }
    getRequest(uri, displayArticles, newSearch);
}

function getSearchUri() {
    return getCurrentURL + "/api/articles?" + getAllParams();
    // return "http://localhost:81/trex/api/articles?" + getAllParams();
}

function getAllParams() {
    var searchTerms = document.getElementById('search-bar-articles').value;

    var orderBy = document.getElementById("article-sortBy-select");
    var orderBySelect = orderBy.options[orderBy.selectedIndex].value;

    var orderSort = document.getElementById("article-sortOrder-select");
    var orderSortSelect = orderSort.options[orderSort.selectedIndex].value;

    var Params = "";

    Params = 'ti=\"' + searchTerms + '\"';
    Params += "&sortBy=" + orderBySelect;
    Params += "&sortOrder=" + orderSortSelect;
    Params += "&start=" + feedStart;
    Params += "&max_results=15";

    return Params;
}

function clearDisplayedArticles() {
    var displayResults = document.getElementById('display-art-results');
    while (displayResults.hasChildNodes()) {
        displayResults.removeChild(displayResults.lastChild);
    }
}

function displayArticles(reqRes, newReq) {
    document.getElementsByClassName("article-display-type")[0].style.pointerEvents = "auto";
    if (newReq) clearDisplayedArticles();

    var articles = reqRes.response;
    var index;

    if (articles === null) {
        if(newReq) {
            helpMe("404");
        } else {
            FeedButtonDisplay("none");
        }
        return;
    }

    if (articles.articles.length < (feedNext - feedStart)) {
        FeedButtonDisplay("none");
    } else {
        FeedButtonDisplay("initial");
    }

    for (index = 0; index < articles.articles.length; index++) {
        var article = articles.articles[index];
        appendArticleInfoToResultsArea(article);
    }
    selectArticleDisplayType(displayType);
    fixArticleHeight();
}

function fixArticleHeight() {
    var ArtResult = document.getElementsByClassName("articleNo");
    for (var i = 0; i <= ArtResult.length; i++) {
        if (ArtResult[i] !== undefined) {
            var img = ArtResult[i].querySelector("img").clientHeight;
            var desc = ArtResult[i].querySelector("div").clientHeight;
        }
        if (img + desc >= 384) {
            ArtResult[i].removeAttribute("style");
        }
    }
}

function appendArticleInfoToResultsArea(article) {
    var displayResults = document.getElementById('display-art-results');
    var content = createArticlesDiv(article);
    displayResults.appendChild(content);
}

function createArticlesDiv(article) {
    var resourceDiv = document.createElement('li');
    resourceDiv.classList.add('articleNo');

    createArticleImageDiv(article, resourceDiv);
    return resourceDiv;
}

function createArticleImageDiv(article, resourceDiv) {
    var link = document.createElement('a');
    if (article.link !== undefined)
        link.href = article.link;
    else
        link.href = article.url[1]["@attributes"]['href'];
    link.target = "_blank";

    var image = document.createElement('img');
    if ((article.thumbnail == "") || (article.thumbnail === undefined)) {
        image.src = "images/article/dn_bg.png";
    } else {
        image.src = article.thumbnail;
    }
    var articlePostInfo = createArticlePostInfo(article);
    resourceDiv.appendChild(link).appendChild(image);
    resourceDiv.appendChild(link).appendChild(articlePostInfo);
}

function createArticlePostInfo(article) {
    var info = document.createElement('div');
    info.classList.add('articlePostInfo');

    // add Article title
    var h3 = document.createElement("h3");
    var title = document.createTextNode(article.title);
    h3.appendChild(title);
    info.appendChild(h3);

    // add pubDate
    var p = document.createElement("p");
    if (article.pubDate !== undefined)
        var description = document.createTextNode(article.pubDate);
    else
        var description = document.createTextNode(article.description);
    p.appendChild(description);
    info.appendChild(p);

    // add Article author
    var h4 = document.createElement("h4");
    if (article.authors != undefined) {
        var author = document.createTextNode(article.authors);
    } else {
        var author = document.createTextNode(article.author);
    }
    h4.appendChild(author);
    info.appendChild(h4);

    return info;
}

function selectArticleDisplayType(displayTemp) {
    displayType = displayTemp;
    var listView = document.getElementsByClassName("article-display-type")[0].children[0];
    var gridView = document.getElementsByClassName("article-display-type")[0].children[1];
    if (displayType == 'list-view') {
        document.getElementById("display-art-results").classList.remove("generatedElementsNoGrid");
        document.getElementById("display-art-results").classList.remove("generatedElementsAGrid");
        document.getElementById("display-art-results").classList.add("generatedElementsAList");
        listView.querySelector("img").src = "images/article/listview_active.svg";
        gridView.querySelector("img").src = "images/article/gridview_inactive.svg";
    } else {
        document.getElementById("display-art-results").classList.remove("generatedElementsNoGrid");
        document.getElementById("display-art-results").classList.remove("generatedElementsAList");
        document.getElementById("display-art-results").classList.add("generatedElementsAGrid");
        listView.querySelector("img").src = "images/article/listview_inactive.svg";
        gridView.querySelector("img").src = "images/article/gridview_active.svg";
    }
}

function helpMe(withThis) {
    var displayNotFound = document.getElementById('display-art-results');
    var image = document.createElement('img');
    var mainContainer = document.createElement('div');
    switch (withThis) {
        case "404":
            document.getElementsByClassName("article-display-type")[0].style.pointerEvents = "none";
            addGhost(mainContainer);
            FeedButtonDisplay("none");
            displayNotFound.appendChild(mainContainer);
            break;
        case "loading":
            image.src = "images/pages/loading.gif";
            image.style.maxWidth = "100%";
            image.style.margin = "0 auto";
            image.style.padding = "50px 0";
            FeedButtonDisplay("none");
            displayNotFound.appendChild(image);
            break;
        case "defaultMessage":
            document.getElementsByClassName("article-display-type")[0].style.pointerEvents = "none";
            image.src = "images/pages/defaultSearch.png";
            image.style.maxWidth = "50%";
            image.style.margin = "0 auto";
            image.style.padding = "50px 0 0 0";
            FeedButtonDisplay("none");
            var quote = document.createElement('h1');
            quote.innerHTML = "Remember to look up at the stars and not down at your feet. <br> But for now, go ahead and search something cool to read";
            displayNotFound.appendChild(quote);
            displayNotFound.appendChild(image);
            break;
        default:
            break;
    }
    var articlePage = document.getElementById("articles").querySelector("section");
    articlePage.style.backgroundColor = "white";
    document.getElementById("display-art-results").classList.remove("generatedElementsAGrid");
    document.getElementById("display-art-results").classList.remove("generatedElementsAList");
    document.getElementById("display-art-results").classList.add("generatedElementsNoGrid");
}

function addGhost(mainContainer) {
    mainContainer.classList.add('notFound404');
    var errorRespond = document.createElement('div');
    var respondeTitle = document.createElement('h1');
    respondeTitle.innerHTML = "404";
    var respondeMessage = document.createElement('h3');
    respondeMessage.innerHTML = "page not found";
    errorRespond.appendChild(respondeTitle);
    errorRespond.appendChild(respondeMessage);
    mainContainer.appendChild(errorRespond);
    var GContainer1 = document.createElement('div');
    GContainer1.classList.add('container404');
    var GhostCopy = document.createElement('div');
    GhostCopy.classList.add('ghost-copy');
    var GhostCopy1 = document.createElement('div');
    GhostCopy1.classList.add('one');
    var GhostCopy2 = document.createElement('div');
    GhostCopy2.classList.add('two');
    var GhostCopy3 = document.createElement('div');
    GhostCopy3.classList.add('three');
    var GhostCopy4 = document.createElement('div');
    GhostCopy4.classList.add('four');
    GhostCopy.appendChild(GhostCopy1);
    GhostCopy.appendChild(GhostCopy2);
    GhostCopy.appendChild(GhostCopy3);
    GhostCopy.appendChild(GhostCopy4);
    GContainer1.appendChild(GhostCopy);
    var GContainer2 = document.createElement('div');
    GContainer2.classList.add('ghost');
    var GhostCopy2 = document.createElement('div');
    GhostCopy2.classList.add('face');
    var GhostCopy5 = document.createElement('div');
    GhostCopy5.classList.add('eye');
    var GhostCopy6 = document.createElement('div');
    GhostCopy6.classList.add('eye-right');
    var GhostCopy7 = document.createElement('div');
    GhostCopy7.classList.add('mouth');
    GhostCopy2.appendChild(GhostCopy5);
    GhostCopy2.appendChild(GhostCopy6);
    GhostCopy2.appendChild(GhostCopy7);
    GContainer2.appendChild(GhostCopy2);
    GContainer1.appendChild(GContainer2);
    var Shadow = document.createElement('div');
    Shadow.classList.add('shadow');
    GContainer1.appendChild(Shadow);
    mainContainer.appendChild(GContainer1);
}
