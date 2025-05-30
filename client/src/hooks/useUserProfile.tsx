import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchFinderProfile,
	fetchRecruiterProfile,
	IsAuth,
} from "../redux/slices/auth.ts";
import { AppDispatch } from "../redux/store.ts";
import { IUsersResponse } from "../types/user.interface.ts";

export const useUserProfile = () => {
	const isAuth = useSelector(IsAuth);
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [user, setUser] = useState<IUsersResponse | null>(null);
	const role = window.localStorage.getItem("role");

	useEffect(() => {
		if (!role) {
			setIsLoading(false);
			return;
		}

		const fetchProfile = async () => {
			try {
				let response;
				if (role === "finder") {
					response = await dispatch(fetchFinderProfile());
				} else if (role === "recruiter") {
					response = await dispatch(fetchRecruiterProfile());
				}

				const data = unwrapResult(response!);
				setUser(data);
			} catch (error) {
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();
	}, [role, dispatch]);

	return { user, isAuth, isLoading };
};
