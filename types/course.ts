export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  youtubeVideoId: string;
  thumbnail: string;
  duration: string;
  position: number;
  createdAt: string;
}

export interface Course {
  id: string;
  slug?: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeUrl: string;
  category?: string;
  categoryIds: string[];
  instructor?: string;
  duration?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  views?: number;
  enrolledCount?: number;
  rating?: number;
  tags?: string[];
  publishedAt?: string;
  isPublished?: boolean;
  lessons?: Lesson[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  courseCount?: number;
  slug?: string;
  image?: string;
  description?: string;
  parentId?: string | null;
  children?: Category[];
  courses?: CourseInCategory[];
}

export interface CourseInCategory {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  isPublished: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  enrolledCourses: string[];
  completedCourses: string[];
  savedCourses: string[];
  joinedAt: string;
}
