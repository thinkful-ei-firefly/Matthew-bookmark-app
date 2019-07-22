const store = (function() {
  const bookmarks = [];
  function addBookmark(bookmark) {
    const localBookmark = {
      ...bookmark,
      extended: false
    };
    this.bookmarks.push(localBookmark);
  }
  function deleteBookmark(id) {
    const index = this.bookmarks.findIndex(bookmark => bookmark.id === id);
    this.bookmarks.splice(index, 1);
  }
  function extendBookmark(id) {
    const bookmark = this.bookmarks.find(bookmark => bookmark.id === id);
    bookmark.extended = !bookmark.extended;
  }
  const adding = false;
  minRatingFilter = null;
  return {
    bookmarks,
    addBookmark,
    deleteBookmark,
    adding,
    minRatingFilter,
    extendBookmark
  };
})();
