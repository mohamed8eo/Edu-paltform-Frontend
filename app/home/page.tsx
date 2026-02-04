"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { CategoryCard } from "@/components/category-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, TrendingUp, BookOpen, Users, Award, Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Course } from "@/types/course";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId: string | null;
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
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const response = await fetch("/api/admin/course/all", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch("/api/categorie/tree", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      const parentCategories: Category[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        image: item.image,
        description: item.description,
        parentId: item.parentId,
      }));
      setCategories(parentCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
      fetchCategories();
    }
  }, [isAuthenticated]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleEnroll = (courseId: string) => {
    console.log("[v0] Enrolling in course:", courseId);
    // Add your enrollment logic here
  };

  const handleSave = (courseId: string) => {
    console.log("[v0] Saving course:", courseId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4">
          <Spinner className="w-12 h-12 mx-auto" />
          <p className="text-muted-foreground animate-pulse">Loading your learning platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Start Learning Today</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                Master New Skills
                <span className="block text-primary mt-2">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Access thousands of expertly curated courses and learn at your own pace. 
                Start your journey to success today.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="What do you want to learn today?"
                className="pl-12 h-14 text-base rounded-full border-2 focus:border-primary shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 max-w-3xl mx-auto">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-2xl font-bold">{courses.length}+</span>
                </div>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold">50K+</span>
                </div>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Award className="w-5 h-5" />
                  <span className="text-2xl font-bold">100+</span>
                </div>
                <p className="text-sm text-muted-foreground">Instructors</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">95%</span>
                </div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 md:space-y-20">
        {/* Categories Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold">Explore Categories</h2>
              <p className="text-muted-foreground">Find courses by your interests</p>
            </div>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(5)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No categories available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Courses Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-bold">Trending Courses</h2>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Popular
                </Badge>
              </div>
              <p className="text-muted-foreground">Most popular courses this month</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/courses")}
              className="gap-2 hidden md:flex"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {coursesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "No courses available yet. Check back soon!"}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.slice(0, 8).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    onSave={handleSave}
                  />
                ))}
              </div>
              
              {filteredCourses.length > 8 && (
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={() => router.push("/courses")}
                    className="gap-2 group"
                  >
                    Explore More Courses
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
          <div className="relative px-6 py-16 md:py-20 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students already learning on our platform. 
                Start your journey today and unlock your potential.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={() => router.push("/courses")}>
                Browse All Courses
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/category")}>
                Explore Categories
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}