'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CategoryForm } from '@/components/admin/category-form'
import { Trash2, Edit2 } from 'lucide-react'
import type { Category } from '@/types/course'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Web Development',
      description: 'Learn web development from basics to advanced',
      image: '/placeholder-course-1.jpg',
      parentId: null,
      courseCount: 15,
    },
    {
      id: '2',
      name: 'Frontend',
      description: 'Frontend development with React and Vue',
      image: '/placeholder-course-frontend.jpg',
      parentId: '1',
      courseCount: 8,
    },
    {
      id: '3',
      name: 'Backend',
      description: 'Backend development with Node.js and Express',
      image: '/placeholder-course-backend.jpg',
      parentId: '1',
      courseCount: 7,
    },
    {
      id: '4',
      name: 'Mobile Development',
      description: 'Build mobile apps with React Native',
      image: '/placeholder-course-4.jpg',
      parentId: null,
      courseCount: 10,
    },
  ])

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set(['1', '4']))

  const handleAddCategory = (data: Omit<Category, 'children'>) => {
    setCategories(prev => [...prev, { ...data, children: [] }])
  }

  const handleUpdateCategory = (data: Omit<Category, 'children'>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === data.id ? { ...cat, ...data } : cat)),
    )
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }

  const toggleExpanded = (parentId: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev)
      if (next.has(parentId)) {
        next.delete(parentId)
      } else {
        next.add(parentId)
      }
      return next
    })
  }

  const rootCategories = categories.filter(cat => !cat.parentId)
  const getCategoryChildren = (parentId: string) => categories.filter(cat => cat.parentId === parentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and organize categories. Sub-categories inherit from parent categories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryForm categories={categories} onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Categories ({categories.length})</CardTitle>
              <CardDescription>Manage your course categories and sub-categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rootCategories.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No categories yet. Create one to get started.</p>
                ) : (
                  rootCategories.map(category => {
                    const children = getCategoryChildren(category.id)
                    const isExpanded = expandedParents.has(category.id)

                    return (
                      <div key={category.id} className="space-y-1">
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition">
                          <div className="flex items-center gap-2 flex-1">
                            {children.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(category.id)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {isExpanded ? '▼' : '▶'}
                              </button>
                            )}
                            {children.length === 0 && <div className="w-4" />}
                            <div className="flex-1">
                              <p className="font-medium">{category.name}</p>
                              <p className="text-xs text-muted-foreground">{category.courseCount} courses</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure? This will delete "{category.name}" {children.length > 0 && `and its ${children.length} sub-category(ies)`}.
                                </AlertDialogDescription>
                                <div className="flex gap-3 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {isExpanded && children.length > 0 && (
                          <div className="ml-4 space-y-1 border-l-2 border-muted pl-2">
                            {children.map(child => (
                              <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition bg-muted/20">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{child.name}</p>
                                  <p className="text-xs text-muted-foreground">{child.courseCount} courses</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingCategory(child)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogTitle>Delete Sub-Category</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{child.name}"?
                                      </AlertDialogDescription>
                                      <div className="flex gap-3 justify-end">
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteCategory(child.id)}
                                          className="bg-destructive hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </div>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
