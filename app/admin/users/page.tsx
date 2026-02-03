"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiUser, UsersResponse } from "@/types/admin";

const API_BASE_URL = "/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [action, setAction] = useState<"ban" | "unban" | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banExpiresIn, setBanExpiresIn] = useState("30d");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "banned">(
    "all",
  );
  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin/all-users?page=${currentPage}&limit=${limit}&search=${searchQuery}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1);
      }
    }, 300);
    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  const filteredUsers = users.filter((user) => {
    if (statusFilter === "active") return !user.banned;
    if (statusFilter === "banned") return user.banned;
    return true;
  });
  const totalPages = Math.ceil(totalUsers / limit);

  const handleBanUser = (user: ApiUser) => {
    setSelectedUser(user);
    setAction("ban");
    setBanReason("");
    setBanExpiresIn("30d");
    setShowDialog(true);
  };

  const handleUnbanUser = (user: ApiUser) => {
    setSelectedUser(user);
    setAction("unban");
    setShowDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedUser || !action) return;

    setActionLoading(true);

    try {
      if (action === "ban") {
        const response = await fetch(
          `${API_BASE_URL}/admin/ban-user/${selectedUser.id}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              banReason,
              banExpiresIn,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to ban user");
        }

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, banned: true } : user,
          ),
        );
      } else {
        // Unban user
        const response = await fetch(
          `${API_BASE_URL}/admin/ban-user/${selectedUser.id}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              banReason: null,
              banExpiresIn: null,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to unban user");
        }

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, banned: false } : user,
          ),
        );
      }

      console.log(`[v0] User ${selectedUser.name} has been ${action}ned`);
    } catch (error) {
      console.error("Error performing action:", error);
    } finally {
      setShowDialog(false);
      setSelectedUser(null);
      setAction(null);
      setActionLoading(false);
    }
  };

  const getStatusBadge = (banned: boolean) => {
    if (banned) {
      return {
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        label: "Banned",
      };
    }
    return {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      label: "Active",
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getUsername = (user: ApiUser) => {
    return user.name || user.email.split("@")[0];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Users Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage user accounts on the platform
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "..." : totalUsers}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loading ? "..." : users.filter((u) => !u.banned).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Banned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {loading ? "..." : users.filter((u) => u.banned).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | "active" | "banned") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="banned">Banned Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Showing {loading ? "..." : filteredUsers.length} of{" "}
                {loading ? "..." : totalUsers} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => {
                            const statusBadge = getStatusBadge(user.banned);
                            return (
                              <TableRow key={user.id}>
                                <TableCell className="font-semibold">
                                  {getUsername(user)}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {user.email}
                                </TableCell>
                                <TableCell className="text-sm capitalize">
                                  {user.role}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusBadge.className}>
                                    {statusBadge.label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {user.banned ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUnbanUser(user)}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Unban
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleBanUser(user)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Ban className="h-4 w-4 mr-2" />
                                      Ban
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No users found matching your search
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "ban" ? "Ban User" : "Unban User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === "ban"
                ? `Are you sure you want to ban ${selectedUser?.name}? They will no longer be able to access the platform.`
                : `Are you sure you want to unban ${selectedUser?.name}? They will regain access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {action === "ban" && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Ban Reason</label>
                <Input
                  placeholder="Enter reason for ban"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ban Duration</label>
                <select
                  value={banExpiresIn}
                  onChange={(e) => setBanExpiresIn(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="90d">90 Days</option>
                  <option value="1y">1 Year</option>
                  <option value="forever">Permanent</option>
                </select>
              </div>
            </div>
          )}
          <AlertDialogAction
            onClick={confirmAction}
            disabled={(action === "ban" && !banReason.trim()) || actionLoading}
            className={action === "ban" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {actionLoading
              ? "Loading..."
              : action === "ban"
                ? "Ban User"
                : "Unban User"}
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
