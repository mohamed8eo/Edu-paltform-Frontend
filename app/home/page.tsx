"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { CategoryCard } from "@/components/category-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Sparkles } from "lucide-react";
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

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categorie/tree", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      // Get only parent categories (those with parentId === null)
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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Learn Anything, Anytime
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Access thousands of free YouTube courses, organized and ready for
              you to master new skills
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses, topics, or skills..."
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">
              Browse by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Courses */}
        <section className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">All Courses</h2>
              <TabsList>
                <TabsTrigger value="all">
                  <Sparkles className="h-4 w-4 mr-2" />
                  All
                </TabsTrigger>
                <TabsTrigger value="trending">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-6">
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No courses found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 6).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    onSave={handleSave}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}
