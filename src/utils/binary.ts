
import { Buffer } from 'buffer';

interface EncodingOpts {
	chunkLength?: number
	chunkBegin?: number
}
export type Encoding = 'utf8' | 'binary' | null

export function textOrBinary(
	buffer: Buffer,
	opts?: EncodingOpts
): Encoding {
	if (!buffer) return null

	const textEncoding = 'utf8'
	const binaryEncoding = 'binary'
	const chunkLength = opts?.chunkLength ?? 24
	let chunkBegin = opts?.chunkBegin ?? 0

	if (opts?.chunkBegin == null) {
		let encoding = textOrBinary(buffer, { chunkLength, chunkBegin })
		if (encoding === textEncoding) {
			chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength)
			encoding = textOrBinary(buffer, {
				chunkLength,
				chunkBegin,
			})
			if (encoding === textEncoding) {
				chunkBegin = Math.max(0, buffer.length - chunkLength)
				encoding = textOrBinary(buffer, {
					chunkLength,
					chunkBegin,
				})
			}
		}

		return encoding
	} else {
		chunkBegin = getChunkBegin(buffer, chunkBegin)
		if (chunkBegin === -1) {
			return binaryEncoding
		}

		const chunkEnd = getChunkEnd(
			buffer,
			Math.min(buffer.length, chunkBegin + chunkLength)
		)

		if (chunkEnd > buffer.length) {
			return binaryEncoding
		}

		const contentChunkUTF8 = buffer.toString(textEncoding, chunkBegin, chunkEnd)

		for (let i = 0; i < contentChunkUTF8.length; ++i) {
			const charCode = contentChunkUTF8.charCodeAt(i)
			if (charCode === 65533 || charCode <= 8) {
				return binaryEncoding
			}
		}

		return textEncoding
	}
}

function getChunkBegin(buf: Buffer, chunkBegin: number) {
	if (chunkBegin === 0) {
		return 0
	}

	if (!isLaterByteOfUtf8(buf[chunkBegin])) {
		return chunkBegin
	}

	let begin = chunkBegin - 3

	if (begin >= 0) {
		if (isFirstByteOf4ByteChar(buf[begin])) {
			return begin
		}
	}

	begin = chunkBegin - 2

	if (begin >= 0) {
		if (
			isFirstByteOf4ByteChar(buf[begin]) ||
			isFirstByteOf3ByteChar(buf[begin])
		) {
			return begin
		}
	}

	begin = chunkBegin - 1

	if (begin >= 0) {
		if (
			isFirstByteOf4ByteChar(buf[begin]) ||
			isFirstByteOf3ByteChar(buf[begin]) ||
			isFirstByteOf2ByteChar(buf[begin])
		) {
			return begin
		}
	}

	return -1
}

function getChunkEnd(buf: Buffer, chunkEnd: number) {
	if (chunkEnd === buf.length) {
		return chunkEnd
	}

	let index = chunkEnd - 3

	if (index >= 0) {
		if (isFirstByteOf4ByteChar(buf[index])) {
			return chunkEnd + 1
		}
	}

	index = chunkEnd - 2

	if (index >= 0) {
		if (isFirstByteOf4ByteChar(buf[index])) {
			return chunkEnd + 2
		}

		if (isFirstByteOf3ByteChar(buf[index])) {
			return chunkEnd + 1
		}
	}

	index = chunkEnd - 1

	if (index >= 0) {
		if (isFirstByteOf4ByteChar(buf[index])) {
			return chunkEnd + 3
		}

		if (isFirstByteOf3ByteChar(buf[index])) {
			return chunkEnd + 2
		}

		if (isFirstByteOf2ByteChar(buf[index])) {
			return chunkEnd + 1
		}
	}

	return chunkEnd
}

function isFirstByteOf4ByteChar(byte: number) {
	return byte >> 3 === 30 
}

function isFirstByteOf3ByteChar(byte: number) {
	return byte >> 4 === 14 
}

function isFirstByteOf2ByteChar(byte: number) {
	return byte >> 5 === 6 
}

function isLaterByteOfUtf8(byte: number) {
	return byte >> 6 === 2 
}