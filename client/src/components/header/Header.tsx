import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IsAuth, logout } from "../../redux/slices/auth.ts";
import { AppDispatch } from "../../redux/store.ts";
import styles from "./Header.module.css";

type Props = {
	userName?: string;
	userSurname?: string;
};

export const Header = ({ userName, userSurname }: Props) => {
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const role = window.localStorage.getItem("role");
	const isAuth = useSelector(IsAuth);

	const onClickLogout = async () => {
		dispatch(logout());
		window.location.reload();
	};

	return (
		<div className={styles.header}>
			<div className={styles.topHeader}>
				<div
					className={styles.logo}
					onClick={() => (window.location.pathname = "/")}
				>
					<h1>JobFinder</h1>
				</div>
				<div className={styles.rightBlock}>
					<div className={styles.options}>
						<Link
							className={window.location.pathname === "/" ? styles.active : ""}
							to='/'
						>
							Знайти вакансії
						</Link>
						{isAuth ? (
							role === "finder" ? (
								<Link
									className={
										window.location.pathname === "/resume/create"
											? styles.active
											: ""
									}
									to='/resume/create'
								>
									Розмістити резюме
								</Link>
							) : (
								<Link
									className={
										window.location.pathname === "/post/create"
											? styles.active
											: ""
									}
									to='/post/create'
								>
									Створити ваканію
								</Link>
							)
						) : (
							""
						)}
						{userName && (
							<Link
								className={
									window.location.pathname === "/profile" ? styles.active : ""
								}
								to='/profile'
							>
								{userName} {userSurname}
							</Link>
						)}
					</div>
					<div className={styles.auth}>
						{!userName ? (
							<Link to='/auth/finder/login'>Увійти</Link>
						) : (
							<button onClick={onClickLogout}>Вийти</button>
						)}
					</div>
				</div>
			</div>
			<div className={styles.bottomHeader}>
				<input type='text' placeholder='Посада або компанія' />
				<button>Знайти вакансії</button>
			</div>
		</div>
	);
};
