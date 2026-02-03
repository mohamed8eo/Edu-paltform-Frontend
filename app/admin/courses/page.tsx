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
import { CourseForm } from "@/components/admin/course-form";
import { Trash2, Edit2, Plus } from "lucide-react";
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

      // Refresh the courses list
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
          method: "PUT",
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

      // Refresh the courses list
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

      // Refresh the courses list
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Course Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses from YouTube collections
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Create a new course from YouTube
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courses ({filteredCourses.length})</CardTitle>
              <CardDescription>Manage your course collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {isLoading ? (
                  <div className="col-span-4 flex justify-center py-12">
                    <Spinner className="w-8 h-8" />
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <p className="col-span-4 text-sm text-muted-foreground py-4">
                    {searchTerm
                      ? "No courses found."
                      : "No courses yet. Create one to get started."}
                  </p>
                ) : (
                  filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col items-start justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex gap-4 w-full">
                        <img
                          src={course.thumbnail || "/placeholder-course-1.jpg"}
                          alt={course.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{course.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                            <span className="px-2 py-1 bg-muted rounded">
                              {course.level}
                            </span>
                            <span className="px-2 py-1 bg-muted rounded">
                              {course.language}
                            </span>
                            {course.categoryIds?.map((catId) => (
                              <span
                                key={catId}
                                className="px-2 py-1 bg-primary/10 text-primary rounded"
                              >
                                {getCategoryName(catId)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-1"
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Course</DialogTitle>
                              <DialogDescription>
                                Update course details
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
                              className="text-destructive hover:bg-destructive/10 flex-1"
                              disabled={deletingCourseSlug === course.slug}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {deletingCourseSlug === course.slug
                                ? "Deleting..."
                                : "Delete"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.title}"?
                            </AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCourse(course.slug)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
