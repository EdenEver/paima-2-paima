export const uint8ArrayFromObject = (obj: object) => new TextEncoder().encode(JSON.stringify(obj))
