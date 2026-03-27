export const CACHE_TAGS = {
  members: 'members',
  jobs: 'jobs',
  contents: 'contents',
  gallery: 'gallery',
  committee: 'committee',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]
