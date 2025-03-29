import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../axios";
import { InitialState } from "../../types/redux.interface.ts";
import {
	IFinder,
	IRecruiter,
	IUserLogin,
	IUsers,
} from "../../types/user.interface.ts";
import { RootState } from "../store.ts";

export const fetchFinderRegister = createAsyncThunk(
	"auth/fetchFinderRegister",
	async (params: IFinder) => {
		const { data } = await axios.post("/auth/finder/register", params);
		console.log("DATA REGISTER FINDER: ", data);
		return { user: data.user, token: data.user.token, role: "finder" };
	}
);

export const fetchRecruiterRegister = createAsyncThunk(
	"auth/fetchRecruiterRegister",
	async (params: IRecruiter) => {
		const { data } = await axios.post("/auth/recruiter/register", params);
		console.log("DATA REGISTER RECRUITER: ", data);
		return { user: data.user, token: data.user.token, role: "recruiter" };
	}
);

export const fetchFinderLogin = createAsyncThunk(
	"auth/fetchFinderLogin",
	async (params: IUserLogin) => {
		const { data } = await axios.post("/auth/finder/login", params);
		console.log("DATA LOGIN FINDER: ", data);
		return { user: data.user, token: data.user.token, role: "finder" };
	}
);

export const fetchRecruiterLogin = createAsyncThunk(
	"auth/fetchRecruiterLogin",
	async (params: IUserLogin) => {
		const { data } = await axios.post("/auth/recruiter/login", params);
		console.log("DATA LOGIN RECRUITER", data);
		return { user: data.user, token: data.user.token, role: "recruiter" };
	}
);

export const fetchFinderProfile = createAsyncThunk(
	"users/fetchFinderProfile",
	async () => {
		const { data } = await axios.get("/users/finder/profile", {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
		return data;
	}
);

export const fetchRecruiterProfile = createAsyncThunk(
	"users/fetchRecruiterProfile",
	async () => {
		const { data } = await axios.get("/users/recruiter/profile", {
			headers: {
				Authorization: `Bearer ${window.localStorage.getItem("token")}`,
			},
		});
		return data;
	}
);

const initialState: InitialState = {
	data: null,
	token: null,
	role: null,
	status: "loading",
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: state => {
			state.data = null;
			state.token = null;
			state.role = null;
			localStorage.removeItem("token");
			localStorage.removeItem("role");
		},
	},
	extraReducers: builder => {
		builder
			//REGISTER FINDER
			.addCase(
				fetchFinderRegister.fulfilled,
				(
					state,
					action: PayloadAction<{ user: IFinder; token: string; role: string }>
				) => {
					state.status = "loaded";
					state.data = action.payload.user;
					state.token = action.payload.token;
					state.role = action.payload.role;
					localStorage.setItem("token", action.payload.token);
					localStorage.setItem("role", action.payload.role);
				}
			)
			.addCase(fetchFinderRegister.rejected, state => {
				state.status = "error";
				state.data = null;
			})

			//REGISTER RECRUITER
			.addCase(
				fetchRecruiterRegister.fulfilled,
				(
					state,
					action: PayloadAction<{
						user: IRecruiter;
						token: string;
						role: string;
					}>
				) => {
					state.status = "loaded";
					state.data = action.payload.user;
					state.token = action.payload.token;
					state.role = action.payload.role;
					localStorage.setItem("token", action.payload.token);
					localStorage.setItem("role", action.payload.role);
				}
			)
			.addCase(fetchRecruiterRegister.rejected, state => {
				state.status = "error";
				state.data = null;
			})

			//LOGIN FINDER
			.addCase(
				fetchFinderLogin.fulfilled,
				(
					state,
					action: PayloadAction<{ user: IFinder; token: string; role: string }>
				) => {
					state.status = "loaded";
					state.data = action.payload.user;
					state.token = action.payload.token;
					state.role = action.payload.role;
					localStorage.setItem("token", action.payload.token);
					localStorage.setItem("role", action.payload.role);
				}
			)
			.addCase(fetchFinderLogin.rejected, state => {
				state.status = "error";
				state.data = null;
			})

			//REGISTER RECRUITER
			.addCase(
				fetchRecruiterLogin.fulfilled,
				(
					state,
					action: PayloadAction<{
						user: IRecruiter;
						token: string;
						role: string;
					}>
				) => {
					state.status = "loaded";
					state.data = action.payload.user;
					state.token = action.payload.token;
					state.role = action.payload.role;
					localStorage.setItem("token", action.payload.token);
					localStorage.setItem("role", action.payload.role);
				}
			)
			.addCase(fetchRecruiterLogin.rejected, state => {
				state.status = "error";
				state.data = null;
			})

			//PROFILE FINDER
			.addCase(
				fetchFinderProfile.fulfilled,
				(state, action: PayloadAction<IUsers>) => {
					state.status = "loaded";
					state.data = action.payload;
				}
			)

			// PROFILE RECRUITER
			.addCase(
				fetchRecruiterProfile.fulfilled,
				(state, action: PayloadAction<IUsers>) => {
					state.status = "loaded";
					state.data = action.payload;
				}
			);
	},
});

export const IsAuth = (state: RootState) => {
	return state.auth.token || window.localStorage.getItem("token");
};

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
