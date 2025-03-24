import {IUsers} from "./user.interface.ts";

export interface InitialState {
    data: IUsers | null;
    token: string | null;
    role: string | null;
    status: "loading" | "loaded" | "error";
}

export interface Payload {
    token?: string;
}
