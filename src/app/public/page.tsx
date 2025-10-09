'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Wrench,
  MapPin,
  Smartphone,
  Lightbulb,
  TreePine,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PublicLandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Report Issues",
      description: "Easily report infrastructure problems like potholes, broken streetlights, and more"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-green-600" />,
      title: "Mobile Friendly",
      description: "Access the platform from any device, anywhere, anytime"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-600" />,
      title: "Track Progress",
      description: "Monitor the status of your reports in real-time"
    },
    {
      icon: <TreePine className="h-8 w-8 text-emerald-600" />,
      title: "Community Impact",
      description: "Help improve your neighborhood infrastructure"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Report Issue",
      description: "Take a photo and describe the problem you've found"
    },
    {
      number: "02",
      title: "Get Assigned",
      description: "Our team assigns your report to qualified contractors"
    },
    {
      number: "03",
      title: "Track Progress",
      description: "Monitor the repair work as it happens"
    },
    {
      number: "04",
      title: "Verify Completion",
      description: "Confirm the issue has been resolved"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">GeoFix</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button
              onClick={() => router.push('/public/login')}
              variant="outline"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push('/public/login')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            🚀 Now Available in Your City
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Fix Your City,
            <span className="text-blue-600"> One Report at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Report infrastructure issues in your neighborhood and track their resolution.
            Join thousands of citizens making their cities better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
              onClick={() => router.push('/public/login')}
            >
              Report an Issue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4"
              onClick={() => router.push('/public/login')}
            >
              Login as Contractor
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose GeoFix?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy for citizens to report issues and for contractors to find work
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your infrastructure issues fixed
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of active citizens and help improve your city's infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4"
              onClick={() => router.push('/public/login')}
            >
              Start Reporting Issues
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => router.push('/public/login')}
            >
              Join as Contractor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold">GeoFix</span>
          </div>
          <p className="text-gray-400 mb-4">
            Making cities better, one report at a time
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2025 GeoFix</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
