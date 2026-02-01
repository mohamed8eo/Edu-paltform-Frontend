'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Clock, Users, BookmarkPlus, Play } from 'lucide-react'
import type { Course } from '@/types/course'
import Image from 'next/image'

interface CourseCardProps {
  course: Course
  onEnroll?: (courseId: string) => void
  onSave?: (courseId: string) => void
}

export function CourseCard({ course, onEnroll, onSave }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm">
            {course.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-primary">{course.category}</span>
          <span>•</span>
          <span>{course.instructor}</span>
        </div>
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{course.enrolledCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button 
          className="flex-1" 
          onClick={() => onEnroll?.(course.id)}
        >
          <Play className="h-4 w-4 mr-2" />
          Start Learning
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onSave?.(course.id)}
        >
          <BookmarkPlus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
