import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ChnagePassword,
  LogIn,
  ResendOtp,
  ResetMail,
  SignUp,
} from 'src/app/shared/models/signup';
import { HttpService } from 'src/app/shared/services/http.service';
import { state } from '@angular/animations';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit, OnDestroy {
  otpValue: string = '';
  divTogle: string = '';
  passwordValidated = false;
  showPassword: boolean = false;
  showCnfrmPassword: boolean = false;
  chnagePassword: boolean = false;
  chnageCnfrmPassword: boolean = false;
  pageTitle: string = 'Sign In';
  cruntPage: any = '';
  paramId = '';
  resendOtp: ResendOtp = new ResendOtp();
  state: any;
  duration = 120; // Duration of the timer in seconds
  minutes = '02';
  seconds = '00';
  private interval: any;
  showTimer = false;
  isSpinnerLoading = false;

  ngOnDestroy() {
    this.clearTimer();
  }

  /*================== FORM GROUPS =====================*/
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  signUpForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confrimpassword: new FormControl('', Validators.required),
  });

  /*================== FORM GROUPS END =====================*/

  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpService,
    private router: Router,
    private toaster: ToastrService,
    private userService: UserService,
    public _utilService: UtilsService
  ) {
    this.activeRoute.data.subscribe((res: any) => {
      this.divTogle = res.togle;
      //console.log(this.divTogle);
      this.pageTitle = res.title;
    });
    this.activeRoute.params.subscribe((res: any) => {
      this.paramId = res['id'];
      //console.log(this.paramId);
    });
    this.state = history.state;
  }

  ngOnInit() {
    this.cruntPage = this.activeRoute.snapshot.url[0].path;
    // Add the custom validator to the password field
    this.signUpForm
      .get('password')
      ?.setValidators([Validators.required, this.passwordValidator.bind(this)]);
    this.resetUserPassword?.setValidators([Validators.required, this.passwordValidator.bind(this)]);
    this.signUpForm
      .get('password')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe(() => {
        this.signUpForm.get('password')?.updateValueAndValidity();
      });

    //console.log(this.cruntPage);

    const time = localStorage.getItem('otpTime')
    if (this.cruntPage.includes('otp')) {
      if (!time) {
        localStorage.setItem('otpTime', Date.now().toString());
      }
      this.startTimer();
      this.showTimer = true;
    }
  }

  get signuseremail() {
    return this.loginForm.get('email');
  }

  get signuserpassword() {
    return this.loginForm.get('password');
  }

  login() {
    let logInDTO = new LogIn();
    localStorage.clear()
    logInDTO.email = this.loginForm.get('email')?.value;
    logInDTO.password = this.loginForm.get('password')?.value;
    this.isSpinnerLoading = true;
    this.http.logIn(logInDTO).subscribe(
      (res: any) => {
        if (res) {
          this.toaster.success(res.message);
          this.userService.userToken = res.data.token;
          localStorage.setItem(
            'showroomUser',
            JSON.stringify(res.data.isShowRoom)
          );
          localStorage.setItem('role', res.data.role)
          this.http.viewProfile().subscribe((response: any) => {
            //console.log(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem(
              'dp',
              this._utilService.getProfileUrl(response.data.profilePic)
            );
            this._utilService.profilePic = this._utilService.getProfileUrl(
              response.data.profilePic
            );
            this.getUserShowroom();
          });
          this.router.navigate(['/'], { replaceUrl: true });
          this.isSpinnerLoading = false;
        }
      },
      (err) => {
        this.toaster.error(err.error.message);
        this.isSpinnerLoading = false;
      }
    );
  }

  getUserShowroom() {
    this.http.getUserShowroom().subscribe((res: any) => {
      this.userService.showRoomId = res.data?._id;
    });
  }

  get loginUserFirstName() {
    return this.signUpForm.get('firstname');
  }
  get loginUserLatName() {
    return this.signUpForm.get('lastname');
  }
  get loginUserEmail() {
    return this.signUpForm.get('email');
  }
  get loginUserPassword() {
    return this.signUpForm.get('password');
  }
  get loginUserConfrmPassowrd() {
    return this.signUpForm.get('confrimpassword');
  }


  // Custom validator function for password
  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;

    // Check for at least one uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      return { uppercase: true };
    }

    // Check for at least one special character
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharacterRegex.test(password)) {
      return { specialCharacter: true };
    }

    // Check for at least one number
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(password)) {
      return { number: true };
    }

    if (password.length < 8) {
      return { minlength: true };
    }

    this.passwordValidated =
      !control.hasError('uppercase') &&
      !control.hasError('specialCharacter') &&
      !control.hasError('number') &&
      !(password.length < 8);
    // All validation rules passed
    return null;
  }

  signup(): any {

    if (
      this.loginUserEmail?.invalid ||
      this.loginUserFirstName?.invalid ||
      this.loginUserLatName?.invalid ||
      this.loginUserConfrmPassowrd?.invalid
    ) {
      return this.toaster.error('Please fill out the form properly.');
    }

    if (
      this.loginUserPassword &&
      this.loginUserPassword.value &&
      this.loginUserPassword.value.length < 8
    ) {
      return this.toaster.error('Password must be at least 8 characters.');
    }

    this.isSpinnerLoading = true;
    let signupDTO = new SignUp();
    signupDTO.firstName = this.signUpForm.get('firstname')?.value;
    signupDTO.lastName = this.signUpForm.get('lastname')?.value;
    signupDTO.email = this.signUpForm.get('email')?.value;
    signupDTO.phoneNumber = this.signUpForm.get('phoneNumber')?.value;
    signupDTO.password = this.signUpForm.get('password')?.value;

    this.http.signUp(signupDTO).subscribe(
      (res: any) => {
        this.toaster.success(res.message);
        this.router.navigate(['auth/otp/signup'], {
          state: { path: this.cruntPage, user: this.paramId },
        });
        localStorage.setItem(
          'email',
          this.signUpForm.get('email')?.value as string
        );
        this.isSpinnerLoading = false;
      },
      (err) => {
        this.toaster.error(err.error.message);
        this.isSpinnerLoading = false;
      }
    );
  }

  resetMail = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetMailValue() {
    let resetDTO = new ResetMail();
    resetDTO.email = this.resetMail.get('email')?.value;
    this.isSpinnerLoading = true;
    this.http.sendMailReset(resetDTO).subscribe(
      (res: any) => {
        if (res) {
          this.router.navigate(['/auth/otp/resetpassword']);
          localStorage.setItem('email', res.data.email);
        }
        this.toaster.success(res.message);
        this.isSpinnerLoading = false;
      },
      (err) => {
        this.toaster.error(err.error.error.message);
        this.isSpinnerLoading = false;
      }
    );
  }

  chnageNewPassword = new FormGroup({
    newPassword: new FormControl('', Validators.required),
    confrimpassword: new FormControl('', Validators.required),
  });

  get resetUserPassword() {
    return this.chnageNewPassword.get('newPassword');
  }
  get resetUserConfirmPassword() {
    return this.chnageNewPassword.get('confrimpassword');
  }


  chnageNewPasswordValue() {
    let changePass = new ChnagePassword();
    this.isSpinnerLoading = true;
    (changePass.newPassword = this.chnageNewPassword.get([
      'newPassword',
    ])?.value),
      (changePass.token = localStorage.getItem('token'));

    //console.log(changePass);
    this.http.sendNewPassword(changePass).subscribe(
      (res: any) => {
        if (res) {
          //console.log(res);
          //console.log(res.data.token);
          this.toaster.success(res.message);
          this.router.navigate(['/auth/login/user']);
          this.isSpinnerLoading = false;
        }
      },
      (err) => {
        if (err) {
          this.toaster.error(err.error.message);
          this.isSpinnerLoading = false;
        }
      }
    );
  }

  isDisabled: boolean = true;

  onOtpInputChange(otp: string) {
    this.otpValue = otp;
    const containsOnlyDigits = /^\d+$/.test(otp); // if OTP contains only digits
    if (otp.length === 6 && containsOnlyDigits) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
      return;
    }
  }

  onVerifyClick() {
    const setValue: any = { token: this.otpValue };
    this.isSpinnerLoading = true;
    if (this.paramId === 'signup') {
      this.http.otpVeriFy(setValue).subscribe(
        (res: any) => {
          if (res) {
            //console.log(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('token', res.data.token);
            this.toaster.success(res.message);
            if (this.state.user === 'showroom') {
              this.router.navigate(['/enter-showroom-details'], {
                replaceUrl: true,
              });
            } else {
              this.router.navigate(['/'], { replaceUrl: true });
            }
            this.isSpinnerLoading = false;
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.isSpinnerLoading = false;
        }
      );
    } else if (this.paramId === 'resetpassword') {
      this.http.otpVeriFyForReset(setValue).subscribe(
        (res: any) => {
          if (res) {
            this.userService.userToken = res.data.token;
            this.toaster.success('OTP verify');

            localStorage.setItem('user', JSON.stringify(res.data.user));
            this.router.navigate(['/auth/change-new-password']);
            this.isSpinnerLoading = false;
          }
        },
        (err) => {
          if (err) {
            this.toaster.error('Expired/Invalid OTP !');
          }
          this.isSpinnerLoading = false;
        }
      );
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleCnfrmPasswordVisibility() {
    this.showCnfrmPassword = !this.showCnfrmPassword;
  }
  toggleResetPasswordVisibility() {
    this.chnagePassword = !this.chnagePassword;
  }
  toggleResetCnfrmPasswordVisibility() {
    this.chnageCnfrmPassword = !this.chnageCnfrmPassword;
  }

  resendOtpFn() {
    this.resendOtp.email = localStorage.getItem('email') as string;
    this.resendOtp.subject = 'Resend OTP';

    this.http.resendOTP(this.resendOtp).subscribe((res: any) => {
      this.toaster.success(res.message);
      localStorage.setItem('otpTime', Date.now().toString())
      this.showTimer = true;
      this.startTimer();
    });
  }

  // API INTEGRATION

  // TIMER
  startTimer() {

    const timeCreated: any = localStorage.getItem('otpTime');
    const currentTime = Date.now();
    const timeDifferenceMs = currentTime - parseInt(timeCreated, 10);
    if (timeDifferenceMs > this.duration * 1000) { // Check if difference is greater than duration
      this.showTimer = false;
      this.startTimer()
      return;
    } else {
      this.showTimer = true;
      let timer = this.duration;
      if (timeDifferenceMs > 0) {
        const remainingTimeMs = this.duration * 1000 - timeDifferenceMs;
        timer = Math.floor(remainingTimeMs / 1000);
      }

      this.interval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        this.minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        this.seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        if (--timer < 0) {
          this.clearTimer();
          this.showTimer = false;
        }
      }, 1000);
    }
  }

  clearTimer() {
    clearInterval(this.interval);
  }
}
