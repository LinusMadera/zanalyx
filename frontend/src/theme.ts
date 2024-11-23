import { ComponentsPropsList, Theme as MuiTheme } from '@mui/material';
import { shadTheme } from './shadTheme';
import { ComponentsOverrides } from '@mui/material/styles';

type Theme = Omit<MuiTheme, 'components'>;

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    FoxUiLogo: 'text' | 'imgContainer' | 'img';
    FoxUiNavigationItem: 'button';
  }

  interface Components {
    FoxUiLogo?: {
      styleOverrides?: ComponentsOverrides<Theme>['FoxUiLogo'];
    };
    FoxUiNavigationItem?: {
      defaultProps?: ComponentsPropsList['MuiListItemButton'];
      styleOverrides?: ComponentsOverrides<Theme>['FoxUiNavigationItem'];
      variants?: 'active' | 'nested';
    };
  }
}

const themeMap: { [key: string]: (mode: 'light' | 'dark') => Theme } = {
  shadTheme,
};

export const getThemeByName = (theme: string, mode: 'light' | 'dark') => {
  return themeMap[theme](mode);
};