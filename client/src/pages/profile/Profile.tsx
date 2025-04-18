import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Post } from "../../components/post/Post";
import { fetchSavedPosts } from "../../redux/slices/posts";
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

	useEffect(() => {
		const getCreatedOrSavedPosts = async () => {
			try {
				let response;
				if (role === "finder") {
					response = await dispatch(fetchSavedPosts());
				} else if (role === "recruiter") {
				}
				const data = unwrapResult(response!);
				setPosts(data);
			} catch (error) {
				console.log("Error get created posts or get saved posts", error);
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

	console.log("POSTS:", posts);

	return (
		<>
			<h1>Інформація про користувача</h1>
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
					/>
				))
			) : (
				<p>error</p>
			)}
		</>
	);
};
