const bookmarkUtils = (function() {
  function renderForm() {
    const form = `<form class="form" name="form">
    <div class="input-group">
      <label for="title">Bookmark Title</label>
      <input required name="title" id="title" class="text-input" type="text" placeholder="My Fav Website..." />
    </div>
    <div class="input-group">
      <label for="url">Bookmark Url</label>
      <input required name="url" id="url" class="text-input" type="url" placeholder="https://www.myfavwebsite.com" />
    </div>
    <div class="input-group">
      <label for="desc">Bookmark Description</label>
      <textarea  placeholder="..." class="text-input" name="desc" id="desc" id="" cols="30" rows="10"></textarea>
    </div>
    <div class="input-group">
      <label for="rating">Bookmark Rating</label>
      <select id="rating" name="rating">
        <option value="1">1 star</option>
        <option value="2">2 star</option>
        <option value="3">3 star</option>
        <option value="4">4 star</option>
        <option value="5">5 star</option>
      </select>
    </div>

    <div class="input-group buttons">
      <input type="submit" class="button" value="Submit New Bookmark" />
      <button class="button--return">Go Back </button>
    </div>
  </form>`;
    if (store.adding) {
      $(".form-holder").html(form);
    } else {
      $(".form").remove();
    }
  }
  // This function should almost never run it is simply a last resort in case of a server error
  function renderError() {
    $(".error").html(`<h2>Error: ${store.error}</h2>`);
    setTimeout(() => {
      store.error = null;
      render();
    }, 3000);
  }

  function render() {
    renderForm();
    if (store.error) {
      renderError();
    }

    let bookmarkList = [...store.bookmarks];

    if (bookmarkList.length === 0) {
      return $(".bookmarkList").html(generateEmptyMessage());
    }
    //apply filter
    if (store.minRatingFilter) {
      bookmarkList = bookmarkList.filter(
        bookmark => bookmark.rating >= store.minRatingFilter
      );
    }
    const bookmarkListString = bookmarkList.map(generateBookmarkHtml).join("");
    $(".bookmarkList").html(bookmarkListString);
  }

  function generateEmptyMessage() {
    return `<li class="js-item-element" ">
    <p>Welcome! You have no current bookmarks saved, click the add bookmark button to get started!</p>
    </li>`;
  }

  function generateBookmarkHtml(bookmark) {
    let description;
    let link = `<a class="url"  target="_blank" href=${
      bookmark.url
    }>Visit Site</a>`;
    if (typeof bookmark.desc === "string") {
      description = `<p class="desc">${bookmark.desc}</p>`;
    }
    return `
    <li class="js-item-element" tabindex="0" role="button" aria-live="polite" data-item-id="${
      bookmark.id
    }">
    <div class="list-title">
    <h3>${bookmark.title}</h3>
    </div>
     <div class="list-content">
     ${bookmark.extended && description ? description : ""}
     ${bookmark.extended ? link : ""}
     </div>
     <div class="list-rating">
     <p>${
       bookmark.rating
         ? `Rating: ${
             bookmark.rating
           } <i aria-hidden="true" class="fas fa-star"></i>`
         : ""
     }</p>
     </div>
        <button class="js-item-delete button--item">
          <span class="button-label">delete</span>
        </button>
    </li>`;
  }
  function getItemIdFromElement(item) {
    return $(item)
      .closest(".js-item-element")
      .data("item-id");
  }

  function handleDeleteItemClicked() {
    $("main").on("click", ".js-item-delete", event => {
      const id = getItemIdFromElement(event.currentTarget);
      api
        .deleteBookmark(id)
        .then(() => {
          store.deleteBookmark(id);
          render();
        })
        .catch(err => render());
    });
  }

  function handleExtenededClick() {
    $("main").on("click keydown", ".js-item-element", e => {
      const id = $(e.currentTarget).data("item-id");
      store.extendBookmark(id);
      render();
    });
  }

  function handleToggleForm() {
    $(".form-button").click(e => {
      store.toggleAdding();
      render();
    });
  }
  function handleGoBack() {
    $(".form-container").on("click", ".button--return", e => {
      store.toggleAdding();
      render();
    });
  }

  function fromEntries(iterable) {
    return [...iterable].reduce(
      (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
      {}
    );
  }

  function handleNewBookmarkSubmit() {
    $(".form-container").on("submit", ".form", e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      api
        .addBookmark(fromEntries(formData))
        .then(data => {
          store.addBookmark(data);
          store.toggleAdding();
          render();
        })
        .catch(err => render());
    });
  }
  function handleFilterChange() {
    $("#filter").change(e => {
      store.minRatingFilter = e.target.value;
      render();
    });
  }
  function bindEventHandlers() {
    handleDeleteItemClicked();
    handleFilterChange();
    handleNewBookmarkSubmit();
    handleToggleForm();
    handleExtenededClick();
    handleGoBack();
  }

  return {
    render,
    bindEventHandlers
  };
})();
