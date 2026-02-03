"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiCategory } from "@/types/course";

interface CategoryFormProps {
  categories: ApiCategory[];
  initialData?: ApiCategory;
  onSubmit: (data: ApiCategory) => void;
  isLoading?: boolean;
}

export function CategoryForm({
  categories,
  initialData,
  onSubmit,
  isLoading,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    parentId: initialData?.parentId || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: ApiCategory = {
      id: initialData?.id || "",
      name: formData.name,
      description: formData.description,
      image: formData.image,
      parentId: formData.parentId || null,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(data);

    if (!initialData) {
      setFormData({ name: "", description: "", image: "", parentId: "" });
    }
  };

  // Filter out current category from parent options to prevent circular references
  const parentOptions = categories.filter((cat) => cat.id !== initialData?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Category" : "Add New Category"}
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Update category details"
            : "Create a new category or sub-category"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Web Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the category..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL *</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              type="url"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Category (Optional)</Label>
            <Select
              value={formData.parentId || "none"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  parentId: value === "none" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category or leave empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Parent (Top Level)</SelectItem>
                {parentOptions.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading
              ? "Saving..."
              : initialData
                ? "Update Category"
                : "Add Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
