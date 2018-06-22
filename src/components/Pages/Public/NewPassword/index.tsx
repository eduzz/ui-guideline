import { Button, Card, CardActions, CardContent, LinearProgress, Typography } from '@material-ui/core';
import { FormComponent, IStateForm } from 'components/Abstract/Form';
import AppRouter, { RouterContext } from 'components/Router';
import Snackbar from 'components/Snackbar';
import { WithStyles } from 'decorators/withStyles';
import { IResetPasswordToken } from 'interfaces/resetPasswordToken';
import FieldText from 'material-ui-form-fields/components/Text';
import ValidationContext from 'material-ui-form-fields/components/ValidationContext';
import queryString from 'query-string';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import rxjsOperators from 'rxjs-operators';
import authService from 'services/auth';
import tokenService from 'services/token';

interface IState extends IStateForm<{
  password: string;
  confirmPassword: string;
}> {
  token: string;
  tokenData: IResetPasswordToken;
  loading: boolean;
}

interface IProps extends RouteComponentProps<{ t: string }, {}> {
  classes?: any;
}

@WithStyles(theme => ({
  root: {
    background: theme.palette.primary.main,
    minHeight: '100vh',
    minWidth: '100vw',
    position: 'relative'
  },
  container: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
    width: '300px',
    height: '440px',
    maxWidth: 'calc(100% - 30px)',
    color: 'white'
  },
  logo: {
    textAlign: 'center'
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: 120
  },
  viewContainer: {
    boxSizing: 'border-box',
    padding: '0 10px',
    height: 310
  },
  buttons: {
    justifyContent: 'flex-end'
  }
}))
export default class NewPasswordPage extends FormComponent<IProps, IState> {
  getRouter: () => AppRouter;

  constructor(props: IProps) {
    super(props);

    const token = queryString.parse(props.location.search).t;
    const tokenData = tokenService.decode<IResetPasswordToken>(token);

    this.state = {
      ...this.state,
      token,
      tokenData,
      loading: false,
    };
  }

  async onSubmit(event: Event) {
    const { model, token, tokenData } = this.state;

    event.preventDefault();

    const isValid = await this.isFormValid();
    if (!isValid) return;

    this.setState({ loading: true });

    authService.resetPassword(token, model.password).pipe(
      rxjsOperators.switchMap(() => authService.login(tokenData.email, model.password)),
      rxjsOperators.logError(),
      rxjsOperators.bindComponent(this)
    ).subscribe(() => {
      Snackbar.show('Senha alterada com sucesso!');
      this.getRouter().navigate('/');
    }, err => {
      Snackbar.error(err);
      this.setState({ loading: false });
    });
  }

  render() {
    const { model, loading, tokenData } = this.state;
    const { classes } = this.props;

    if (!tokenData) {
      return (
        <Redirect to='/' />
      );
    }

    return (
      <div className={classes.root}>
        <div className={classes.container}>

          <RouterContext.Consumer>
            {getRouter => (this.getRouter = getRouter) && null}
          </RouterContext.Consumer>

          <div className={classes.logo}>
            <img src={require('assets/images/logo-white.png')} className={classes.logoImage} />
          </div>

          <form onSubmit={this.onSubmit.bind(this)} noValidate>
            <ValidationContext ref={this.bindValidationContext.bind(this)}>

              <Card>
                <CardContent>
                  <Typography>Olá {tokenData.firstName}, informe sua nova senha:</Typography>

                  <FieldText
                    label='Nova senha'
                    type='password'
                    disabled={loading}
                    value={model.password}
                    validation='required|min:5'
                    onChange={this.updateModel((model, v) => model.password = v)}
                  />

                  <FieldText
                    label='Repita a senha'
                    type='password'
                    disabled={loading}
                    value={model.confirmPassword}
                    validation='required|same:nova senha'
                    validationContext={{ 'nova senha': model.password }}
                    onChange={this.updateModel((model, v) => model.confirmPassword = v)}
                  />

                </CardContent>

                <CardActions className={classes.buttons}>
                  <Button disabled={loading} color='secondary' type='submit'>Salvar</Button>
                </CardActions>

                {loading && <LinearProgress color='secondary' />}
              </Card>

            </ValidationContext>
          </form>

        </div>
      </div>
    );
  }
}