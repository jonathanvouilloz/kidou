import { json, error } from '@sveltejs/kit';
import { extractTextFromFile, isSupportedExtension } from '$lib/server/file-parser';
import type { RequestHandler } from './$types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check authentication
	if (!locals.user) {
		throw error(401, { message: 'Non autorisé' });
	}

	// Parse multipart form data
	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		throw error(400, { message: 'Invalid form data' });
	}

	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		throw error(400, { message: 'No file provided' });
	}

	// Validate file size
	if (file.size > MAX_FILE_SIZE) {
		throw error(400, { message: 'File too large (max 5MB)' });
	}

	// Validate file extension
	if (!isSupportedExtension(file.name)) {
		throw error(400, { message: 'Unsupported format. Use .txt, .md, .pdf, or .docx' });
	}

	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const text = await extractTextFromFile(buffer, file.name);

		if (!text.trim()) {
			throw error(400, { message: 'File is empty or could not be read' });
		}

		return json({ text: text.trim() });
	} catch (err) {
		// Re-throw if it's already an error response
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		console.error('File parsing error:', err);
		throw error(500, { message: 'Error reading file' });
	}
};
