import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
require('fast-text-encoding');

Enzyme.configure({
  adapter: new Adapter(),
});

