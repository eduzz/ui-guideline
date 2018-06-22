import { Button, Card, CardActions, CardContent, LinearProgress, Typography } from '@material-ui/core';
import { FormComponent, IStateForm } from 'components/Abstract/Form';
import Snackbar from 'components/Snackbar';
import { WithStyles } from 'decorators/withStyles';
import FieldText from 'material-ui-form-fields/components/Text';
import ValidationContext from 'material-ui-form-fields/components/ValidationContext';
import React, { MouseEvent } from 'react';
import rxjsOperators from 'rxjs-operators';
import authService from 'services/auth';

interface IState extends IStateForm<{
  email: string;
}> {
  opened: boolean;
  loading: boolean;
}

interface IProps {
  classes?: any;
  onCancel: (e: MouseEvent<HTMLElement>) => void;
  onComplete: () => void;
}

@WithStyles({
  buttons: {
    justifyContent: 'space-between'
  }
})
export default class LoginDialogRecoveryAccess extends FormComponent<IProps, IState>  {
  constructor(props: IProps) {
    super(props);
    this.state = { ...this.state, opened: false, loading: false };
  }

  async onSubmit(event: Event) {
    const { model } = this.state;

    event.preventDefault();

    const isValid = await this.isFormValid();
    if (!isValid) return;

    this.setState({ loading: true });

    authService.sendResetPassword(model.email).pipe(
      rxjsOperators.logError(),
      rxjsOperators.bindComponent(this)
    ).subscribe(() => {
      this.setState({ loading: false });
      this.resetForm();
      this.props.onComplete();

      Snackbar.show('Foi enviado um link para seu email para podermos recuperar seu acesso.');
    }, err => {
      Snackbar.error(err);
      this.setState({ loading: false });
    });
  }

  render() {
    const { model, loading } = this.state;
    const { classes, onCancel } = this.props;

    return (
      <form onSubmit={this.onSubmit.bind(this)} noValidate>
        <ValidationContext ref={this.bindValidationContext.bind(this)}>

          <Card>
            <CardContent>
              <Typography>Iremos lhe enviar um email para recuperar seu acesso</Typography>

              <FieldText
                label='Email'
                type='email'
                disabled={loading}
                value={model.email}
                validation='required|email'
                onChange={this.updateModel((model, v) => model.email = v)}
              />

            </CardContent>

            <CardActions className={classes.buttons}>
              <Button disabled={loading} size='small' onClick={onCancel}>Voltar</Button>
              <Button disabled={loading} color='secondary' type='submit'>Enviar</Button>
            </CardActions>

            {loading && <LinearProgress color='secondary' />}
          </Card>

        </ValidationContext>
      </form>
    );
  }
}