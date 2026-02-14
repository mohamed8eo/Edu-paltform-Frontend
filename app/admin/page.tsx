"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrafficChart } from "@/components/traffic-chart";
import { EndpointTable } from "@/components/endpoint-table";
import { ErrorStatusCard } from "@/components/error-status-card";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  Zap,
  Download,
  Settings,
  FileText,
  Shield,
  ArrowRight,
  BarChart3,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";
import { redirect } from "next/navigation";
import type {
  DailyTraffic,
  TrafficData,
  EndpointTraffic,
  ErrorStats,
  DashboardStats,
} from "@/types/admin";
import { tokenManager } from "../auth-api";

const API_BASE_URL = "/api";

export default function AdminDashboard() {
  const { user, loading: userLoading } = useUser();
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [topEndpointsData, setTopEndpointsData] = useState<EndpointTraffic[]>(
    [],
  );
  const [slowEndpointsData, setSlowEndpointsData] = useState<EndpointTraffic[]>(
    [],
  );
  const [errorStatsData, setErrorStatsData] = useState<ErrorStats[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const session = await authApi.getSession();
        const token = session?.user;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch dashboard stats
        const statsResponse = await fetch(
          `${API_BASE_URL}/admin/traffic/dashboard-stats`,
          { method: "GET", headers },
        );
        if (!statsResponse.ok) {
          throw new Error(
            `Failed to fetch dashboard stats: ${statsResponse.status}`,
          );
        }
        const statsData: DashboardStats = await statsResponse.json();
        setDashboardStats(statsData);

        // Fetch daily traffic
        const trafficResponse = await fetch(
          `${API_BASE_URL}/admin/traffic/daily`,
          { method: "GET", headers },
        );
        if (!trafficResponse.ok) {
          throw new Error(`Failed to fetch traffic: ${trafficResponse.status}`);
        }
        const trafficDataRaw: DailyTraffic[] = await trafficResponse.json();

        // Transform traffic data
        const transformedTraffic: TrafficData[] = trafficDataRaw.map(
          (item) => ({
            date: item.day,
            traffic: parseInt(item.requests, 10),
            signups: 0,
          }),
        );
        setTrafficData(transformedTraffic);

        // Fetch top endpoints
        const topResponse = await fetch(
          `${API_BASE_URL}/admin/traffic/top-endpoints`,
          { method: "GET", headers },
        );
        if (!topResponse.ok) {
          throw new Error(
            `Failed to fetch top endpoints: ${topResponse.status}`,
          );
        }
        const topData: EndpointTraffic[] = await topResponse.json();
        setTopEndpointsData(topData);

        // Fetch slow endpoints
        const slowResponse = await fetch(
          `${API_BASE_URL}/admin/traffic/slow-endpoints`,
          { method: "GET", headers },
        );
        if (!slowResponse.ok) {
          throw new Error(
            `Failed to fetch slow endpoints: ${slowResponse.status}`,
          );
        }
        const slowData: EndpointTraffic[] = await slowResponse.json();
        setSlowEndpointsData(slowData);

        // Fetch error stats
        const errorResponse = await fetch(
          `${API_BASE_URL}/admin/traffic/error-stats`,
          { method: "GET", headers },
        );
        if (!errorResponse.ok) {
          throw new Error(
            `Failed to fetch error stats: ${errorResponse.status}`,
          );
        }
        const errorData: ErrorStats[] = await errorResponse.json();
        setErrorStatsData(errorData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchAllData();
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <p className="text-muted-foreground font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    redirect("/home");
  }

  const stats = dashboardStats;
  const avgResponseTime = stats
    ? Math.round(parseFloat(stats.averageResponseTime))
    : 0;

  const quickActions = [
    {
      icon: Users,
      label: "Manage Users",
      description: "View and manage user accounts",
      href: "/admin/users",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download analytics reports",
      onClick: () => console.log("[v0] Export data clicked"),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: FileText,
      label: "View Logs",
      description: "System and error logs",
      onClick: () => console.log("[v0] View logs clicked"),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Platform configuration",
      onClick: () => console.log("[v0] Settings clicked"),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Header - Modernized */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-primary/20 shadow-lg">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Admin Portal
                </span>
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
                  <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="text-3xl font-bold text-primary">
                  Control Center
                </p>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                Monitor platform performance, user activity, and system health
                in real-time with comprehensive analytics and insights
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/admin/users">
                <Button
                  size="lg"
                  className="gap-2 shadow-xl hover:shadow-2xl hover:shadow-primary/20 group transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
                >
                  <Users className="h-5 w-5" />
                  Manage Users
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 backdrop-blur-sm bg-background/50 hover:bg-background/80 border-primary/20"
              >
                <Download className="h-5 w-5" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Main Stats Grid - Enhanced */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <h2 className="text-3xl font-bold">Platform Metrics</h2>
            </div>
            <p className="text-muted-foreground text-lg ml-7">
              Real-time performance indicators and key statistics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total Users Card */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-500/15 border-green-500/20 font-semibold"
                  >
                    +12%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                    Total Users
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {loading
                      ? "..."
                      : stats?.totalUsers.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Registered accounts
                  </p>
                </div>
              </div>
            </div>

            {/* Active Users Card */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-green-500/20 hover:border-green-500/40 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Activity className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-500/15 border-green-500/20 font-semibold"
                  >
                    +5%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                    Active Users
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {loading
                      ? "..."
                      : stats?.activeUsers.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Currently online
                  </p>
                </div>
              </div>
            </div>

            {/* Total Traffic Card */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-500/15 border-green-500/20 font-semibold"
                  >
                    +23%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                    Total Traffic
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {loading
                      ? "..."
                      : stats?.totalRequests.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    API requests
                  </p>
                </div>
              </div>
            </div>

            {/* Error Rate Card */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-red-500/20 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <AlertTriangle className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-500/15 border-green-500/20 font-semibold"
                  >
                    -2%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                    Error Rate
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {loading ? "..." : `${stats?.errorRate}%` || "0%"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    HTTP errors
                  </p>
                </div>
              </div>
            </div>

            {/* Avg Response Card */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-orange-500/20 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Zap className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-green-600 bg-green-500/15 border-green-500/20 font-semibold"
                  >
                    -8%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                    Avg Response
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {loading ? "..." : `${avgResponseTime}ms`}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    API latency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Traffic Chart - Now using the new component */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <h2 className="text-3xl font-bold">Traffic Analytics</h2>
            </div>
            <p className="text-muted-foreground text-lg ml-7">
              Visualize request patterns and usage trends
            </p>
          </div>
          <TrafficChart data={trafficData} />
        </section>

        {/* Endpoints and Error Status */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <h2 className="text-3xl font-bold">Endpoint Performance</h2>
            </div>
            <p className="text-muted-foreground text-lg ml-7">
              Analyze API endpoint usage and error metrics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <EndpointTable
                  title="Top Used Endpoints"
                  description="Most frequently called API endpoints"
                  data={topEndpointsData}
                  loading={loading}
                />
              </div>
            </div>
            <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <ErrorStatusCard data={errorStatsData} loading={loading} />
            </div>
          </div>
        </section>

        {/* Slow Endpoints */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <h2 className="text-3xl font-bold">Performance Issues</h2>
            </div>
            <p className="text-muted-foreground text-lg ml-7">
              Identify bottlenecks and optimize slow responses
            </p>
          </div>
          <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <EndpointTable
              title="Slowest Endpoints"
              description="Endpoints with highest average response times"
              data={slowEndpointsData}
              loading={loading}
            />
          </div>
        </section>

        {/* Quick Actions - Enhanced */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
              <h2 className="text-3xl font-bold">Quick Actions</h2>
            </div>
            <p className="text-muted-foreground text-lg ml-7">
              Frequently used administrative tasks
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const ActionWrapper = action.href ? Link : "div";
              const wrapperProps = action.href
                ? { href: action.href }
                : { onClick: action.onClick };

              return (
                <ActionWrapper key={index} {...wrapperProps}>
                  <div
                    className={`group relative h-full overflow-hidden rounded-2xl ${action.borderColor} border bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${action.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />

                    <div className="relative p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="relative">
                          <div
                            className={`absolute inset-0 ${action.bgColor} rounded-xl blur-lg group-hover:blur-xl transition-all`}
                          />
                          <div
                            className={`relative w-14 h-14 rounded-xl ${action.bgColor} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          >
                            <action.icon className="h-7 w-7" />
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {action.label}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </ActionWrapper>
              );
            })}
          </div>
        </section>

        {/* System Status - Enhanced */}
        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                      <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 animate-ping" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-green-600 bg-green-500/15 border-green-500/20 font-semibold px-4 py-1"
                    >
                      All Systems Operational
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold">Platform Status</h3>
                  <p className="text-muted-foreground text-lg">
                    All services are running smoothly with optimal performance
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 backdrop-blur-sm bg-background/50 hover:bg-background/80 border-primary/20"
                >
                  <Clock className="h-5 w-5" />
                  View History
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
