import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import overrides from './overrides';
import variables from './variables';

const primary = {
  light: '#3a5885',
  main: '#002f58',
  dark: '#00042f',
  contrastText: '#fff',
};

const secondary = {
  light: '#ffff53',
  main: '#ffcc09',
  dark: '#c79c00',
  contrastText: '#000',
};

export const theme = createMuiTheme({
  palette: { primary, secondary },
  variables,
  overrides
});

export const reverseTheme = createMuiTheme({
  palette: { primary: secondary, secondary: primary },
  variables,
  overrides
});

export const whiteTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#cccccc',
      contrastText: '##596375'
    },
    secondary: {
      light: '#4ec485',
      main: '#009358',
      dark: '#00642e',
      contrastText: '#fff',
    }
  },
  variables,
  overrides
});