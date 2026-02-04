"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { Clock, BookOpen, Share2, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonCard } from "@/components/lesson-card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import type { Lesson, Course } from "@/types/course";

interface CourseWithLessons extends Course {
  lessons: Lesson[];
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseAndLessons = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch course info
      const courseResponse = await fetch(`/api/courses/${slug}`, {
        method: "GET",
        credentials: "include",
      });

      if (!courseResponse.ok) {
        throw new Error(`Failed to fetch course: ${courseResponse.status}`);
      }

      const courseData = await courseResponse.json();
      const course: CourseWithLessons = courseData.course;

      if (!course) {
        throw new Error("Course not found");
      }

      // Fetch lessons
      const lessonsResponse = await fetch(`/api/courses/${slug}/lessons`, {
        method: "GET",
        credentials: "include",
      });

      if (!lessonsResponse.ok) {
        throw new Error(`Failed to fetch lessons: ${lessonsResponse.status}`);
      }

      const lessonsData = await lessonsResponse.json();

      setCourse({
        ...course,
        lessons: lessonsData.lessons || [],
      });

      if (lessonsData.lessons && lessonsData.lessons.length > 0) {
        setSelectedLesson(lessonsData.lessons[0]);
      }
    } catch (err) {
      console.error("Error fetching course and lessons:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseAndLessons();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <p className="text-muted-foreground mt-2">
              {error || "The course you are looking for does not exist."}
            </p>
            <Link href="/home">
              <Button className="mt-4">Go back home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalDuration =
    course.lessons?.reduce((acc, lesson) => {
      const parts = lesson.duration.split(":").reverse();
      const hours = parseInt(parts[2] || "0");
      const minutes = parseInt(parts[1] || "0");
      return acc + hours * 60 + minutes;
    }, 0) ?? 0;

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

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
            Back to Courses
          </Link>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {hours}h {minutes}m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{course.lessons?.length || 0} lessons</span>
            </div>
            {course.level && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-muted rounded text-sm">
                  {course.level}
                </span>
              </div>
            )}
            {course.language && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-muted rounded text-sm">
                  {course.language}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6 overflow-hidden">
              <div className="relative w-full h-96">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
            {selectedLesson && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {selectedLesson.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4" />
                    Duration: {selectedLesson.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative w-full bg-black rounded-lg overflow-hidden"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedLesson.youtubeVideoId}?autoplay=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Level</h4>
                    <p className="text-muted-foreground capitalize">
                      {course.level}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Language</h4>
                    <p className="text-muted-foreground">{course.language}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.lessons?.length || 0} lessons - {hours}h {minutes}m
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isActive={selectedLesson?.id === lesson.id}
                        onSelect={setSelectedLesson}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No lessons available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 space-y-2">
              <Button className="w-full" size="lg">
                Enroll Now
              </Button>
              <Button
                variant={isSaved ? "default" : "outline"}
                className="w-full"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`}
                />
                Save Course
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
