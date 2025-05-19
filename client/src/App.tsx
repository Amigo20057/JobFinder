import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components";
import { useUserProfile } from "./hooks/useUserProfile.tsx";
import { NotFound } from "./NotFound.tsx";
import { FinderLogin } from "./pages/auth/login/FinderLogin.tsx";
import { RecruiterLogin } from "./pages/auth/login/RecruiterLogin.tsx";
import { FinderRegister } from "./pages/auth/register/FinderRegister.tsx";
import { RecruiterRegister } from "./pages/auth/register/RecruiterRegister.tsx";
import { CreatePost } from "./pages/createPost/CreatePost.tsx";
import { CreateReview } from "./pages/createReview/CreateReview.tsx";
import { FullPost } from "./pages/fullPost/FullPost.tsx";
import { Home } from "./pages/home/Home.tsx";
import { Profile } from "./pages/profile/Profile.tsx";
import { Reviews } from "./pages/reviews/Reviews.tsx";

function App() {
	const location = useLocation();
	const { user, isAuth } = useUserProfile();
	const [filterPostName, setFilterPostName] = useState<string>("");

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
				<Header
					userName={user?.user_name}
					userSurname={user?.user_surname}
					setFilterPostName={setFilterPostName}
				/>
			)}
			<Routes>
				<Route path='/' element={<Home filterPostName={filterPostName} />} />
				<Route path='/posts/:id' element={<FullPost />} />
				<Route path='/post/create' element={<CreatePost />} />

				<Route path='/auth/finder/register' element={<FinderRegister />} />
				<Route
					path='/auth/recruiter/register'
					element={<RecruiterRegister />}
				/>
				<Route path='/auth/finder/login' element={<FinderLogin />} />
				<Route path='/auth/recruiter/login' element={<RecruiterLogin />} />

				<Route path='/profile' element={<Profile user={user!} />} />
				<Route path='/profile/reviews/:postId' element={<Reviews />} />
				<Route path='/respond/:id' element={<CreateReview />} />

				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
