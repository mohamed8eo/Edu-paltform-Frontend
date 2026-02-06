"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Shield,
  Edit,
  Target,
  Loader2,
} from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import type { Course } from "@/types/course";

export default function ProfilePage() {
  const {
    user,
    loading: userLoading,
    error: userError,
    refreshUser,
  } = useUser();
  const { toast } = useToast();

  const [refreshing, setRefreshing] = useState(false);
  const [subscribedCourses, setSubscribedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Get subscribed courses from localStorage
  const getLocalSubscribedCourses = (): Course[] => {
    const courses: Course[] = [];

    // Iterate through localStorage to find subscribed courses
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        key.startsWith("course_subscription_") &&
        localStorage.getItem(key) === "true"
      ) {
        const slug = key.replace("course_subscription_", "");

        // Try to get course data from localStorage cache
        const courseData = localStorage.getItem(`course_data_${slug}`);
        if (courseData) {
          try {
            courses.push(JSON.parse(courseData));
          } catch (e) {
            console.error("Error parsing course data:", e);
          }
        }
      }
    }

    return courses;
  };

  // Fetch user's subscribed courses
  const fetchUserCourses = async () => {
    setLoading(true);

    try {
      // Fetch subscribed courses from API
      const subscribedResponse = await fetch("/api/user/subscribed-courses", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (subscribedResponse.ok) {
        const subscribedData = await subscribedResponse.json();
        console.log("Subscribed courses response:", subscribedData);

        setSubscribedCourses(
          Array.isArray(subscribedData.courses) ? subscribedData.courses : [],
        );
      } else {
        console.error(
          "Failed to fetch subscribed courses:",
          subscribedResponse.status,
          await subscribedResponse.text(),
        );

        // Fallback to localStorage
        const localSubscribed = getLocalSubscribedCourses();
        setSubscribedCourses(localSubscribed);

        if (localSubscribed.length > 0) {
          toast({
            title: "Using Local Data",
            description: "Showing subscribed courses from local storage.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user courses:", error);

      // Fallback to localStorage on error
      const localSubscribed = getLocalSubscribedCourses();
      setSubscribedCourses(localSubscribed);

      toast({
        title: "Connection Error",
        description: "Showing courses from local storage.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await fetchUserCourses();
    setRefreshing(false);

    toast({
      title: "Profile Refreshed",
      description: "Your profile data has been updated.",
    });
  };

  const userJoinedAt = user ? user.createdAt : new Date().toISOString();

  // Calculate stats - ensure subscribedCourses is always an array
  const coursesArray = Array.isArray(subscribedCourses)
    ? subscribedCourses
    : [];
  const totalCourses = coursesArray.length;
  const completedCourses = 0; // You can track this separately if needed
  const completionRate =
    totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  const totalLearningHours = coursesArray.reduce((total, course) => {
    // Assuming course has a duration field, adjust as needed
    return total + 10; // Placeholder: 10 hours per course
  }, 0);

  // Show loading state
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
            <p className="text-muted-foreground font-medium">
              Loading your profile...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Failed to load profile</h2>
            <p className="text-muted-foreground text-center max-w-md">
              {userError}
            </p>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              size="lg"
              className="gap-2"
            >
              {refreshing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section with Cover */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-background shadow-2xl">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-primary">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 border-4 border-background flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="pb-2 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{user?.name}</h1>
                  {user?.role && (
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {new Date(userJoinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {user?.emailVerified && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2 backdrop-blur-sm bg-background/50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button size="sm" className="gap-2 shadow-lg">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2 border-blue-500/20 shadow-xl bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{totalCourses}</p>
                  <p className="text-sm text-muted-foreground">Subscribed</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/20 shadow-xl bg-gradient-to-br from-green-500/5 to-transparent hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">{completedCourses}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500/20 shadow-xl bg-gradient-to-br from-orange-500/5 to-transparent hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold">
                    {Math.round(totalLearningHours)}
                  </p>
                  <p className="text-sm text-muted-foreground">Hours</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Card */}
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Completion Rate
                    </span>
                    <span className="font-bold text-lg">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="text-sm font-medium">
                      Courses in Progress
                    </span>
                    <span className="font-bold">
                      {totalCourses - completedCourses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="text-sm font-medium">Avg. Completion</span>
                    <span className="font-bold">{completionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent pb-0">
                <CardTitle className="flex items-center gap-2 py-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  My Courses ({coursesArray.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {coursesArray.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-10 w-10 text-primary/50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      No subscribed courses yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Start your learning journey by subscribing to a course
                      today
                    </p>
                    <Button size="lg" className="gap-2" asChild>
                      <a href="/home">
                        <BookOpen className="h-5 w-5" />
                        Browse Courses
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coursesArray.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
