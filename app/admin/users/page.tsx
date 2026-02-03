'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Search, Ban, CheckCircle } from 'lucide-react'
import { activeUsers as initialUsers } from '@/lib/admin-data'
import type { ActiveUser } from '@/types/admin'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ActiveUser[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<ActiveUser | null>(null)
  const [action, setAction] = useState<'ban' | 'unban' | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBanUser = (user: ActiveUser) => {
    setSelectedUser(user)
    setAction('ban')
    setShowDialog(true)
  }

  const handleUnbanUser = (user: ActiveUser) => {
    setSelectedUser(user)
    setAction('unban')
    setShowDialog(true)
  }

  const confirmAction = () => {
    if (!selectedUser || !action) return

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? { ...user, status: action === 'ban' ? 'banned' : 'active' }
          : user
      )
    )

    console.log(`[v0] User ${selectedUser.username} has been ${action}ned`)
    setShowDialog(false)
    setSelectedUser(null)
    setAction(null)
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      banned: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    }
    const label: Record<string, string> = {
      active: 'Active',
      banned: 'Banned',
      inactive: 'Inactive',
    }
    return { className: badges[status], label: label[status] }
  }

  const activeCount = users.filter((u) => u.status === 'active').length
  const bannedCount = users.filter((u) => u.status === 'banned').length

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Active Users Management</h1>
            <p className="text-muted-foreground mt-2">Monitor and manage user accounts on the platform</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Banned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{bannedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Showing {filteredUsers.length} of {users.length} users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Total Logins</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const statusBadge = getStatusBadge(user.status)
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-semibold">{user.username}</TableCell>
                            <TableCell className="text-sm">{user.email}</TableCell>
                            <TableCell className="text-sm">
                              {user.lastLogin} at {user.loginTime}
                            </TableCell>
                            <TableCell className="text-sm">{user.totalLogins}</TableCell>
                            <TableCell className="text-sm">{user.joinDate}</TableCell>
                            <TableCell>
                              <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {user.status === 'active' ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBanUser(user)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ban
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUnbanUser(user)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Unban
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No users found matching your search
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === 'ban' ? 'Ban User' : 'Unban User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'ban'
                ? `Are you sure you want to ban ${selectedUser?.username}? They will no longer be able to access the platform.`
                : `Are you sure you want to unban ${selectedUser?.username}? They will regain access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={confirmAction} className={action === 'ban' ? 'bg-red-600 hover:bg-red-700' : ''}>
            {action === 'ban' ? 'Ban User' : 'Unban User'}
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  )
}
