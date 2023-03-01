import { HOTPAlgorithm, generateHOTP } from "./hotp.js"

/**
 * Generate a TOTP code.
 * @param secret The secret/key/seed to use.
 * @param timestamp The timestamp to use, in milliseconds.
 * @param startTime The start time of the TOTP counter, in milliseconds.
 */
export async function generateTOTP(
	secret: string | ArrayBuffer,
	algorithm: HOTPAlgorithm = "SHA-1",
	digits = 6,
	stepTime = 30,
	timestamp = Date.now(),
	startTime = 0
) {
	const counter = Math.floor((timestamp - startTime) / 1000 / stepTime)
	return generateHOTP(secret, counter, algorithm, digits)
}

/** Allows for the previous or next code to be submitted, and still count. */
export async function verifyTOTPLaxed(
	secret: string | ArrayBuffer,
	code: string,
	algorithm: HOTPAlgorithm = "SHA-1",
	digits = 6,
	stepTime = 30,
	timestamp = Date.now(),
	startTime = 0
) {
	const counter = Math.floor((timestamp - startTime) / 1000 / stepTime)
	const expected = await Promise.all([
		generateHOTP(secret, counter - 1, algorithm, digits),
		generateHOTP(secret, counter, algorithm, digits),
		generateHOTP(secret, counter + 1, algorithm, digits),
	])
	return expected.includes(code)
}
