export default function BlogCard({ title, category, date, readTime, idx }) {
  return (
    <article className="relative w-full group drop-shadow-sm hover:drop-shadow-md transition-all min-h-[180px]">
      <div className="absolute top-0 right-0 w-[calc(100%-70px)] h-full bg-[#041a12] rounded-[1.5rem] transition-colors group-hover:bg-[#0a261a]"></div>

      <div className="absolute bottom-0 left-0 w-full h-[calc(100%-70px)] bg-[#041a12] rounded-[1.5rem] transition-colors group-hover:bg-[#0a261a]"></div>

      <div className="absolute bottom-0 right-0 w-[calc(100%-50px)] h-[calc(100%-70px)] bg-[#041a12] rounded-br-[1.5rem] transition-colors group-hover:bg-[#0a261a]"></div>

      <svg className="absolute top-[50px] left-[51px] w-[20px] h-[20px] text-[#041a12] group-hover:text-[#0a261a] transition-colors z-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M 24 0 C 24 13.25 13.25 24 0 24 L 24 24 Z" />
      </svg>

      <div className="absolute top-[10px] left-[10px] w-[44px] h-[44px] bg-[#d4ff00] rounded-[1rem] flex items-center justify-center font-black text-[1.2rem] text-[#041a12] z-20">
        {`0${idx + 1}`}
      </div>

      <div className="relative z-10 pl-[70px] pr-6 py-6 min-h-[150px] flex flex-col justify-center">
        <span className="text-[#d4ff00] text-[10px] font-bold uppercase tracking-widest mb-1.5">{category}</span>
        <h3 className="text-white font-bold text-[1rem] mb-2 leading-snug line-clamp-2">{title}</h3>
        <p className="text-[12px] font-light text-gray-400 leading-relaxed">{readTime} &middot; {date}</p>
      </div>
    </article>
  );
}
