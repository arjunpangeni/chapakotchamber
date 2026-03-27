import { z } from 'zod'

// Member Schema
export const MemberSchema = z.object({
  _id: z.string().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  businessType: z.string().min(1, 'Business type is required'),
  address: z.string().min(1, 'Address is required'),
  ward: z.string().min(1, 'Ward is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  membershipStatus: z.enum(['active', 'inactive']).default('active'),
  joinDate: z.string().default(() => new Date().toISOString()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Member = z.infer<typeof MemberSchema>

// Job Schema
export const JobSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  description: z.string().min(1, 'Job description is required'),
  location: z.string().optional(),
  salary: z.string().optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'temporary']),
  deadline: z.string(),
  postedBy: z.string(),
  status: z.enum(['active', 'closed']).default('active'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Job = z.infer<typeof JobSchema>

// News Schema
export const ContentBaseSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    type: z.enum(['news', 'notice', 'article']),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
    authorName: z.string().optional(),
    isPinned: z.boolean().optional().default(false),
    expiresAt: z.string().optional().nullable(),
    published: z.boolean().optional().default(false),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })

export const ContentSchema = ContentBaseSchema
  .superRefine((data, ctx) => {
    if (data.type === 'article' && !data.authorName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['authorName'],
        message: 'Author name is required for articles',
      })
    }
  })

export type Content = z.infer<typeof ContentSchema>

export const NewsSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'News title is required'),
  content: z.string().min(1, 'News content is required'),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  author: z.string().min(1, 'Author is required'),
  category: z.string().optional(),
  published: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type News = z.infer<typeof NewsSchema>

// Gallery Schema
export const GalleryImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().optional(),
  caption: z.string().optional(),
  blurDataURL: z.string().optional(),
})

export const GalleryAlbumSchema = z.object({
  _id: z.string().optional(),
  eventName: z.string().min(1, 'Event name is required'),
  eventSlug: z.string().min(1, 'Event slug is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  images: z.array(GalleryImageSchema).min(1, 'At least one image is required'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type GalleryAlbum = z.infer<typeof GalleryAlbumSchema>

// legacy Gallery item and fallback
export const GallerySchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Gallery title is required'),
  image: z.string().min(1, 'Image URL is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  eventDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Gallery = z.infer<typeof GallerySchema>

// User Schema (for NextAuth)
export const UserSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(['admin', 'user']).default('user'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// Committee Member Schema
export const CommitteeMemberSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  type: z.enum(['current', 'past']).default('current'),
  tenure: z.string().optional(),
  priority: z.number().min(1).max(100).default(50),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type CommitteeMember = z.infer<typeof CommitteeMemberSchema>
