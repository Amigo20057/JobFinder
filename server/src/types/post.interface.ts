export interface IPost {
	title: string;
	description: string;
	aboutCompany: string;
	workFormat: string;
	experience: string;
	language: string;
	tags: string[];
	isSaved?: boolean;
	recruiterId: number;
	createdAt?: Date;
}
