const { Dimensions, Platform } = require('react-native');
const { width } = Dimensions.get('window');
const BASE_WIDTH = Platform.OS === 'ios' ? 390 : 360;
const scale = width / BASE_WIDTH;

module.exports = {
  theme: {
    extend: {
      spacing: {
        '1': `${0.25 * scale}rem`,
        '2': `${0.5 * scale}rem`,
        '3': `${0.75 * scale}rem`,
        '4': `${1 * scale}rem`,
        // etc...
      }
    }
  }
};
