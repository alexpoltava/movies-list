window.onload = function () {
  resetHeaderNames();
  setOnClickHandlers();
}

const setOnClickHandlers = function (){
  Array.from(document.getElementsByTagName("th")).forEach((el) => {
    el.addEventListener("click", function() {onSort(el)});
  });
}

function resetHeaderNames() {
  Array.from(document.getElementsByTagName("th")).forEach((el) => {
    el.innerHTML = el.dataset.text;
  });
}

function onSearch () {
  var query = document.getElementById("query").value;
  resetHeaderNames();
  getMoviesListFromServer(query);
}

function onSort(obj) {
  const table = Results.getTable();
  if (table.length > 0) {
    const ARROW_UP = '\u2191';
    const ARROW_DOWN = '\u2193';
    Results.store(sortObjectsArray(table, obj.dataset.key, obj.dataset.type, Results.sortOrder));
    resetHeaderNames();

    obj.innerHTML += Results.sortOrder ? ARROW_DOWN : ARROW_UP;
    buildTableBody(Results);
  }
}

function sortObjectsArray(arr, key, type, order) {
    if(type ==='string') {
      return arr.sort((a, b) => {
        if (a[key] > b[key]) {
          return order ?  1 : -1;
        }
        if(a[key] < b[key]) {
          return order ?  -1 : 1;
        }
        return 0;
      });
    } else if (type ==='number') {
      return arr.sort((a, b) => order ? Number(a[key]) - Number(b[key]) : Number(b[key]) - Number(a[key]));
    }
}

const getMoviesListFromServer = (query) => {
  const queryString = composeURL(query);
  if(queryString) {
      const settings = {
        mode: "cors",
        method: "GET",
        headers: {}
      }
      fetch(queryString, settings)
            .then((response) => {
              if(response.ok) {
                return response.json();
              } else {
                console.log(response);
              }
            })
            .then(obj => {
              Results.store(obj.results);
              buildTableBody(Results);
            })
            .catch(error => console.log(error));
    } else {
      return false;
    }
}

const buildTableBody = function (data) {
  const moviesArray = data.getTable();
  if (moviesArray) {
    const tbody = document.getElementById("table-body");
    while(tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    const filterArray = Array.from(document.getElementsByTagName("th")).map((el) => el.dataset.key);
    moviesArray.forEach(obj => {
      const tr = document.createElement("tr");
      filterArray.forEach(key => {
        const textNode = document.createTextNode(obj[key]);
        const td = document.createElement("td");
        td.appendChild(textNode);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    return true;
  } else {
    return false;
  }
}

const Results = {
    sortOrder: false,
    table: [],
    getTable: function() {
                if(this.table && Array.isArray(this.table)) {
                  return this.table;
                } else {
                 return false;
                }
              },
    store:    function (results) {
                this.table = results;
                this.sortOrder = !this.sortOrder;
              }
}

const composeURL = (query) => {
  if(query.length>0) {
    const url = "https://api.themoviedb.org/3/search/movie?";
    const queryParams = {
      api_key : "c9f5652c46506832ccafded5a8f020e5",
      language: "en-US",
      query,
    };
    return (url + Object.keys(queryParams).map( key => key + '=' + queryParams[key]).join('&'));
  } else {
    return false;
  }
}
