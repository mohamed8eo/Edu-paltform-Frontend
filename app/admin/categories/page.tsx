"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/category-form";
import {
  Trash2,
  Edit2,
  Loader2,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Plus,
  Search,
  LayoutGrid,
} from "lucide-react";
import type { CategoryTreeItem, ApiCategory } from "@/types/course";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = "/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
  const [flatCategories, setFlatCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set(),
  );
  const [deletingCategorySlug, setDeletingCategorySlug] = useState<
    string | null
  >(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categorie/tree", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);

      // Flatten the tree for the parent select dropdown
      const flattenCategories = (items: CategoryTreeItem[]): ApiCategory[] => {
        return items.flatMap((item) => [
          {
            id: item.id,
            slug: item.slug || "",
            name: item.name,
            description: item.description,
            image: item.image,
            parentId: item.parentId,
            createdAt: item.createdAt,
            updatedAt: item.createdAt,
          },
          ...flattenCategories(item.children),
        ]);
      };
      setFlatCategories(flattenCategories(data));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (data: ApiCategory) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/categorie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          image: data.image,
          parentId: data.parentId || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      await fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data: ApiCategory) => {
    setSubmitting(true);

    console.log("=== Update Category Debug ===");
    console.log("Category data:", data);
    console.log("Slug:", data.slug);

    try {
      // Validate slug before making request
      if (!data.slug || data.slug.trim() === "") {
        throw new Error("Category slug is missing or empty");
      }

      const endpoint = `${API_BASE_URL}/categorie/update/${encodeURIComponent(data.slug)}`;
      console.log("Full endpoint URL:", endpoint);

      const payload = {
        name: data.name,
        description: data.description ?? null,
        image: data.image ?? null,
        parentId: data.parentId ?? null,
      };
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to update category: ${response.status} - ${errorText}`,
        );
      }

      const result = await response.json();
      console.log("Success result:", result);

      await fetchCategories();
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("=== Update Error ===");
      console.error("Error updating category:", error);

      // Show error to user
      alert(
        error instanceof Error ? error.message : "Failed to update category",
      );
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    setDeletingCategorySlug(slug);
    try {
      const response = await fetch(`${API_BASE_URL}/categorie/delete/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    } finally {
      setDeletingCategorySlug(null);
    }
  };

  const toggleExpanded = (parentId: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  };

  const handleEditClick = (category: ApiCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  // Count total categories from tree
  const countAllCategories = (items: CategoryTreeItem[]): number => {
    return items.reduce((count, item) => {
      return count + 1 + countAllCategories(item.children);
    }, 0);
  };

  const totalCategories = countAllCategories(categories);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-primary/20 shadow-lg">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Content Organization
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  Category Management
                </span>
              </h1>

              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                Create and organize categories. Sub-categories inherit from
                parent categories and create a hierarchical structure.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-2">
                  <span className="text-2xl font-bold text-primary">
                    {loading ? "..." : totalCategories}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Total Categories
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Form - Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CategoryForm
              categories={flatCategories}
              onSubmit={handleAddCategory}
              isLoading={submitting}
            />
          </div>
        </div>

        {/* Categories List - Main Content */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Folder className="w-6 h-6 text-primary" />
                    <span>Categories</span>
                    <Badge variant="secondary" className="ml-2">
                      {loading ? "..." : totalCategories}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Manage your course categories and sub-categories hierarchy
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setExpandedParents(
                      new Set(flatCategories.map((c) => c.id)),
                    );
                  }}
                >
                  <FolderOpen className="w-4 h-4" />
                  Expand All
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Loading categories...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Folder className="w-10 h-10 text-primary/50" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        No categories yet
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Get started by creating your first category using the
                        form on the left.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <CategoryItem
                          key={category.id}
                          category={category}
                          level={0}
                          expandedParents={expandedParents}
                          onToggleExpanded={toggleExpanded}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteCategory}
                          deletingCategorySlug={deletingCategorySlug}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      Edit Category Dialog
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-blue-600" />
              </div>
              Edit Category
            </DialogTitle>
            <DialogDescription className="text-base">
              Update category details and information
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              categories={flatCategories}
              initialData={editingCategory}
              onSubmit={handleUpdateCategory}
              isLoading={submitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CategoryItemProps {
  category: CategoryTreeItem;
  level: number;
  expandedParents: Set<string>;
  onToggleExpanded: (id: string) => void;
  onEdit: (category: ApiCategory) => void;
  onDelete: (slug: string) => void;
  deletingCategorySlug: string | null;
}

function CategoryItem({
  category,
  level,
  expandedParents,
  onToggleExpanded,
  onEdit,
  onDelete,
  deletingCategorySlug,
}: CategoryItemProps) {
  const isExpanded = expandedParents.has(category.id);
  const hasChildren = category.children.length > 0;

  // Color gradient based on level
  const levelColors = [
    "border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/5",
    "border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5",
    "border-green-500/30 hover:border-green-500/50 hover:bg-green-500/5",
    "border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/5",
  ];

  const levelColor = levelColors[level % levelColors.length];

  return (
    <div className="space-y-2">
      <div
        className={`group relative flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${levelColor} bg-card/50 backdrop-blur-sm`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Connector line for nested items */}
        {level > 0 && (
          <div className="absolute -left-3 top-1/2 w-3 h-px bg-border" />
        )}

        <div className="flex items-center gap-3 flex-1">
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => onToggleExpanded(category.id)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 hover:scale-110"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            </div>
          )}

          {/* Category Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:scale-105 transition-transform duration-200">
            {hasChildren ? (
              <FolderOpen className="w-6 h-6 text-primary" />
            ) : (
              <Folder className="w-6 h-6 text-primary" />
            )}
          </div>

          {/* Category Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-base truncate">
                {category.name}
              </p>
              {hasChildren && (
                <Badge variant="secondary" className="text-xs">
                  {category.children.length}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {category.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onEdit({
                id: category.id,
                slug: category.slug || "",
                name: category.name,
                description: category.description,
                image: category.image,
                parentId: category.parentId,
                createdAt: category.createdAt,
                updatedAt: category.createdAt,
              })
            }
            className="h-9 w-9 p-0 hover:bg-blue-500/10 hover:text-blue-500"
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                disabled={
                  deletingCategorySlug === (category.slug || category.id)
                }
              >
                {deletingCategorySlug === (category.slug || category.id) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-2">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-xl">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </div>
                  Delete Category
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base pt-2">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    "{category.name}"
                  </span>
                  ?
                  {hasChildren && (
                    <span className="block mt-2 text-destructive">
                      ⚠️ This will also delete {category.children.length}{" "}
                      sub-category(ies).
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-3 justify-end mt-4">
                <AlertDialogCancel className="border-2">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(category.slug || category.id)}
                  className="bg-destructive hover:bg-destructive/90 shadow-lg"
                >
                  Delete Category
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Render children with animation */}
      {isExpanded && hasChildren && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              expandedParents={expandedParents}
              onToggleExpanded={onToggleExpanded}
              onEdit={onEdit}
              onDelete={onDelete}
              deletingCategorySlug={deletingCategorySlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
