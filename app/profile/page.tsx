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
  Edit,
  Star,
  Zap,
  Target,
  Trophy,
  Flame,
} from "lucide-react";
import { courses } from "@/lib/mock-data";
import { useUser } from "@/contexts/user-context";
import Image from "next/image";

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
            <p className="text-muted-foreground font-medium">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Failed to load profile</h2>
            <p className="text-muted-foreground text-center max-w-md">{error}</p>
            <Button onClick={handleRefresh} disabled={refreshing} size="lg" className="gap-2">
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
                    Joined {new Date(userJoinedAt).toLocaleDateString("en-US", {
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
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
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
            {/* About Card */}
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {userBio}
                </p>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-2 border-blue-500/20 shadow-xl bg-gradient-to-br from-blue-500/5 to-transparent hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold">{userEnrolledCourses.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/20 shadow-xl bg-gradient-to-br from-green-500/5 to-transparent hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold">{userCompletedCourses.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/20 shadow-xl bg-gradient-to-br from-purple-500/5 to-transparent hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Bookmark className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold">{userSavedCourses.length}</p>
                  <p className="text-sm text-muted-foreground">Saved</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-500/20 shadow-xl bg-gradient-to-br from-orange-500/5 to-transparent hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold">{Math.round(totalLearningHours)}</p>
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
                    <span className="text-muted-foreground font-medium">Completion Rate</span>
                    <span className="font-bold text-lg">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-3" />
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="text-sm font-medium">Courses in Progress</span>
                    <span className="font-bold">{userEnrolledCourses.length - userCompletedCourses.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="text-sm font-medium">Avg. Completion</span>
                    <span className="font-bold">{completionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">First Course</p>
                    <p className="text-xs text-muted-foreground">Completed your first course</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Fast Learner</p>
                    <p className="text-xs text-muted-foreground">Completed 3+ courses</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Flame className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">On Fire!</p>
                    <p className="text-xs text-muted-foreground">7 day learning streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card className="border-2 shadow-xl bg-card/50 backdrop-blur-sm">
              <Tabs defaultValue="enrolled" className="space-y-0">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent pb-0">
                  <TabsList className="grid w-full grid-cols-3 h-auto p-0 bg-transparent">
                    <TabsTrigger 
                      value="enrolled" 
                      className="data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary py-4"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Enrolled ({enrolledCourses.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="completed"
                      className="data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary py-4"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completed ({completedCourses.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="saved"
                      className="data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary py-4"
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Saved ({savedCourses.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="p-6">
                  <TabsContent value="enrolled" className="mt-0 space-y-6">
                    {enrolledCourses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <BookOpen className="h-10 w-10 text-primary/50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No enrolled courses yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                          Start your learning journey by enrolling in a course today
                        </p>
                        <Button size="lg" className="gap-2">
                          <BookOpen className="h-5 w-5" />
                          Browse Courses
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrolledCourses.map((course) => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="mt-0 space-y-6">
                    {completedCourses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                          <CheckCircle2 className="h-10 w-10 text-green-500/50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No completed courses yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                          Keep learning to complete your first course and earn achievements
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {completedCourses.map((course) => (
                          <div key={course.id} className="relative">
                            <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                            <CourseCard course={course} />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="saved" className="mt-0 space-y-6">
                    {savedCourses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                          <Bookmark className="h-10 w-10 text-purple-500/50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No saved courses yet</h3>
                        <p className="text-muted-foreground max-w-sm">
                          Save interesting courses to watch later
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedCourses.map((course) => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}