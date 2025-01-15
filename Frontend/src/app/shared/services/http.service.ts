import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { ChnagePassword, LogIn, Profile, ResendOtp, ResetMail, SignUp } from '../models/signup';
import { AddShoowRoom } from '../models/showRoom';
import { UserService } from './user.service';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private userService: UserService) {

  }
  userToken = this.userService.userToken

  header = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.userToken}`
  })

  userHeaderToken = { headers: this.header }
  formDataOptions = { headers: this.header, 'Content-Type': 'multipart/form-data', }

  baseUrl: string = 'http://localhost:5000/api/'; //#local
  // baseUrl: string = 'https://car.zuras.online/api/';// #live
  BASE_PATH: string = 'http://20.169.239.112:5000/api/';
  liveUrl: string = 'http://20.169.239.112:5000/api/';
  // liveAssetUrl: string = 'http://52.191.74.149:5000/';
  liveAssetUrl: string = 'https://car.zuras.online/';


  /*================== AUTH =====================*/

  signUp(data: SignUp) {
    return this.http.post(this.baseUrl + 'auth/register', data);
  }
  logIn(data: LogIn) {
    return this.http.post(this.baseUrl + 'auth/login', data);
  }
  otpVeriFy(data: any) {
    return this.http.post(this.baseUrl + 'auth/verify', data);
  }
  sendMailReset(data: ResetMail) {
    return this.http.post(this.baseUrl + 'auth/forgot', data).pipe(shareReplay());

  }
  updateCar(id: string, data: any) {
    return this.http.put(`${this.baseUrl}car/update/${id}`, data);
  }
  sendNewPassword(data: ChnagePassword) {
    return this.http.post(this.baseUrl + 'auth/reset', data);

  }
  otpVeriFyForReset(data: any) {
    return this.http.post(this.baseUrl + 'auth/verifyForReset', data);
  }
  resendOTP(data: ResendOtp) {
    return this.http.post(this.baseUrl + 'auth/resendOTP', data)
  }
  viewProfile() {
    return this.http.get(this.baseUrl + 'auth/viewProfile')
  }
  updateProfile(data: Profile) {
    return this.http.post(this.baseUrl + 'auth/updateProfile', data)
  }
  /*================== AUTH ENDS =====================*/


  /*================== SHOWROOM =====================*/
  addShowRoom(data: AddShoowRoom) {
    return this.http.post(this.baseUrl + 'showroom/', data);
  }

  getShowRooms(query: string) {
    return this.http.get(this.baseUrl + 'showroom/getAll' + query);
  }

  uploadCarInShowRoom(data: any) {
    return this.http.post(this.baseUrl + 'car/create', data);
  }

  getUserShowroom() {
    return this.http.get(this.baseUrl + 'showroom/get/userShowRoom')
  }

  deleteShowroom(id: string) {
    return this.http.delete(this.baseUrl + 'showroom/' + id)
  }

  getShowroomByID(id: any) {
    return this.http.get(this.baseUrl + '/showroom/' + id)
  }

  updateShowroomStatus(showroomId: any, status: any) {
    return this.http.post(this.baseUrl + '/showroom/approve', {
      showroomId,
      status
    })
  }

  /*================== SHOWROOM ENDS =====================*/


  bookedCarForRent(data: any) {
    return this.http.post(this.baseUrl + 'booking/addtobooking', data);
  }

  getCarBySearch() {
    return this.http.get(this.baseUrl + 'car/searchcars');
  }

  getRecommendedCars(params?: any) {
    return this.http.get(this.baseUrl + `car/recommended${params ? params : ''}`);
  }

  getAlBrand() {
    return this.http.get(this.baseUrl + 'brand/getAll');
  }

  getCarById(id: string) {
    return this.http.get(this.baseUrl + 'car/getOne/' + id)
  }

  getCarByParams(params?: any) {
    return this.http.get(this.baseUrl + `car/getAll${params ? params : ''}`);
  }

  getCarsBySearch(searchText: string) {
    return this.http.get(this.baseUrl + 'car/searchcars' + searchText);
  }

  getAllCar() {
    return this.http.get(this.baseUrl + 'car/getAll');

  }
  uploadFile(data: any) {
    return this.http.post(this.baseUrl + 'upload/anyfile', data)
  }


  /*================== FAVORITE =====================*/

  addToFavorite(data: any) {
    return this.http.post(this.baseUrl + 'favorite/addFavorite', data)
  }

  removeFavorite(data: any) {
    return this.http.post(this.baseUrl + 'favorite/removeFavorite', data)
  }

  getAllFavorite(query: string) {
    return this.http.get(this.baseUrl + 'favorite' + query);
  }
  /*================== FAVORITE ENDS =====================*/


  /*================== BOOKINGS =====================*/

  getMyBookings(queryParams?: string) {
    return this.http.get(`${this.baseUrl}booking/getAll${queryParams}`);
  }

  getBookingById(id: string) {
    return this.http.get(`${this.baseUrl}booking/getById/${id}`);
  }

  allowNotifications(token: string) {
    return this.http.post(this.baseUrl + 'auth/allowNotification', { deviceToken: token });
  }

  getNotiifications(query: string) {
    return this.http.get(this.baseUrl + 'notification/approval/notifications' + query);
  }
  readSingleNotification(id: string) {
    return this.http.post(this.baseUrl + 'notification/approval/singleRead', { notificationId: id })
  }

  readAllNotifications() {
    return this.http.post(this.baseUrl + 'notification/approval/readAll', {});
  }


  /*================== BOOKINGS ENDS =====================*/


  /*================== ORDER =====================*/

  createBooking(data: any) {
    return this.http.post(this.baseUrl + 'booking/addtobooking', data)
  }

  updateBookingOrder(data: any) {
    return this.http.post(this.baseUrl + 'booking/updateStatus', data)
  }

  /*================== ORDER END =====================*/


  /*================== Brand =====================*/
  getLocation() {
    return this.http.get(this.baseUrl + 'location/getAll')
  }

  /*================== Cars =====================*/
  updateCarStatusAdmin(status: string, id: string) {
    return this.http.post(this.baseUrl + '/car/approve', { status, carId: id })
  }

}
