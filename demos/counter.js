document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('#button');
  const count = document.querySelector('#count');

  Rx.Observable.fromEvent(button, 'click')
    .do((e) => {
      e.preventDefault()
    })
    .bufferTime(500)
    .filter((clicks) => clicks.length === 1)
    .mapTo(1)
    .scan((sum, curr) => sum + curr)
    .subscribe((sum) => {
      count.innerHTML = sum;
    });
});