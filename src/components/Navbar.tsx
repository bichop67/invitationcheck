import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Sparkles, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isAdminPage) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-black/10 to-black/5 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full shadow-lg">
                  <Users className="h-6 w-6 text-white transform group-hover:scale-110 transition-transform duration-200" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                      rotate: 360
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                </div>
              </div>
              <motion.span 
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 hidden sm:block"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                SoiréesEntrepreneurs
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div 
            className="hidden sm:flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/evenements" 
              className="relative overflow-hidden group text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <span className="relative z-10 group-hover:text-gray-600 transition-colors duration-200">
                Voir les événements
              </span>
              <motion.div
                className="absolute inset-0 bg-gray-100 rounded-lg -z-0"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="py-2 space-y-1">
                <Link
                  to="/evenements"
                  className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Voir les événements
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}