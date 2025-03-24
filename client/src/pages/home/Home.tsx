import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../redux/store.ts";
import {fetchFinderProfile, fetchRecruiterProfile, IsAuth} from "../../redux/slices/auth.ts";
import {IUsersResponse} from "../../types/user.interface.ts";
import {unwrapResult} from "@reduxjs/toolkit";

export const Home = () => {
    const isAuth = useSelector(IsAuth);
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const role = window.localStorage.getItem("role");
    const [user, setUser] = useState<IUsersResponse | null>(null);

    useEffect(() => {
        if (role) {
            const profile = async () => {
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
                    console.log(error);
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            };
            profile();
        }
    }, [role, dispatch]);

    console.log("IS AUTH: ", isAuth);
    console.log("Role: ", role);
    console.log("USER: ", user);

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>{user ? `Welcome, ${user.user_name}` : "No user found"}</div>
            )}
        </div>
    );
};
