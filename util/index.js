const moviesCached = {
  movies: [],
  header: "",
  order: 0
};

const composeURL = (query = "") => {
  if (query.length) {
    const url = new URL("https://api.themoviedb.org/3/search/movie");
    const params = {
      api_key: "c9f5652c46506832ccafded5a8f020e5",
      language: "en-US",
      query
    };
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key]));
    return url.href;
  }
  return false;
};

const getMoviesList = url => {
  const settings = {
    mode: "cors",
    method: "GET",
    headers: {}
  };

  resetHeader();

  return fetch(url, settings).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      console.error(response);
    }
  });
};

const addToDOM = (table, movies) => {
  const tbody = table.querySelector("tbody");
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  const headers = Array.from(document.getElementsByTagName("th"));
  const keys = headers.map(el => el.dataset.key);

  movies.forEach(movie => {
    const row = document.createElement("tr");
    keys.forEach(key => {
      const textNode = document.createTextNode(movie[key]);
      const td = document.createElement("td");
      td.appendChild(textNode);
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
};

const setOnClickHandlers = table => {
  const headers = table.querySelectorAll("th");
  Array.from(headers).forEach(el => {
    el.addEventListener("click", function() {
      onSort(table, el);
    });
  });
};

const saveSearchResults = movies => {
  while (moviesCached.movies.length)
    moviesCached.movies.pop();
  while (movies.length)
    moviesCached.movies.unshift(movies.pop());
};

const resetHeader = () => {
  if (moviesCached.header) {
    moviesCached.header.innerHTML = moviesCached.header.dataset.name;
  }
};

const onSort = (table, header) => {
  const ARROW_UP = "\u2191";
  const ARROW_DOWN = "\u2193";

  if (moviesCached.movies.length > 0) {
    resetHeader();
    const nameWithArrow = `${header.dataset.name} ${moviesCached.order ? ARROW_UP : ARROW_DOWN}`;
    header.innerHTML = nameWithArrow;
    moviesCached.header = header;
    moviesCached.order = !moviesCached.order;
    const moviesSorted = sortMovies(
      moviesCached.movies,
      header.dataset.key,
      header.dataset.type,
      moviesCached.order
    );
    addToDOM(table, moviesSorted);
    saveSearchResults(moviesSorted);
  }
};

const sortMovies = (movies, key, type, order) => {
  if (type === "string") {
    return [...movies].sort((a, b) => {
      if (a[key] > b[key]) {
        return order ? 1 : -1;
      }
      if (a[key] < b[key]) {
        return order ? -1 : 1;
      }
      return 0;
    });
  } else if (type === "number") {
    return [...movies].sort(
      (a, b) =>
        order
          ? Number(a[key]) - Number(b[key])
          : Number(b[key]) - Number(a[key])
    );
  }
};

if (typeof makeTableSortable === "undefined") {
  window.makeTableSortable = selector => {
    const table = document.querySelector(selector);

    return {
      onSearch: query => {
        return getMoviesList(composeURL(query));
      },
      elementsAddToDOM: movies => {
        addToDOM(table, movies);
        saveSearchResults(movies);
      },
      setOnClickHandlers: () => {
        setOnClickHandlers(table);
      }
    };
  };
} else {
  throw new Error("makeTableSortable function already defined");
}
