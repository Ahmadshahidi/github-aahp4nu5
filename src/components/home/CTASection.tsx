import React, { useState } from 'react';
import Button from '../ui/Button';
import { Calendar, Mail, User, MessageSquare, CheckCircle, Clock, Star, ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consultation request submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
    alert('Your consultation request has been submitted. Our statistics expert will contact you soon!');
  };

  const benefits = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "One-on-One Sessions",
      description: "Schedule private consultations with experienced statisticians to discuss your specific analysis needs and get personalized guidance."
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Expert Project Review",
      description: "Get professional feedback on your statistical models and analytical approaches from industry experts with proven track records."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Validation & Verification",
      description: "Ensure your statistical methods are sound and your conclusions are valid with thorough peer review and validation processes."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Data Scientist at Google",
      content: "The statistical guidance I received was invaluable for my machine learning project. The expert review helped me avoid critical errors.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Research Analyst",
      content: "Professional, thorough, and incredibly knowledgeable. The consultation saved me weeks of work and improved my analysis significantly.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div className="lg:sticky lg:top-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Expert Statistical Consultation
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Get Personalized
              <span className="block text-blue-600 dark:text-blue-400">
                Statistical Guidance
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Need help with statistical analysis or choosing the right modeling approach? Our experts are here to guide you through your data science journey with personalized consultations and professional reviews.
            </p>

            {/* Benefits */}
            <div className="space-y-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start group">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Clients Say
              </h3>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Form */}
          <div className="mt-12 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Request a Consultation
                </h3>
                <p className="text-blue-100">
                  Get expert statistical guidance tailored to your needs
                </p>
              </div>

              {/* Form Content */}
              <div className="px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-lg"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-lg"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      What statistical help do you need? *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 text-lg resize-none"
                      placeholder="Describe your statistical analysis needs, challenges, or the type of consultation you're looking for..."
                    />
                  </div>

                  {/* Response Time Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                          Quick Response Time
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          We typically respond within 24 hours
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                  >
                    Request Consultation
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </form>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Free initial consultation • No commitment required • Expert guidance guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;