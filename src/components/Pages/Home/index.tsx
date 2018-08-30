import Test from '!raw-loader!./Examples/Test';
import Toolbar from 'components/Layout/Toolbar';
import Code from 'components/Shared/Code';
import React, { Fragment, PureComponent } from 'react';

export default class HomePage extends PureComponent {
  render() {
    return (
      <Fragment>
        <Toolbar title='Inicio' />

        <Code content={Test} />
      </Fragment>
    );
  }
}