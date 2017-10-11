document.addEventListener('DOMContentLoaded', () => {
  const op1 = document.querySelector('#operand1');
  const op2 = document.querySelector('#operand2');
  const plus = document.querySelector('#plus');
  const minus = document.querySelector('#minus');
  const result = document.querySelector('#result');

  const valueStream = (target) => {
    return Rx.Observable.fromEvent(target, 'input')
    .map((event) => event.currentTarget.value)
    .map(parseFloat)
    .startWith(0)
    .distinctUntilChanged();
  }

  const plus$ = Rx.Observable.fromEvent(plus, 'click')
    .mapTo((a, b) => a + b);

  const minus$ = Rx.Observable.fromEvent(minus, 'click')
    .mapTo((a, b) => a - b);

  const operator$ = Rx.Observable.merge(plus$, minus$);

  const op1$ = valueStream(op1);
  const op2$ = valueStream(op2);

  operator$
    .withLatestFrom(op1$, op2$, (operator, a, b) => operator(a, b))
    .subscribe((computation) => {
      result.innerText = computation;
    });
});