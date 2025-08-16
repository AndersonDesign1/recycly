import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Shield,
  Users,
  Recycle,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-forest-green-50/30 overflow-hidden">
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-forest-green-500 to-forest-green-600 rounded-xl flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-forest-green-600 to-forest-green-800 bg-clip-text text-transparent">
              Recycly
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-forest-green-600 hover:bg-forest-green-50 rounded-xl px-6"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-forest-green-500 to-forest-green-600 hover:from-forest-green-600 hover:to-forest-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-forest-green-500/5 via-transparent to-forest-green-600/5 rounded-full blur-3xl transform -rotate-12 scale-150"></div>
        <div className="absolute inset-0 opacity-5">
          <img
            src="/images/hero-tech-bg.png"
            alt="Technology Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-forest-green-100 to-forest-green-50 rounded-full px-5 py-2 mb-6 border border-forest-green-200/50">
              <Sparkles className="w-4 h-4 text-forest-green-600" />
              <span className="text-forest-green-700 font-medium text-sm">
                The Future of Waste Intelligence
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Waste
              <span className="block bg-gradient-to-r from-forest-green-500 via-forest-green-600 to-forest-green-700 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Transform chaos into clarity. Our AI-powered platform doesn't just
              track waste—it predicts, optimizes, and revolutionizes how
              businesses think about sustainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-forest-green-500 to-forest-green-600 hover:from-forest-green-600 hover:to-forest-green-700 text-white px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Start Revolution
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-forest-green-300 text-forest-green-700 hover:bg-forest-green-50 px-10 py-4 text-lg rounded-xl bg-white/50 backdrop-blur-sm"
                >
                  Experience Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 transform hover:scale-[1.02] transition-transform duration-500">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="/images/dashboard-preview.png"
                  alt="Recycly Dashboard Interface"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-green-600/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-lg p-4 border border-white/20">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-forest-green-600">
                        2.4k
                      </div>
                      <div className="text-gray-600 text-sm">Tons Recycled</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-forest-green-600">
                        89%
                      </div>
                      <div className="text-gray-600 text-sm">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-forest-green-600">
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

      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Beyond Traditional Tracking
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Six revolutionary capabilities that transform how enterprises
              approach waste management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                key={index}
                className="group border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
              >
                <CardContent className="p-0 relative">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-forest-green-500 to-forest-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forest-green-600 via-forest-green-500 to-forest-green-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-forest-green-400/20 to-transparent"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Revolutionize Waste?
            </h2>
            <p className="text-xl text-forest-green-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Join the sustainability revolution. Transform your waste
              management from cost center to profit driver with Recycly's
              intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-forest-green-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Start Your Revolution
                  <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-forest-green-600 px-10 py-4 text-lg rounded-xl bg-transparent backdrop-blur-sm"
                >
                  Experience the Future
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-forest-green-500 to-forest-green-600 rounded-xl flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-forest-green-400 to-forest-green-500 bg-clip-text text-transparent">
                Recycly
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-8 text-sm">
              <Link
                href="#"
                className="hover:text-forest-green-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="hover:text-forest-green-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="hover:text-forest-green-400 transition-colors"
              >
                Support
              </Link>
              <Link
                href="#"
                className="hover:text-forest-green-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Recycly. Transforming waste into opportunity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
