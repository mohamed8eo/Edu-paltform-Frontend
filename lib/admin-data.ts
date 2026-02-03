import type { TrafficData, EndpointMetric, ErrorStatus, ActiveUser, DashboardStats } from '@/types/admin'

export const trafficData: TrafficData[] = [
  { date: 'Jan 1', traffic: 2400, signups: 240 },
  { date: 'Jan 2', traffic: 1398, signups: 221 },
  { date: 'Jan 3', traffic: 9800, signups: 229 },
  { date: 'Jan 4', traffic: 3908, signups: 200 },
  { date: 'Jan 5', traffic: 4800, signups: 218 },
  { date: 'Jan 6', traffic: 3908, signups: 250 },
  { date: 'Jan 7', traffic: 4300, signups: 210 },
  { date: 'Jan 8', traffic: 5100, signups: 290 },
  { date: 'Jan 9', traffic: 6200, signups: 320 },
  { date: 'Jan 10', traffic: 7100, signups: 280 },
]

export const topEndpoints: EndpointMetric[] = [
  { endpoint: '/api/courses', method: 'GET', requests: 15420, avgResponseTime: 145, errorRate: 0.2 },
  { endpoint: '/api/users/profile', method: 'GET', requests: 12890, avgResponseTime: 98, errorRate: 0.1 },
  { endpoint: '/api/enroll', method: 'POST', requests: 8940, avgResponseTime: 230, errorRate: 0.5 },
  { endpoint: '/api/auth/login', method: 'POST', requests: 8120, avgResponseTime: 320, errorRate: 0.8 },
  { endpoint: '/api/search', method: 'GET', requests: 6750, avgResponseTime: 189, errorRate: 0.3 },
]

export const slowEndpoints: EndpointMetric[] = [
  { endpoint: '/api/analytics/report', method: 'POST', requests: 1240, avgResponseTime: 2850, errorRate: 1.2 },
  { endpoint: '/api/courses/detailed', method: 'GET', requests: 3450, avgResponseTime: 2120, errorRate: 0.7 },
  { endpoint: '/api/recommendations', method: 'GET', requests: 2890, avgResponseTime: 1890, errorRate: 0.4 },
  { endpoint: '/api/admin/export', method: 'POST', requests: 890, avgResponseTime: 1650, errorRate: 0.9 },
]

export const errorStatuses: ErrorStatus[] = [
  { status: 200, count: 98540, percentage: 93.2, description: 'OK' },
  { status: 404, count: 3450, percentage: 3.3, description: 'Not Found' },
  { status: 500, count: 2120, percentage: 2.0, description: 'Server Error' },
  { status: 429, count: 890, percentage: 0.8, description: 'Rate Limited' },
  { status: 401, count: 540, percentage: 0.5, description: 'Unauthorized' },
]

export const activeUsers: ActiveUser[] = [
  {
    id: '1',
    username: 'john_dev',
    email: 'john@example.com',
    lastLogin: '2024-01-10',
    loginTime: '14:35',
    status: 'active',
    totalLogins: 145,
    joinDate: '2023-05-15',
  },
  {
    id: '2',
    username: 'sarah_student',
    email: 'sarah@example.com',
    lastLogin: '2024-01-10',
    loginTime: '13:22',
    status: 'active',
    totalLogins: 89,
    joinDate: '2023-08-20',
  },
  {
    id: '3',
    username: 'mike_engineer',
    email: 'mike@example.com',
    lastLogin: '2024-01-10',
    loginTime: '12:45',
    status: 'active',
    totalLogins: 234,
    joinDate: '2023-02-10',
  },
  {
    id: '4',
    username: 'spam_user',
    email: 'spam@example.com',
    lastLogin: '2024-01-09',
    loginTime: '08:15',
    status: 'banned',
    totalLogins: 12,
    joinDate: '2024-01-08',
  },
  {
    id: '5',
    username: 'alex_designer',
    email: 'alex@example.com',
    lastLogin: '2024-01-10',
    loginTime: '15:10',
    status: 'active',
    totalLogins: 167,
    joinDate: '2023-06-05',
  },
  {
    id: '6',
    username: 'lisa_teacher',
    email: 'lisa@example.com',
    lastLogin: '2024-01-09',
    loginTime: '19:45',
    status: 'active',
    totalLogins: 298,
    joinDate: '2023-01-12',
  },
  {
    id: '7',
    username: 'troll_account',
    email: 'troll@example.com',
    lastLogin: '2024-01-08',
    loginTime: '22:30',
    status: 'banned',
    totalLogins: 45,
    joinDate: '2023-12-01',
  },
  {
    id: '8',
    username: 'emma_learner',
    email: 'emma@example.com',
    lastLogin: '2024-01-10',
    loginTime: '11:20',
    status: 'active',
    totalLogins: 73,
    joinDate: '2023-09-18',
  },
]

export const dashboardStats: DashboardStats = {
  totalUsers: 5420,
  activeUsers: 1248,
  totalTraffic: 156420,
  errorRate: 4.6,
  avgResponseTime: 487,
}
