"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  X,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Users,
  Grid3x3,
  List,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedStatus]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/my-courses", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Replace with actual API call
      const mockCategories: Category[] = [
        { id: "1", name: "Web Development", slug: "web-dev", count: 25 },
        { id: "2", name: "Programming", slug: "programming", count: 18 },
        { id: "3", name: "Design", slug: "design", count: 12 },
        { id: "4", name: "Marketing", slug: "marketing", count: 8 },
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((course) =>
        course.categoryIds.includes(selectedCategory),
      );
    }

    // Level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }

    // Status filter
    if (selectedStatus !== "all") {
      if (selectedStatus === "completed") {
        filtered = filtered.filter((course) => (course.progress || 0) === 100);
      } else if (selectedStatus === "in-progress") {
        filtered = filtered.filter(
          (course) =>
            (course.progress || 0) > 0 && (course.progress || 0) < 100,
        );
      } else if (selectedStatus === "not-started") {
        filtered = filtered.filter((course) => (course.progress || 0) === 0);
      }
    }

    setFilteredCourses(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedLevel !== "all" ||
    selectedStatus !== "all";

  const completedCount = courses.filter(
    (c) => (c.progress || 0) === 100,
  ).length;
  const inProgressCount = courses.filter(
    (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100,
  ).length;

  // Calculate total videos and completed videos
  const totalVideos = courses.reduce(
    (acc, c) => acc + (c.totalLessons || 0),
    0,
  );
  const completedVideos = courses.reduce((acc, c) => {
    const completed = Math.round(
      ((c.progress || 0) / 100) * (c.totalLessons || 0),
    );
    return acc + completed;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section - Compact for longer courses */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-6xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">My Learning Journey</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
              My Courses
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-6">
              Continue your learning journey and track your progress across all
              enrolled courses
            </p>

            {/* Stats - Optimized for courses with many videos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-card border backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {courses.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Courses
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-card border backdrop-blur-sm">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {completedCount}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Completed
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-card border backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {inProgressCount}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  In Progress
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-card border backdrop-blur-sm">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {Math.round(
                      courses.reduce((acc, c) => acc + (c.progress || 0), 0) /
                        (courses.length || 1),
                    )}
                    %
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Avg Progress
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-card border backdrop-blur-sm">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {totalVideos}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Videos
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-card border backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {completedVideos}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Watched
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters Section - Compact */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-10 text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 h-10 lg:hidden text-sm"
              >
                <SlidersHorizontal className="h-3 w-3" />
                Filters
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    showFilters && "rotate-180",
                  )}
                />
              </Button>

              <div className="hidden sm:flex items-center border rounded-lg p-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="gap-1.5 h-8 px-3 text-xs"
                >
                  <Grid3x3 className="h-3 w-3" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-1.5 h-8 px-3 text-xs"
                >
                  <List className="h-3 w-3" />
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Options - Compact */}
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-300",
              showFilters
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 lg:grid-rows-[1fr] lg:opacity-100",
            )}
          >
            <div className="overflow-hidden">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-hidden">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-hidden">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-hidden">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full h-10 gap-2 text-sm"
                >
                  <X className="h-3 w-3" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info - Compact */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {loading ? (
              "Loading courses..."
            ) : (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredCourses.length}
                </span>{" "}
                course
                {filteredCourses.length !== 1 ? "s" : ""}
                {hasActiveFilters && " matching your filters"}
              </>
            )}
          </p>
        </div>

        {/* Courses Grid/List - Optimized for many courses */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-16" />
                  <div className="space-y-1.5">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                  <div className="h-2 bg-muted rounded w-full" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {hasActiveFilters
                ? "Try adjusting your filters or search query"
                : "You haven't enrolled in any courses yet"}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
              <Button size="sm" onClick={() => router.push("/courses")}>
                Browse All Courses
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 max-w-4xl mx-auto",
            )}
          >
            {filteredCourses.map((course, idx) => (
              <div
                key={course.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${idx * 30}ms`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className={cn(
                    "h-full rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/50",
                    viewMode === "list" && "flex flex-row",
                  )}
                >
                  <CourseCard
                    course={course}
                    onEnroll={(id) =>
                      router.push(`/courses/watch/${course.slug}`)
                    }
                    onSave={(id) => console.log("Save:", id)}
                    showProgress
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More for courses with 30+ items */}
        {filteredCourses.length >= 20 && (
          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground mb-3">
              Showing {filteredCourses.length} courses
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
