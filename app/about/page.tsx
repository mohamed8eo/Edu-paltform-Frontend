"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutSection } from "@/components/about-section";
import {
  Sparkles,
  CheckCircle2,
  Award,
  Users,
  BookOpen,
  Clock,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "50+", label: "Free Courses" },
    { number: "10K+", label: "Students" },
    { number: "100+", label: "Video Lessons" },
    { number: "4.9", label: "Avg. Rating" },
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
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Our Story</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              About LearnHub
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              We believe that quality education should be available to everyone,
              regardless of their background or financial situation. That's why
              all our courses are completely free.
            </p>

            <p className="text-slate-400">
              Our mission is to democratize education and help people from all
              walks of life acquire the skills they need to succeed in today's
              rapidly changing world.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow"
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

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our{" "}
                <span className="text-primary relative">
                  Mission
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M0 4C50 2 150 6 200 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary"
                    />
                  </svg>
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                At LearnHub, we're on a mission to make high-quality education
                accessible to everyone. We believe that learning should not be
                limited by financial constraints or geographical boundaries.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Founded by a team of passionate educators and technologists,
                we've helped thousands of students transform their careers and
                achieve their goals through our free online courses.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're looking to switch careers, upskill for your
                current job, or simply explore a new hobby, we're here to
                support you every step of the way.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Free Education</h3>
                  <p className="text-muted-foreground">
                    For Everyone, Everywhere
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything we do is guided by our core values and commitment to
              making education accessible to all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card border hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="relative px-8 py-12 md:py-16 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to Start Learning?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Join thousands of students already learning on our platform.
                Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Browse Courses
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-input bg-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Contact Us
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
