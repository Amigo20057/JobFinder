export interface IPost {
	id: number;
	title: string;
	description: string;
	experience: string;
	language: string;
	tags: string | string[];
	isSaved: boolean;
	created_at: string;
	recruiter_id: number;
	work_format?: string;
	name_company?: string;
	address_company?: string;
}

export interface IPostResponse {
	title: string;
	description: string;
	experience: string;
	language: string;
	tags: string | string[];
	workFormat: string;
}

export type IPostWithRecruiter = IPost & {
	work_format: string;
	name_company: string;
	address_company: string;
};
