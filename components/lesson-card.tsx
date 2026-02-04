'use client'

import Image from 'next/image'
import { Play, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lesson } from '@/types/course'

interface LessonCardProps {
  lesson: Lesson
  isActive?: boolean
  onSelect?: (lesson: Lesson) => void
}

export function LessonCard({ lesson, isActive = false, onSelect }: LessonCardProps) {
  return (
    <div
      className={`flex gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
        isActive
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      }`}
      onClick={() => onSelect?.(lesson)}
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        <Image
          src={lesson.thumbnail || '/placeholder-course-1.jpg'}
          alt={lesson.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {lesson.title}
        </h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Clock className="w-3 h-3" />
          <span>{lesson.duration}</span>
        </div>
        {lesson.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {lesson.description}
          </p>
        )}
      </div>
    </div>
  )
}
