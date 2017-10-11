document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#search');
  const results = document.querySelector('#results');

  const clearResults = () => {
    results.innerHTML = '';
  }

  const appendResult = ([term, link]) => {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.innerText = term;
    li.appendChild(anchor);
    results.appendChild(li);
  };

  const searchWikipedia = (query) => {
    const result = fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=10&namespace=0&format=json`,
        {
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'*',
          },
        }
      ).then((response) => response.json());

    return Rx.Observable.fromPromise(result);
  };

  Rx.Observable.fromEvent(input, 'input')
    .map((event) => event.currentTarget.value.toLowerCase())
    .map((value) => value.trim())
    .filter((value) => value.length > 2)
    .distinctUntilChanged()
    .debounceTime(300)
    .switchMap(searchWikipedia)
    .do(clearResults)
    .flatMap(([query, terms, descriptions, links]) => Rx.Observable.from(terms).zip(Rx.Observable.from(links)))
    .subscribe(appendResult, (err) => {
      console.error('failed');
    });
});