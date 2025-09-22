import {
  ArrowRight,
  BarChart3,
  Globe,
  Recycle,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-forest-green-50/30">
      <nav className="-translate-x-1/2 fixed top-6 left-1/2 z-50 transform rounded-2xl border border-white/20 bg-white/90 px-8 py-4 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-forest-green-600 to-forest-green-800 bg-clip-text font-bold text-transparent text-xl">
              Recycly
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                className="rounded-xl px-6 text-gray-700 hover:bg-forest-green-50 hover:text-forest-green-600"
                variant="ghost"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="rounded-xl bg-gradient-to-r from-forest-green-500 to-forest-green-600 px-6 text-white shadow-md transition-all duration-300 hover:from-forest-green-600 hover:to-forest-green-700 hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="-rotate-12 absolute inset-0 scale-150 transform rounded-full bg-gradient-to-r from-forest-green-500/5 via-transparent to-forest-green-600/5 blur-3xl" />
        <div className="absolute inset-0 opacity-5">
          <img
            alt="Technology Background"
            className="h-full w-full object-cover"
            src="/images/hero-tech-bg.png"
          />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-forest-green-200/50 bg-gradient-to-r from-forest-green-100 to-forest-green-50 px-5 py-2">
              <Sparkles className="h-4 w-4 text-forest-green-600" />
              <span className="font-medium text-forest-green-700 text-sm">
                The Future of Waste Intelligence
              </span>
            </div>

            <h1 className="mb-6 font-black text-5xl text-gray-900 leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Waste
              <span className="block bg-gradient-to-r from-forest-green-500 via-forest-green-600 to-forest-green-700 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-3xl text-gray-600 text-xl leading-relaxed">
              Transform chaos into clarity. Our AI-powered platform doesn't just
              track waste—it predicts, optimizes, and revolutionizes how
              businesses think about sustainability.
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  className="group rounded-xl bg-gradient-to-r from-forest-green-500 to-forest-green-600 px-10 py-4 text-lg text-white shadow-lg transition-all duration-300 hover:from-forest-green-600 hover:to-forest-green-700 hover:shadow-xl"
                  size="lg"
                >
                  Start Revolution
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  className="rounded-xl border-2 border-forest-green-300 bg-white/50 px-10 py-4 text-forest-green-700 text-lg backdrop-blur-sm hover:bg-forest-green-50"
                  size="lg"
                  variant="outline"
                >
                  Experience Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="transform rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  alt="Recycly Dashboard Interface"
                  className="h-auto w-full"
                  src="/images/dashboard-preview.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-green-600/20 via-transparent to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 rounded-lg border border-white/20 bg-white/90 p-4 backdrop-blur-xl">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="font-bold text-2xl text-forest-green-600">
                        2.4k
                      </div>
                      <div className="text-gray-600 text-sm">Tons Recycled</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-forest-green-600">
                        89%
                      </div>
                      <div className="text-gray-600 text-sm">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-2xl text-forest-green-600">
                        $47k
                      </div>
                      <div className="text-gray-600 text-sm">Cost Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-4xl text-gray-900">
              Beyond Traditional Tracking
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 text-lg">
              Six revolutionary capabilities that transform how enterprises
              approach waste management
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "AI Predictions",
                desc: "Machine learning algorithms predict waste patterns, optimize collection routes, and prevent overflow incidents before they happen.",
                image: "/images/ai-predictions.png",
              },
              {
                icon: Globe,
                title: "Global Impact",
                desc: "Real-time carbon footprint calculation with blockchain-verified environmental credits and global sustainability reporting.",
                image: "/images/global-impact.png",
              },
              {
                icon: BarChart3,
                title: "Quantum Analytics",
                desc: "Process millions of data points instantly with quantum-inspired algorithms for unprecedented waste intelligence insights.",
                image: "/images/quantum-analytics.png",
              },
              {
                icon: Shield,
                title: "Zero-Trust Security",
                desc: "Military-grade encryption with decentralized data architecture ensures your environmental data remains completely secure.",
                image: "/images/security-tech.png",
              },
              {
                icon: Users,
                title: "Neural Networks",
                desc: "Connect teams, suppliers, and stakeholders through intelligent collaboration networks that learn and adapt.",
                image: "/images/neural-networks.png",
              },
              {
                icon: Recycle,
                title: "Circular Economy",
                desc: "Transform linear waste streams into circular value chains with automated material recovery and redistribution.",
                image: "/images/circular-economy.png",
              },
            ].map((feature, index) => (
              <Card
                className="group hover:-translate-y-1 overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg transition-all duration-300 hover:shadow-xl"
                key={index}
              >
                <CardContent className="relative p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      alt={feature.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={feature.image || "/placeholder.svg"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600 shadow-md">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-3 font-bold text-gray-900 text-xl">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-forest-green-600 via-forest-green-500 to-forest-green-600" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-forest-green-400/20 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-10 backdrop-blur-xl">
            <h2 className="mb-6 font-bold text-4xl text-white">
              Ready to Revolutionize Waste?
            </h2>
            <p className="mx-auto mb-10 max-w-3xl text-forest-green-100 text-xl leading-relaxed">
              Join the sustainability revolution. Transform your waste
              management from cost center to profit driver with Recycly's
              intelligent platform.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  className="group rounded-xl bg-white px-10 py-4 font-bold text-forest-green-600 text-lg shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
                  size="lg"
                >
                  Start Your Revolution
                  <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  className="rounded-xl border-2 border-white bg-transparent px-10 py-4 text-lg text-white backdrop-blur-sm hover:bg-white hover:text-forest-green-600"
                  size="lg"
                  variant="outline"
                >
                  Experience the Future
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative bg-gray-900 py-16 text-gray-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-8 flex items-center space-x-3 md:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-forest-green-500 to-forest-green-600">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-forest-green-400 to-forest-green-500 bg-clip-text font-bold text-2xl text-transparent">
                Recycly
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm md:justify-end">
              <Link
                className="transition-colors hover:text-forest-green-400"
                href="#"
              >
                Privacy
              </Link>
              <Link
                className="transition-colors hover:text-forest-green-400"
                href="#"
              >
                Terms
              </Link>
              <Link
                className="transition-colors hover:text-forest-green-400"
                href="#"
              >
                Support
              </Link>
              <Link
                className="transition-colors hover:text-forest-green-400"
                href="#"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-12 border-gray-800 border-t pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Recycly. Transforming waste into opportunity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
