export interface IPost {
	title: string;
	description: string;
	workFormat: string;
	experience: string;
	language: string;
	tags: string[];
	isSaved: boolean;
	recruiterId: number;
	createdAt: Date;
}
