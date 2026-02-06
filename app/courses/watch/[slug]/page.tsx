"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  Clock,
  BookOpen,
  Award,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Lesson, Course } from "@/types/course";

interface CourseWatchData extends Course {
  lessons: Lesson[];
}

export default function CourseWatchPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [course, setCourse] = useState<CourseWatchData | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingLesson, setCompletingLesson] = useState(false);

  // Check if screen is desktop
  useEffect(() => {
    const checkScreenSize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch course and lessons data
  useEffect(() => {
    if (!slug) return;

    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch course info
        const courseResponse = await fetch(`/api/courses/${slug}`, {
          method: "GET",
          credentials: "include",
        });

        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course");
        }

        const courseData = await courseResponse.json();
        const courseInfo: CourseWatchData = courseData.course;

        // Fetch lessons
        const lessonsResponse = await fetch(`/api/courses/${slug}/lessons`, {
          method: "GET",
          credentials: "include",
        });

        if (!lessonsResponse.ok) {
          throw new Error("Failed to fetch lessons");
        }

        const lessonsData = await lessonsResponse.json();

        // Fetch completed lessons from progress endpoint
        let completedLessonIds: string[] = [];
        const progressResponse = await fetch(
          `/api/courses/${slug}/lessons/progress`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          completedLessonIds =
            progressData.completedLessons?.map(
              (item: { lessonId: string }) => item.lessonId,
            ) || [];
        }

        // Mark completed lessons
        const lessonsWithProgress = (lessonsData.lessons || []).map(
          (lesson: Lesson) => ({
            ...lesson,
            isCompleted: completedLessonIds.includes(lesson.id),
          }),
        );

        // Calculate completed count
        const completedCount = lessonsWithProgress.filter(
          (l: Lesson) => l.isCompleted,
        ).length;

        const fullCourse: CourseWatchData = {
          ...courseInfo,
          lessons: lessonsWithProgress,
          totalLessons: lessonsWithProgress.length || 0,
          completedLessons: completedCount,
        };

        setCourse(fullCourse);
        setLessons(lessonsWithProgress);

        // Set first uncompleted lesson as current if available
        const firstUncompleted = lessonsWithProgress.find(
          (l: Lesson) => !l.isCompleted,
        );
        if (firstUncompleted) {
          setCurrentLesson(firstUncompleted);
        } else if (lessonsWithProgress.length > 0) {
          setCurrentLesson(lessonsWithProgress[0]);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug]);

  const handleCompleteLesson = async () => {
    if (!currentLesson || completingLesson) return;

    setCompletingLesson(true);

    try {
      // Call the progress API endpoint
      const response = await fetch(
        `/api/courses/${slug}/lessons/${currentLesson.id}/progress`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: true }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark lesson as complete");
      }

      const updatedLessons = lessons.map((lesson) =>
        lesson.id === currentLesson.id
          ? { ...lesson, isCompleted: true }
          : lesson,
      );

      const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
      if (currentIndex < lessons.length - 1) {
        updatedLessons[currentIndex + 1].isLocked = false;
      }

      setLessons(updatedLessons);

      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(updatedLessons[currentIndex + 1]);
      }

      if (course) {
        const completedCount = updatedLessons.filter(
          (l) => l.isCompleted,
        ).length;
        setCourse({
          ...course,
          completedLessons: completedCount,
        });
      }
    } catch (error) {
      console.error("Error completing lesson:", error);
    } finally {
      setCompletingLesson(false);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setCurrentLesson(lesson);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const totalLessonsCount = course?.totalLessons || lessons.length;
  const completedLessonsCount = course?.completedLessons || 0;
  const progressPercentage =
    totalLessonsCount > 0
      ? (completedLessonsCount / totalLessonsCount) * 100
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Spinner className="w-16 h-16 mx-auto" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Failed to load course</h2>
            <p className="text-muted-foreground">
              {error || "Course not found"}
            </p>
            <Link href="/home">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video Player */}
          <div
            className="relative bg-black w-full"
            style={{ aspectRatio: "16/9" }}
          >
            {currentLesson ? (
              <iframe
                src={
                  currentLesson.youtubeVideoId
                    ? `https://www.youtube.com/embed/${currentLesson.youtubeVideoId}`
                    : ""
                }
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>No lesson selected</p>
              </div>
            )}

            {/* Mobile Sidebar Toggle */}
            <Button
              size="icon"
              className="absolute top-4 right-4 lg:hidden z-10 shadow-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Lesson Info and Controls */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-card border-t">
            {/* Current Lesson Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 space-y-2 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">
                    {currentLesson?.title || "Select a lesson"}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{currentLesson?.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Lesson{" "}
                        {currentLesson
                          ? lessons.findIndex(
                              (l) => l.id === currentLesson.id,
                            ) + 1
                          : 0}{" "}
                        of {lessons.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop Sidebar Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden lg:flex gap-2 flex-shrink-0"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      Hide Lessons
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      Show Lessons
                    </>
                  )}
                </Button>
              </div>

              {/* Course Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                  <span className="font-medium">Course Progress</span>
                  <span className="text-muted-foreground">
                    {completedLessonsCount} / {totalLessonsCount} lessons
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(progressPercentage)}% complete
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {currentLesson && !currentLesson.isCompleted && (
                <Button
                  size="lg"
                  onClick={handleCompleteLesson}
                  disabled={completingLesson}
                  className="gap-2 flex-1 sm:flex-none min-w-[200px]"
                >
                  {completingLesson ? (
                    <>
                      <Spinner className="w-4 h-4 animate-spin" />
                      <span>Completing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="hidden sm:inline">
                        Mark as Complete & Continue
                      </span>
                      <span className="sm:hidden">Complete</span>
                    </>
                  )}
                </Button>
              )}

              {currentLesson?.isCompleted && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 flex-1 sm:flex-none justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-600">
                    Completed
                  </span>
                </div>
              )}

              {progressPercentage === 100 && (
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 flex-1 sm:flex-none"
                >
                  <Award className="h-5 w-5" />
                  <span className="hidden sm:inline">Get Certificate</span>
                  <span className="sm:hidden">Certificate</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Lessons List */}
        <aside
          className={cn(
            "bg-card border-l transition-all duration-300 ease-in-out",
            "fixed inset-y-0 right-0 z-50 w-full sm:w-96",
            "lg:relative lg:inset-auto lg:z-auto lg:w-96 xl:w-[420px]",
            sidebarOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 sm:p-6 border-b space-y-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold">Course Content</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden -mr-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-base sm:text-lg line-clamp-2">
                  {course.title}
                </h3>
                {course.instructor && (
                  <p className="text-sm text-muted-foreground">
                    by {course.instructor}
                  </p>
                )}
              </div>

              {/* Progress Summary */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      Your Progress
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(progressPercentage)}% Complete
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {completedLessonsCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {totalLessonsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-4 space-y-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    disabled={lesson.isLocked}
                    className={cn(
                      "w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200",
                      currentLesson?.id === lesson.id
                        ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                        : "bg-card hover:bg-muted/50 border-border",
                      lesson.isLocked && "opacity-50 cursor-not-allowed",
                      !lesson.isLocked &&
                        "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {lesson.isCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : lesson.isLocked ? (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          </div>
                        ) : currentLesson?.id === lesson.id ? (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <PlayCircle className="w-4 h-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                            <Circle className="w-3 h-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-medium text-muted-foreground">
                            Lesson {index + 1}
                          </span>
                          {lesson.isCompleted && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-500/10 text-green-600"
                            >
                              Completed
                            </Badge>
                          )}
                          {lesson.isLocked && (
                            <Badge variant="secondary" className="text-xs">
                              Locked
                            </Badge>
                          )}
                        </div>
                        <h4
                          className={cn(
                            "font-medium text-sm mb-1 line-clamp-2",
                            currentLesson?.id === lesson.id && "text-primary",
                          )}
                        >
                          {lesson.title}
                        </h4>
                        {lesson.duration && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{lesson.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Footer - Certificate */}
            {progressPercentage === 100 && (
              <div className="p-4 sm:p-6 border-t flex-shrink-0">
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Congratulations! 🎉</h3>
                    <p className="text-sm text-muted-foreground">
                      You've completed this course
                    </p>
                  </div>
                  <Button className="w-full gap-2">
                    <Award className="h-4 w-4" />
                    Download Certificate
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
