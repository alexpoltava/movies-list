let table = null;

const init = () => {
    table = makeTableSortable('#moviesTable');
    table.setOnClickHandlers();
};

window.addEventListener('load', init);

const onSearch = () => {
    const query = document.getElementById("query").value;
    if (query){
        table.onSearch(query)
        .then((data) => {
            table.elementsAddToDOM(data.results);
        })
        .catch(error => console.error(error));
    }
}
