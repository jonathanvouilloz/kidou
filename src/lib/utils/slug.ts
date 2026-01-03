/**
 * Generates a URL-safe slug from a project name.
 * - Lowercases the string
 * - Removes accents
 * - Replaces non-alphanumeric characters with hyphens
 * - Trims leading/trailing hyphens
 * - Limits to 50 characters
 */
export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove accents
		.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
		.replace(/^-|-$/g, '') // Trim leading/trailing hyphens
		.slice(0, 50);
}
