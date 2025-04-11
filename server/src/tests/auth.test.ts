import bcrypt from "bcryptjs";
import pool from "../db/pool";
import { IRegister } from "../types/register.interface";

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

async function createFinderInDb(password: string) {
	const hashed = await bcrypt.hash(password, 10);
	return pool.query(
		`
			INSERT INTO temp_finders (user_name, user_surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *
		`,
		[user.userName, user.userSurname, user.email, hashed]
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

		CREATE TEMPORARY TABLE temp_finders (
			id           SERIAL PRIMARY KEY,
    		user_name    VARCHAR(255) NOT NULL,
    		user_surname VARCHAR(255) NOT NULL,
    		email        VARCHAR(255) NOT NULL UNIQUE,
    		password     VARCHAR(255) NOT NULL,
    		created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    		updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`);
});

afterEach(async () => {
	await pool.query("ROLLBACK");
});

test("register recruiter", async () => {
	const result = await createUserInDB(testPassword);
	const createdUser = result.rows[0];

	expect(createdUser).toHaveProperty("id");
	expect(createdUser.user_name).toBe(user.userName);
	expect(createdUser.user_surname).toBe(user.userSurname);
	expect(createdUser.email).toBe(user.email);
	expect(createdUser.name_company).toBe(user.nameCompany);
	expect(createdUser.address_company).toBe(user.addressCompany);

	const isPasswordMatch = await bcrypt.compare(
		testPassword,
		createdUser.password
	);
	expect(isPasswordMatch).toBe(true);
});

test("login recruiter", async () => {
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
});

test("delete recruiter", async () => {
	await createUserInDB(testPassword);

	const userExists = await pool.query(
		`SELECT * FROM temp_users WHERE email = $1`,
		[user.email]
	);
	expect(userExists.rows).toHaveLength(1);

	const foundUser = userExists.rows[0];
	const isPasswordValid = await bcrypt.compare(
		testPassword,
		foundUser.password
	);
	expect(isPasswordValid).toBe(true);

	await pool.query("DELETE FROM temp_users WHERE email = $1", [user.email]);

	const checkDeleted = await pool.query(
		`SELECT * FROM temp_users WHERE email = $1`,
		[user.email]
	);
	expect(checkDeleted.rows).toHaveLength(0);
});

test("register finder", async () => {
	const result = await createFinderInDb(testPassword);
	const createdUser = result.rows[0];

	expect(createdUser).toHaveProperty("id");
	expect(createdUser.user_name).toBe(user.userName);
	expect(createdUser.user_surname).toBe(user.userSurname);
	expect(createdUser.email).toBe(user.email);

	const isPasswordMatch = await bcrypt.compare(
		testPassword,
		createdUser.password
	);
	expect(isPasswordMatch).toBe(true);
});

test("login finder", async () => {
	await createFinderInDb(testPassword);

	const userExists = await pool.query(
		`SELECT * FROM temp_finders WHERE email = $1`,
		[user.email]
	);

	expect(userExists.rows).toHaveLength(1);
	const foundUser = userExists.rows[0];

	expect(foundUser).toHaveProperty("id");
	expect(foundUser.user_name).toBe(user.userName);
	expect(foundUser.user_surname).toBe(user.userSurname);
	expect(foundUser.email).toBe(user.email);

	const isPasswordValid = await bcrypt.compare(
		testPassword,
		foundUser.password
	);
	expect(isPasswordValid).toBe(true);
});

test("delete finder", async () => {
	await createFinderInDb(testPassword);

	const userExists = await pool.query(
		`SELECT * FROM temp_finders WHERE email = $1`,
		[user.email]
	);
	expect(userExists.rows).toHaveLength(1);

	const foundUser = userExists.rows[0];
	const isPasswordValid = await bcrypt.compare(
		testPassword,
		foundUser.password
	);
	expect(isPasswordValid).toBe(true);

	await pool.query("DELETE FROM temp_finders WHERE email = $1", [user.email]);

	const checkDeleted = await pool.query(
		`SELECT * FROM temp_finders WHERE email = $1`,
		[user.email]
	);
	expect(checkDeleted.rows).toHaveLength(0);
});
