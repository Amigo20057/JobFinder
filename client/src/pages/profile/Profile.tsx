import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Post } from "../../components/post/Post";
import { IsAuth } from "../../redux/slices/auth";
import { fetchCreatedPosts, fetchSavedPosts } from "../../redux/slices/posts";
import { AppDispatch } from "../../redux/store";
import { IPost, IPostWithRecruiter } from "../../types/post.interface";
import { IUsersResponse } from "../../types/user.interface";
import { ProfileInfo } from "./ProfileInfo";

type Props = {
	user: IUsersResponse;
};

export const Profile = ({ user }: Props) => {
	const [posts, setPosts] = useState<IPost[] | null>(null);
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const role = window.localStorage.getItem("role");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const isAuth = useSelector(IsAuth);

	if (!isAuth) {
		return <Navigate to='/' />;
	}

	useEffect(() => {
		const getCreatedOrSavedPosts = async () => {
			try {
				let response;
				if (role === "finder") {
					response = await dispatch(fetchSavedPosts());
				} else if (role === "recruiter") {
					response = await dispatch(fetchCreatedPosts());
				}
				const data = unwrapResult(response!);
				setPosts(data);
			} catch (error) {
				setPosts(null);
			} finally {
				setIsLoading(false);
			}
		};

		getCreatedOrSavedPosts();
	}, [dispatch, role]);

	if (isLoading) {
		return <div>...loading</div>;
	}

	if (!user) {
		return <div>...loading</div>;
	}

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<ProfileInfo
				user_name={user.user_name}
				user_surname={user.user_surname}
				email={user.email}
				name_company={user.name_company}
				address_company={user.address_company}
				role={role!}
			/>
			<h1>
				{role === "finder" ? (
					<p>Збережині вакансії</p>
				) : (
					<p>Створені вакансії</p>
				)}
			</h1>
			{Array.isArray(posts) ? (
				posts.map((post, index) => (
					<Post
						key={index}
						id={post.id}
						title={post.title}
						description={post.description}
						workFormat={(post as IPostWithRecruiter).work_format}
						experience={post.experience}
						language={post.language}
						tags={post.tags}
						isSaved={true}
						createdAt={post.created_at}
						nameCompany={(post as IPostWithRecruiter).name_company}
						isFullPost={false}
						about_company={post.about_company}
						isProfile={true}
					/>
				))
			) : (
				<p>error</p>
			)}
		</div>
	);
};
