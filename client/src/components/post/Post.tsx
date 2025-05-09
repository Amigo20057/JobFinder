import { formatDistanceStrict } from "date-fns";
import { uk } from "date-fns/locale";
import {
	BadgeDollarSign,
	Building2,
	Check,
	Globe,
	Heart,
	MapPin,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRemoveSavedPost, fetchSavePost } from "../../redux/slices/posts";
import { AppDispatch } from "../../redux/store";
import styles from "./Post.module.css";

type Props = {
	id: number;
	title: string;
	description: string;
	nameCompany: string;
	workFormat: string;
	experience: string;
	language: string;
	tags: string;
	isSaved: boolean;
	createdAt: string;
	isFullPost: boolean;
};

export const Post = ({
	id,
	title,
	description,
	workFormat,
	experience,
	language,
	tags,
	isSaved,
	createdAt,
	nameCompany,
	isFullPost,
}: Props) => {
	const userRole = window.localStorage.getItem("role");
	const formattedTags = tags.replace(/[{}]/g, "").split(",");
	const dispatch: AppDispatch = useDispatch<AppDispatch>();
	const [savePostLocal, setSavePostLocal] = useState<boolean>(isSaved);

	const saveOrRemovePost = async () => {
		try {
			if (!isSaved) {
				await dispatch(fetchSavePost(id));
				setSavePostLocal(prev => !prev);
			} else {
				await dispatch(fetchRemoveSavedPost(id));
				setSavePostLocal(prev => !prev);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const displayTags = () => {
		return (
			<div className={styles.tags}>
				{formattedTags.map((tag, index) => (
					<p key={index}>{tag.trim()}</p>
				))}
			</div>
		);
	};

	return (
		<>
			{!isFullPost ? (
				<div className={styles.post}>
					<h1
						className={styles.title}
						onClick={() => (window.location.pathname = `/posts/${id}`)}
					>
						{title}
					</h1>
					<p className={styles.workFormat}>
						<span style={{ fontWeight: "600" }}>{nameCompany} </span>
						{workFormat}
					</p>
					<p className={styles.description}>{description}</p>
					<div className={styles.options}>
						<p>
							{formatDistanceStrict(new Date(createdAt), new Date(), {
								locale: uk,
							})}{" "}
							тому
						</p>
						{userRole === "finder" && (
							<button onClick={saveOrRemovePost}>
								<Heart
									style={{
										color: savePostLocal ? "#ff0033" : "black",
										fill: savePostLocal ? "#ff0033" : "none",
									}}
								/>
								{!savePostLocal ? (
									<span style={{ marginLeft: "25px" }}>Зберегти</span>
								) : (
									<span style={{ marginLeft: "10px" }}>Збережено</span>
								)}
							</button>
						)}
					</div>
				</div>
			) : (
				<div className={styles.fullPost}>
					<div className={styles.options}>
						{userRole === "finder" && (
							<>
								<button className={styles.respond}>Відгукнутися</button>
								<button onClick={saveOrRemovePost}>
									<Heart
										style={{
											color: savePostLocal ? "#ff0033" : "black",
											fill: savePostLocal ? "#ff0033" : "none",
										}}
									/>
									{!savePostLocal ? (
										<span style={{ marginLeft: "25px" }}>Зберегти</span>
									) : (
										<span style={{ marginLeft: "10px" }}>Збережено</span>
									)}
								</button>
							</>
						)}
					</div>
					<div className={styles.createdAt}>
						<p>Вакансія від 27 березня 2025</p>
					</div>
					<h1 className={styles.title}>{title}</h1>
					<p className={styles.price}>
						<BadgeDollarSign style={{ marginRight: "10px" }} />
						120 000 - 130 000
					</p>
					<p className={styles.nameCompany}>
						<Building2 style={{ marginRight: "10px" }} />
						{nameCompany}
					</p>
					<p className={styles.workFormat}>
						<MapPin style={{ marginRight: "10px" }} />
						{workFormat}
					</p>
					<p className={styles.experience}>
						<Check style={{ marginRight: "10px" }} />
						{experience}
					</p>
					<p className={styles.experience}>
						<Globe style={{ marginRight: "10px" }} />
						{language}
					</p>
					{displayTags()}
					<h1>Опис вакансії</h1>
					<div className={styles.description}>{description}</div>
					{userRole === "finder" && (
						<button className={styles.respond}>Відгукнутися</button>
					)}
				</div>
			)}
		</>
	);
};
