"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Video,
  Users,
  Award,
  Clock,
  Globe,
  Shield,
  Zap,
  Smartphone,
  Download,
  Infinity,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

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
      "Earn recognized certificates upon completing courses. Showcase your achievements and skills to employers and on your professional profiles.",
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
  {
    icon: Shield,
    title: "Trusted Content",
    description:
      "All courses are created by industry experts and reviewed for quality and accuracy. Learn skills that are current and relevant to today's job market.",
  },
  {
    icon: Zap,
    title: "Quick Start",
    description:
      "Get started in minutes. No registration hassles, no waiting periods. Simply browse courses and begin learning immediately.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Take your learning on the go. Our responsive design ensures a seamless experience across all your devices.",
  },
  {
    icon: Download,
    title: "Download Resources",
    description:
      "Download course materials, exercises, and resources for offline study. Learn even when you're not connected.",
  },
  {
    icon: Infinity,
    title: "Lifetime Access",
    description:
      "Once enrolled in a course, you have unlimited access to all course materials forever. Review whenever you need to.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Monitor your learning journey with progress tracking. See how far you've come and what you've accomplished.",
  },
];

const benefits = [
  {
    title: "100% Free",
    description:
      "No hidden costs, no subscriptions, no catch. Everything is completely free forever.",
    icon: Infinity,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Expert-Led",
    description:
      "Learn from industry professionals with years of real-world experience.",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Beginner Friendly",
    description:
      "Start from zero. Our courses assume no prior knowledge and build up gradually.",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Practical Skills",
    description:
      "Focus on skills you can use immediately in your career or projects.",
    icon: Zap,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const steps = [
  {
    step: "01",
    title: "Browse Courses",
    description:
      "Explore our catalog of free courses and find the perfect course for your learning goals.",
    icon: BookOpen,
  },
  {
    step: "02",
    title: "Start Learning",
    description:
      "Enroll with a single click and start watching video lessons, reading materials, and practicing skills.",
    icon: Video,
  },
  {
    step: "03",
    title: "Get Certified",
    description:
      "Complete the course, earn your certificate, and showcase your new skills to the world.",
    icon: Award,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Why Choose Us</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                Everything You Need
                <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mt-2">
                  To Succeed
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We provide all the tools and resources you need to master new skills and achieve your learning goals - completely free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-4">
                  <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Feature Overview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Your Success
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover all the features that make our platform the best choice for your online learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-primary/70 group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/0 group-hover:shadow-primary/25">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to begin your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center space-y-6">
                  {/* Step number badge */}
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-2xl shadow-primary/25">
                      {item.step}
                    </div>
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5">
                        <div className="w-full h-full bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30" />
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Ready to Get Started?</h3>
                  <p className="text-muted-foreground">
                    Join thousands of learners and start your journey today
                  </p>
                </div>
              </div>
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl group flex-shrink-0">
                Browse Courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Learners Worldwide
            </h2>
            <p className="text-muted-foreground text-lg">
              Join our growing community of successful students
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "50+", label: "Free Courses" },
              { number: "10K+", label: "Active Students" },
              { number: "100+", label: "Expert Instructors" },
              { number: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </p>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
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
                <Badge variant="secondary" className="text-sm">
                  Start Learning Today
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Explore Our Features?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Start learning today and discover why thousands of students trust our platform for their education
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl group">
                  Browse All Courses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Learn More About Us
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