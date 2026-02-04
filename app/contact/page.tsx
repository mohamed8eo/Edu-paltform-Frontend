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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("[v0] Form submitted:", formData);
    setSubmitted(true);
    setIsSubmitting(false);
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
      description: "Send us an email",
      value: "support@learnhub.com",
      href: "mailto:support@learnhub.com",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Call us",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Visit us",
      value: "123 Learning Street, Education City",
      href: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're available",
      value: "Mon - Fri: 9AM - 6PM EST",
      href: "#",
    },
  ];

  const faqs = [
    {
      question: "Are all courses really free?",
      answer:
        "Yes! All courses on LearnHub are completely free. There are no hidden costs, subscriptions, or fees of any kind.",
    },
    {
      question: "How do I enroll in a course?",
      answer:
        "Simply browse our course catalog, click on any course you like, and click the 'Enroll Now' button. It's that easy!",
    },
    {
      question: "Do I get a certificate after completion?",
      answer:
        "Yes! Upon completing a course, you'll receive a certificate of completion that you can download and share.",
    },
    {
      question: "Can I access courses on mobile?",
      answer:
        "Absolutely! LearnHub is fully responsive and works on all devices including smartphones, tablets, and desktops.",
    },
    {
      question: "Are the courses self-paced?",
      answer:
        "Yes, all our courses are completely self-paced. You can learn whenever you want, at your own speed.",
    },
    {
      question: "How do I get help if I'm stuck?",
      answer:
        "You can reach out to our support team via email or use the community forum to connect with other learners.",
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
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Get In Touch</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              We're Here to <span className="text-primary">Help</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Have questions about our courses or need help getting started? Our
              team is ready to assist you on your learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <a key={index} href={info.href} className="group block">
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {info.description}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-xl bg-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                            className="transition-all focus:scale-[1.01]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                            className="transition-all focus:scale-[1.01]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="text-sm font-medium"
                        >
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this about?"
                          className="transition-all focus:scale-[1.01]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium"
                        >
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          rows={6}
                          required
                          className="transition-all focus:scale-[1.01]"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto group"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Frequently Asked</h2>
                <h2 className="text-2xl font-bold text-primary">Questions</h2>
                <p className="text-muted-foreground mt-4">
                  Find quick answers to common questions about our platform.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground pl-8 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      Still have questions?
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Can't find what you're looking for? Send us a message and
                      we'll be happy to help you out.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 h-96 flex items-center justify-center border border-primary/20">
            <div className="text-center space-y-4 p-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Visit Our Office</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                123 Learning Street, Education City, EC 12345
              </p>
              <Button variant="outline" className="mt-4">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
