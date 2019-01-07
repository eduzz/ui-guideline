import Test from '!raw-loader!./Examples/Test';
import Typography from '@material-ui/core/Typography';
import Toolbar from 'components/Layout/Toolbar';
import Code from 'components/Shared/Code';
import React, { Fragment, PureComponent } from 'react';

export default class HomePage extends PureComponent {
  render() {
    return (
      <Fragment>
        <Toolbar title='Inicio' />

        <Typography variant='subheading'>Teste de editor</Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Etiam vestibulum dui velit, quis tempus felis placerat ac.
          Vestibulum et fermentum dolor. Proin porta massa massa.
          Duis pretium lorem id vehicula mollis.
          Duis a faucibus leo. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          Aliquam venenatis ipsum quis orci feugiat bibendum.
        </Typography>

        <Code content={Test} />
      </Fragment>
    );
  }
}