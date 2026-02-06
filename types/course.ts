export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  youtubeVideoId: string;
  thumbnail: string;
  duration: string;
  position: number;
  createdAt: string;
  // Progress tracking fields
  isCompleted?: boolean;
  isLocked?: boolean;
  order?: number;
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
  price?: number;
  originalPrice?: number;
  totalLessons?: number;
  completedLessons?: number;
  // Progress and enrollment fields
  progress?: number;
  enrolled?: boolean;
  // Subscription-specific fields
  subscriptionStatus?: string;
  subscriptionProgress?: number;
  subscriptionAddedAt?: string;
  subscriptionCompletedAt?: string | null;
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
export interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Category Tree Item (for hierarchical display)
export interface CategoryTreeItem {
  id: string;
  slug?: string;
  name: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: string;
  children: CategoryTreeItem[];
}

// Category Create/Update DTO
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

// Category Response types
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
