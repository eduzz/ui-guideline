import Toolbar from 'components/Layout/Toolbar';
import React, { Fragment, PureComponent } from 'react';

export default class HomePage extends PureComponent {
  render() {
    return (
      <Fragment>
        <Toolbar title='Inicio' />
      </Fragment>
    );
  }
}