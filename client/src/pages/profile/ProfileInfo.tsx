import { useEffect, useRef, useState } from "react";

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
	const [isOpen, setIsOpen] = useState(true);
	const contentRef = useRef<HTMLDivElement>(null);
	const [maxHeight, setMaxHeight] = useState("1000px");

	useEffect(() => {
		if (contentRef.current) {
			setMaxHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
		}
	}, [isOpen]);

	return (
		<div
			style={{
				position: "relative",
				border: "1px solid #ccc",
				borderRadius: "8px",
				padding: "16px",
				maxWidth: "500px",
				marginBottom: "24px",
				backgroundColor: "#f9f9f9",
			}}
		>
			<button
				onClick={() => setIsOpen(prev => !prev)}
				style={{
					position: "absolute",
					top: "8px",
					right: "12px",
					cursor: "pointer",
					background: "transparent",
					border: "none",
					color: "#007bff",
					fontWeight: "bold",
				}}
			>
				{isOpen ? "▲ Приховати" : "▼ Показати"}
			</button>

			<div
				ref={contentRef}
				style={{
					overflow: "hidden",
					transition: "max-height 0.4s ease",
					maxHeight,
				}}
			>
				<h2 style={{ marginBottom: "12px" }}>Профіль користувача</h2>
				<div style={{ marginBottom: "8px" }}>
					<strong>Ім'я:</strong> {user_name}
				</div>
				<div style={{ marginBottom: "8px" }}>
					<strong>Прізвище:</strong> {user_surname}
				</div>
				<div style={{ marginBottom: "8px" }}>
					<strong>Email:</strong> {email}
				</div>
				{role === "recruiter" && (
					<>
						<div style={{ marginBottom: "8px" }}>
							<strong>Компанія:</strong> {name_company || "-"}
						</div>
						<div style={{ marginBottom: "8px" }}>
							<strong>Адреса компанії:</strong> {address_company || "-"}
						</div>
					</>
				)}
				<div>
					<strong>Роль:</strong> {role}
				</div>
			</div>
		</div>
	);
};
