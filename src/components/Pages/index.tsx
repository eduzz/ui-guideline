import { IAppRoute } from 'interfaces/route';
import HomeIcon from 'mdi-react/HomeIcon';
import React, { PureComponent } from 'react';

import AppWrapper from '../Layout/AppWrapper';
import HomePage from './Home';

export default class Pages extends PureComponent {
  public static routes: IAppRoute[] = [
    {
      path: '/',
      exact: true,
      component: HomePage,
      sideDrawer: {
        icon: HomeIcon,
        display: 'Inicio',
        order: 0
      }
    }
  ];

  render() {
    return (
      <AppWrapper routes={Pages.routes}>
        {this.props.children}
      </AppWrapper>
    );
  }
}
