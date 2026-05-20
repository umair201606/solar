import { Zap } from "lucide-react";
import BlogCard from "./BlogCard";
import Reveal from "../shared/Reveal";

const posts = [
  {
    title: "Off-Grid vs Hybrid vs On-Grid: Which System Is Right for You?",
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600",
    category: "Solar Guide",
    date: "May 20, 2026",
    readTime: "5 min read",
  },
  {
    title: "Flexible Financing Options for Solar in Pakistan",
    img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600",
    category: "Finance Tips",
    date: "May 18, 2026",
    readTime: "4 min read",
  },
  {
    title: "700+ Installations: Sectors We Serve Across Pakistan",
    img: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=600",
    category: "Sectors Served",
    date: "May 15, 2026",
    readTime: "6 min read",
  },
];

export default function Blog() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <span className="border border-gray-300 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-gray-500 uppercase">
            Solarkon Blog
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-6 mb-4 text-dark-bg tracking-tight leading-tight">
            Green Insights, Real Impact
          </h2>
          <p className="text-gray-600 max-w-xl font-light text-base md:text-lg">
            Explore how <strong className="text-dark-bg">Solarkon</strong>{" "}
            transforms industries, communities, and the planet. One story at a
            time.
          </p>
        </div>
        <button className="bg-primary text-dark-bg px-7 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:text-dark-bg hover:scale-105 transition shadow-lg shrink-0">
          Read More <Zap className="w-4 h-4 fill-current" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <Reveal key={post.title} animation="fade-up" delay={`${idx * 150}ms`}>
            <BlogCard {...post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
