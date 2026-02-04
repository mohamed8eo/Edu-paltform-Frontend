"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="group overflow-hidden relative h-48 cursor-pointer hover:shadow-xl transition-all duration-300">
        <Image
          src={category.image || "/placeholder.jpg"}
          alt={category.name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-200 line-clamp-1">
              {category.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
