export default function BlogCard({ title, img }) {
  return (
    <div className="bg-dark-card text-white rounded-3xl overflow-hidden shadow-lg border border-gray-800 flex flex-col">
      <img src={img} className="w-full h-48 object-cover" alt={title} />
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-gray-400 text-sm mb-6">
            Insights on solar energy, financing, and sustainability from
            Pakistan&apos;s leading solar provider.
          </p>
        </div>
        <button className="bg-primary text-dark-bg w-max px-6 py-2 rounded-full font-bold text-sm hover:bg-primary-hover">
          Learn More
        </button>
      </div>
    </div>
  );
}
