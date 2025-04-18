import MDEditor, {
	commands,
	ICommand,
	TextAreaTextApi,
	TextState,
} from "@uiw/react-md-editor";
import React from "react";
import styles from "./CreatePost.module.css";

// Кастомная кнопка для заголовка H3
const title3: ICommand = {
	name: "title3",
	keyCommand: "title3",
	buttonProps: { "aria-label": "Insert title3" },
	icon: (
		<svg width='12' height='12' viewBox='0 0 520 520'>
			<path
				fill='currentColor'
				d='M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z'
			/>
		</svg>
	),
	execute: (state: TextState, api: TextAreaTextApi) => {
		let modifyText = `### ${state.selectedText}\n`;
		if (!state.selectedText) {
			modifyText = `### `;
		}
		api.replaceSelection(modifyText);
	},
};

export const CreatePost = () => {
	const [value, setValue] = React.useState("");

	return (
		<div className={styles.createPost}>
			<div className={styles.container}>
				<div data-color-mode='light'>
					<MDEditor
						value={value}
						onChange={val => setValue(val!)}
						commands={[
							commands.group(
								[
									commands.title1,
									commands.title2,
									commands.title4,
									commands.title5,
									commands.title6,
								],
								{
									name: "title",
									groupName: "title",
									buttonProps: { "aria-label": "Insert title" },
								}
							),
							commands.bold,
							commands.italic,
							commands.strikethrough,
							commands.divider,
							commands.link,
							commands.image,
							commands.unorderedListCommand,
							commands.orderedListCommand,
						]}
					/>
				</div>
			</div>
		</div>
	);
};
