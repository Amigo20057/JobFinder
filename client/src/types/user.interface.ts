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

export interface IFinderResponse {
    id: number;
    user_name: string;
    user_surname: string;
    email: string;
    password: string;
}

export interface IRecruiterResponse {
    id: number;
    user_name: string;
    user_surname: string;
    email: string;
    password: string;
    name_company: string;
    address_company: string;
}

export type IUsersResponse = IFinderResponse | IRecruiterResponse;
export type IUsers = IFinder | IRecruiter;
