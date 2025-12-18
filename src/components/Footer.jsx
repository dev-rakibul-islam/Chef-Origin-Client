import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Chef Origin"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-2xl font-bold font-serif text-gray-900">
                Chef Origin
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Connecting you with local home chefs for authentic, delicious
              meals delivered straight to your doorstep. Taste the difference of
              homemade.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary-accent hover:bg-primary-accent hover:text-white transition-all duration-300"
              >
                <FiFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary-accent hover:bg-primary-accent hover:text-white transition-all duration-300"
              >
                <FiTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary-accent hover:bg-primary-accent hover:text-white transition-all duration-300"
              >
                <FiInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-primary-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/meals"
                  className="text-gray-600 hover:text-primary-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
                  Browse Meals
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-primary-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-primary-accent transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-accent"></span>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <FiMapPin className="text-primary-accent text-xl mt-1 shrink-0" />
                <span>123 Culinary Avenue, Foodie District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <FiPhone className="text-primary-accent text-xl shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <FiMail className="text-primary-accent text-xl shrink-0" />
                <span>support@cheforigin.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to get special offers, free giveaways, and
              once-in-a-lifetime deals.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent transition-all"
              />
              <button className="absolute right-2 top-2 p-2 bg-primary-accent text-white rounded-md hover:bg-orange-700 transition-colors">
                <FiSend />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Chef Origin. All rights reserved.
          </p>
          <span>
            Develop by{" "}
            <a
              href="https://rakib-dev-portfolio.netlify.app/"
              className="hover:text-primary-accent transition-colors"
            >
              Rakibul Islam
            </a>
          </span>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-accent transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
