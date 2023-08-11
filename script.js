const usertab=document.querySelector("[data-userWeather]");
const searchtab=document.querySelector("[data-searchWeather]");
const weatherContainer=document.querySelector(".weather-container");
const grantAccessContainer =document.querySelector(".grant-location");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorcontainer=document.querySelector(".error-container");

// Initially needed varriables

let currentTab=usertab;
const API_KEY= 'ac2901b818b0a4c53fe0cca744908004';
currentTab.classList.add("current-tab");
getfromSessionStorage();

//TAB Switching Code
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        searchInput.value=""; //if want to refresh the search input whenever tab is switched inlude this line of code
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            console.log("removed succesfully");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            console.log("Switch tab to search");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //Local Storage for coordinates
            // console.log("Switch tab to main");
            getfromSessionStorage(); 
        }


    }
}

usertab.addEventListener("click",() =>{
    //pass the clicked tab as input
    switchTab(usertab)
});

searchtab.addEventListener("click",() =>{
    switchTab(searchtab)
});

//check the coordinates is already present or not
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-Coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates= JSON.parse(localCoordinates);

    fetchUserWeatherInfo(coordinates);

    }

}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");
    errorcontainer.classList.remove("active");
    loadingScreen.classList.add("active");
    // console.log("Loading screen enabled")

    // API call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json(); // Await for the JSON data to be resolved
        loadingScreen.classList.remove("active");
        errorcontainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        // console.log("api call succesfull");
        renderWeatherInfo(data);
    } catch (err) {
        loadingScreen.classList.remove("active");
        // Handle the error, e.g., show an error message
    }
}
 
function renderWeatherInfo(weatherInfo){
    const cityName= document.querySelector("[data-cityName]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIon]");
    const showTemp= document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudyness= document.querySelector("[data-cloudiness]");


    cityName.innerText= weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    showTemp.innerText=`${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudyness.innerText=`${weatherInfo?.clouds?.all} %`;
}



const grantAccessbtn=document.querySelector("[data-grantAccess]");
 function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        console.log("Geolocatio  is not supported");
    }
 }

 function showPosition(position){

    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude

    }
    sessionStorage.setItem("user-Coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
    //console.log(userCoordinates)

};

grantAccessbtn.addEventListener('click',getLocation);


const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="") 
       return;
    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorcontainer.classList.remove("active");
    

    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        errorcontainer.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        if (!response.ok) {
            throw new Error('API request failed');
          }
        
    }
    catch(err){
        userInfoContainer.classList.remove("active");
        errorcontainer.classList.add("active");


    }


}







