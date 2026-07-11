interface SectionBannerProps {
  title: string;
  index: number;
}

const SECTION_COLORS = [
  { bg: 'bg-duo-green', border: 'border-duo-green-dark', text: 'text-white' },
  { bg: 'bg-duo-blue', border: 'border-duo-blue-dark', text: 'text-white' },
  { bg: 'bg-duo-orange', border: 'border-duo-orange-dark', text: 'text-white' },
  { bg: 'bg-duo-purple', border: 'border-duo-purple-dark', text: 'text-white' },
];

export default function SectionBanner({ title, index }: SectionBannerProps) {
  const color = SECTION_COLORS[index % SECTION_COLORS.length];

  return (
    <div
      className={`relative w-full rounded-3xl px-6 py-4 flex items-center gap-3 border-b-4 shadow-card animate-fade-in-up ${color.bg} ${color.border} ${color.text}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Decorative dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2 opacity-30">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white" />
        ))}
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80">
          Section {index + 1}
        </span>
        <span className="text-xl font-extrabold leading-tight">{title}</span>
      </div>

      <div className="ml-auto mr-12">
        <div className="bg-white/20 rounded-2xl px-3 py-1.5 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">Guide ›</span>
        </div>
      </div>
    </div>
  );
}
