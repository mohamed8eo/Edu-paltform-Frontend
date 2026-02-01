'use client';

import { Card, CardContent } from '@/components/ui/card'
import type { Category } from '@/types/course'
import { Code, Smartphone, BarChart, Palette, TrendingUp, Briefcase, type LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  category: Category
  onClick?: () => void
}

const iconMap: Record<string, LucideIcon> = {
  Code,
  Smartphone,
  BarChart,
  Palette,
  TrendingUp,
  Briefcase,
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Code

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category.courseCount} courses
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
