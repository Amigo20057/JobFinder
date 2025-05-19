import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchReviews } from "../../redux/slices/reviews";
import { AppDispatch, RootState } from "../../redux/store";
import { IReview } from "../../types/reviews.interface";
import styles from "./Reviews.module.css";

export const Reviews = () => {
	const { postId } = useParams();
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const { reviews } = useSelector((state: RootState) => state.reviews);

	useEffect(() => {
		dispatch(fetchReviews(postId!));
	}, [dispatch]);

	const renderReviews = () => {
		return reviews.items.map((review: IReview, index) => (
			<div key={index} className={styles.review}>
				<p>{review.email}</p>
				<p>{review.user_name}</p>
				<p>{review.user_surname}</p>
				<p>{review.about_finder}</p>
			</div>
		));
	};

	return <div className={styles.reviewsContainer}>{renderReviews()}</div>;
};
