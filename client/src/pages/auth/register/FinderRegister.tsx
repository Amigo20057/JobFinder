import { BriefcaseBusiness, CircleUserRound } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { fetchFinderRegister, IsAuth } from "../../../redux/slices/auth.ts";
import { AppDispatch } from "../../../redux/store.ts";
import { IFinder } from "../../../types/user.interface.ts";
import styles from "../Auth.module.css";

export const FinderRegister = () => {
	const isAuth = useSelector(IsAuth);
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const { register, handleSubmit } = useForm<IFinder>();

	const onSubmit: SubmitHandler<IFinder> = async (params: IFinder) => {
		const data = await dispatch(fetchFinderRegister(params));
		if (!data.payload) {
			return alert("Error register");
		}
		console.log("DATA PAYLOAD: ", data.payload);
	};

	if (isAuth) {
		return <Navigate to='/' />;
	}

	return (
		<div className={styles.authPage}>
			<div className={styles.container}>
				<h1>Реєстрація шукача</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<input
						id='username'
						type='text'
						{...register("userName", { required: true })}
						required={true}
						placeholder="Ім'я шукача"
					/>
					<input
						id='usersurname'
						type='text'
						{...register("userSurname", { required: true })}
						required={true}
						placeholder='Прізвище шукача'
					/>
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
					<button type='submit'>Зареєструватися</button>
				</form>
				<Link to='/auth/finder/login'>
					<CircleUserRound style={{ marginRight: "10px" }} />
					Увійти як шукач
				</Link>
				<Link to='/auth/recruiter/login' style={{ marginTop: "20px" }}>
					<BriefcaseBusiness style={{ marginRight: "10px" }} />
					Увійти як роботодавець
				</Link>
			</div>
		</div>
	);
};
