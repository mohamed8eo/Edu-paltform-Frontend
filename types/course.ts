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

// API Category Type Definition
// This represents the category structure used in API requests and responses

export interface ApiCategory {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Category Tree Item (for hierarchical display)
// Used when fetching the category tree structure
export interface CategoryTreeItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  children: CategoryTreeItem[];
}

// Optional: Category Create/Update DTO (Data Transfer Object)
// Use this for API requests when creating or updating categories
export interface CategoryCreateDto {
  name: string;
  description: string;
  image?: string | null;
  parentId?: string | null;
}

export interface CategoryUpdateDto {
  name?: string;
  description?: string;
  image?: string | null;
  parentId?: string | null;
}

// Optional: Category Response (if your API returns additional metadata)
export interface CategoryResponse {
  success: boolean;
  data: ApiCategory;
  message?: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: ApiCategory[];
  message?: string;
}//API Category Type Definition
// This represents the category structure used in API requests and responses

export interface ApiCategory {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Category Tree Item (for hierarchical display)
// Used when fetching the category tree structure
export interface CategoryTreeItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  children: CategoryTreeItem[];
}

// Optional: Category Create/Update DTO (Data Transfer Object)
// Use this for API requests when creating or updating categories
export interface CategoryCreateDto {
  name: string;
  description: string;
  image?: string | null;
  parentId?: string | null;
}

export interface CategoryUpdateDto {
  name?: string;
  description?: string;
  image?: string | null;
  parentId?: string | null;
}

// Optional: Category Response (if your API returns additional metadata)
export interface CategoryResponse {
  success: boolean;
  data: ApiCategory;
  message?: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: ApiCategory[];
  message?: string;
}