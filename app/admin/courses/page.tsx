"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { CourseForm } from "@/components/admin/course-form";
import { Trash2, Edit2 } from "lucide-react";
import type { Course, Category } from "@/types/course";

export default function CoursesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Web Development",
      courseCount: 2,
    },
    {
      id: "2",
      name: "Frontend",
      courseCount: 1,
      parentId: "1",
    },
    {
      id: "3",
      name: "Backend",
      courseCount: 1,
      parentId: "1",
    },
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Complete Frontend Development Bootcamp",
      description:
        "Master HTML, CSS, JavaScript, React, TypeScript and modern frontend frameworks",
      thumbnail: "/placeholder-course-frontend.jpg",
      youtubeUrl:
        "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
      level: "Beginner",
      language: "EN",
      categoryIds: ["2"],
    },
    {
      id: "2",
      title: "Complete Backend Development Bootcamp",
      description:
        "Learn Node.js, Express, Database Design, REST APIs, Authentication",
      thumbnail: "/placeholder-course-backend.jpg",
      youtubeUrl:
        "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
      level: "Intermediate",
      language: "EN",
      categoryIds: ["3"],
    },
  ]);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCourse = (data: Course) => {
    setCourses((prev) => [...prev, data]);
  };

  const handleUpdateCourse = (data: Course) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === data.id ? data : course)),
    );
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CourseForm
            categories={categories}
            initialData={editingCourse || undefined}
            onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}
          />
        </div>

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

              <div className="space-y-2">
                {filteredCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    {searchTerm
                      ? "No courses found."
                      : "No courses yet. Create one to get started."}
                  </p>
                ) : (
                  filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex gap-4 flex-1">
                        <img
                          src={course.thumbnail || "/placeholder-course-1.jpg"}
                          alt={course.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="px-2 py-1 bg-muted rounded">
                              {course.level}
                            </span>
                            <span className="px-2 py-1 bg-muted rounded">
                              {course.language}
                            </span>
                            {course.categoryIds.map((catId) => (
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCourse(course)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
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
                                onClick={() => handleDeleteCourse(course.id)}
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
