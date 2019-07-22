const bookmarkUtils = (function() {
  function renderForm() {
    console.log("working");
    const form = `<form class="form" name="form">
          <label for="title">Bookmark Title</label>
          <input required name="title" id="title" type="text" />
          <label for="url">Bookmark Url</label>
          <input required name="url" id="url" type="text" />
          <label for="desc">Bookmark Description</label>
          <textarea name="desc" id="desc" id="" cols="30" rows="10"></textarea>
          <label for="rating">Bookmark Rating</label>
          <select id="rating" name="rating">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <input type="submit" class=".submit" value="Submit New Bookmark" />
        </form>`;
    console.log(store.adding);
    if (store.adding) {
      $(".form-container").append(form);
    } else {
      $(".form").remove();
    }
  }
  function render() {
    renderForm();

    //render bookmarks
    let bookmarkList = [...store.bookmarks];
    //apply filter
    if (store.minRatingFilter) {
      bookmarkList = bookmarkList.filter(
        bookmark => bookmark.rating >= store.minRatingFilter
      );
    }
    const bookmarkListString = bookmarkList.map(generateBookmarkHtml).join("");
    $(".bookmarkList").html(bookmarkListString);
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
    <li class="js-item-element" data-item-id="${bookmark.id}">
     <h3>${bookmark.title}</h3>
     ${bookmark.extended && description ? description : ""}
     ${bookmark.extended ? link : ""}
     <p>${bookmark.rating ? bookmark.rating : ""}</p>
        <button class="js-item-delete">
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
      console.log(`clicked ${id}`);
      api
        .deleteBookmark(id)
        .then(() => {
          store.deleteBookmark(id);
          render();
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  function handleExtenededClick() {
    $("main").on("click", ".js-item-element", e => {
      const id = $(e.currentTarget).data("item-id");
      store.extendBookmark(id);
      render();
    });
  }

  function handleToggleForm() {
    $(".form-button").click(e => {
      store.adding = !store.adding;
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
      api.addBookmark(fromEntries(formData)).then(data => {
        store.addBookmark(data);
        store.adding = false;
        render();
      });
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
  }

  return {
    render,
    bindEventHandlers
  };
})();
