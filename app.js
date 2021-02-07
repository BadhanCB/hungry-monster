const getMealDetails = async api =>{
    const response = await fetch(api);
    const data = await response.json();
    return data.meals[0];
}

const displayMealDetails = mealId => {
    const api = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const detailsSection = document.getElementById("details-area");

    getMealDetails(api).then(detailsInfo => {
        const info = `
            <div>
                <img src="${detailsInfo.strMealThumb}">
                <h1>${detailsInfo.strMeal}</h1>
                <h4>Ingredients</h4>
                <ul id="ingredients-list"></ul>
            </div>
        `;

        detailsSection.innerHTML = info;
        for (let i = 1; i <= 20; i++) {
            const ingredient = `strIngredient${i}`;
            const ingredientMeasure = `strMeasure${i}`;

            //"if" used to ignore null or empty("") value  
            if(detailsInfo[ingredient]){
                const listItem = document.createElement("li");
                listItem.innerText = `${detailsInfo[ingredientMeasure]} ${detailsInfo[ingredient]}`;
                document.getElementById("ingredients-list").appendChild(listItem);
            }
        }
    }).catch(error => {
        document.getElementById("error-message").innerText = "Connection Lost! Please Check Your Internet Connection";
        document.getElementById("error-message").style.display = "block";
    });
}

const getMealSearchResult = async api => {
    const response = await fetch(api);
    const data = await response.json();
    return data.meals;
}

//to display food image and name into search result section
const displaySearchResult = mealName => {
    const api = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    const resultSection = document.getElementById("search-results-area");

    getMealSearchResult(api).then( data => {
        data.map(meal => {
            const mealDiv = document.createElement("div");
            const mealInfo = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}<h3>
            `;
            mealDiv.innerHTML = mealInfo;
            resultSection.appendChild(mealDiv);

            mealDiv.addEventListener("click", () => {
                document.getElementById("search-bar").style.display = "none";
                document.getElementById("search-results-area").style.display = "none";
                document.getElementById("details-area").style.display = "block";
                displayMealDetails(meal.idMeal);
            });
        });
    }).catch(error => {
        document.getElementById("error-message").style.display = "block";
    });
}

//function expression to get input from search bar input element
const getInputValue = () => document.getElementById("meal-input").value;

//to add event handler to the search button
document.getElementById("search-btn").addEventListener("click", () => {
    document.getElementById("search-results-area").innerHTML = '';
    document.getElementById("error-message").style.display = "none";
    const mealName = getInputValue();
    displaySearchResult(mealName);
});