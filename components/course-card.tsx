"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Bookmark } from "lucide-react";
import type { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onSave?: (courseId: string) => void;
}

export function CourseCard({ course, onEnroll, onSave }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-0 ring-1 ring-border/50 hover:ring-primary/50">
      {/* Image Container */}
      <Link href={`/courses/${course.slug}`} className="relative block">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
          <Image
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
            {/* Duration */}
            {course.totalDuration && (
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                <Clock className="w-3 h-3" />
                {course.totalDuration}
              </div>
            )}

            {/* Level Badge */}
            <Badge className="bg-primary/90 backdrop-blur-sm hover:bg-primary">
              {course.level}
            </Badge>
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onSave?.(course.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full  backdrop-blur-sm hover:cursor-pointer transition-all shadow-lg hover:scale-110"
          >
            <Bookmark className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Language */}
        <Badge variant="secondary" className="text-xs">
          {course.language}
        </Badge>

        {/* Title */}
        <Link href={`/courses/${course.slug}`}>
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Enroll Button */}
        <Button
          className="w-full"
          size="sm"
          onClick={() => onEnroll?.(course.id)}
        >
          Start Learning
        </Button>
      </div>
    </Card>
  );
}
