
import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  LineChart, 
  Brain, 
  Award, 
  Shield, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';

const Index = () => {
  return (
   
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-candidate-primary to-candidate-secondary py-16 md:py-24">
        <div className="container relative z-10">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold animate-fade-in">
                Game-Based Recruitment Assessment System
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Discover personality traits through engaging gamified assessments
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" 
                variant="outline"
                className="bg-white text-candidate-primary hover:bg-white/10">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white text-candidate-primary hover:bg-white/10">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-square w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-scale-in">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                  <div className="bg-white/20 rounded-lg flex items-center justify-center">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                  <div className="bg-white/20 rounded-lg flex items-center justify-center">
                    <Award className="h-16 w-16 text-white" />
                  </div>
                  <div className="bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <div className="bg-white/20 rounded-lg flex items-center justify-center">
                    <LineChart className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract background elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-2xl"></div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Key Features</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Our platform offers a comprehensive solution for modern recruitment needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-candidate-accent flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-candidate-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamified Assessments</h3>
              <p className="text-gray-600">
                Engaging scenario-based questions that reveal personality traits through interactive gameplay.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-recruiter-accent flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-recruiter-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">
                Comprehensive reports and insights to help recruiters make data-driven hiring decisions.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-admin-accent flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-admin-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Custom dashboards for candidates, recruiters, and administrators with tailored features.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-candidate-accent flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-candidate-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Badges & Rewards</h3>
              <p className="text-gray-600">
                Motivate candidates with achievement badges and gamified rewards throughout the assessment.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-recruiter-accent flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-recruiter-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                End-to-end encryption and role-based access control to protect sensitive assessment data.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-admin-accent flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-admin-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Modules</h3>
              <p className="text-gray-600">
                Tailor assessments to specific roles and requirements through the admin dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-recruiter-primary to-recruiter-secondary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Recruitment Process?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of companies using our platform to identify the perfect candidates through gamified assessments.
          </p>
          <Button asChild size="lg" className="bg-white text-recruiter-primary hover:bg-gray-100">
            <Link to="/signup" className="inline-flex items-center">
              Get Started Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-candidate-primary to-candidate-secondary mr-2"></div>
                <span className="font-bold text-white">GameOn Assessment</span>
              </div>
              <p className="mt-2 text-sm">
                Revolutionizing recruitment through gamified assessments.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-semibold text-white mb-3">Platform</h3>
                <ul className="space-y-2">
                  <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                  <li><Link to="/signup" className="hover:text-white">Register</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
            <p>© 2025 GameOn Assessment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;