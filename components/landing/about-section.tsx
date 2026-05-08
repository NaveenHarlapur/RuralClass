"use client"

import { CheckCircle, Target, Heart, Lightbulb } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To democratize education by providing accessible, quality learning resources to students in rural and underserved areas of India.",
  },
  {
    icon: Heart,
    title: "Our Vision",
    description:
      "A future where every student, regardless of their location or connectivity, has equal access to world-class education.",
  },
  {
    icon: Lightbulb,
    title: "Our Approach",
    description:
      "Technology designed for the ground reality - low bandwidth, intermittent connectivity, and diverse language needs.",
  },
]

const achievements = [
  "Partnered with 500+ rural colleges across 15 states",
  "Supporting 50,000+ active students monthly",
  "Content available in 15+ regional languages",
  "90% reduction in data usage compared to traditional platforms",
  "Offline-first architecture for uninterrupted learning",
  "Government-recognized digital education initiative",
]

export function AboutSection() {
  return (
    <section id="about" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Empowering Rural Education Through Technology
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                RuralClass was born from a simple observation: millions of
                talented students in rural India lack access to quality
                education due to connectivity challenges. We set out to change
                that.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-6">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Achievements */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h3 className="mb-6 text-xl font-semibold text-foreground">
              Our Impact
            </h3>
            <ul className="space-y-4">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{achievement}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8 rounded-xl bg-primary/10 p-6">
              <p className="font-medium text-foreground">
                Join the movement to transform rural education
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Whether you&apos;re a student seeking knowledge, a teacher
                wanting to make an impact, or an institution looking to expand
                reach - RuralClass is for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
