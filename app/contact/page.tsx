"use client";

import { useState } from "react";
import type React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  HelpCircle,
  MessageSquare,
  MapPin,
  Phone,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("[v0] Form submitted:", formData);
    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email anytime",
      value: "support@learnhub.com",
      href: "mailto:support@learnhub.com",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Mon-Fri from 9am to 6pm",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: MapPin,
      title: "Office",
      description: "Visit us in person",
      value: "123 Learning St, Education City",
      href: "#",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "Our availability",
      value: "Mon - Fri: 9AM - 6PM EST",
      href: "#",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const faqs = [
    {
      question: "Are all courses really free?",
      answer:
        "Yes! All courses on LearnHub are completely free. There are no hidden costs, subscriptions, or fees of any kind. We believe education should be accessible to everyone.",
    },
    {
      question: "How do I enroll in a course?",
      answer:
        "Simply browse our course catalog, click on any course you like, and click the 'Enroll Now' button. You'll get instant access to all course materials.",
    },
    {
      question: "Do I get a certificate after completion?",
      answer:
        "Yes! Upon completing a course and passing the assessments, you'll receive a certificate of completion that you can download, print, and share on your professional profiles.",
    },
    {
      question: "Can I access courses on mobile devices?",
      answer:
        "Absolutely! LearnHub is fully responsive and works seamlessly on all devices including smartphones, tablets, and desktop computers.",
    },
    {
      question: "Are the courses self-paced?",
      answer:
        "Yes, all our courses are completely self-paced. You can learn whenever you want, pause and resume at any time, and there are no deadlines to worry about.",
    },
    {
      question: "How do I get help if I'm stuck?",
      answer:
        "You can reach out to our support team via email, use the contact form on this page, or join our community forum to connect with other learners and instructors.",
    },
  ];

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
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Get In Touch</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                We're Here to
                <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mt-2">
                  Help You
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Have questions about our courses or need help getting started? Our team is ready to assist you on your learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                className="group block"
              >
                <div className="h-full p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-xl ${info.bgColor} ${info.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {info.description}
                      </p>
                      <p className="text-sm font-medium">
                        {info.value}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Send Us a Message</h2>
                <p className="text-muted-foreground text-lg">
                  Fill out the form and we'll get back to you within 24 hours
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-card border-2 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                
                <div className="relative p-8">
                  {submitted ? (
                    <div className="text-center py-16 space-y-6">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Message Sent Successfully!</h3>
                        <p className="text-muted-foreground">
                          Thank you for reaching out. We'll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-semibold">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="h-12 bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-semibold">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="h-12 bg-background/50"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-semibold">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                          className="h-12 bg-background/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-semibold">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help you..."
                          rows={6}
                          required
                          className="bg-background/50 resize-none"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full group shadow-lg hover:shadow-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground text-lg">
                  Quick answers to questions you may have
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl bg-card border hover:border-primary/50 transition-all overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {faq.question}
                          </h3>
                          {expandedFaq === index && (
                            <p className="text-muted-foreground leading-relaxed mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                          expandedFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Still have questions?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Can't find what you're looking for? Our support team is here to help you.
                    </p>
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary/20 h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
            <div className="absolute inset-0 bg-grid-white/5" />
            
            <div className="relative h-full flex items-center justify-center p-8">
              <div className="text-center space-y-6 max-w-md">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl shadow-primary/25">
                  <MapPin className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Visit Our Office</h3>
                  <p className="text-muted-foreground text-lg">
                    123 Learning Street, Education City
                  </p>
                  <p className="text-sm text-muted-foreground">
                    EC 12345, United States
                  </p>
                </div>
                <Button size="lg" className="gap-2 shadow-lg">
                  <MapPin className="w-4 h-4" />
                  Get Directions
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