import { ArrowRight, Clock, Calendar } from "lucide-react";

export default function BlogCard({ title, img, category, date, readTime }) {
  return (
    <article className="group bg-gradient-to-b from-dark-card to-dark-bg/85 text-white rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.25)] border border-white/5 hover:border-primary/20 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(212,255,0,0.06)] transition-all duration-500 flex flex-col h-full">
      
      {/* Zoomable Image Container */}
      <div className="relative w-full h-52 overflow-hidden">
        {/* Floating Category Badge */}
        <span className="absolute top-4 left-4 z-10 bg-primary text-dark-bg font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
          {category}
        </span>
        
        <img 
          src={img} 
          className="w-full h-full object-cover transform group-hover:scale-[1.04] transition-transform duration-700 ease-out" 
          alt={title} 
        />
        
        {/* Soft overlay gradient on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Card Contents */}
      <div className="p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs font-light text-gray-400 mb-3.5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              {date}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary/70" />
              {readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-extrabold mb-3 leading-snug tracking-tight text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          {/* Snippet Description */}
          <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
            Explore inside insights on solar setups, system financing, and community impact from Pakistan's sustainable energy pioneers.
          </p>
        </div>

        {/* Clean Interactive Arrow Link */}
        <div className="inline-flex items-center gap-1.5 text-primary text-sm font-bold group/btn cursor-pointer">
          Read Article
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </article>
  );
}
