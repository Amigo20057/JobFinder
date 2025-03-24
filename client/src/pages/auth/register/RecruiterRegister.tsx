import styles from "../Auth.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import {IRecruiter} from "../../../types/user.interface.ts";
import {Link, Navigate} from "react-router-dom";
import { CircleUserRound, BriefcaseBusiness } from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {fetchRecruiterRegister, IsAuth} from "../../../redux/slices/auth.ts";
import {AppDispatch} from "../../../redux/store.ts";

export const RecruiterRegister = () => {
  const isAuth = useSelector(IsAuth);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit } = useForm<IRecruiter>();

  const onSubmit: SubmitHandler<IRecruiter> = async (params: IRecruiter) => {
    const data = await dispatch(fetchRecruiterRegister(params));
    if (!data.payload) {
      return alert("Error register");
    }
    console.log("DATA PAYLOAD: ", data.payload);
  };

  if(isAuth){
    return <Navigate to="/" />
  }

  return (
      <div className={styles.authPage}>
        <div className={styles.container} style={{paddingTop: "100px"}}>
          <h1>Реєстрація роботодавця</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
                id="username"
                type="text"
                {...register("userName", { required: true })}
                required={true}
                placeholder="Ім'я роботодавця"
            />
            <input
                id="usersurname"
                type="text"
                {...register("userSurname", { required: true })}
                required={true}
                placeholder="Прізвище роботодавця"
            />
            <input
                id="nameCompany"
                type="text"
                {...register("nameCompany", {required: true})}
                required={true}
                placeholder="Назва компанії"
            />
            <input
                id="addressCompany"
                type="text"
                {...register("addressCompany", {required: true})}
                required={true}
                placeholder="Адреса компанії"
            />
            <input
                id="email"
                type="email"
                {...register("email", { required: true })}
                required={true}
                placeholder="Ел. пошта"
            />
            <input
                id="password"
                type="password"
                {...register("password", { required: true })}
                required={true}
                placeholder="Пароль"
            />
            <button type="submit">Зареєструватися</button>
          </form>
          <Link to="/auth/finder/login">
            <BriefcaseBusiness style={{ marginRight: "10px" }} />
            Увійти як роботодавець
          </Link>
          <Link to="/auth/recruiter/login" style={{ marginTop: "20px" }}>
            <CircleUserRound style={{ marginRight: "10px" }} />
            Увійти як шукач
          </Link>
        </div>
      </div>
  );
};
