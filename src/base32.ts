const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

export function base32Encode(data: Uint8Array): string {
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

function readChar(char: string) {
	const index = ALPHABET.indexOf(char)
	if (index === -1) throw new Error("Invalid character found: " + char)
	return index
}

export function base32Decode(input: string): Uint8Array {
	// Adapted from https://github.com/LinusU/base32-decode/blob/a6601b/index.js
	input = input.replace(/=+$/, "")
	const length = input.length

	let bits = 0
	let value = 0

	let index = 0
	const output = new Uint8Array(Math.floor((length * 5) / 8))

	for (let index_ = 0; index_ < length; index_++) {
		value = (value << 5) | readChar(input[index_])
		bits += 5

		if (bits >= 8) {
			output[index++] = (value >>> (bits - 8)) & 255
			bits -= 8
		}
	}

	return output
}
