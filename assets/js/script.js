
const searchHistory = document.querySelector( ".search-history" );
const searchHistoryList = document.querySelector( ".search-history-list" );

searchHistory.addEventListener( "click", function() {
  const listHeight = searchHistoryList.scrollHeight;
  if( searchHistoryList.dataset.state === "hidden" ) {
    searchHistoryList.style.maxHeight = `${ listHeight }px`;
    searchHistoryList.dataset.state = "visible";
  } else {
    searchHistoryList.style.maxHeight = "0px";
    searchHistoryList.dataset.state = "hidden";
  }
} );