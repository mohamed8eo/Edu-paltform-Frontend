"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/types/course";
import { Skeleton } from "@/components/ui/skeleton";

interface ProcessSectionProps {
  limit?: number;
}

export function PortfolioSection 
({ limit = 6 }: ProcessSectionProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/random/${limit}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Error fetching random courses:", err);
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomCourses();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            {[...Array(Math.ceil(limit / 2))].map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full h-full mb-4" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Failed to load courses</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No courses available</h3>
          <p className="text-muted-foreground">
            Check back later for new courses
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Featured Courses
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            Explore our <span className="text-primary">Popular Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Discover top-rated courses chosen just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={course.thumbnail || "/placeholder-course.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="lg" className="gap-2">
                    <PlayCircle className="h-5 w-5" /> Start Course
                  </Button>
                </div>
                {course.level && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {course.level}
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-primary font-semibold mb-2">
                  {course.category || "Course"}
                </p>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                {course.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.totalLessons || 0} lessons</span>
                  </div>
                  {course.instructor && (
                    <p className="text-sm text-muted-foreground">
                      by {course.instructor}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
