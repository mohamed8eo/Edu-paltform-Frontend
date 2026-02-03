export interface Course {
  id: string;
  title: string;
  slug?: string;
  description: string;
  thumbnail: string;
  youtubeUrl?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language?: string;
  categoryIds?: string[];
  [key: string]: any;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  courseCount: number;
  slug: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId: string | null;
  createdAt: string;
  updatedAt?: string;
  children: CategoryTreeItem[];
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
