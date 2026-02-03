'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { Course, Category } from '@/types/course'

interface CourseFormProps {
  categories: Category[]
  initialData?: Course
  onSubmit: (data: Course) => void
  isLoading?: boolean
}

export function CourseForm({ categories, initialData, onSubmit, isLoading }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    thumbnail: initialData?.thumbnail || '',
    youtubeUrl: initialData?.youtubeUrl || '',
    level: initialData?.level || 'Beginner' as const,
    language: initialData?.language || 'EN',
    categoryIds: initialData?.categoryIds || [],
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>(formData.categoryIds)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      youtubeUrl: formData.youtubeUrl,
      level: formData.level,
      language: formData.language,
      categoryIds: selectedCategories,
    })
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        thumbnail: '',
        youtubeUrl: '',
        level: 'Beginner',
        language: 'EN',
        categoryIds: [],
      })
      setSelectedCategories([])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Course' : 'Add New Course'}</CardTitle>
        <CardDescription>
          {initialData ? 'Update course details' : 'Create a new course from YouTube'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., NestJS Fundamentals"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the course..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
              type="url"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL</Label>
            <Input
              id="youtubeUrl"
              name="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/playlist?list=..."
              type="url"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={value => setFormData(prev => ({ ...prev, level: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={formData.language} onValueChange={value => setFormData(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="AR">Arabic</SelectItem>
                  <SelectItem value="FR">French</SelectItem>
                  <SelectItem value="ES">Spanish</SelectItem>
                  <SelectItem value="DE">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Categories</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories available. Create one first.</p>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={cat.id}
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => handleCategoryToggle(cat.id)}
                    />
                    <label htmlFor={cat.id} className="text-sm cursor-pointer">
                      {cat.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <Button type="submit" disabled={isLoading || selectedCategories.length === 0} className="w-full">
            {isLoading ? 'Saving...' : initialData ? 'Update Course' : 'Add Course'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
