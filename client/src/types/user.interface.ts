export interface IRecruiter {
    id?: number;
    userName: string;
    userSurname: string;
    email: string;
    password: string;
    nameCompany: string;
    addressCompany: string;
}

export interface IFinder {
    id?: number;
    userName: string;
    userSurname: string;
    email: string;
    password: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}