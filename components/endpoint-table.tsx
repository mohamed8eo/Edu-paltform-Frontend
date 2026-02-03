'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { EndpointMetric } from '@/types/admin'

interface EndpointTableProps {
  title: string
  description: string
  data: EndpointMetric[]
  showErrorRate?: boolean
}

export function EndpointTable({ title, description, data, showErrorRate = true }: EndpointTableProps) {
  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }
    return colors[method] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Endpoint</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Avg Response</TableHead>
              {showErrorRate && <TableHead className="text-right">Error Rate</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((endpoint) => (
              <TableRow key={`${endpoint.endpoint}-${endpoint.method}`}>
                <TableCell className="font-mono text-sm">{endpoint.endpoint}</TableCell>
                <TableCell>
                  <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                </TableCell>
                <TableCell className="text-right">{endpoint.requests.toLocaleString()}</TableCell>
                <TableCell className="text-right">{endpoint.avgResponseTime}ms</TableCell>
                {showErrorRate && (
                  <TableCell className="text-right">
                    <span className={endpoint.errorRate > 1 ? 'text-red-600 font-semibold' : ''}>
                      {endpoint.errorRate.toFixed(2)}%
                    </span>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
