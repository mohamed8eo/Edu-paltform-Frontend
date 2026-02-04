"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Award,
  Users,
  BookOpen,
  Clock,
  Target,
  Heart,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "50+", label: "Free Courses", icon: BookOpen },
    { number: "10K+", label: "Students", icon: Users },
    { number: "100+", label: "Video Lessons", icon: Clock },
    { number: "4.9", label: "Avg. Rating", icon: Award },
  ];

  const values = [
    {
      icon: Sparkles,
      title: "Free Forever",
      description:
        "All our courses are 100% free with no hidden costs or subscriptions. We believe education should be accessible to everyone.",
    },
    {
      icon: CheckCircle2,
      title: "Quality Content",
      description:
        "Expert-created courses with up-to-date, industry-relevant material. Learn skills that are in demand.",
    },
    {
      icon: Award,
      title: "Certificates",
      description:
        "Earn recognized certificates upon completion to showcase your achievements to employers.",
    },
    {
      icon: Clock,
      title: "Self-Paced",
      description:
        "Learn on your own schedule without deadlines. Access materials anytime, anywhere.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Join a vibrant community of learners. Ask questions and collaborate with fellow students.",
    },
    {
      icon: BookOpen,
      title: "Lifetime Access",
      description:
        "Once enrolled, access your courses forever at no additional cost. Learn at your own pace.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "The Beginning",
      description: "LearnHub was founded with a vision to democratize education",
    },
    {
      year: "2021",
      title: "Growing Impact",
      description: "Reached 1,000+ students and launched 20 free courses",
    },
    {
      year: "2023",
      title: "Global Reach",
      description: "Expanded to 50+ countries with 10,000+ active learners",
    },
    {
      year: "2024",
      title: "Innovation",
      description: "Introduced AI-powered learning paths and career guidance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Our Story</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                Empowering Learners
                <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mt-2">
                  Worldwide
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We believe that quality education should be available to everyone, regardless of their background or financial situation. That's why all our courses are completely free.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {stats.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border">
                  <stat.icon className="w-4 h-4 text-primary" />
                  <span className="font-bold text-lg">{stat.number}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative text-center p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                    <stat.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:scale-105 transition-transform">
                    {stat.number}
                  </p>
                  <p className="text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Our Mission</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Making Education
                <span className="block text-primary mt-2">
                  Accessible to All
                </span>
              </h2>
              
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  At LearnHub, we're on a mission to make high-quality education accessible to everyone. We believe that learning should not be limited by financial constraints or geographical boundaries.
                </p>
                <p>
                  Founded by a team of passionate educators and technologists, we've helped thousands of students transform their careers and achieve their goals through our free online courses.
                </p>
                <p>
                  Whether you're looking to switch careers, upskill for your current job, or simply explore a new hobby, we're here to support you every step of the way.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="gap-2 group">
                  Browse Courses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Join Community
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="relative h-full flex items-center justify-center p-12">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/25">
                      <BookOpen className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">Free Education</h3>
                      <p className="text-muted-foreground text-lg">
                        For Everyone, Everywhere
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Badge variant="secondary" className="text-sm">
                        No Hidden Fees
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        Lifetime Access
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        Quality Content
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From a small idea to a global learning platform
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center gap-8 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/50" />

                  {/* Content */}
                  <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16'} pl-20 md:pl-0`}>
                    <div className="inline-block">
                      <Badge variant="secondary" className="mb-3">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">What We Stand For</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything we do is guided by our commitment to making education accessible to all
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary/70 group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/0 group-hover:shadow-primary/25">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            
            <div className="relative px-8 py-16 md:py-20 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Start Your Learning Journey?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of students already learning on our platform. Start your journey today and unlock your potential.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 group shadow-lg hover:shadow-xl">
                  Browse All Courses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}