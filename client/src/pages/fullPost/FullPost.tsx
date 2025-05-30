import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Post } from "../../components/post/Post.tsx";
import { Spinner } from "../../components/spinner/Spinner.tsx";
import { fetchPostWithRecruiterById } from "../../redux/slices/posts.ts";
import { AppDispatch, RootState } from "../../redux/store.ts";
import { IPostWithRecruiter } from "../../types/post.interface.ts";

export const FullPost = () => {
	const { id } = useParams();
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const post = useSelector((state: RootState) => state.posts.fullPost);

	useEffect(() => {
		if (id) {
			setIsLoading(true);
			dispatch(fetchPostWithRecruiterById(parseInt(id))).finally(() =>
				setIsLoading(false)
			);
		}
	}, [id, dispatch]);

	if (isLoading) {
		return <Spinner />;
	}

	if (!post) {
		return <h1 style={{ textAlign: "center" }}>Post not found</h1>;
	}

	return (
		<div>
			<Post
				id={post.id}
				title={post.title}
				description={post.description}
				nameCompany={(post as IPostWithRecruiter).name_company}
				workFormat={(post as IPostWithRecruiter).work_format}
				experience={post.experience}
				language={post.language}
				isSaved={post.isSaved}
				tags={post.tags}
				createdAt={post.created_at}
				isFullPost={true}
				about_company={post.about_company}
			/>
		</div>
	);
};
