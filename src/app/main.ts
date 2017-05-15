import  axios from 'axios';
import { CancelTokenSource } from "axios";
import { Observable } from 'rxjs';
const CancelToken = axios.CancelToken;


const eventStream = new Observable<string>(observer => {
  const eventListener = (event: KeyboardEvent) => {
    observer.next((event.target as HTMLInputElement).value)
  };
  const el = document.querySelector('#autocompleteInput');
  el.addEventListener('keyup', eventListener);
  return () => el.removeEventListener('keyup', eventListener);
});

const planedRequests = eventStream
  .filter(val => val.length > 3)
  .distinctUntilChanged()
  .debounceTime(1234);

const cancelTokens = planedRequests
  .map(_ => CancelToken.source());

const pairOfTokens = cancelTokens
  .map(item => [item])
  .scan((acc: CancelTokenSource[], curr: CancelTokenSource[]) => {
    return acc.length === 1 ? acc.concat(curr) : acc.concat(curr).slice(1);
  });

const executedRequests = planedRequests
  .withLatestFrom(pairOfTokens)
  .map(([value, tokenSources]) => {
    if (tokenSources.length === 1) {
      tokenSources.unshift(null);
    }
    const [prevTokenSource, currTokenSource] = tokenSources;
    if (prevTokenSource) {
      prevTokenSource.cancel();
    }
    return axios.get('http://localhost:4002/contacts', {
      params: {value},
      cancelToken: currTokenSource && currTokenSource.token
    }).catch(err => {
      if (axios.isCancel(err)) {
        // ошибка - результат отмены
        console.log('request was cancelled');
      } else {
        // результат запроса - ошибка от сервера
        console.error('request failed', err);
      }
    })
  })
  .subscribe(request => {
    request.then(result => {
      // успешный результат
      console.log('request was successful', result);
    });
  });