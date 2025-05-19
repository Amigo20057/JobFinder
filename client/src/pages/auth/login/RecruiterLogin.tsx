import { BriefcaseBusiness, CircleUserRound } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { fetchRecruiterLogin, IsAuth } from "../../../redux/slices/auth.ts";
import { AppDispatch } from "../../../redux/store.ts";
import { IUserLogin } from "../../../types/user.interface.ts";
import styles from "../Auth.module.css";

export const RecruiterLogin = () => {
	const isAuth = useSelector(IsAuth);
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const { register, handleSubmit } = useForm<IUserLogin>();

	const onSubmit: SubmitHandler<IUserLogin> = async (params: IUserLogin) => {
		const data = await dispatch(fetchRecruiterLogin(params));
		if (!data.payload) {
			return alert("Error login");
		}
	};

	if (isAuth) {
		return <Navigate to='/' />;
	}

	return (
		<div className={styles.authPage}>
			<div className={styles.container}>
				<h1>Авторизація роботодавця</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<input
						id='email'
						type='email'
						{...register("email", { required: true })}
						required={true}
						placeholder='Ел. пошта'
					/>
					<input
						id='password'
						type='password'
						{...register("password", { required: true })}
						required={true}
						placeholder='Пароль'
					/>
					<button type='submit'>Логін</button>
				</form>
				<Link to='/auth/finder/register'>
					<CircleUserRound style={{ marginRight: "10px" }} />
					Зареєструватися як шукач
				</Link>
				<Link to='/auth/recruiter/register' style={{ marginTop: "20px" }}>
					<BriefcaseBusiness style={{ marginRight: "10px" }} />
					Зареєструватися як роботодавець
				</Link>
			</div>
		</div>
	);
};
