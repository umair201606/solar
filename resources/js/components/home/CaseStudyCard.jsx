export default function CaseStudyCard({ subtitle, title, loc, img }) {
  return (
    <div className="bg-dark-card text-white p-4 rounded-3xl flex gap-4 items-center">
      <div className="flex-1 pl-4">
        <p className="text-primary text-xs font-bold mb-2">{subtitle}</p>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <button className="bg-primary text-dark-bg w-full py-2 rounded-full text-sm font-bold hover:bg-primary-hover">
          Read Detail
        </button>
        <p className="text-gray-400 text-xs mt-3 text-center">{loc}</p>
      </div>
      <img
        src={img}
        className="w-1/2 h-40 object-cover rounded-2xl"
        alt={title}
      />
    </div>
  );
}
