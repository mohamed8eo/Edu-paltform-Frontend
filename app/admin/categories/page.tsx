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
import { CategoryForm } from "@/components/admin/category-form";
import {
  Trash2,
  Edit2,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { CategoryTreeItem, ApiCategory } from "@/types/course";

const API_BASE_URL = "/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
  const [flatCategories, setFlatCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(
    null,
  );
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set(),
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categorie/tree`, {
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
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/categorie`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      // Refresh the tree after adding
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data: ApiCategory) => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/categorie/${data.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          image: data.image,
          parentId: data.parentId || null,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      // Refresh the tree after updating
      fetchCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categorie/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      // Refresh the tree after deleting
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
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

  // Count total categories from tree
  const countAllCategories = (items: CategoryTreeItem[]): number => {
    return items.reduce((count, item) => {
      return count + 1 + countAllCategories(item.children);
    }, 0);
  };

  const totalCategories = countAllCategories(categories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Category Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and organize categories. Sub-categories inherit from parent
            categories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CategoryForm
            categories={flatCategories}
            initialData={editingCategory || undefined}
            onSubmit={
              editingCategory ? handleUpdateCategory : handleAddCategory
            }
            isLoading={submitting}
          />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Categories ({loading ? "..." : totalCategories})
              </CardTitle>
              <CardDescription>
                Manage your course categories and sub-categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No categories yet. Create one to get started.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <CategoryItem
                          key={category.id}
                          category={category}
                          level={0}
                          expandedParents={expandedParents}
                          onToggleExpanded={toggleExpanded}
                          onEdit={setEditingCategory}
                          onDelete={handleDeleteCategory}
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
    </div>
  );
}

interface CategoryItemProps {
  category: CategoryTreeItem;
  level: number;
  expandedParents: Set<string>;
  onToggleExpanded: (id: string) => void;
  onEdit: (category: ApiCategory) => void;
  onDelete: (id: string) => void;
}

function CategoryItem({
  category,
  level,
  expandedParents,
  onToggleExpanded,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  const isExpanded = expandedParents.has(category.id);
  const hasChildren = category.children.length > 0;

  return (
    <div className="space-y-1">
      <div
        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-2 flex-1">
          {hasChildren ? (
            <button
              onClick={() => onToggleExpanded(category.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          <div className="flex-1">
            <p className="font-medium">{category.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {category.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onEdit({
                id: category.id,
                name: category.name,
                description: category.description,
                image: category.image,
                parentId: category.parentId,
                createdAt: category.createdAt,
                updatedAt: category.createdAt,
              })
            }
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Delete Category</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This will delete "{category.name}"{" "}
                {hasChildren &&
                  `and its ${category.children.length} sub-category(ies)`}
                .
              </AlertDialogDescription>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(category.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isExpanded &&
        hasChildren &&
        category.children.map((child) => (
          <CategoryItem
            key={child.id}
            category={child}
            level={level + 1}
            expandedParents={expandedParents}
            onToggleExpanded={onToggleExpanded}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}
