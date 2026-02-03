export interface TrafficData {
  date: string;
  traffic: number;
  signups: number;
}

export interface EndpointMetric {
  endpoint: string;
  method: string;
  requests: number;
  avgResponseTime: number;
  errorRate: number;
}

export interface ErrorStatus {
  status: number;
  count: number;
  percentage: number;
  description: string;
}

export interface ActiveUser {
  id: string;
  username: string;
  email: string;
  lastLogin: string;
  loginTime: string;
  status: "active" | "inactive" | "banned";
  totalLogins: number;
  joinDate: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTraffic: number;
  errorRate: number;
  avgResponseTime: number;
}

export interface DailyTraffic {
  day: string;
  requests: string;
}

export interface ChartTrafficData {
  date: string;
  traffic: number;
  signups: number;
}

export interface EndpointTraffic {
  path: string;
  method: string;
  statusCode: number;
  hits: string;
  averageDuration: string;
}
