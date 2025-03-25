import {IUsersResponse} from "../../types/user.interface.ts";

type Props = {
    user: IUsersResponse | null;
}

export const Home = ({user}: Props) => {

    //
    // if (isLoading) {
    //     return <p>Loading...</p>
    // }
    //
    // if (!isLoading && user === null) {
    //     return <Navigate to="/auth/finder/login" replace/>;
    // }

    return (
        <div>
            <div>{user ? `Welcome, ${user.user_name}` : "No user found"}</div>
        </div>
    );
};
