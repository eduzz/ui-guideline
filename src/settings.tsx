export const ENV = (process.env.REACT_APP_ENV || 'production').trim();

export const SENTRY_KEY = (process.env.REACT_APP_SENTRY_KEY || '').trim();

export const IS_DEVELOPMENT = ENV === 'development';
export const SNACKBAR_DEFAULT_TIMEOUT = 3000;
