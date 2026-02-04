"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit3, X, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
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

  const isEditing = !!initialData;

  return (
    <Card className="border-2 shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Header with gradient */}
      <CardHeader className="relative border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        
        <div className="relative space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              {isEditing ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <span>Edit Category</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span>New Category</span>
                </>
              )}
            </CardTitle>
            
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <CardDescription className="text-base">
            {isEditing
              ? "Update category information"
              : "Fill in the details to create a new category"}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
              Category Name
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                name="name"
                placeholder="e.g., Web Development"
                value={formData.name}
                onChange={handleChange}
                className="h-11 border-primary/20"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              Description
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a detailed description of this category..."
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px] resize-none border-primary/20"
                disabled={isLoading}
                rows={3}
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Image URL
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
              className="h-11 border-primary/20"
              disabled={isLoading}
              required
            />
            {formData.image && (
              <div className="mt-3 p-3 rounded-lg border-2 border-primary/20 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Preview:</p>
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.image}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='14'%3EInvalid URL%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Parent Category */}
          <div className="space-y-2">
            <Label htmlFor="parentId" className="text-sm font-semibold flex items-center gap-2">
              Parent Category
              <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Select
              value={formData.parentId || "none"}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  parentId: value === "none" ? "" : value,
                }))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 border-primary/20">
                <SelectValue placeholder="Select parent category or leave empty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="font-medium">No Parent (Top Level)</span>
                </SelectItem>
                {parentOptions.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Select a parent to create a sub-category
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className={`h-11 shadow-lg hover:shadow-xl transition-all duration-300 w-full ${isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-gradient-to-r from-primary to-primary/90"}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Update Category
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}