# @esthe/totp

A TOTP (Time-based one-time password) / HOTP (HMAC-based one-time password) implementation in TypeScript.

ESM-only, no dependencies, browser-first. (but also works in Node.js)

```bash
pnpm install @esthe/totp
```

## Usage

```ts
import { generateSeed, generateTOTP, verifyTOTPLaxed } from "@esthe/totp"

// server, generate a seed/secret
const seed = generateSeed()

// client, generate the one-time password for the current time, using the seed
const totp = await generateTOTP(seed)

// server, verify the one-time password. Allows about 1 minute of drift.
const correct = await verifyTOTPLaxed(seed, totp)

if (!correct) res.status(401).send("Invalid one-time password.") // or whatever
```
