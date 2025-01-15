import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { UserService } from "../services/user.service";

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptors implements HttpInterceptor {

    constructor(private _userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let newReq = req.clone();

            // //console.log(this._userService.userToken );

            newReq = req.clone({
                headers: req.headers.set(
                    'Authorization',
                    'Bearer ' + this._userService.userToken,
                ).set('Access-Control-Allow-Origin', '*'),
            });
        // }


        return next.handle(newReq).pipe(
            catchError((error) => {
                if ((error instanceof HttpErrorResponse && error.status === 404) || error.status == 401) {
                  if (error.status == 401) {
                    this._userService.logout();
                  }
                } else if (
                    error instanceof HttpErrorResponse &&
                    (error.status === 500 || error.status === 400)
                ) {
                }
                return throwError(() => error);
            })
        );
    }
}
