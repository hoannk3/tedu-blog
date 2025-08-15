import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { UtilsService } from "../../common/utils/utils.service";
import { ToastService } from "../../common/utils/toast.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../../../environments/environment";
import { link } from "../../common/constants/link";
import { responseStatus } from "../../common/constants/config";
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient,
        private route: Router,
        private utilsService: UtilsService,
        private toastService: ToastService) {
    }
    private formatErrors(error: any) {
        if (error instanceof HttpErrorResponse) {
            if (error.error?.errors) {
                Object.values(error.error.errors).forEach((messages: unknown) => {
                    (messages as string[]).forEach((message: string) => this.toastService.showToastError(message));
                });
            } else if (!navigator.onLine) {
                this.toastService.showToastError(error.error)
            } else if (error.error && error.status) {
                this.toastService.showToastError(error.error)
            } else {
                this.toastService.showToastError('エラーが発生しました。')
            }
        }
        return throwError(() => error.error)
    }
    private formatResponse(response: any) {
        if (!response.success && response.message) {
            if (response.status === responseStatus.Maintenance) {
                this.route.navigate([link.login]);
            }
            this.toastService.showToastError(response.message);
        }
        return response;
    }

    get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
        return this.http.get<T>(`${environment.apiUrl}${path}`, { params })
            .pipe(
                catchError((error) => this.formatErrors(error)),
                map(response => {
                    return this.formatResponse(response);
                })
            );
    }

    put<T>(path: string, body: Object = {}): Observable<T> {
        return this.http.put<T>(
            `${environment.apiUrl}${path}`,
            body
        ).pipe(
            catchError(this.formatErrors),
            map(response => {
                return this.formatResponse(response);
            })
        );
    }

    post<T>(path: string, body: Object = {}): Observable<T> {
        return this.http.post<T>(
            `${environment.apiUrl}${path}`,
            body
        ).pipe(
            catchError(this.formatErrors),
            map(response => {
                return this.formatResponse(response);
            })
        );
    }

    postWithRefreshToken<T>(path: string, body: Object = {}, refreshToken: string): Observable<T> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
        });

        return this.http.post<T>(
            `${environment.apiUrl}${path}`,
            body,
            { headers }
        ).pipe(
            catchError(this.formatErrors),
            map(response => this.formatResponse(response))
        );
    }

    delete<T>(path: string, body: any = {}): Observable<T> {
        return this.http.delete<T>(
            `${environment.apiUrl}${path}`,
            { body }
        ).pipe(
            catchError(this.formatErrors),
            map(response => {
                return this.formatResponse(response);
            })
        );
    }

    callAPI<T>(method: string, url: string, payload?: any, params?: Record<string, any>): Observable<T> {
        const apiUrl = params ? this.utilsService.setUrlValueParams(url, params) : url;

        switch (method) {
            case 'GET':
                return this.get<T>(apiUrl);
            case 'POST':
                return this.post<T>(apiUrl, payload);
            case 'PUT':
                return this.put<T>(apiUrl, payload);
            case 'DELETE':
                return this.delete<T>(apiUrl);
            default:
                throw new Error('エラーが発生しました。');
        }
    }
}