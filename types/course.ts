export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  youtubeUrl: string
  category: string
  instructor: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  views: number
  enrolledCount: number
  rating: number
  tags: string[]
  publishedAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  courseCount: number
  slug: string
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
