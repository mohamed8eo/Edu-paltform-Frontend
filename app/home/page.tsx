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
import { Search, ArrowRight, TrendingUp, BookOpen, Users, Award, Sparkles, X, Filter } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Course } from "@/types/course";
import { cn } from "@/lib/utils";

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
  const [isSearching, setIsSearching] = useState(false);
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

  // Search results - only used when actively searching
  const searchResults = courses.filter((course) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  });

  const handleEnroll = (courseId: string) => {
    console.log("[v0] Enrolling in course:", courseId);
    // Add your enrollment logic here
  };

  const handleSave = (courseId: string) => {
    console.log("[v0] Saving course:", courseId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
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
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Start Learning Today</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                Master New Skills
                <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mt-2">
                  Anytime, Anywhere
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Access thousands of expertly curated courses and learn at your own pace. 
                Start your journey to success today.
              </p>
            </div>

            {/* Modern Search Bar - FIXED */}
            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-background/95 backdrop-blur-md border-2 border-border rounded-2xl shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                  <Search className="absolute left-6 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search for courses, topics, or skills..."
                    className="pl-14 pr-32 h-16 text-base border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!e.target.value.trim()) {
                        setIsSearching(false);
                      }
                    }}
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="h-10 w-10 p-0 rounded-lg hover:bg-muted"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all"
                      disabled={!searchQuery.trim()}
                    >
                      Search
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Quick Search Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {['JavaScript', 'Python', 'Design', 'Marketing'].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(tag);
                      setIsSearching(true);
                    }}
                    className="rounded-full text-xs"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </form>

            {/* Stats */}
            {!isSearching && (
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
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 md:space-y-20">
        {/* Search Results Section - Only shows when actively searching */}
        {isSearching && (
          <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-bold">Search Results</h2>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {searchResults.length} found
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Results for <span className="font-medium text-foreground">"{searchQuery}"</span>
                </p>
              </div>
              <Button
                variant="outline"
                onClick={clearSearch}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Search
              </Button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-2xl border-2 border-dashed">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any courses matching "{searchQuery}". Try different keywords or browse our categories.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={clearSearch}
                  >
                    Clear Search
                  </Button>
                  <Button
                    onClick={() => router.push("/courses")}
                    className="gap-2"
                  >
                    Browse All Courses
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((course, idx) => (
                  <div
                    key={course.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ 
                      animationDelay: `${idx * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <CourseCard
                      course={course}
                      onEnroll={handleEnroll}
                      onSave={handleSave}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Only show categories and trending when NOT searching */}
        {!isSearching && (
          <>
            {/* Categories Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-bold">Explore Categories</h2>
                  <p className="text-muted-foreground">Find courses by your interests</p>
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
                  {categories.slice(0, 5).map((category) => (
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
              ) : courses.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-xl border-2 border-dashed">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">No courses available</h3>
                  <p className="text-muted-foreground">
                    Check back soon for new courses!
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.slice(0, 8).map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onEnroll={handleEnroll}
                        onSave={handleSave}
                      />
                    ))}
                  </div>
                  
                  {courses.length > 8 && (
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}