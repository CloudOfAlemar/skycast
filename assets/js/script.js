const searchHistoryBtn = document.querySelector( ".search-history-btn" );
const searchHistoryList = document.querySelector( ".search-history-list" );

const apiObj = {
  key: "873da18ac866fdce4b4c52d044835c91",
  url: "http://api.openweathermap.org/geo/1.0/direct"
};

const fetchApi = function() {
  fetch( `${ apiObj.url }?q=Norwalk,California,United States&appid=${ apiObj.key }` )
    .then( function( res ) {
      return res.json();
    } )
    .then( function( data ) {
      console.log( data );
    } );
}

searchHistoryBtn.addEventListener( "click", function() {
  const listHeight = searchHistoryList.scrollHeight;
  if( searchHistoryList.dataset.state === "hidden" ) {
    searchHistoryList.style.maxHeight = `${ listHeight }px`;
    searchHistoryList.dataset.state = "visible";
  } else {
    searchHistoryList.style.maxHeight = "0px";
    searchHistoryList.dataset.state = "hidden";
  }
} );

const app = function() {
  fetchApi();
}

app();