"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { CategoryCard } from "@/components/category-card";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [categoryTree, setCategoryTree] = useState<CategoryItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(
    null,
  );
  const [parentCategory, setParentCategory] = useState<CategoryItem | null>(
    null,
  );

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
      // Find the current category and its parent
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

  // Get courses from current category and all subcategories
  const getAllCourses = (category: CategoryItem): Course[] => {
    const courses: Course[] = [...category.courses];
    for (const child of category.children) {
      courses.push(...getAllCourses(child));
    }
    return courses;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <Link href="/home">
              <Button>Go back home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get courses only from current category (not children)
  // Filter to show only published courses
  const currentCourses =
    currentCategory?.courses?.filter((course) => course.isPublished) || [];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with Category Image */}
      <section
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{
          backgroundImage: `url(${currentCategory.image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            {parentCategory && (
              <Link href={`/category/${parentCategory.slug}`}>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {parentCategory.name}
                </Button>
              </Link>
            )}
            <h1 className="text-4xl md:text-5xl font-bold">
              {currentCategory.name}
            </h1>
            {currentCategory.description && (
              <p className="text-lg mt-2 text-gray-200">
                {currentCategory.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Subcategories */}
        {currentCategory.children.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Subcategories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentCategory.children.map((child) => (
                <CategoryCard key={child.id} category={child} />
              ))}
            </div>
          </section>
        )}

        {/* Courses - Only show if current category has courses in its own array */}
        {currentCourses.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {currentCategory.children.length > 0
                ? `Courses in ${currentCategory.name}`
                : `${currentCategory.name} Courses`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Show message if no subcategories and no courses */}
        {currentCategory.children.length === 0 &&
          currentCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No courses or subcategories found in this category.
              </p>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
}
