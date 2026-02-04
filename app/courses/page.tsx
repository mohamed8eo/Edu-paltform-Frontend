"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronRight, ChevronDown, Grid3x3, Layers, BookOpen, TrendingUp, Search, X } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

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
  const [openSubCategories, setOpenSubCategories] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

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
      // Auto-open first subcategory of each parent
      const firstSubs = new Set<string>();
      data.forEach((parent: CategoryTree) => {
        if (parent.children && parent.children.length > 0) {
          firstSubs.add(parent.children[0].id);
        }
      });
      setOpenSubCategories(firstSubs);
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

  // Toggle subcategory open/close
  const toggleSubCategory = (subCategoryId: string) => {
    setOpenSubCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subCategoryId)) {
        newSet.delete(subCategoryId);
      } else {
        newSet.add(subCategoryId);
      }
      return newSet;
    });
  };

  // Check if subcategory is open
  const isSubCategoryOpen = (subCategoryId: string) => {
    return openSubCategories.has(subCategoryId);
  };

  // Get total courses count
  const getTotalCoursesCount = () => {
    let total = 0;
    categoryTree.forEach((parent) => {
      total += filterPublishedCourses(parent.courses).length;
      parent.children?.forEach((sub) => {
        total += filterPublishedCourses(sub.courses).length;
      });
    });
    return total;
  };

  // Filter categories and courses based on search query
  const filteredCategoryTree = useMemo(() => {
    if (!searchQuery.trim()) {
      return categoryTree;
    }

    const query = searchQuery.toLowerCase().trim();

    return categoryTree
      .map((parent) => {
        // Check if parent category name matches
        const parentMatches = parent.name.toLowerCase().includes(query);

        // Filter children subcategories
        const filteredChildren = parent.children
          ?.map((subCategory) => {
            // Check if subcategory name matches
            const subCategoryMatches = subCategory.name.toLowerCase().includes(query);

            // Filter courses in subcategory
            const filteredCourses = filterPublishedCourses(subCategory.courses).filter(
              (course) => course.title.toLowerCase().includes(query)
            );

            // Include subcategory if it matches, or has matching courses, or parent matches
            if (parentMatches || subCategoryMatches || filteredCourses.length > 0) {
              return {
                ...subCategory,
                courses: parentMatches || subCategoryMatches 
                  ? filterPublishedCourses(subCategory.courses) 
                  : filteredCourses,
              };
            }
            return null;
          })
          .filter(Boolean) as SubCategory[];

        // Filter parent's direct courses
        const filteredParentCourses = filterPublishedCourses(parent.courses).filter(
          (course) => course.title.toLowerCase().includes(query)
        );

        // Include parent if it matches, or has matching children, or matching direct courses
        if (
          parentMatches ||
          filteredChildren.length > 0 ||
          filteredParentCourses.length > 0
        ) {
          return {
            ...parent,
            children: filteredChildren,
            courses: parentMatches 
              ? filterPublishedCourses(parent.courses) 
              : filteredParentCourses,
          };
        }

        return null;
      })
      .filter(Boolean) as CategoryTree[];
  }, [categoryTree, searchQuery]);

  // Auto-expand all categories when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const allSubCategoryIds = new Set<string>();
      filteredCategoryTree.forEach((parent) => {
        parent.children?.forEach((sub) => {
          allSubCategoryIds.add(sub.id);
        });
      });
      setOpenSubCategories(allSubCategoryIds);
    }
  }, [searchQuery, filteredCategoryTree]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <BookOpen className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Loading amazing courses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <Grid3x3 className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Error loading courses</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchCategoryTree} size="lg" className="gap-2">
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalCourses = getTotalCoursesCount();
  const hasSearchResults = filteredCategoryTree.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="max-w-7xl mx-auto px-4 py-16 relative">
          <Link
            href="/home"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm border flex items-center justify-center mr-2 transition-transform group-hover:-translate-x-1">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                <Layers className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
                    Course Catalog
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  Discover {totalCourses}+ expertly crafted courses across multiple categories. Start your learning journey today.
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-2 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-muted rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-3 ml-1">
                  {hasSearchResults ? (
                    <>
                      Showing results for <span className="font-medium text-foreground">"{searchQuery}"</span>
                    </>
                  ) : (
                    <>
                      No results found for <span className="font-medium text-foreground">"{searchQuery}"</span>
                    </>
                  )}
                </p>
              )}
            </div>
            
            {/* Stats */}
            {!searchQuery && (
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{totalCourses} Courses</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">All Levels</span>
                </div>
                <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border flex items-center gap-2">
                  <Grid3x3 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{categoryTree.length} Categories</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {!hasSearchResults ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">
              {searchQuery ? "No matches found" : "No courses available yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? "Try adjusting your search terms or browse all categories" 
                : "Check back soon for new content!"}
            </p>
            {searchQuery && (
              <Button onClick={clearSearch} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-20">
            {filteredCategoryTree.map((parentCategory, parentIdx) => {
              const hasContent = 
                parentCategory.children?.some(sub => filterPublishedCourses(sub.courses).length > 0) ||
                filterPublishedCourses(parentCategory.courses).length > 0;

              if (!hasContent) return null;

              return (
                <div 
                  key={parentCategory.id} 
                  className="space-y-10"
                >
                  {/* Parent Category Header */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {parentCategory.name}
                      </h2>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    {parentCategory.description && (
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        {parentCategory.description}
                      </p>
                    )}
                  </div>

                  {/* Subcategories */}
                  <div className="space-y-8">
                    {parentCategory.children &&
                      parentCategory.children.map((subCategory, subIdx) => {
                        const publishedCourses = filterPublishedCourses(
                          subCategory.courses,
                        );
                        const isOpen = isSubCategoryOpen(subCategory.id);
                        const displayCourses = isOpen ? publishedCourses : publishedCourses.slice(0, 3);
                        const hasMoreCourses = publishedCourses.length > 3;

                        if (publishedCourses.length === 0) return null;

                        return (
                          <div 
                            key={subCategory.id}
                            className="group"
                          >
                            {/* Subcategory Header */}
                            <div className="mb-6 flex items-center justify-between">
                              <button
                                onClick={() => toggleSubCategory(subCategory.id)}
                                className="flex items-center gap-4 group/header hover:opacity-80 transition-opacity"
                              >
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                  isOpen 
                                    ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25" 
                                    : "bg-muted text-muted-foreground"
                                )}>
                                  {isOpen ? (
                                    <ChevronDown className="w-6 h-6" />
                                  ) : (
                                    <ChevronRight className="w-6 h-6" />
                                  )}
                                </div>
                                <div className="text-left">
                                  <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                    {subCategory.name}
                                    <Badge variant="secondary" className="font-normal">
                                      {publishedCourses.length}
                                    </Badge>
                                  </h3>
                                  {subCategory.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {subCategory.description}
                                    </p>
                                  )}
                                </div>
                              </button>

                              {hasMoreCourses && !searchQuery && (
                                <Button
                                  variant="outline"
                                  onClick={() => router.push(`/category/${subCategory.slug}`)}
                                  className="gap-2 hover:gap-3 transition-all shadow-sm"
                                >
                                  View All {publishedCourses.length}
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            {/* Modern Courses Grid */}
                            <div 
                              className={cn(
                                "grid transition-all duration-500 ease-in-out",
                                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                              )}
                            >
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-2">
                                  {displayCourses.map((course, courseIdx) => (
                                    <div
                                      key={course.id}
                                      className="animate-in fade-in slide-in-from-bottom-4"
                                      style={{ 
                                        animationDelay: `${courseIdx * 75}ms`,
                                        animationFillMode: 'both'
                                      }}
                                    >
                                      <div className="h-full rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/50">
                                        <CourseCard
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
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Show More Button (when collapsed and has more courses) */}
                                {!isOpen && hasMoreCourses && !searchQuery && (
                                  <div className="mt-6 text-center">
                                    <Button
                                      variant="ghost"
                                      onClick={() => toggleSubCategory(subCategory.id)}
                                      className="gap-2"
                                    >
                                      Show {publishedCourses.length - 3} More Courses
                                      <ChevronDown className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {/* Parent category courses (if any direct courses) */}
                    {parentCategory.courses &&
                      filterPublishedCourses(parentCategory.courses).length > 0 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                General Courses
                                <Badge variant="secondary" className="font-normal">
                                  {filterPublishedCourses(parentCategory.courses).length}
                                </Badge>
                              </h3>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                Foundational courses in {parentCategory.name}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filterPublishedCourses(parentCategory.courses)
                              .slice(0, searchQuery ? undefined : 4)
                              .map((course, courseIdx) => (
                                <div
                                  key={course.id}
                                  className="animate-in fade-in slide-in-from-bottom-4"
                                  style={{ 
                                    animationDelay: `${courseIdx * 75}ms`,
                                    animationFillMode: 'both'
                                  }}
                                >
                                  <div className="h-full rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/50">
                                    <CourseCard
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
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Divider between parent categories */}
                  {parentIdx < filteredCategoryTree.length - 1 && (
                    <div className="relative py-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dashed" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}