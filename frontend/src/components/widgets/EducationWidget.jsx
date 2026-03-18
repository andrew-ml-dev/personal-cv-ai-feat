import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'

export default function EducationWidget({ payload = {} }) {
  // Added location and achievements for extra resume flexibility
  const {
    institution = 'AGH University of Krakow',
    degree = 'Master of Science (MSc)',
    focus = 'Mechatronics, Robotics & Automation',
    period = '2014 – 2019',
    location = 'Krakow, Poland',
    summary = 'Specialized in real-time control systems, computer vision algorithms, and embedded C++ programming for robotic manipulators.',
    achievements = [],
  } = payload

  return (
    <div
      className="group relative overflow-hidden rounded-2xl rounded-tl-sm p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* 🔮 Decorative glow on hover (frame effect) */}
      <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-zinc-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors duration-300">
            <GraduationCap size={16} strokeWidth={2.5} />
          </div>
          <h3 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase">
            Education
          </h3>
        </div>
        {/* Date Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-mono transition-colors group-hover:border-white/20">
          <Calendar size={10} />
          <span>{period}</span>
        </div>
      </div>

      {/* --- BODY --- */}
      <div className="space-y-4">
        <div>
          {/* Degree takes center stage; hover adds a gradient treatment */}
          <h4 className="text-lg font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
            {degree}
          </h4>
          
          {/* University as a colored subtitle */}
          <p className="text-sm font-medium text-cyan-400/90 mb-2.5">
            {institution}
          </p>

          {/* Meta information (focus and location) */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Award size={12} className="text-zinc-500" />
              <span>{focus}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-zinc-500" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* --- SUMMARY (Separated by a thin line) --- */}
        {summary && (
          <p className="text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4 mt-4 transition-colors group-hover:text-zinc-300">
            {summary}
          </p>
        )}

        {/* --- TAGS / ACHIEVEMENTS --- */}
        {achievements && achievements.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {achievements.map((ach, i) => (
              <span
                key={i}
                className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-zinc-300 bg-black/20 border border-white/5 rounded-md transition-colors group-hover:border-white/10"
              >
                {ach}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}