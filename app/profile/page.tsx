"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Award,
  TrendingUp,
  Clock,
  RefreshCw,
  AlertCircle,
  Shield,
  LogIn,
} from "lucide-react";
import { courses } from "@/lib/mock-data";
import { useUser } from "@/contexts/user-context";

export default function ProfilePage() {
  const { user, loading, error, refreshUser } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  };

  // Fallback mock data for courses (keeping existing course functionality)
  const mockUserData = {
    enrolledCourses: ["1", "2", "3"],
    completedCourses: ["3"],
    savedCourses: ["4", "5"],
    joinedAt: "2024-01-01",
    bio: "Passionate learner exploring web development and data science. Always excited to learn new skills!",
  };

  // Use real user data or fallback for courses
  const userEnrolledCourses = mockUserData.enrolledCourses;
  const userCompletedCourses = mockUserData.completedCourses;
  const userSavedCourses = mockUserData.savedCourses;
  const userBio = mockUserData.bio;
  const userJoinedAt = user ? user.createdAt : mockUserData.joinedAt;

  const enrolledCourses = courses.filter((course) =>
    userEnrolledCourses.includes(course.id),
  );

  const completedCourses = courses.filter((course) =>
    userCompletedCourses.includes(course.id),
  );

  const savedCourses = courses.filter((course) =>
    userSavedCourses.includes(course.id),
  );

  const completionRate = Math.round(
    (userCompletedCourses.length / userEnrolledCourses.length) * 100,
  );

  const totalLearningHours = enrolledCourses.reduce((total, course) => {
    const hours = parseFloat(course.duration.split("h")[0]);
    return total + hours;
  }, 0);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Spinner size="lg" className="h-12 w-12" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Failed to load profile</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
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
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={user?.image || undefined} 
                      alt={user?.name || "User"}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="text-2xl">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-muted-foreground text-sm">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                        className="mt-2"
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {user.role}
                      </Badge>
                    )}
                  </div>
                  <Button className="w-full">Edit Profile</Button>
                </div>

                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(userJoinedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LogIn className="h-4 w-4" />
                    <span>Last login: {user?.lastLoginMethod || "N/A"}</span>
                  </div>
                  {user?.emailVerified && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Email verified</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">{userBio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Completion Rate
                    </span>
                    <span className="font-semibold">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <BookOpen className="h-3 w-3" />
                      <span>Enrolled</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {userEnrolledCourses.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Completed</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {userCompletedCourses.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Bookmark className="h-3 w-3" />
                      <span>Saved</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {userSavedCourses.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Clock className="h-3 w-3" />
                      <span>Hours</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Math.round(totalLearningHours)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">First Course</p>
                    <p className="text-xs text-muted-foreground">
                      Completed your first course
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Fast Learner</p>
                    <p className="text-xs text-muted-foreground">
                      Completed 3+ courses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="enrolled" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="enrolled">
                  Enrolled ({enrolledCourses.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedCourses.length})
                </TabsTrigger>
                <TabsTrigger value="saved">
                  Saved ({savedCourses.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="enrolled" className="space-y-6">
                {enrolledCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No enrolled courses yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start learning by enrolling in a course
                      </p>
                      <Button>Browse Courses</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                {completedCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No completed courses yet
                      </h3>
                      <p className="text-muted-foreground">
                        Keep learning to complete your first course
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedCourses.map((course) => (
                      <div key={course.id} className="relative">
                        <Badge className="absolute top-4 right-4 z-10 bg-green-500">
                          Completed
                        </Badge>
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="space-y-6">
                {savedCourses.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No saved courses yet
                      </h3>
                      <p className="text-muted-foreground">
                        Save courses to watch later
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}