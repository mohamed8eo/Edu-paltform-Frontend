"use client";

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
import type { EndpointMetric, EndpointTraffic } from "@/types/admin";

interface EndpointTableProps {
  title: string;
  description: string;
  data: EndpointMetric[] | EndpointTraffic[];
  showErrorRate?: boolean;
  loading?: boolean;
}

export function EndpointTable({
  title,
  description,
  data,
  showErrorRate = true,
  loading,
}: EndpointTableProps) {
  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      colors[method] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  // Transform EndpointTraffic to EndpointMetric format
  const transformData = (
    items: EndpointMetric[] | EndpointTraffic[],
  ): EndpointMetric[] => {
    return items.map((item): EndpointMetric => {
      // Check if it's the API format (has path, hits, averageDuration)
      if ("path" in item && "hits" in item) {
        const apiItem = item as EndpointTraffic;
        return {
          endpoint: apiItem.path,
          method: apiItem.method,
          requests: parseInt(apiItem.hits, 10),
          avgResponseTime: Math.round(parseFloat(apiItem.averageDuration)),
          errorRate: 0,
        };
      }
      // Already in EndpointMetric format
      return item as EndpointMetric;
    });
  };

  const displayData = transformData(data);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between"
              >
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-6 w-16 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((endpoint) => (
              <TableRow key={`${endpoint.endpoint}-${endpoint.method}`}>
                <TableCell className="font-mono text-sm">
                  {endpoint.endpoint}
                </TableCell>
                <TableCell>
                  <Badge className={getMethodColor(endpoint.method)}>
                    {endpoint.method}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {endpoint.requests.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {endpoint.avgResponseTime}ms
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
