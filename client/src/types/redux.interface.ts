import {IFinder, IRecruiter} from "./user.interface.ts";

type Users = IFinder | IRecruiter

export interface InitialState {
    data: Users | null;
    token: string | null;
    role: string | null;
    status: "loading" | "loaded" | "error";
}

export interface Payload {
    token?: string;
}
