import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { ConfigService } from "../config/config.service";
import pool from "../db/pool";
import { ILogin } from "../types/login.interface";
import { IRegister } from "../types/register.interface";
import { UserService } from "./user.service";

export class AuthService {
	private pool: Pool = pool;

	public constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService
	) {}

	private async hashPassword(password: string):Promise<string> {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt)
	}

	private tokenGenerate(id:number, email:string):string{
		return jwt.sign(
			{
				id: id,
				email: email
			},
			this.config.get<string>("SECRET"),
			{
				expiresIn: "30d"
			}
		)
	}

	public async registerFinder(dto: IRegister) {
		const finderExists = await this.userService.findFinderByEmail(dto.email);
		const recruiterExists = await this.userService.findRecruiterByEmail(dto.email);
		if (finderExists.rowCount! > 0 || recruiterExists.rowCount! > 0) {
			throw new Error("User already exists");
		}
		dto.password = await this.hashPassword(dto.password);
		const userResult = await this.userService.createFinder(dto);
		const token = this.tokenGenerate(userResult.rows[0].id, userResult.rows[0].email)
		const user = userResult.rows[0];
		return {
			...user,
			token,
		};
	}

	public async registerRecruiter(dto: IRegister) {
		const recruiterExists = await this.userService.findRecruiterByEmail(dto.email);
		const finderExists = await this.userService.findFinderByEmail(dto.email);
		if (recruiterExists.rowCount! > 0 || finderExists.rowCount! > 0) {
			throw new Error("User already exists");
		}
		dto.password = await this.hashPassword(dto.password);
		const userResult = await this.userService.createRecruiter(dto);
		const token = this.tokenGenerate(userResult.rows[0].id, userResult.rows[0].email)
		const user = userResult.rows[0];
		return {
			...user,
			token,
		};
	}

	public async loginFinder(dto: ILogin) {
		const finderExists = await this.userService.findFinderByEmail(dto.email);
		if (finderExists.rowCount === 0) {
			throw new Error("User not exists");
		}
		const user = finderExists.rows[0];
		const isPasswordValid = bcrypt.compareSync(dto.password, user.password);
		if (!isPasswordValid) {
			throw new Error("Wrong data");
		}
		const token = this.tokenGenerate(user.id, user.email);
		return {
			...user,
			token,
		};
	}

	public async loginRecruiter(dto: ILogin) {
		const recruiterExists = await this.userService.findRecruiterByEmail(dto.email);
		if (recruiterExists.rowCount === 0) {
			throw new Error("User not exists");
		}
		const user = recruiterExists.rows[0];
		const isPasswordValid = bcrypt.compareSync(dto.password, user.password);
		if (!isPasswordValid) {
			throw new Error("Wrong data");
		}
		const token = this.tokenGenerate(user.id, user.email);
		return {
			...user,
			token,
		};
	}
}
