export interface Lesson {
  id: string
  title: string
  duration: string
  thumbnail: string
  videoUrl: string
  description?: string
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  youtubeUrl: string
  category?: string
  categoryIds: string[]
  instructor?: string
  duration?: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  language: string
  views?: number
  enrolledCount?: number
  rating?: number
  tags?: string[]
  publishedAt?: string
  lessons?: Lesson[]
}

export interface Category {
  id: string
  name: string
  icon?: string
  courseCount?: number
  slug?: string
  image?: string
  description?: string
  parentId?: string | null
  children?: Category[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  enrolledCourses: string[]
  completedCourses: string[]
  savedCourses: string[]
  joinedAt: string
}
