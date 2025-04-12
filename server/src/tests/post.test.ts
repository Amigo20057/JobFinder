import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ConfigService } from "../config/config.service";
import pool from "../db/pool";
import { IPost } from "../types/post.interface";
import { IRegister } from "../types/register.interface";
import { DecodedToken } from "../types/token.types";

const config = new ConfigService();
const testPassword = "12345";
const testEmail = "testemail@gmail.com";

const user: IRegister = {
	userName: "testUserName",
	userSurname: "testSurname",
	email: testEmail,
	nameCompany: "testNameCompany",
	addressCompany: "testAddressCompany",
	password: testPassword,
};

const post: IPost = {
	title: "testTitlePost",
	description: "testDescriptionPost",
	workFormat: "testWorkFormat",
	experience: "testExperience",
	language: "testLanguage",
	tags: ["testTag1", "testTag2", "testTag3"],
	recruiterId: 0,
};

async function createUserInDB(password: string) {
	const hashed = await bcrypt.hash(password, 10);
	return pool.query(
		`
		INSERT INTO temp_users (user_name, user_surname, email, password, name_company, address_company)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
		`,
		[
			user.userName,
			user.userSurname,
			user.email,
			hashed,
			user.nameCompany,
			user.addressCompany,
		]
	);
}

async function createPostInDB() {
	return await pool.query(
		"INSERT INTO temp_posts(title, description, work_format, experience, language, tags, recruiter_id) VALUES($1, $2, $3, $4, $5 ,$6::TEXT[], $7) RETURNING *",
		[
			post.title,
			post.description,
			post.workFormat,
			post.experience,
			post.language,
			post.tags,
			post.recruiterId,
		]
	);
}

beforeEach(async () => {
	await pool.query("BEGIN");
	await pool.query(`
		CREATE TEMPORARY TABLE temp_users (
			id              SERIAL PRIMARY KEY,
			user_name       VARCHAR(255) NOT NULL,
			user_surname    VARCHAR(255) NOT NULL,
			email           VARCHAR(255) NOT NULL UNIQUE,
			password        VARCHAR(255) NOT NULL,
			name_company    VARCHAR(255),
			address_company VARCHAR(255),
			created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TEMPORARY TABLE temp_posts (
		    id           SERIAL PRIMARY KEY,
			title        VARCHAR(255) NOT NULL,
			description  TEXT         NOT NULL,
			work_format  VARCHAR(255) NOT NULL,
			experience   VARCHAR(255) NOT NULL,
			language     VARCHAR(255) NOT NULL,
			tags         TEXT[],
			recruiter_id INT NOT NULL,
			created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`);
});

afterEach(async () => {
	await pool.query("ROLLBACK");
});

test("create post", async () => {
	await createUserInDB(testPassword);

	const userExists = await pool.query(
		`SELECT * FROM temp_users WHERE email = $1`,
		[user.email]
	);

	expect(userExists.rows).toHaveLength(1);
	const foundUser = userExists.rows[0];

	expect(foundUser).toHaveProperty("id");
	expect(foundUser.user_name).toBe(user.userName);
	expect(foundUser.user_surname).toBe(user.userSurname);
	expect(foundUser.email).toBe(user.email);
	expect(foundUser.name_company).toBe(user.nameCompany);
	expect(foundUser.address_company).toBe(user.addressCompany);

	const isPasswordValid = await bcrypt.compare(
		testPassword,
		foundUser.password
	);
	expect(isPasswordValid).toBe(true);

	const token = jwt.sign(
		{
			id: foundUser.id,
			email: foundUser.email,
		},
		config.get<string>("SECRET"),
		{
			expiresIn: "10s",
		}
	);

	const decoded = jwt.verify(
		token,
		config.get<string>("SECRET")
	) as DecodedToken;

	const userId = decoded.id;

	// Обновим recruiterId у поста
	post.recruiterId = userId;

	const result = await createPostInDB();
	const createdPost = result.rows[0];

	expect(createdPost).toHaveProperty("id");
	expect(createdPost.title).toBe(post.title);
	expect(createdPost.description).toBe(post.description);
	expect(createdPost.work_format).toBe(post.workFormat);
	expect(createdPost.experience).toBe(post.experience);
	expect(createdPost.language).toBe(post.language);
	expect(createdPost.tags).toEqual(post.tags);
	expect(createdPost.recruiter_id).toBe(post.recruiterId);

	// Проверим, что пост действительно записан в базе
	const postFromDB = await pool.query(
		`SELECT * FROM temp_posts WHERE id = $1`,
		[createdPost.id]
	);

	expect(postFromDB.rows).toHaveLength(1);
	expect(postFromDB.rows[0].title).toBe(post.title);
});
