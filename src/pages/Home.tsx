import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-4 sm:px-6 pt-10 sm:pt-14 lg:px-8">
        <motion.div 
          className="mx-auto max-w-3xl py-20 sm:py-32 lg:py-40"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <motion.div 
            className="text-center px-4 sm:px-6"
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-black mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Rencontrez. Échangez. Innovez.
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 mb-8 sm:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Rejoignez nos soirées entrepreneuriales exclusives et développez votre réseau professionnel dans un cadre privilégié.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="px-4 sm:px-0"
            >
              <Link
                to="/evenements"
                className="relative inline-flex items-center w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-black rounded-lg group hover:bg-gray-900 transition-colors duration-200"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent rounded-lg"
                  animate={{
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <Calendar className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">Découvrir nos événements</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="py-16 sm:py-24 lg:py-32 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl lg:text-center px-4 sm:px-6"
            variants={fadeInUp}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black">
              Des événements conçus pour les entrepreneurs
            </h2>
          </motion.div>
          <motion.div 
            className="mx-auto mt-12 sm:mt-16 lg:mt-20"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <dl className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "Networking Ciblé",
                  description: "Rencontrez des entrepreneurs qui partagent vos ambitions et vos défis dans un cadre professionnel."
                },
                {
                  icon: Calendar,
                  title: "Événements Premium",
                  description: "Des soirées thématiques organisées dans des lieux sélectionnés pour leur excellence."
                },
                {
                  icon: Trophy,
                  title: "Opportunités Business",
                  description: "Développez votre réseau et découvrez de nouvelles opportunités de collaboration."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="relative bg-white p-6 sm:p-8 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <dt className="text-lg font-semibold leading-7 text-black mb-4">
                    <motion.div 
                      className="flex items-center mb-4"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <feature.icon className="h-6 w-6 text-black" />
                      <span className="ml-3">{feature.title}</span>
                    </motion.div>
                  </dt>
                  <dd className="text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}