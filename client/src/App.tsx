import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components";
import { useUserProfile } from "./hooks/useUserProfile.tsx";
import { NotFound } from "./NotFound.tsx";
import { FinderLogin, FinderRegister, Home } from "./pages";
import { RecruiterLogin } from "./pages/auth/login/RecruiterLogin.tsx";
import { RecruiterRegister } from "./pages/auth/register/RecruiterRegister.tsx";
import { FullPost } from "./pages/fullPost/FullPost.tsx";

function App() {
	const location = useLocation();
	const { user, isAuth } = useUserProfile();

	console.log("IS AUTH: ", isAuth);
	console.log("USER: ", user);

	const noHeaderRoutes = [
		"/auth/finder/register",
		"/auth/recruiter/register",
		"/auth/finder/login",
		"/auth/recruiter/login",
	];
	const showHeader = !noHeaderRoutes.includes(location.pathname);

	return (
		<>
			{showHeader && (
				<Header userName={user?.user_name} userSurname={user?.user_surname} />
			)}
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/posts/:id' element={<FullPost />} />

				<Route path='/auth/finder/register' element={<FinderRegister />} />
				<Route
					path='/auth/recruiter/register'
					element={<RecruiterRegister />}
				/>
				<Route path='/auth/finder/login' element={<FinderLogin />} />
				<Route path='/auth/recruiter/login' element={<RecruiterLogin />} />

				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
