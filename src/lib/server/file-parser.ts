import PDFParser from 'pdf2json';
import mammoth from 'mammoth';

const SUPPORTED_EXTENSIONS = ['txt', 'md', 'pdf', 'docx'] as const;
type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

/**
 * Extract text content from various file formats
 */
export async function extractTextFromFile(
	buffer: Buffer,
	filename: string
): Promise<string> {
	const ext = filename.split('.').pop()?.toLowerCase() as SupportedExtension | undefined;

	if (!ext || !SUPPORTED_EXTENSIONS.includes(ext)) {
		throw new Error(`Unsupported format: .${ext || 'unknown'}`);
	}

	switch (ext) {
		case 'txt':
		case 'md':
			return buffer.toString('utf-8');

		case 'pdf': {
			return new Promise((resolve, reject) => {
				const pdfParser = new PDFParser();
				pdfParser.on('pdfParser_dataReady', () => {
					const text = pdfParser.getRawTextContent();
					resolve(text);
				});
				pdfParser.on('pdfParser_dataError', (err: { parserError: Error }) => {
					reject(err.parserError);
				});
				pdfParser.parseBuffer(buffer);
			});
		}

		case 'docx': {
			const result = await mammoth.extractRawText({ buffer });
			return result.value;
		}
	}
}

/**
 * Check if a file extension is supported
 */
export function isSupportedExtension(filename: string): boolean {
	const ext = filename.split('.').pop()?.toLowerCase();
	return !!ext && SUPPORTED_EXTENSIONS.includes(ext as SupportedExtension);
}
