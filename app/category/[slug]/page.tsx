"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { CategoryCard } from "@/components/category-card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, FolderOpen, Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { CourseInCategory } from "@/types/course";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId: string | null;
  createdAt: string;
  children: CategoryItem[];
  courses: CourseInCategory[];
}

// Skeleton Components
function CourseCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-xl bg-card border animate-pulse">
      <div className="aspect-video bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-full" />
          <div className="h-5 bg-muted rounded w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-xl bg-card border animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [categoryTree, setCategoryTree] = useState<CategoryItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(null);
  const [parentCategory, setParentCategory] = useState<CategoryItem | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categorie/tree", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategoryTree(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryTree.length > 0 && slug) {
      const findCategory = (
        items: CategoryItem[],
        parent: CategoryItem | null = null,
      ): { current: CategoryItem | null; parent: CategoryItem | null } => {
        for (const item of items) {
          if (item.slug === slug) {
            return { current: item, parent };
          }
          if (item.children.length > 0) {
            const result = findCategory(item.children, item);
            if (result.current) {
              return result;
            }
          }
        }
        return { current: null, parent: null };
      };

      const { current, parent } = findCategory(categoryTree);
      setCurrentCategory(current);
      setParentCategory(parent);
    }
  }, [categoryTree, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          {/* Hero Skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-10 bg-muted rounded w-48 animate-pulse" />
            <div className="h-16 bg-muted rounded w-full max-w-2xl animate-pulse" />
            <div className="h-6 bg-muted rounded w-96 animate-pulse" />
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-48 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
              The category you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/home">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentCourses = currentCategory?.courses?.filter((course) => course.isPublished) || [];
  const hasContent = currentCategory.children.length > 0 || currentCourses.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        {/* Background with Image */}
        <div className="absolute inset-0">
          <Image
            src={currentCategory.image || "/placeholder.jpg"}
            alt={currentCategory.name}
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-background" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white/90 hover:text-white hover:bg-white/10 mb-6 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Breadcrumb - Only show if there's a parent category */}
            {parentCategory && (
              <div className="mb-4">
                <Link href={`/category/${parentCategory.slug}`}>
                  <span className="text-sm text-white/70 hover:text-white transition-colors">
                    {parentCategory.name} / <span className="text-white font-medium">{currentCategory.name}</span>
                  </span>
                </Link>
              </div>
            )}

            {/* Title and Stats */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-primary/20 text-primary-foreground backdrop-blur-sm">
                  Category
                </Badge>
                {currentCourses.length > 0 && (
                  <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-sm">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {currentCourses.length} {currentCourses.length === 1 ? 'Course' : 'Courses'}
                  </Badge>
                )}
                {currentCategory.children.length > 0 && (
                  <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-sm">
                    <Grid3x3 className="w-3 h-3 mr-1" />
                    {currentCategory.children.length} Subcategories
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                {currentCategory.name}
              </h1>

              {currentCategory.description && (
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
                  {currentCategory.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        {/* Subcategories */}
        {currentCategory.children.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Explore Subcategories</h2>
              <p className="text-muted-foreground">
                Browse through {currentCategory.children.length} specialized topics
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {currentCategory.children.map((child) => (
                <CategoryCard key={child.id} category={child} />
              ))}
            </div>
          </section>
        )}

        {/* Courses */}
        {currentCourses.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                {currentCategory.children.length > 0
                  ? `Featured Courses in ${currentCategory.name}`
                  : `All ${currentCategory.name} Courses`}
              </h2>
              <p className="text-muted-foreground">
                {currentCourses.length} {currentCourses.length === 1 ? 'course' : 'courses'} available to start learning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    description: "",
                    thumbnail: course.thumbnail,
                    youtubeUrl: "",
                    categoryIds: [],
                    level: course.level,
                    language: course.language,
                    publishedAt: "",
                    isPublished: course.isPublished,
                  }}
                  onEnroll={() => console.log("Enroll:", course.id)}
                  onSave={() => console.log("Save:", course.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!hasContent && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Content Available Yet</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              This category is being prepared. Check back soon for courses and subcategories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/home">
                <Button size="lg" variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Browse All Categories
                </Button>
              </Link>
              {parentCategory && (
                <Link href={`/category/${parentCategory.slug}`}>
                  <Button size="lg" className="gap-2">
                    Back to {parentCategory.name}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* CTA Section - Only show if has content */}
        {hasContent && (
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 mt-8">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="relative px-6 py-12 md:py-16 text-center space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold">
                  Ready to Master {currentCategory.name}?
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of learners and start your journey today
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/category">
                  <Button size="lg" variant="outline">
                    Explore More Categories
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}