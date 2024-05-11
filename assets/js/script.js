"use strict";

const searchBtn = document.querySelector( ".search-btn" );
const searchInput = document.querySelector( ".search-input" );
const searchTooltip = document.querySelector( ".search-tooltip" );
const searchHistoryBtn = document.querySelector( ".search-history-btn" );
const searchHistoryList = document.querySelector( ".search-history-list" );
const forecast = document.querySelector( ".forecast" );
const primaryForecast = document.querySelector( ".primary-forecast" );
const otherForecastCards = document.querySelector( ".other-forecast-cards" );
const historyCities = JSON.parse( localStorage.getItem( "historyCities" ) ) || [];

const apiObj = {
  key: "873da18ac866fdce4b4c52d044835c91",
  geoCodeURL: "https://api.openweathermap.org/geo/1.0/direct",
  weatherURL: "https://api.openweathermap.org/data/2.5/forecast",
  currentWeatherURL: "https://api.openweathermap.org/data/2.5/weather"
};

// Clear searchInput field
const clearSearchInput = function() {
  searchInput.value = "";
}

// Pull data from API
const fetchApi = function() {
  return new Promise( function( resolve, reject ) {
    const dataObj = {};
    fetch( `${ apiObj.geoCodeURL }?q=${ searchInput.value }&appid=${ apiObj.key }` )
    .then( function( res ) {
      return res.json();
    } )
    .then( function( geoCodeData ) {
        const { lat, lon, country, name: city, state } = geoCodeData[ 0 ];
        dataObj.city = city;
        dataObj.state = state;
        dataObj.country = country;
        dataObj.lat = lat;
        dataObj.lon = lon;
        return fetch( `${ apiObj.currentWeatherURL }?lat=${ lat }&lon=${ lon }&appid=${ apiObj.key }&units=imperial` );
    } )
    .then( function( res ) {
      return res.json();
    } )
    .then( function( currentWeatherData ) {
      dataObj.weatherData = currentWeatherData;
      return fetch( `${ apiObj.weatherURL }?lat=${ dataObj.lat }&lon=${ dataObj.lon }&appid=${ apiObj.key }&units=imperial` );
    } )
    .then( function( res ) {
      return res.json();
    } )
    .then( function( forecastData ) {
      if( !searchTooltip.classList.contains( "hide" ) ) searchTooltip.classList.add( "hide" );
      dataObj.otherForecastData = forecastData.list;
      resolve( dataObj );
    } )
    .catch( function( error ) {
      // display an invalid tooltip
      searchTooltip.classList.remove( "hide" );
      clearSearchInput();
    })
  } );
}

// Creating a formatted date
const createFormatDate = function( unformattedDate ) {
  const date = new Date( unformattedDate );
  const dateFormatter = new Intl.DateTimeFormat( "en-US", {
    year : "numeric",
    month : "2-digit",
    day : "2-digit"
  } );
  return dateFormatter.format( date );
}

const createOtherForecastsHTML = function( otherForecasts ) {
  let otherForcastsHTML = ``;
  for( const forecast of otherForecasts ) {
    const hour = new Date( forecast.dt_txt ).getHours();
    if( hour - 12 === 3 ) {
      const date = createFormatDate( forecast.dt_txt );
      const weatherIcon = forecast.weather[ 0 ].icon;
      const temp = forecast.main.temp;
      const humidity = forecast.main.humidity;
      const wind = forecast.wind.speed;
      otherForcastsHTML +=
        `<div class="forecast-card">
          <p class="forecast-card-date">${ date }</p>
          <img src="https://openweathermap.org/img/wn/${ weatherIcon }@2x.png" alt="Icon of the forecast" class="forecast-card-img">
          <div class="forecast-card-info">
            <p class="forecast-card-temp">Temp: ${ temp }°F</p>
            <p class="forecast-card-wind">Wind: ${ wind } MPH</p>
            <p class="forecast-card-humidity">Humidity: ${ humidity }%</p>
          </div>
        </div>`
    }
  }
  return otherForcastsHTML;
}

