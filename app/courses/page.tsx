"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

// Extended types for category tree
interface CourseInCategory {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  isPublished: boolean;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId: string;
  courses: CourseInCategory[];
}

interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId: string | null;
  courses: CourseInCategory[];
  children: SubCategory[];
}

export default function AllCoursesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryTree();
  }, []);

  const fetchCategoryTree = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categorie/tree", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategoryTree(data || []);
    } catch (err) {
      console.error("Error fetching category tree:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter only published courses
  const filterPublishedCourses = (courses: CourseInCategory[]) => {
    return courses.filter((course) => course.isPublished);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Error loading courses</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchCategoryTree} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/home"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-muted-foreground mt-2">
            Browse courses organized by category
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {categoryTree.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses available yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categoryTree.map((parentCategory) => (
              <div key={parentCategory.id} className="space-y-6">
                {/* Parent Category Header */}
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{parentCategory.name}</h2>
                </div>

                {/* Subcategories */}
                <div className="space-y-8 pl-4">
                  {parentCategory.children &&
                    parentCategory.children.map((subCategory) => {
                      const publishedCourses = filterPublishedCourses(
                        subCategory.courses,
                      );
                      const displayCourses = publishedCourses.slice(0, 3);
                      const hasMoreCourses = publishedCourses.length > 3;

                      if (publishedCourses.length === 0) return null;

                      return (
                        <div
                          key={subCategory.id}
                          className="space-y-4 border-l-2 border-muted pl-6"
                        >
                          {/* Subcategory Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                              <h3 className="text-xl font-semibold">
                                {subCategory.name}
                              </h3>
                            </div>
                            {hasMoreCourses && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  router.push(`/category/${subCategory.slug}`)
                                }
                                className="gap-1"
                              >
                                Show More
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {/* Courses Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayCourses.map((course) => (
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
                                }}
                                onEnroll={(id) => console.log("Enroll:", id)}
                                onSave={(id) => console.log("Save:", id)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}

                  {/* Parent category courses (if any direct courses) */}
                  {parentCategory.courses &&
                    filterPublishedCourses(parentCategory.courses).length >
                      0 && (
                      <div className="space-y-4 border-l-2 border-muted pl-6">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          <h3 className="text-xl font-semibold">General</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filterPublishedCourses(parentCategory.courses)
                            .slice(0, 3)
                            .map((course) => (
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
                                }}
                                onEnroll={(id) => console.log("Enroll:", id)}
                                onSave={(id) => console.log("Save:", id)}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
