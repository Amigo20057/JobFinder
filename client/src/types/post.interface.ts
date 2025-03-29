export interface IPost {
	id: number;
	title: string;
	description: string;
	experience: string;
	language: string;
	tags: string[];
	created_at: string;
	recruiter_id: number;
}

export type IPostWithRecruiter = IPost & {
	work_format: string;
	name_company: string;
	address_company: string;
};
