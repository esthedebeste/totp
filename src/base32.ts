const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

export function base32Encode(data: Uint8Array) {
	// Adapted from https://github.com/LinusU/base32-encode/blob/d68e91/index.js
	let bits = 0
	let value = 0
	let output = ""

	for (let index = 0; index < data.byteLength; index++) {
		value = (value << 8) | data[index]
		bits += 8

		while (bits >= 5) {
			bits -= 5
			output += ALPHABET[(value >>> bits) & 31]
		}
	}

	if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31]

	return output
}
