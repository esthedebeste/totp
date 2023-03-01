export type HOTPAlgorithm = "SHA-1" | "SHA-256" | "SHA-512"

/** Convert an integer to a Uint8Array of size 8, zero-padded at the start, big-endian. */
function integerToBytes(integer: number) {
	const BYTE_SIZE = 8
	const byteArray = new Uint8Array(BYTE_SIZE).fill(0)
	for (let index = 0; index < BYTE_SIZE && integer !== 0; index++) {
		byteArray[BYTE_SIZE - index - 1] = integer & 0xff
		integer >>>= 8
	}
	return byteArray
}

async function hmac(
	secret: ArrayBuffer,
	input: number,
	algorithm: HOTPAlgorithm
): Promise<Uint8Array> {
	const byteArray = integerToBytes(input)
	const key = await crypto.subtle.importKey(
		"raw",
		secret,
		{ name: "HMAC", hash: algorithm },
		false,
		["sign"]
	)
	return new Uint8Array(await crypto.subtle.sign({ name: "HMAC", hash: algorithm }, key, byteArray))
}

function truncate(source: Uint8Array) {
	const offset = source[source.byteLength - 1] & 0xf
	return (
		((source[offset] & 0x7f) << 24) |
		((source[offset + 1] & 0xff) << 16) |
		((source[offset + 2] & 0xff) << 8) |
		(source[offset + 3] & 0xff)
	)
}

/**
 * Generate a HOTP code.
 * @param secret The secret/key/seed to use.
 */
export async function generateHOTP(
	secret: string | ArrayBuffer,
	counter: number,
	algorithm: HOTPAlgorithm = "SHA-1",
	digits = 6
): Promise<string> {
	if (typeof secret === "string") secret = new TextEncoder().encode(secret)
	const hmacResult = await hmac(secret, counter, algorithm)
	const codeValue = truncate(hmacResult) % 10 ** digits
	return codeValue.toString().padStart(digits, "0")
}
