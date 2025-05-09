import { body } from "express-validator";

export const loginValidator = [
	body("email", "invalid email format").isEmail(),
	body("password", "password must have min 5 symbols").isLength({ min: 5 }),
];

export const registerValidator = [
	body("email", "Invalid email format").isEmail(),
	body("password", "Password must have at least 5 symbols").isLength({
		min: 5,
	}),
	body("userName", "Enter your name").isLength({ min: 3 }),
	body("userSurname", "Enter your surname").isLength({ min: 3 }),
	body("nameCompany", "Enter company name (if applicable)")
		.isLength({
			min: 3,
		})
		.optional(),
	body("addressCompany", "Enter company address (if applicable)")
		.isString()
		.optional(),
];

export const postCreateValidation = [
	body("title", "Enter a valid title").isLength({ min: 3 }).isString(),
	body("description", "Enter a valid text")
		.isLength({ min: 10 })
		.isString()
		.escape(),
	body("workFormat", "Enter a valid text").isString(),
	body("experience", "Enter a valid text").isString(),
	body("language", "Enter a valid language").isString(),
	body("tags", "Tags must be an array").isString(),
];
