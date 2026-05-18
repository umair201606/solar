export default function FeatureItem({ num, title, desc }) {
  return (
    <div className="bg-dark-card text-white p-5 rounded-2xl flex gap-4 items-start relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-12 h-full bg-primary text-dark-bg font-bold text-xl flex items-center justify-center group-hover:w-14 transition-all">
        {num}
      </div>
      <div className="pl-14">
        <h4 className="font-bold text-primary mb-1">{title}</h4>
        <p className="text-sm text-gray-300">{desc}</p>
      </div>
    </div>
  );
}
