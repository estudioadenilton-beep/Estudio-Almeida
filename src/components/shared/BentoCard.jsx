import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const BentoCard = ({ 
  title, 
  subtitle, 
  image, 
  colSpan = 'md:col-span-4', 
  height = 'h-[400px]', 
  delay = 0,
  showPlay = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className={`${colSpan} group relative overflow-hidden rounded cursor-pointer ${height} bento-card`}
    >
      <img 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        src={image} 
        alt={title}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8 opacity-90 transition-opacity group-hover:opacity-100">
        <span className="text-primary text-[0.6875rem] font-label font-bold tracking-widest mb-2 uppercase">
          {subtitle}
        </span>
        <h3 className="text-xl font-serif font-bold text-white mb-4">
          {title}
        </h3>
        
        {showPlay && (
          <div className="w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
            <Play size={20} fill="currentColor" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BentoCard;
