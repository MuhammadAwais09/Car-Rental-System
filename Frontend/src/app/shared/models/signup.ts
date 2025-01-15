export class SignUp {
    firstName: string | undefined | null;
    lastName: string | undefined | null;
    phoneNumber: string | undefined | null;
    email: string | undefined | null;
    password: string | undefined | null;
}
export class LogIn {
    email: string | undefined | null;
    password: string | undefined | null;
}
export class ResetMail {
    email: string | undefined | null;

}
export class ChnagePassword {
    token: string | undefined | null;
    newPassword: string | undefined | null;

}

export class ResendOtp {
    email: string = '';
    subject: string = ''
}

export class Profile {
    firstName:string | undefined
    lastName:string | undefined
    profilePic:string = 'assets/imgs/profile.webp'
    email ?: string
    address: Address = new Address()
}

export class Address {
    street: string | undefined
    city: string | undefined
    state: string | undefined
    zipCode: string | undefined
}
