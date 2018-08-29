import { History, Location } from 'history';
import { IAppRoute } from 'interfaces/route';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as rxjs from 'rxjs';
import { sampleTime } from 'rxjs/operators';

// tslint:disable:jsx-no-lambda

interface IProps {
  routes: IAppRoute[];
}

export const RouterContext = React.createContext<AppRouter>(null);

export default class AppRouter extends React.PureComponent<IProps> {

  get history(): History {
    return this.browserRouter.history;
  }

  browserRouter: RouteComponentProps<any>;
  private listenUnregister: Function;
  private location$: rxjs.ReplaySubject<Location>;

  constructor(props: IProps) {
    super(props);
    this.location$ = new rxjs.ReplaySubject(1);
  }

  componentDidMount() {
    this.location$.next(this.browserRouter.history.location);
    this.listenUnregister = this.browserRouter.history.listen(location => {
      this.location$.next(location);
    });
  }

  componentWillUnmount() {
    this.listenUnregister && this.listenUnregister();
  }

  observeChange = () => {
    return this.location$.asObservable().pipe(
      sampleTime(500)
    );
  }

  previousPage = () => {
    this.history.goBack();
  }

  reload = (): void => {
    /* Hack for reload, dont judge me: https://github.com/ReactTraining/react-router/issues/1982 */
    const path = this.history.location.pathname;
    this.history.replace('/reload');
    setTimeout(() => this.history.replace(path));
  }

  navigate = (path: string): void => {
    if (path === this.history.location.pathname) {
      this.reload();
      return;
    }

    this.history.push(path);
  }

  changeUrl = (url: string) => {
    window.history.pushState && window.history.pushState(null, null, url);
  }

  render(): JSX.Element {
    const { routes } = this.props;

    return (
      <RouterContext.Provider value={this}>
        <BrowserRouter ref={ref => this.browserRouter = ref as any}>
          <Switch>
            {routes.map(router => this.renderRoute(router))}
            <Route path='/reload' exact render={() => <div />} />
            <Route render={() => <Redirect to='/' />} />
          </Switch>
        </BrowserRouter>
      </RouterContext.Provider>
    );
  }

  private renderRoute(route: IAppRoute, baseUrl: string = ''): JSX.Element {
    const path = (baseUrl + route.path)
      .replace(/\/\//gi, '/')
      .replace(/\/$/gi, '') || '/';

    return (
      <Route
        key={route.path}
        exact={route.exact}
        path={path}
        render={props =>
          <route.component {...props}>
            <Switch>
              {(route.component.routes || []).map(child => this.renderRoute(child, path))}
              <Route render={() => <Redirect to='/' />} />
            </Switch>
          </route.component>
        }
      />
    );
  }

}
