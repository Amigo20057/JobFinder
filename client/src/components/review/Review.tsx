type Props = {
	email: string;
	user_name: string;
	user_surname: string;
	about_finder: string;
};

export const Review = ({
	email,
	user_name,
	user_surname,
	about_finder,
}: Props) => {
	return (
		<div>
			<h1>email: {email}</h1>
			<h3>user name: {user_name}</h3>
			<h3>user surname: {user_surname}</h3>
			<p>about finder: {about_finder}</p>
		</div>
	);
};
