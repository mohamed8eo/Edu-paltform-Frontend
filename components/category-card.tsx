"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
    courseCount?: number;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group">
      <Card className="relative overflow-hidden h-64 cursor-pointer border-0 ring-1 ring-border/50 hover:ring-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={category.image || "/placeholder.jpg"}
            alt={category.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-5">
          {/* Course Count Badge (if available) */}
          {category.courseCount !== undefined && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-xs font-medium"
            >
              {category.courseCount} {category.courseCount === 1 ? 'Course' : 'Courses'}
            </Badge>
          )}

          {/* Category Info */}
          <div className="space-y-2 transform group-hover:translate-y-0 translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors duration-300 line-clamp-1">
                {category.name}
              </h3>
              <ArrowRight className="w-5 h-5 text-white group-hover:text-primary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            
            {category.description && (
              <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed opacity-90">
                {category.description}
              </p>
            )}
          </div>

          {/* Bottom Border Accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>

        {/* Corner Decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      </Card>
    </Link>
  );
}