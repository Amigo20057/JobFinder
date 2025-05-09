import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../components/post/Post.tsx";
import { Spinner } from "../../components/spinner/Spinner.tsx";
import { fetchPostsWithRecruiter } from "../../redux/slices/posts.ts";
import { AppDispatch, RootState } from "../../redux/store.ts";

type Props = {
	filterPostName: string;
};

export const Home = ({ filterPostName }: Props) => {
	const posts = useSelector((state: RootState) => state.posts);
	const dispatch: AppDispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(fetchPostsWithRecruiter());
	}, [dispatch]);

	const filteredPosts = posts.posts.items.filter(post => {
		const search = filterPostName.toLowerCase();
		return (
			post.title.toLowerCase().includes(search) ||
			post.name_company?.toLowerCase().includes(search)
		);
	});

	if (posts.posts.status === "loading") {
		return <Spinner />;
	}

	if (posts.posts.status === "error") {
		return (
			<p style={{ textAlign: "center" }}>Помилка при завантаженні вакансій</p>
		);
	}

	return (
		<div>
			{Array.isArray(posts.posts.items) ? (
				filteredPosts.length > 0 ? (
					filteredPosts.map((post, index) => (
						<Post
							key={index}
							id={post.id}
							title={post.title}
							description={post.description}
							workFormat={post.work_format!}
							experience={post.experience}
							language={post.language}
							tags={post.tags}
							isSaved={post.isSaved}
							createdAt={post.created_at}
							nameCompany={post.name_company!}
							isFullPost={false}
						/>
					))
				) : (
					<h1 style={{ textAlign: "center" }}>
						Нічого не знайдено за запитом "{filterPostName}"
					</h1>
				)
			) : (
				<p>Помилка при завантаженні вакансій</p>
			)}
		</div>
	);
};
