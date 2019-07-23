const api = (function() {
  const BASE_URL = " https://thinkful-list-api.herokuapp.com/matthew/bookmarks";
  function listApiFetch(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = { code: res.status };
        }
        return res.json();
      })
      .then(data => {
        if (error) {
          error.message = data.message;
          store.error = error.message;
          return Promise.reject(error);
        }

        return data;
      });
  }
  const getBookmarks = () => listApiFetch(`${BASE_URL}`);

  const addBookmark = bookmarkData => {
    const bookmark = JSON.stringify(bookmarkData);
    return listApiFetch(`${BASE_URL}`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: bookmark
    });
  };
  const deleteBookmark = id =>
    listApiFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return {
    getBookmarks,
    addBookmark,
    deleteBookmark
  };
})();
