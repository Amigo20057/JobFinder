import styles from "./Post.module.css";
import {formatDistanceStrict} from "date-fns";
import {uk} from "date-fns/locale";
import {Heart} from 'lucide-react';

type Props = {
    id: number;
    title: string;
    description: string;
    nameCompany: string;
    workFormat: string;
    experience: string;
    language: string;
    tags: string[];
    createdAt: string;
    isFullPost: boolean;
}

export const Post = ({
                         id,
                         title,
                         description,
                         workFormat,
                         experience,
                         language,
                         tags,
                         createdAt,
                         nameCompany,
                         isFullPost
                     }: Props) => {
    const userRole = window.localStorage.getItem("role");

    return (
        <>
            {!isFullPost ?
                <div className={styles.post}>
                    <h1 className={styles.title} onClick={() => window.location.pathname = `/posts/${id}`}>{title}</h1>
                    <p className={styles.workFormat}><span
                        style={{fontWeight: "600"}}>{nameCompany}</span> {workFormat}</p>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.options}>
                        <p>
                            {formatDistanceStrict(new Date(createdAt), new Date(), {locale: uk})} тому
                        </p>
                        {
                            userRole === "finder" &&
                            <button><Heart style={{marginRight: "20px"}}/> Зберегти</button>
                        }
                    </div>
                </div>
                :
                <div className={styles.fullPost}>
                    {experience} {language} {tags}
                </div>}
        </>
    );
}