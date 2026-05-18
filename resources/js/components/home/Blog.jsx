import { Zap } from "lucide-react";
import BlogCard from "./BlogCard";

const posts = [
  {
    title: "Off-Grid vs Hybrid vs On-Grid: Which System Is Right for You?",
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600",
  },
  {
    title: "Flexible Financing Options for Solar in Pakistan",
    img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600",
  },
  {
    title: "700+ Installations: Sectors We Serve Across Pakistan",
    img: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=600",
  },
];

export default function Blog() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <span className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-600">
            Solarkon Blog
          </span>
          <h2 className="text-4xl font-bold mt-6 mb-2 text-dark-bg">
            Green Insights, Real Impact
          </h2>
          <p className="text-gray-600">
            Explore how <strong className="text-dark-bg">Solarkon</strong>{" "}
            transforms industries, communities, and the planet. One story at a
            time.
          </p>
        </div>
        <button className="bg-primary text-dark-bg px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-primary-hover transition shrink-0">
          Read More <Zap className="w-4 h-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.title} {...post} />
        ))}
      </div>
    </section>
  );
}
