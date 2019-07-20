import './styles.styl';
import drawFunction from './demo';
import data from './data.json';

new drawFunction(data);

module.hot.accept('./demo', () => { // eslint-disable-line no-undef
  const NewDrawFunction = require('./demo').default;

  document.getElementsByClassName('root')[0].innerHTML = '';

  new NewDrawFunction(data);
});
