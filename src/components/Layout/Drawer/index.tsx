import { List } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import logo from 'assets/images/logo.png';
import AppRouter, { RouterContext } from 'components/Router';
import { WithStyles } from 'decorators/withStyles';
import { IAppRoute } from 'interfaces/route';
import React, { PureComponent } from 'react';

import DrawerListItem from './ListItem';
import { IAppRouteParsed, routeParser } from './routeParser';

interface IState {
  routes: IAppRouteParsed[];
}

interface IProps {
  routes: IAppRoute[];
  classes?: any;
  router?: AppRouter;
  drawer?: IDrawerContext;
}

export interface IDrawerContext {
  open(): void;
  close(): void;
}

export const DrawerContext = React.createContext<IDrawerContext>(null);

@WithStyles(theme => ({
  root: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: '100vh'
  },
  header: {
    padding: '10px 0',
    textAlign: 'center',
    background: darken(theme.palette.primary.main, 0.15)
  },
  logo: {
    maxWidth: 170,
    maxHeight: 100,
    margin: '10px 0'
  },
  list: {
    padding: 0
  }
}))
class AppDrawer extends PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = { routes: [] };
  }

  static getDerivedStateFromProps(props: IProps, currentState: IState): IState {
    return {
      ...currentState,
      routes: routeParser(props.routes)
    };
  }

  toRoute = (route: IAppRoute) => {
    this.props.drawer.close();
    this.props.router.navigate(route.path);
  }

  render() {
    const { routes } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <img src={logo} className={classes.logo} />
        </div>

        <List className={classes.list}>
          {routes.map(route =>
            <DrawerListItem key={route.path} route={route} onClick={this.toRoute} />
          )}
        </List>
      </div>
    );
  }
}

export default React.forwardRef((props: IProps, ref: any) => (
  <RouterContext.Consumer>
    {router =>
      <DrawerContext.Consumer>
        {drawer => <AppDrawer {...props} ref={ref} router={router} drawer={drawer} />}
      </DrawerContext.Consumer>
    }
  </RouterContext.Consumer>
));