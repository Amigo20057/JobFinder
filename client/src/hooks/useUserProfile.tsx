import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { fetchFinderProfile, fetchRecruiterProfile, IsAuth } from "../redux/slices/auth.ts";
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
            console.log("No role found, skipping fetch");
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
                console.log("PROFILE RESPONSE: ", response);

                const data = unwrapResult(response!);
                setUser(data);
            } catch (error) {
                console.log("Error fetching profile:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [role, dispatch]);

    return { user, isAuth, isLoading };
};
