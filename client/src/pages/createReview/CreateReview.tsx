import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCreateReview } from "../../redux/slices/reviews";
import { AppDispatch } from "../../redux/store";
import styles from "./CreateReview.module.css";

export const CreateReview = () => {
	const [value, setValue] = useState<string>("");
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const { id } = useParams();

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const payload = {
			aboutFinder: value,
			postId: id,
		};
		const data = await dispatch(
			fetchCreateReview({
				aboutFinder: payload.aboutFinder,
				postId: payload.postId!,
			})
		);
		if (!data.payload) {
			return alert("Error creating review");
		}
		navigate("/profile");
	};

	return (
		<div className={styles.respond}>
			<div className={styles.container}>
				<h2>Про себе</h2>
				Створити відгук
				<form onSubmit={onSubmit}>
					<textarea onChange={e => setValue(e.target.value)}></textarea>

					<button className={styles.send}>Створити</button>
				</form>
			</div>
		</div>
	);
};
