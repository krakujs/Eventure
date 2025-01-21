import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const handleLogin = () => {
    console.log('Initiating login process');
    window.location.href = 'http://localhost:8080/oauth2/authorization/okta';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-400 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Eventure</h1>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-800 leading-tight">
          Discover and Create <br className="hidden md:block" /> Unforgettable Events
        </h2>
        <p className="text-xl mb-10 text-gray-600 max-w-3xl">
          Connect, celebrate, and make memories with Eventure. Your all-in-one platform for seamless event management and discovery.
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white text-lg px-12 py-4 rounded-full hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Get Started for Free
        </button>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Eventure?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon="🎉"
              title="Easy Event Creation"
              description="Intuitive tools to create and manage events with just a few clicks. Customize every detail to make your event unique."
            />
            <FeatureCard
              icon="🤝"
              title="Seamless Collaboration"
              description="Invite team members, assign roles, and coordinate effortlessly. Keep everyone on the same page, always."
            />
            <FeatureCard
              icon="📊"
              title="Powerful Analytics"
              description="Gain valuable insights into your events' performance. Make data-driven decisions to improve future experiences."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Start Your Event Journey?</h3>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of event organizers who trust Eventure to bring their visions to life. Start creating unforgettable experiences today.
          </p>
          <button
            onClick={handleLogin}
            className="bg-white text-blue-600 text-lg px-12 py-4 rounded-full hover:bg-blue-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Sign Up Now - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">About Eventure</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300">Our Story</a></li>
                <li><a href="#" className="hover:text-blue-300">Careers</a></li>
                <li><a href="#" className="hover:text-blue-300">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-300">Blog</a></li>
                <li><a href="#" className="hover:text-blue-300">Developers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300">Twitter</a></li>
                <li><a href="#" className="hover:text-blue-300">Facebook</a></li>
                <li><a href="#" className="hover:text-blue-300">Instagram</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-300">Cookie Settings</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 Eventure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
    <div className="text-5xl mb-6">{icon}</div>
    <h4 className="text-xl font-bold mb-4 text-gray-800">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Landing;
