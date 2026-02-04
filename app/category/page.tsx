"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CategoryCard } from "@/components/category-card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Layers, BookOpen, Grid3x3, Sparkles, TrendingUp, Filter } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  parentId: string | null;
  children?: Category[];
}

// Skeleton for category cards
function CategoryCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-xl bg-card border animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categorie/tree", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();

      // Filter only parent categories (parentId === null)
      const parentCategories: Category[] = (data || [])
        .filter((item: any) => item.parentId === null)
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          image: item.image,
          description: item.description,
          parentId: item.parentId,
          children: item.children || [],
        }));

      setCategories(parentCategories);
      setFilteredCategories(parentCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const totalSubcategories = categories.reduce(
    (acc, cat) => acc + (cat.children?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4">
          <Spinner className="w-12 h-12 mx-auto" />
          <p className="text-muted-foreground animate-pulse">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: '1s' }} />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Explore Learning Paths</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mt-2">
                  Perfect Category
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Browse through our expertly curated categories and find courses that match your interests and career goals.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder="Search categories by name or topic..."
                className="pl-12 h-14 text-base rounded-full border-2 focus:border-primary shadow-lg bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Grid3x3 className="w-5 h-5" />
                  <span className="text-2xl font-bold">{categories.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
              
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Layers className="w-5 h-5" />
                  <span className="text-2xl font-bold">{totalSubcategories}</span>
                </div>
                <p className="text-xs text-muted-foreground">Subcategories</p>
              </div>
              
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-xs text-muted-foreground">Courses</p>
              </div>
              
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">95%</span>
                </div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              {searchQuery ? 'Search Results' : 'All Categories'}
            </h2>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `${filteredCategories.length} ${filteredCategories.length === 1 ? 'category' : 'categories'} found for "${searchQuery}"`
                : `Explore ${categories.length} main categories to start your learning journey`
              }
            </p>
          </div>

          {/* Filter Badge (for future use) */}
          {!searchQuery && (
            <Badge variant="secondary" className="w-fit">
              <Filter className="w-3 h-3 mr-1" />
              Showing all
            </Badge>
          )}
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Categories Found</h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
              {searchQuery
                ? `We couldn't find any categories matching "${searchQuery}". Try different keywords or explore all categories.`
                : "No categories available yet. Check back soon!"}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                size="lg"
              >
                Clear Search & View All
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CategoryCard 
                    category={{
                      ...category,
                      courseCount: category.children?.length
                    }} 
                  />
                </div>
              ))}
            </div>

            {/* View More Hint */}
            {filteredCategories.length > 12 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCategories.length} categories
                </p>
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {filteredCategories.length > 0 && !searchQuery && (
          <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative px-6 py-12 md:py-16 text-center space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <Sparkles className="w-4 h-4" />
                  Start Your Journey
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  Ready to Start Learning?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Choose a category that interests you and explore hundreds of courses designed to help you succeed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 text-base" asChild>
                  <a href="/courses">
                    <BookOpen className="w-4 h-4" />
                    Browse All Courses
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-base" asChild>
                  <a href="/home">
                    Back to Home
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Alternative CTA for Search Results */}
        {filteredCategories.length > 0 && searchQuery && (
          <div className="mt-12 text-center p-8 rounded-xl bg-muted/30 border">
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for?
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
            >
              View All Categories
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}