import { Pool } from "pg";
import pool from "../db/pool";
import { IRegister } from "../types/register.interface";

export class UserService {
	private pool: Pool = pool;

	public async findFindersById(id: number) {
		return await this.pool.query("SELECT * FROM public.finders WHERE id = $1", [
			id,
		]);
	}

	public async findRecruiterById(id: number) {
		return await this.pool.query(
			"SELECT * FROM public.recruiters WHERE id = $1",
			[id]
		);
	}

	public async findFinderByEmail(email: string) {
		return await this.pool.query(
			"SELECT * FROM public.finders WHERE email = $1",
			[email]
		);
	}

	public async findRecruiterByEmail(email: string) {
		return await this.pool.query(
			"SELECT * FROM public.recruiters WHERE email = $1",
			[email]
		);
	}

	public async createRecruiter(dto: IRegister) {
		return await this.pool.query(
			"INSERT INTO public.recruiters(user_name, user_surname, email, password, name_company, address_company) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
			[
				dto.userName,
				dto.userSurname,
				dto.email,
				dto.password,
				dto.nameCompany,
				dto.addressCompany,
			]
		);
	}

	public async createFinder(dto: IRegister) {
		return await this.pool.query(
			"INSERT INTO public.finders(user_name, user_surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
			[dto.userName, dto.userSurname, dto.email, dto.password]
		);
	}
}
