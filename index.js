const main = () => {
  bookmarkUtils.bindEventHandlers();
  api
    .getBookmarks()
    .then(bookmarks => {
      console.log(bookmarks);
      bookmarks.forEach(bookmark => store.addBookmark(bookmark));
      bookmarkUtils.render();
    })
    .catch(err => console.log(err.message));
};
$(main);
