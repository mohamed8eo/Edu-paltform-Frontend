"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ServicesSection } from "@/components/services-section";
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
  },
  {
    title: "Expert-Led",
    description:
      "Learn from industry professionals with years of real-world experience.",
    icon: Award,
  },
  {
    title: "Beginner Friendly",
    description:
      "Start from zero. Our courses assume no prior knowledge and build up gradually.",
    icon: TrendingUp,
  },
  {
    title: "Practical Skills",
    description:
      "Focus on skills you can use immediately in your career or projects.",
    icon: Zap,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Why Choose Us</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Everything You Need to{" "}
              <span className="text-primary">Succeed</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              We provide all the tools and resources you need to master new
              skills and achieve your learning goals - completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover all the features that make LearnHub the best choice for
              your online learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
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
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Getting started is easy. Follow these simple steps to begin your
              learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse Courses",
                description:
                  "Explore our catalog of free courses and find the perfect course for your learning goals.",
              },
              {
                step: "02",
                title: "Start Learning",
                description:
                  "Enroll with a single click and start watching video lessons, reading materials, and practicing skills.",
              },
              {
                step: "03",
                title: "Get Certified",
                description:
                  "Complete the course, earn your certificate, and showcase your new skills to the world.",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="relative px-8 py-12 md:py-16 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to Explore Our Features?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start learning today and discover why thousands of students
                trust LearnHub for their education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Browse Courses
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
