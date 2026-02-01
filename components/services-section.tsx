"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Video, Users, Award, Clock, Globe } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description:
      "Our courses cover everything from fundamentals to advanced topics. Each course is carefully designed to provide you with practical, real-world skills that you can apply immediately.",
  },
  {
    icon: Video,
    title: "HD Video Lessons",
    description:
      "Learn through high-quality video content with clear explanations and visual demonstrations. Watch, pause, and rewind at your own pace to ensure you understand every concept.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Join a vibrant community of learners. Ask questions, share insights, and collaborate with fellow students from around the world who share your passion for learning.",
  },
  {
    icon: Award,
    title: "Certificates of Completion",
    description:
      "Earn recognized certificates upon completing courses. Showcase your achievements and newly acquired skills to employers and on your professional profiles.",
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description:
      "No deadlines, no pressure. Access course materials anytime, anywhere. Our flexible learning approach lets you study when it suits your schedule best.",
  },
  {
    icon: Globe,
    title: "Accessible Anywhere",
    description:
      "Learn from any device - desktop, tablet, or mobile. Our platform is optimized for all screens, so you can continue your education wherever you are.",
  },
]

export function ServicesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mx-auto block w-fit">
          Why Choose Us
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Everything you need to <span className="text-primary">succeed</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed text-lg">
          We provide all the tools and resources you need to master new skills and achieve your learning goals - completely free.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-background/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
