"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CourseForm } from "@/components/admin/course-form";
import { 
  Trash2, 
  Edit2, 
  Plus, 
  Search, 
  BookOpen, 
  GraduationCap,
  Globe,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Course, ApiCategory, CategoryTreeItem } from "@/types/course";

const API_BASE_URL = "/api/admin";

export default function CoursesPage() {
  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingCourseSlug, setDeletingCourseSlug] = useState<string | null>(
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
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCourses = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const flattenCategories = (items: CategoryTreeItem[]): ApiCategory[] => {
    return items.flatMap((item) => [
      {
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.image,
        parentId: item.parentId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
      ...flattenCategories(item.children),
    ]);
  };

  const flatCategories = flattenCategories(categories);

  const getCategoryName = (categoryId: string) => {
    const category = flatCategories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const handleAddCourse = async (data: Course) => {
    try {
      const response = await fetch(`${API_BASE_URL}/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          level: data.level,
          language: data.language,
          categoryIds: data.categoryIds,
          youtubePlaylistURL: data.youtubeUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      await fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  };

  const handleUpdateCourse = async (data: Course) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/course/update/${data.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            level: data.level,
            language: data.language,
            categoryIds: data.categoryIds,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      await fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  const handleDeleteCourse = async (slug: string) => {
    setDeletingCourseSlug(slug);
    try {
      const response = await fetch(`${API_BASE_URL}/course/delete/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    } finally {
      setDeletingCourseSlug(null);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      (course.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (course.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ),
  );

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-primary/20 shadow-lg">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Learning Management
                </span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  Course Management
                </span>
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Create and manage courses from YouTube playlists. Organize your educational content efficiently.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-2">
                  <span className="text-2xl font-bold text-primary">
                    {isLoading ? "..." : courses.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Total Courses</p>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 shadow-xl hover:shadow-2xl bg-gradient-to-r from-primary to-primary/90 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Add New Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      Add New Course
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Create a new course from YouTube playlist
                    </DialogDescription>
                  </DialogHeader>
                  <CourseForm
                    categories={flatCategories}
                    onSubmit={handleAddCourse}
                    onSuccess={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <span>Course Library</span>
                <Badge variant="secondary" className="ml-2">
                  {filteredCourses.length}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base">
                Browse and manage your course collection
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search courses by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-2 border-primary/20 focus-visible:ring-primary/30"
            />
          </div>

          {/* Courses Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
              </div>
              <p className="text-sm text-muted-foreground">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-primary/50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No courses found" : "No courses yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first course from YouTube"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Course
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    <img
                      src={course.thumbnail || "/placeholder-course-1.jpg"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Course Number Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20">
                      <span className="text-xs font-bold text-white">#01</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[3.5rem]">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {course.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20">
                        <GraduationCap className="w-3 h-3" />
                        {course.level}
                      </Badge>
                      <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 border-green-500/20">
                        <Globe className="w-3 h-3" />
                        {course.language}
                      </Badge>
                    </div>

                    {/* Categories */}
                    {course.categoryIds && course.categoryIds.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {course.categoryIds.slice(0, 2).map((catId) => (
                          <Badge
                            key={catId}
                            variant="outline"
                            className="text-xs bg-primary/5 border-primary/20 text-primary"
                          >
                            {getCategoryName(catId)}
                          </Badge>
                        ))}
                        {course.categoryIds.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.categoryIds.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t bg-muted/30 p-3 flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 gap-2 hover:bg-blue-500/10 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                              <Edit2 className="w-5 h-5 text-blue-600" />
                            </div>
                            Edit Course
                          </DialogTitle>
                          <DialogDescription className="text-base">
                            Update course details and information
                          </DialogDescription>
                        </DialogHeader>
                        <CourseForm
                          categories={flatCategories}
                          initialData={course}
                          onSubmit={handleUpdateCourse}
                          onSuccess={() => {}}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 gap-2 text-destructive hover:bg-destructive/10"
                          disabled={deletingCourseSlug === course.slug}
                        >
                          {deletingCourseSlug === course.slug ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-2">
                        <AlertDialogTitle className="flex items-center gap-2 text-xl">
                          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-destructive" />
                          </div>
                          Delete Course
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base pt-2">
                          Are you sure you want to delete{" "}
                          <span className="font-semibold text-foreground">"{course.title}"</span>?
                          <span className="block mt-2 text-destructive">
                            ⚠️ This action cannot be undone.
                          </span>
                        </AlertDialogDescription>
                        <div className="flex gap-3 justify-end mt-4">
                          <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCourse(course.slug)}
                            className="bg-destructive hover:bg-destructive/90 shadow-lg"
                          >
                            Delete Course
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