const createUniqueId = function( dataObj ) {
  let uniqueId = "";
  for( let i = 0; i < 10; i++ ) {
    uniqueId+= String.fromCharCode( Math.floor( Math.random() * 26 ) + 97 );
  }
  dataObj.uniqueId = dataObj.uniqueId || uniqueId;
  return dataObj;
}

const createFullForecast = function( dataObj ) {
  createUniqueId( dataObj );
  const { city, state, country, uniqueId, weatherData: { main : { humidity, temp }, wind : { speed }, weather } } = dataObj;
  const weatherIcon = weather[ 0 ].icon;
  const currentDate = createFormatDate( Date.now() );
  const otherForecastsHTML = createOtherForecastsHTML( dataObj.otherForecastData );
  let fullForecastHTML = 
    `<div class="primary-forecast" data-id="${ uniqueId }">
      <div class="forecast-city-img-wrapper">
        <h2 class="primary-forecast-city">${ city }, ${ state ? `${ state },` : "" } ${ country } ${ currentDate }</h2>
        <img src="https://openweathermap.org/img/wn/${ weatherIcon }@2x.png" alt="Icon of the forecast" class="primary-forecast-img">
      </div>
      <p class="primary-forecast-temp">Temp: ${ temp }°F</p>
      <p class="primary-forecast-wind">Wind: ${ speed } MPH</p>
      <p class="primary-forecast-humidity">Humidity: ${ humidity }%</p>
    </div>`;
  primaryForecast.innerHTML = fullForecastHTML;
  otherForecastCards.innerHTML = otherForecastsHTML;
}

const createHistoryCitiesHTML = function( historyCities ) {
  let html = ``;
  for( const historyCity of historyCities ) {
    const { city, uniqueId } = historyCity;
    html += `<li class="search-history-item" tabindex="0" data-id="${ uniqueId }">${ city }</li>`;
  }
  return html;
}

const setSearchHistoryListMaxHeight = function() {
  searchHistoryList.style.maxHeight = `${ searchHistoryList.scrollHeight }px`;
}

const renderHistoryCitiesHTML = function( historyCities ) {
  searchHistoryList.innerHTML = createHistoryCitiesHTML( historyCities );
  if( searchHistoryList.dataset.state === "visible" ) setSearchHistoryListMaxHeight();
}

const addToHistoryCities = function( dataObj ) {
  if( historyCities.length === 0 ) {
    historyCities.push( dataObj );
  } else {
    let existsInArray = false;
    for( const city of historyCities ) {
      if( dataObj.lat === city.lat && dataObj.lon === city.lon ) {
        existsInArray = true;
        break;
      }
    }
    if( !existsInArray ) historyCities.push( dataObj );
  }
}

searchHistoryBtn.addEventListener( "click", function() {
  if( searchHistoryList.dataset.state === "hidden" ) {
    setSearchHistoryListMaxHeight();
    searchHistoryList.dataset.state = "visible";
  } else {
    searchHistoryList.style.maxHeight = "0px";
    searchHistoryList.dataset.state = "hidden";
  }
} );

searchBtn.addEventListener( "click", function( event ) {
  event.preventDefault();
  fetchApi()
    .then( function( dataObj ) {
      createFullForecast( dataObj );
      addToHistoryCities( dataObj );
      localStorage.setItem( "historyCities", JSON.stringify( historyCities ) );
      renderHistoryCitiesHTML( historyCities );
      clearSearchInput();
    } );
} );

searchHistoryList.addEventListener( "click", function( event ) {
  const target = event.target;
  if( target.classList.contains( "search-history-item" ) ) {
    for( const city of historyCities ) {
      if( target.dataset.id === city.uniqueId ) {
        createFullForecast( city );
      }
    }
  }
} );

const app = function() {
  renderHistoryCitiesHTML( historyCities );
}

app();