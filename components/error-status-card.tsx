"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ErrorStatus, ErrorStats } from "@/types/admin";

interface ErrorStatusCardProps {
  data: ErrorStatus[] | ErrorStats[];
  loading?: boolean;
}

const statusDescriptions: Record<number, string> = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  500: "Internal Server Error",
};

const statusColors: Record<number, string> = {
  200: "bg-green-500",
  201: "bg-green-500",
  400: "bg-yellow-500",
  401: "bg-blue-500",
  404: "bg-yellow-500",
  500: "bg-red-500",
};

const getStatusDescription = (statusCode: number): string => {
  return statusDescriptions[statusCode] || "Unknown";
};

const transformData = (items: ErrorStatus[] | ErrorStats[]): ErrorStatus[] => {
  const total = items.reduce((sum, item) => {
    // Check if it's the API format (has statusCode, count as string)
    if ("statusCode" in item && "count" in item) {
      return sum + parseInt(item.count, 10);
    }
    return sum + (item as ErrorStatus).count;
  }, 0);

  return items.map((item): ErrorStatus => {
    // Check if it's the API format
    if ("statusCode" in item && "count" in item) {
      const apiItem = item as ErrorStats;
      const count = parseInt(apiItem.count, 10);
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        status: apiItem.statusCode,
        count,
        percentage: Math.round(percentage * 10) / 10,
        description: getStatusDescription(apiItem.statusCode),
      };
    }
    return item as ErrorStatus;
  });
};

export function ErrorStatusCard({ data, loading }: ErrorStatusCardProps) {
  const displayData = transformData(data);

  if (loading) {
    return (
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>HTTP Status Distribution</CardTitle>
          <CardDescription>Response status codes breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-12"></div>
              </div>
              <Progress value={0} className="h-2" />
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>HTTP Status Distribution</CardTitle>
        <CardDescription>Response status codes breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayData.map((status, index) => (
          <div key={`${status.status}-${index}`} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {status.status} - {status.description}
              </span>
              <span className="text-muted-foreground">
                {status.percentage}%
              </span>
            </div>
            <Progress value={status.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {status.count.toLocaleString()} responses
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
