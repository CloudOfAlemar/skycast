
const searchHistoryBtn = document.querySelector( ".search-history-btn" );
const searchHistoryList = document.querySelector( ".search-history-list" );

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