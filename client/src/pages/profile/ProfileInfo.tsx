type Props = {
	user_name: string;
	user_surname: string;
	email: string;
	name_company?: string;
	address_company?: string;
	role: string;
};

export const ProfileInfo = ({
	user_name,
	user_surname,
	email,
	name_company,
	address_company,
	role,
}: Props) => {
	return (
		<div>
			<p>user name: {user_name}</p>
			<p>user surname: {user_surname}</p>
			<p>email: {email}</p>
			{role === "recruiter" ? (
				<>
					<p>name company: {name_company ? name_company : ""}</p>
					<p>address company: {address_company ? address_company : ""}</p>
				</>
			) : (
				""
			)}
		</div>
	);
};
