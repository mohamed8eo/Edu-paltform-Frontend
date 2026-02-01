import { GraduationCap } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <GraduationCap className="h-7 w-7 text-primary" />
        <span className="text-xl font-semibold tracking-tight">LearnHub</span>
      </div>
    </div>
  )
}
