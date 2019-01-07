import axios, { AxiosError, AxiosResponse } from 'axios';
import ApiError from 'errors/api';
import { apiRequestFormatter } from 'formatters/apiRequest';
import * as rxjs from 'rxjs';
import * as rxjsOperators from 'rxjs/operators';

import { API_ENDPOINT } from '../settings';
import { apiResponseFormatter } from './../formatters/apiResponse';
import authService from './auth';
import tokenService, { TokenService } from './token';

export class ApiService {
  constructor(
    private apiEndpoint: string,
    private tokenService: TokenService
  ) { }

  public get<T = any>(url: string, params?: any): rxjs.Observable<T> {
    return this.request<T>('GET', url, params).pipe(
      rxjsOperators.map(({ response }) => response),
      rxjsOperators.filter(response => !!response)
    );
  }

  public post<T = any>(url: string, body: any): rxjs.Observable<T> {
    return this.request<T>('POST', url, body).pipe(
      rxjsOperators.map(({ response }) => response),
      rxjsOperators.filter(response => !!response)
    );
  }

  public put<T = any>(url: string, body: any): rxjs.Observable<T> {
    return this.request<T>('PUT', url, body).pipe(
      rxjsOperators.map(({ response }) => response),
      rxjsOperators.filter(response => !!response)
    );
  }

  public delete<T = any>(url: string, params?: any): rxjs.Observable<T> {
    return this.request<T>('DELETE', url, params).pipe(
      rxjsOperators.map(({ response }) => response),
      rxjsOperators.filter(response => !!response)
    );
  }

  public upload<T = any>(url: string, data: FormData) {
    return this.request<T>('POST', url, data);
  }

  private request<T = any>(
    method: string,
    url: string,
    data: any = null,
    retry: boolean = true
  ): rxjs.Observable<{ response: T, progress: number }> {
    const progress$ = new rxjs.BehaviorSubject(0);

    return this.tokenService.getToken().pipe(
      rxjsOperators.first(),
      rxjsOperators.map(token => {
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
      }),
      rxjsOperators.switchMap(headers => {
        return axios.request({
          baseURL: this.apiEndpoint,
          url,
          method,
          headers: {
            ...headers,
            'Content-Type': data instanceof FormData ?
              'multipart/form-data' :
              'application/json'
          },
          params: method === 'GET' ? apiRequestFormatter(data) : null,
          data: method === 'POST' || method === 'PUT' ? apiRequestFormatter(data) : null,
          onUploadProgress: (progress: ProgressEvent) => {
            const result = progress.loaded / progress.total;
            progress$.next(result * 100);
          }
        });
      }),
      rxjsOperators.tap(() => progress$.next(100)),
      rxjsOperators.switchMap(res => this.checkNewToken(res)),
      rxjsOperators.map(res => apiResponseFormatter<T>(res.data)),
      rxjsOperators.startWith(null),
      rxjsOperators.combineLatest(
        progress$.pipe(rxjsOperators.distinctUntilChanged()),
        (response, progress) => ({ response, progress })
      ),
      rxjsOperators.catchError(err => {
        progress$.complete();
        return this.handleError(err, retry);
      }),
    );
  }

  private checkNewToken(response: AxiosResponse): rxjs.Observable<AxiosResponse> {
    const token = response.headers['x-token'];

    if (!token) {
      return rxjs.of(response);
    }

    return this.tokenService.setToken(token).pipe(
      rxjsOperators.map(() => response)
    );
  }
  private handleError(err: AxiosError, retry: boolean) {
    if (!err.config || !err.response) return rxjs.throwError(err);

    if (err.response.status !== 401 || !retry) {
      return rxjs.throwError(new ApiError(err.config, err.response, err));
    }

    authService.openLogin();
    return authService.getUser().pipe(
      rxjsOperators.skip(1),
      rxjsOperators.switchMap(user => {
        if (!user) {
          return rxjs.throwError(new ApiError(err.config, err.response, err));
        }

        return this.request(
          err.config.method,
          err.config.url,
          err.config.data || err.config.params,
          false
        );
      })
    );
  }

}

const apiService = new ApiService(API_ENDPOINT, tokenService);
export default apiService;