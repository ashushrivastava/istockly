// frontend/src/components/ui/card-hover-effect.jsx
// Hover effect for cards

import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const HoverEffect = ({ items, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {items.map((item, idx) => (
        <Card key={idx} {...item} />
      ))}
    </div>
  );
};

const Card = ({ title, description, icon: Icon, link }) => {
  return (
    <a href={link} className="block group">
      <motion.div
        whileHover={{ y: -5 }}
        className="relative h-full p-6 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-yellow-500/50 transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
              <Icon className="w-6 h-6 text-yellow-500" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </motion.div>
    </a>
  );
};