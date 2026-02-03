"use client";

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
import { StatCard } from "@/components/stat-card";
import { TrafficChart } from "@/components/traffic-chart";
import { EndpointTable } from "@/components/endpoint-table";
import { ErrorStatusCard } from "@/components/error-status-card";
import { Users, TrendingUp, AlertTriangle, Activity, Zap } from "lucide-react";
import Link from "next/link";
import {
  trafficData,
  topEndpoints,
  slowEndpoints,
  errorStatuses,
  dashboardStats,
} from "@/lib/admin-data";
import { useUser } from "@/contexts/user-context";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user?.role !== "admin") {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Navigation */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor platform performance and user activity
              </p>
            </div>
            <Link href="/admin/users">
              <Button className="mt-4 md:mt-0">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={dashboardStats.totalUsers.toLocaleString()}
              description="Registered on platform"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Active Users"
              value={dashboardStats.activeUsers.toLocaleString()}
              description="Currently online"
              icon={Activity}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Total Traffic"
              value={dashboardStats.totalTraffic.toLocaleString()}
              description="API requests"
              icon={TrendingUp}
              trend={{ value: 23, isPositive: true }}
            />
            <StatCard
              title="Error Rate"
              value={`${dashboardStats.errorRate}%`}
              description="HTTP errors"
              icon={AlertTriangle}
              trend={{ value: 2, isPositive: false }}
            />
            <StatCard
              title="Avg Response"
              value={`${dashboardStats.avgResponseTime}ms`}
              description="API latency"
              icon={Zap}
              trend={{ value: 8, isPositive: false }}
            />
          </div>

          {/* Traffic Chart */}
          <div className="mb-8">
            <TrafficChart data={trafficData} />
          </div>

          {/* Endpoints and Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <EndpointTable
                title="Top Used Endpoints"
                description="Most frequently called API endpoints"
                data={topEndpoints}
              />
            </div>
            <ErrorStatusCard data={errorStatuses} />
          </div>

          {/* Slow Endpoints */}
          <div className="mb-8">
            <EndpointTable
              title="Slowest Endpoints"
              description="Endpoints with highest average response times"
              data={slowEndpoints}
              showErrorRate={true}
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    View Users
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => console.log("[v0] Export data clicked")}
                >
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => console.log("[v0] View logs clicked")}
                >
                  View Logs
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => console.log("[v0] Settings clicked")}
                >
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
