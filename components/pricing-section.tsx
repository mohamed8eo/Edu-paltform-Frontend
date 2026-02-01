"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { QuoteFormDialog } from "@/components/quote-form-dialog"

const pricingTiers = [
  {
    name: "Basic Website",
    price: "$999",
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Basic SEO optimization",
      "Contact form",
      "1 month free maintenance",
    ],
    highlighted: false,
  },
  {
    name: "Pro Package",
    price: "$2,499",
    features: [
      "Up to 15 pages",
      "Premium design",
      "Advanced SEO",
      "CMS integration",
      "E-commerce functionality",
      "3 months free maintenance",
    ],
    highlighted: true,
  },
  {
    name: "Custom",
    price: "On Request",
    features: [
      "Unlimited pages",
      "Custom functionalities",
      "API integrations",
      "Dedicated project manager",
      "6 months free maintenance",
    ],
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="packages" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">
            Choose the <span className="text-primary">perfect package</span> for your project
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From startups to established businesses - we have a suitable solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={`relative group ${
                tier.highlighted
                  ? "border-primary shadow-xl scale-105 bg-gradient-to-b from-background to-primary/5"
                  : "hover:border-primary/50 hover:shadow-lg"
              } transition-all duration-300`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {tier.price === "On Request" ? (
                      <span className="text-3xl">{tier.price}</span>
                    ) : (
                      <>
                        <span className="text-lg font-normal text-muted-foreground">From </span>
                        {tier.price}
                      </>
                    )}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 group/item">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <QuoteFormDialog
                  packageName={tier.name}
                  variant={tier.highlighted ? "default" : "outline"}
                  className={`w-full ${tier.highlighted ? "shadow-lg shadow-primary/20" : ""}`}
                >
                  {tier.price === "On Request" ? "Contact Us" : "Choose Package"}
                </QuoteFormDialog>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All packages include <span className="text-primary font-semibold">free hosting setup</span> and{" "}
            <span className="text-primary font-semibold">SSL certificate</span>
          </p>
        </div>
      </div>
    </section>
  )
}
