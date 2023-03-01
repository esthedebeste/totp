import { base32Encode } from "./base32.js"

/** @param size Recommendations: SHA-1: 20, SHA-256: 32, SHA-512: 64 */
export function generateSeed(size = 20) {
	return crypto.getRandomValues(new Uint8Array(size))
}

export interface FormatOptions {
	issuer?: string
	algorithm?: "SHA1" | "SHA256" | "SHA512"
	digits?: number
	period?: number
}

/**
 * Formats a seed as a otpauth://totp/ URL.
 * This is often displayed to the user as a QR code.
 */
export async function formatSeed(
	seed: Uint8Array,
	label: string,
	{ issuer = "@esthe/totp", algorithm = "SHA1", digits = 6, period = 30 }: FormatOptions = {}
): Promise<URL> {
	const url = new URL(`otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}`)
	url.searchParams.set("secret", base32Encode(seed))
	url.searchParams.set("issuer", issuer)
	url.searchParams.set("algorithm", algorithm)
	url.searchParams.set("digits", digits.toString())
	url.searchParams.set("period", period.toString())
	return url
}
