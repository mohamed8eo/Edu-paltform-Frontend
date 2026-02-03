'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { ErrorStatus } from '@/types/admin'

interface ErrorStatusCardProps {
  data: ErrorStatus[]
}

const statusColors: Record<number, string> = {
  200: 'bg-green-500',
  404: 'bg-yellow-500',
  500: 'bg-red-500',
  429: 'bg-orange-500',
  401: 'bg-blue-500',
}

export function ErrorStatusCard({ data }: ErrorStatusCardProps) {
  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>HTTP Status Distribution</CardTitle>
        <CardDescription>Response status codes breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((status) => (
          <div key={status.status} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{status.status} - {status.description}</span>
              <span className="text-muted-foreground">{status.percentage}%</span>
            </div>
            <Progress value={status.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">{status.count.toLocaleString()} responses</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
