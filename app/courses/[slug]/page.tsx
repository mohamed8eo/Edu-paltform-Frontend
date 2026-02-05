"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import {
  Clock,
  BookOpen,
  Share2,
  Heart,
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonCard } from "@/components/lesson-card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import type { Lesson, Course } from "@/types/course";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseWithLessons | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

  const FREE_LESSONS_COUNT = 3; // Number of free lessons for non-subscribers

  // Fetch course, lessons, and user subscription status
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

      // Check subscription status from API
      try {
        const subscriptionResponse = await fetch(
          `/api/courses/${slug}/subscription`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          setIsSubscribed(subscriptionData.isSubscribed || false);

          // Also save to localStorage
          localStorage.setItem(
            `course_subscription_${slug}`,
            subscriptionData.isSubscribed ? "true" : "false",
          );
        } else {
          // Fallback to localStorage if API fails
          const localSubscription = localStorage.getItem(
            `course_subscription_${slug}`,
          );
          setIsSubscribed(localSubscription === "true");
        }
      } catch (err) {
        // Fallback to localStorage on error
        const localSubscription = localStorage.getItem(
          `course_subscription_${slug}`,
        );
        setIsSubscribed(localSubscription === "true");
      }

      // Check saved status from API
      try {
        const savedResponse = await fetch(`/api/courses/${slug}/saved`, {
          method: "GET",
          credentials: "include",
        });

        if (savedResponse.ok) {
          const savedData = await savedResponse.json();
          setIsSaved(savedData.isSaved || false);

          // Also save to localStorage
          localStorage.setItem(
            `course_saved_${slug}`,
            savedData.isSaved ? "true" : "false",
          );
        } else {
          // Fallback to localStorage if API fails
          const localSaved = localStorage.getItem(`course_saved_${slug}`);
          setIsSaved(localSaved === "true");
        }
      } catch (err) {
        // Fallback to localStorage on error
        const localSaved = localStorage.getItem(`course_saved_${slug}`);
        setIsSaved(localSaved === "true");
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

  // Handle subscription
  const handleSubscribe = async () => {
    if (!course?.id) {
      toast({
        title: "Error",
        description: "Course ID not found.",
        variant: "destructive",
      });
      return;
    }

    setSubscribing(true);

    try {
      // Call /api/me/add-course endpoint to add course to user
      const response = await fetch(`/api/me/add-course`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(true);
        localStorage.setItem(`course_subscription_${slug}`, "true");

        toast({
          title: "Successfully Subscribed! 🎉",
          description: "You now have access to all course lessons.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "API subscription failed");
      }
    } catch (err) {
      console.warn("API subscription failed, using local state:", err);

      // Fallback to local state
      setIsSubscribed(true);
      localStorage.setItem(`course_subscription_${slug}`, "true");

      toast({
        title: "Subscribed Locally! 🎉",
        description: "You now have access to all course lessons. (Local mode)",
      });
    } finally {
      setSubscribing(false);
      setShowSubscribeDialog(false);
    }
  };

  // Handle save/unsave course
  const handleSaveCourse = async () => {
    setSaving(true);
    const newSavedState = !isSaved;

    try {
      // Try API first
      const response = await fetch(`/api/courses/${slug}/save`, {
        method: newSavedState ? "POST" : "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsSaved(newSavedState);
        localStorage.setItem(
          `course_saved_${slug}`,
          newSavedState ? "true" : "false",
        );

        toast({
          title: newSavedState ? "Course Saved! ❤️" : "Course Removed",
          description: newSavedState
            ? "Added to your saved courses."
            : "Removed from your saved courses.",
        });
      } else {
        throw new Error("API save failed");
      }
    } catch (err) {
      console.warn("API save failed, using local state:", err);

      // Fallback to local state
      setIsSaved(newSavedState);
      localStorage.setItem(
        `course_saved_${slug}`,
        newSavedState ? "true" : "false",
      );

      toast({
        title: newSavedState ? "Course Saved Locally! ❤️" : "Course Removed",
        description: newSavedState
          ? "Added to your saved courses. (Local mode)"
          : "Removed from your saved courses. (Local mode)",
      });
    } finally {
      setSaving(false);
    }
  };

  // Check if lesson is locked
  const isLessonLocked = (lessonIndex: number) => {
    return !isSubscribed && lessonIndex >= FREE_LESSONS_COUNT;
  };

  // Handle lesson selection
  const handleLessonClick = (lesson: Lesson, index: number) => {
    if (isLessonLocked(index)) {
      setShowSubscribeDialog(true);
    } else {
      setSelectedLesson(lesson);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center space-y-4">
          <Spinner className="w-12 h-12 mx-auto" />
          <p className="text-muted-foreground animate-pulse">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
              {error || "The course you are looking for does not exist."}
            </p>
            <Link href="/home">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Courses
              </Button>
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            href="/home"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {isSubscribed && (
                    <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Subscribed
                    </Badge>
                  )}
                  {course.level && (
                    <Badge variant="secondary" className="text-sm font-medium">
                      {course.level}
                    </Badge>
                  )}
                  {course.language && (
                    <Badge variant="outline" className="text-sm">
                      {course.language}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="text-sm bg-primary/5 border-primary/20"
                  >
                    Free Course
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  {course.title}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {hours}h {minutes}m
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total duration
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {course.lessons?.length || 0} lessons
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Course content
                      </div>
                    </div>
                  </div>

                  {!isSubscribed &&
                    course.lessons &&
                    course.lessons.length > FREE_LESSONS_COUNT && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                          <Lock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {FREE_LESSONS_COUNT} free lessons
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Subscribe for full access
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl border-primary/20">
                <CardContent className="p-6 space-y-3">
                  {!isSubscribed ? (
                    <Button
                      className="w-full h-12 text-base font-semibold group bg-gradient-to-r from-primary to-primary/90"
                      size="lg"
                      onClick={() => setShowSubscribeDialog(true)}
                      disabled={subscribing}
                    >
                      {subscribing ? (
                        <>
                          <Spinner className="w-5 h-5 mr-2" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          Subscribe to Course
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="p-4 rounded-lg bg-green-500/10 border-2 border-green-500/20">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">
                          You're Subscribed!
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enjoy full access to all lessons
                      </p>
                    </div>
                  )}

                  <Button
                    variant={isSaved ? "default" : "outline"}
                    className="w-full h-11"
                    onClick={handleSaveCourse}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        {isSaved ? "Removing..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Heart
                          className={`w-4 h-4 mr-2 transition-all ${
                            isSaved ? "fill-current scale-110" : ""
                          }`}
                        />
                        {isSaved ? "Saved" : "Save Course"}
                      </>
                    )}
                  </Button>

                  <Button variant="ghost" className="w-full h-11">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Course
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video & About */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {selectedLesson && (
              <Card className="overflow-hidden shadow-lg border-0 ring-1 ring-border">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl">
                        {selectedLesson.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <Clock className="w-4 h-4" />
                        {selectedLesson.duration}
                      </CardDescription>
                    </div>
                    <Badge className="bg-primary/90">
                      Lesson{" "}
                      {course.lessons?.findIndex(
                        (l) => l.id === selectedLesson.id,
                      ) + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className="relative w-full bg-black"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedLesson.youtubeVideoId}?autoplay=0`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Thumbnail (if no lesson selected) */}
            {!selectedLesson && (
              <Card className="overflow-hidden shadow-lg">
                <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5">
                  <Image
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      Ready to start learning?
                    </h3>
                    <p className="text-white/90">Select a lesson to begin</p>
                  </div>
                </div>
              </Card>
            )}

            {/* About Course */}
            <Card className="shadow-lg border-0 ring-1 ring-border">
              <CardHeader>
                <CardTitle className="text-2xl">About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      Overview
                    </h4>
                    <p className="text-muted-foreground leading-relaxed pl-4">
                      {course.description}
                    </p>
                  </div>

                  {!isSubscribed &&
                    course.lessons &&
                    course.lessons.length > FREE_LESSONS_COUNT && (
                      <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/20">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-semibold text-lg">
                              Limited Access
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              You have access to the first {FREE_LESSONS_COUNT}{" "}
                              lessons for free. Subscribe to this course to
                              unlock all {course.lessons.length} lessons and
                              complete your learning journey!
                            </p>
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => setShowSubscribeDialog(true)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Subscribe Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Difficulty Level
                      </p>
                      <p className="font-semibold text-lg capitalize">
                        {course.level}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                      <p className="text-sm text-muted-foreground">Language</p>
                      <p className="font-semibold text-lg">{course.language}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Lessons List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg border-0 ring-1 ring-border">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="space-y-2">
                  <CardTitle className="text-xl">Course Content</CardTitle>
                  <CardDescription className="text-base">
                    {course.lessons?.length || 0} lessons • {hours}h {minutes}m
                  </CardDescription>
                  {!isSubscribed &&
                    course.lessons &&
                    course.lessons.length > FREE_LESSONS_COUNT && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <Lock className="w-4 h-4" />
                        <span>
                          {FREE_LESSONS_COUNT} free,{" "}
                          {course.lessons.length - FREE_LESSONS_COUNT} locked
                        </span>
                      </div>
                    )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {course.lessons && course.lessons.length > 0 ? (
                    <div className="divide-y divide-border">
                      {course.lessons.map((lesson, index) => {
                        const locked = isLessonLocked(index);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson, index)}
                            disabled={locked}
                            className={`w-full text-left p-4 transition-all ${
                              locked
                                ? "opacity-60 cursor-not-allowed bg-muted/30"
                                : "hover:bg-muted/50"
                            } ${
                              selectedLesson?.id === lesson.id && !locked
                                ? "bg-primary/5 border-l-4 border-l-primary"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${
                                  locked
                                    ? "bg-muted/50 text-muted-foreground"
                                    : selectedLesson?.id === lesson.id
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                }`}
                              >
                                {locked ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4
                                  className={`font-medium text-sm line-clamp-2 ${
                                    selectedLesson?.id === lesson.id && !locked
                                      ? "text-primary"
                                      : locked
                                        ? "text-muted-foreground"
                                        : ""
                                  }`}
                                >
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration}</span>
                                  {locked && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {selectedLesson?.id === lesson.id && !locked && (
                                <Play className="w-5 h-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No lessons available yet
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Subscribe Dialog */}
      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              Subscribe to This Course
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Get unlimited access to all {course.lessons?.length || 0} lessons
              in this course
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span>
                  Access to all {course.lessons?.length || 0} video lessons
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span>Learn at your own pace</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span>Lifetime access to course content</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-semibold text-primary">
                  100% Free - No Payment Required
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                This is a completely free course platform. Subscribe to unlock
                all content and continue your learning journey!
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSubscribeDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubscribe}
              disabled={subscribing}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90"
            >
              {subscribing ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Subscribing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
