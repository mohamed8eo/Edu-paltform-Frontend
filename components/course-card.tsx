"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Play, Clock } from "lucide-react";
import type { Course } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onSave?: (courseId: string) => void;
}

export function CourseCard({ course, onEnroll, onSave }: CourseCardProps) {
  // Use slug for navigation, fallback to id if slug is not available
  const courseSlug = course.slug || course.id;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200 bg-card border">
      {/* Image Container */}
      <Link href={`/courses/${courseSlug}`} className="relative block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />

          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

          {/* Video Play Icon - Shows on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-0.5" />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onSave?.(course.id);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/95 hover:bg-white transition-all shadow-md hover:shadow-lg z-10"
            aria-label="Save course"
          >
            <Bookmark className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        {/* Title */}
        <Link href={`/courses/${courseSlug}`}>
          <h3 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight min-h-[2.5rem]">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Instructor (if available) */}
        {course.instructor && (
          <p className="text-xs text-muted-foreground">{course.instructor}</p>
        )}

        {/* Meta Info Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {/* Level Badge */}
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {course.level}
            </Badge>

            {/* Duration (if available) */}
            {course.duration && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA or Status */}
        <div className="pt-2 flex items-center justify-between">
          {course.price !== undefined ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">${course.price}</span>
              {course.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${course.originalPrice}
                </span>
              )}
            </div>
          ) : (
            <Badge variant="outline" className="text-xs font-semibold">
              Free
            </Badge>
          )}

          {/* Language Badge */}
          <Badge variant="outline" className="text-xs">
            {course.language}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
