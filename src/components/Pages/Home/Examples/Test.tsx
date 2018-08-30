import Toolbar from 'components/Layout/Toolbar';
import React, { Fragment, PureComponent } from 'react';

export default class Test extends PureComponent {
  render() {
    return (
      <Fragment>
        <Toolbar title='Teste' />

        <p>Conteudo</p>
      </Fragment>
    );
  }
}