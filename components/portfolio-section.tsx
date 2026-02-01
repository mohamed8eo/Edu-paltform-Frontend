"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PlayCircle, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const courses = [
  {
    title: "Web Development Fundamentals",
    category: "Programming",
    image: "/modern-ecommerce-website.png",
    description:
      "Learn HTML, CSS, and JavaScript from scratch. Build responsive websites and understand the core concepts of web development.",
    duration: "8 hours",
    students: "2,450",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
  },
  {
    title: "Introduction to Data Science",
    category: "Data & Analytics",
    image: "/professional-corporate-website.png",
    description:
      "Discover the world of data science. Learn Python basics, data analysis, and visualization techniques used by professionals.",
    duration: "12 hours",
    students: "1,890",
    tags: ["Python", "Data Analysis", "Visualization", "Statistics"],
  },
  {
    title: "Digital Marketing Essentials",
    category: "Marketing",
    image: "/social-media-graphics.png",
    description:
      "Master the fundamentals of digital marketing including SEO, social media marketing, email campaigns, and analytics.",
    duration: "6 hours",
    students: "3,120",
    tags: ["SEO", "Social Media", "Email Marketing", "Analytics"],
  },
  {
    title: "UI/UX Design Principles",
    category: "Design",
    image: "/creative-portfolio-website.png",
    description:
      "Learn user-centered design principles. Create intuitive interfaces and improve user experience with practical projects.",
    duration: "10 hours",
    students: "1,560",
    tags: ["UI Design", "UX Research", "Prototyping", "Figma"],
  },
]

export function PortfolioSection() {
  return (
    <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            Free Courses
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">Featured Courses</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Explore our most popular courses and start your learning journey today. All courses are completely free with lifetime access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="lg" className="gap-2">
                    <PlayCircle className="h-5 w-5" /> Start Course
                  </Button>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  FREE
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-primary font-semibold mb-2">{course.category}</p>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{course.description}</p>
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
