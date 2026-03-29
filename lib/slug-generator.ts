/**
 * Slug Generator Utility
 * Generates URL-friendly slugs from content titles or names
 */

/**
 * Generate a URL-friendly slug from text
 * @param text - The text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug with timestamp if needed
 * @param text - The text to convert to slug
 * @param existingSlugs - Array of existing slugs to check for duplicates
 * @returns Unique slug with timestamp suffix if duplicate found
 */
export function generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
  let slug = generateSlug(text)
  
  // Check if slug already exists
  if (existingSlugs.includes(slug)) {
    // Add timestamp suffix to make it unique
    const timestamp = Date.now().toString().slice(-6) // Last 6 digits of timestamp
    slug = `${slug}-${timestamp}`
  }
  
  return slug
}

/**
 * Generate slug from news/article title with hashtags for SEO
 * @param title - News title
 * @returns Slug optimized for news content
 */
export function generateNewsSlug(title: string): string {
  return generateSlug(title)
}

/**
 * Generate slug from gallery album name
 * @param albumName - Album name
 * @returns Slug optimized for gallery
 */
export function generateGallerySlug(albumName: string): string {
  return generateSlug(albumName)
}

/**
 * Validate a slug format
 * @param slug - The slug to validate
 * @returns boolean - True if slug is valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}

/**
 * Generate slug with random suffix for uniqueness
 * @param text - The text to convert to slug
 * @returns Slug with random suffix
 */
export function generateRandomSlug(text: string): string {
  const baseSlug = generateSlug(text)
  const randomSuffix = Math.random().toString(36).substring(2, 8) // Generate random string
  return `${baseSlug}-${randomSuffix}`
}
