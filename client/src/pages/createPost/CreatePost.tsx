import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../redux/slices/posts";
import { AppDispatch } from "../../redux/store";
import { IPostResponse } from "../../types/post.interface";
import styles from "./CreatePost.module.css";

export const CreatePost = () => {
	const navigate = useNavigate();
	const [value, setValue] = useState("");
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const { register, handleSubmit } = useForm<IPostResponse>();

	const onSubmit: SubmitHandler<IPostResponse> = async (
		params: IPostResponse
	) => {
		const payload = {
			...params,
			description: value,
			tags:
				typeof params.tags === "string"
					? params.tags
							.replace(/[{}]/g, "")
							.split(",")
							.map(tag => tag.trim())
							.join(", ")
					: params.tags,
		};

		const data = await dispatch(createPost(payload));
		if (!data.payload) {
			return alert("Error creating post");
		}
		navigate("/");
	};

	return (
		<div className={styles.createPost}>
			<div className={styles.container}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.inputs}>
						<label htmlFor='title'>Назва вакансії</label>
						<input
							{...register("title", { required: true })}
							type='text'
							id='title'
						/>

						<label htmlFor='work_format'>Формат роботи</label>
						<input
							{...register("workFormat", { required: true })}
							type='text'
							id='work_format'
						/>

						<label htmlFor='experience'>Досвід</label>
						<input
							{...register("experience", { required: true })}
							type='text'
							id='experience'
						/>

						<label htmlFor='language'>Мова</label>
						<input
							{...register("language", { required: true })}
							type='text'
							id='language'
						/>

						<label htmlFor='tags'>Теги (через кому)</label>
						<input
							{...register("tags")}
							type='text'
							id='tags'
							placeholder='React, TypeScript, Remote'
						/>

						<label htmlFor='about_company'>Про компанію</label>
						<textarea
							{...register("aboutCompany", { required: true })}
							id='about_company'
						/>
					</div>

					<label style={{ marginTop: 16, display: "block" }}>
						Опис вакансії
					</label>
					<div data-color-mode='light'>
						<MDEditor value={value} onChange={val => setValue(val || "")} />
					</div>

					<button className={styles.send} type='submit'>
						Створити
					</button>
				</form>
			</div>
		</div>
	);
};
