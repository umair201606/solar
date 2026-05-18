export default function ServiceCard({ title, desc, icon: Icon, dark }) {
  return (
    <div
      className={`flex min-h-[220px] flex-col justify-between rounded-3xl p-8 ${
        dark ? "bg-dark-card text-white" : "bg-primary text-dark-bg"
      }`}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-current">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-bold leading-tight">{title}</h3>
        <p
          className={`text-xs leading-relaxed ${
            dark ? "text-gray-300" : "font-medium text-dark-bg"
          }`}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
