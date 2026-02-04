'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Users, Clock, BookOpen, Share2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonCard } from '@/components/lesson-card'
import { courses } from '@/lib/mock-data'
import type { Lesson } from '@/types/course'

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    course?.lessons?.[0] || null
  )
  const [isSaved, setIsSaved] = useState(false)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const totalDuration = course.lessons
    ?.reduce((acc, lesson) => {
      const parts = lesson.duration.split(':').reverse()
      const hours = parseInt(parts[2] || '0')
      const minutes = parseInt(parts[1] || '0')
      return acc + hours * 60 + minutes
    }, 0) ?? 0

  const hours = Math.floor(totalDuration / 60)
  const minutes = totalDuration % 60

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{course.rating}</span>
              <span className="text-muted-foreground">({course.enrolledCount?.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{course.enrolledCount?.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>
                {hours}h {minutes}m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{course.lessons?.length || 0} lessons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Image & Video Player */}
          <div className="lg:col-span-2">
            {/* Course Image */}
            <Card className="mb-6 overflow-hidden">
              <div className="relative w-full h-96">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>

            {/* Video Player if lesson selected */}
            {selectedLesson && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">{selectedLesson.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4" />
                    Duration: {selectedLesson.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${extractVideoId(
                        selectedLesson.videoUrl
                      )}?autoplay=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                  {selectedLesson.description && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{selectedLesson.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* About Course */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Instructor</h4>
                    <p className="text-muted-foreground">{course.instructor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Level</h4>
                    <p className="text-muted-foreground capitalize">{course.level}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Language</h4>
                    <p className="text-muted-foreground">{course.language}</p>
                  </div>
                  {course.tags && course.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Topics Covered</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Lessons List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.lessons?.length || 0} lessons • {hours}h {minutes}m
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isActive={selectedLesson?.id === lesson.id}
                        onSelect={setSelectedLesson}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No lessons available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              <Button className="w-full" size="lg">
                Enroll Now
              </Button>
              <Button
                variant={isSaved ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                Save Course
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function extractVideoId(url: string): string {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\s]{11})/
  const match = url.match(youtubeRegex)
  return match ? match[1] : ''
}
