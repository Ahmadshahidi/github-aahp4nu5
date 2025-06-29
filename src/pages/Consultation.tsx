import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, Star, Users, MessageSquare, Video, FileText, ArrowRight, User, Mail } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  duration,
  features,
  icon,
  popular = false,
}) => {
  return (
    <Card className={`relative hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
      popular 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700' 
        : 'bg-white dark:bg-gray-800 border-0'
    } shadow-lg`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </div>
        </div>
      )}
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${
            popular 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
              : 'bg-blue-100 dark:bg-blue-900/30'
          } rounded-2xl mb-4`}>
            <div className={popular ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
              {icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {description}
          </p>
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {price}
            <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/{duration}</span>
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={popular ? "primary" : "outline"}
          fullWidth
          className={popular 
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900 py-3 text-lg font-semibold"
          }
        >
          Book Consultation
        </Button>
      </CardContent>
    </Card>
  );
};

const Consultation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });

  const services = [
    {
      title: "Statistical Analysis Review",
      description: "Get expert feedback on your statistical methods and analysis approach",
      price: "$150",
      duration: "hour",
      icon: <FileText size={28} />,
      features: [
        "Review of statistical methodology",
        "Validation of analysis approach",
        "Recommendations for improvement",
        "Written summary report",
        "Follow-up email support"
      ]
    },
    {
      title: "One-on-One Mentoring",
      description: "Personalized guidance for your statistical learning journey",
      price: "$200",
      duration: "hour",
      icon: <Video size={28} />,
      popular: true,
      features: [
        "Live video consultation",
        "Personalized learning plan",
        "Career guidance and advice",
        "Resource recommendations",
        "Ongoing email support",
        "Recording of session"
      ]
    },
    {
      title: "Project Consultation",
      description: "Comprehensive support for your data science or research project",
      price: "$300",
      duration: "session",
      icon: <MessageSquare size={28} />,
      features: [
        "2-hour intensive session",
        "Project planning and design",
        "Statistical method selection",
        "Implementation guidance",
        "Code review and optimization",
        "Presentation preparation"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Research Scientist",
      content: "The statistical consultation helped me identify critical flaws in my analysis approach. The expert guidance saved months of work and significantly improved my research quality.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Michael Chen",
      role: "Data Analyst",
      content: "The one-on-one mentoring session was incredibly valuable. I received personalized advice that directly addressed my career goals and learning needs.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "PhD Student",
      content: "The project consultation was exactly what I needed for my dissertation. The expert helped me choose the right statistical methods and provided clear implementation guidance.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consultation request submitted:', formData);
    alert('Your consultation request has been submitted. We will contact you within 24 hours to schedule your session!');
    setFormData({
      name: '',
      email: '',
      service: '',
      message: '',
      preferredDate: '',
      preferredTime: ''
    });
  };

  const stats = [
    { icon: <Users size={24} />, value: "500+", label: "Consultations Completed" },
    { icon: <Star size={24} />, value: "4.9/5", label: "Average Rating" },
    { icon: <Clock size={24} />, value: "24hrs", label: "Response Time" },
    { icon: <CheckCircle size={24} />, value: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Expert Statistical Consultation
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get Expert
            <span className="block text-blue-400">Statistical Guidance</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Work directly with experienced statisticians and data scientists to solve your analytical challenges, 
            validate your methods, and accelerate your learning journey.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3 backdrop-blur-sm">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Consultation Service
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the consultation type that best fits your needs and get personalized expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Book Your Consultation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you within 24 hours to schedule your session.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="service"
                    id="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                  >
                    <option value="">Select a service...</option>
                    <option value="analysis-review">Statistical Analysis Review ($150/hour)</option>
                    <option value="mentoring">One-on-One Mentoring ($200/hour)</option>
                    <option value="project-consultation">Project Consultation ($300/session)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      id="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Time
                    </label>
                    <select
                      name="preferredTime"
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                    >
                      <option value="">Select time...</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tell us about your needs *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 resize-none"
                    placeholder="Describe your statistical challenge, project details, or what you'd like to achieve from the consultation..."
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                >
                  Book Consultation
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hear from professionals who have benefited from our expert consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;