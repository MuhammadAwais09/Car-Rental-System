import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { getMessaging, getToken } from "@firebase/messaging";
import { environment } from "../../../environments/environment";
import { Location } from "@angular/common";

@Injectable({
  providedIn: 'root'
})

export class UtilsService {


  profilePic: string = 'assets/imgs/profile.webp'
  constructor(
    private http: HttpService,
    private location: Location
  ) {
  }

  get profileImage() {
    const url = localStorage.getItem('dp');
    if (url == null) {
      return 'assets/imgs/profile.webp'
    }
    return url;
  }

  // Pagination 
  pagination = {
    pageSize: 10,
  }

  // Assets
  getFile(path: string) {
    const url = `${this.http.liveAssetUrl}${path}`;
    return url;
  }

  // Profile
  getProfileUrl(path?: string) {
    if (!path)
      return 'assets/imgs/profile.webp'
    const url = `${this.http.liveAssetUrl}${path}`;
    return url;
  }

  // Nagvigation
  back() {
    this.location.back();
  }

  async requestPermission() {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey });
      if (currentToken) {
        localStorage.setItem('deviceToken', currentToken);
      } else {
        //console.log('No registration token available. Request permission to generate one.');
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
    }
  }
}
