import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../components/post/Post.tsx";
import { fetchPostsWithRecruiter } from "../../redux/slices/posts.ts";
import { AppDispatch, RootState } from "../../redux/store.ts";
import { IPostWithRecruiter } from "../../types/post.interface.ts";

export const Home = () => {
	const posts = useSelector((state: RootState) => state.posts);
	const dispatch: AppDispatch = useDispatch<AppDispatch>();

	console.log("POSTS: ", posts);

	useEffect(() => {
		dispatch(fetchPostsWithRecruiter());
	}, [dispatch]);

	return (
		<div>
			{Array.isArray(posts.posts.items) ? (
				posts.posts.items.map((post, index) => (
					<Post
						key={index}
						id={post.id}
						title={post.title}
						description={post.description}
						workFormat={(post as IPostWithRecruiter).work_format}
						experience={post.experience}
						language={post.language}
						tags={post.tags}
						createdAt={post.created_at}
						nameCompany={(post as IPostWithRecruiter).name_company}
						isFullPost={false}
					/>
				))
			) : (
				<p>error</p>
			)}
		</div>
	);
};
