import { FileText, Download, Eye, CheckCircle } from 'lucide-react'

export default function ResumeWidget({ payload = {} }) {
  const { 
    fileName = 'Resume_Andrei.pdf', 
    fileSize = '1.2 MB', 
    downloadUrl = '#' 
  } = payload

  return (
    <div
      className="rounded-2xl rounded-tl-sm p-6 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-colors duration-700" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        
        {/* --- Fresh CSS preview instead of an icon --- */}
        <div className="relative w-28 h-40 bg-[#f4f4f5] rounded-sm shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500 flex-shrink-0 border border-white/10">
          {/* Header Area */}
          <div className="p-2 border-b-[0.5px] border-zinc-200 bg-white">
            <div className="w-7 h-7 bg-zinc-200 rounded-full mb-1.5 shadow-inner" /> 
            <div className="w-14 h-2 bg-zinc-800 rounded-full mb-1" /> 
            <div className="w-10 h-1 bg-cyan-500 rounded-full" /> 
          </div>
          
          {/* Body Content */}
          <div className="p-2 flex gap-2 bg-white h-full">
            {/* Left Sidebar */}
            <div className="w-1/3 space-y-1.5 pt-1">
               <div className="w-full h-0.5 bg-zinc-200 rounded-full" />
               <div className="w-full h-0.5 bg-zinc-100 rounded-full" />
               <div className="w-4/5 h-0.5 bg-zinc-100 rounded-full" />
               <div className="pt-2">
                 <div className="w-full h-0.5 bg-cyan-100 rounded-full" />
               </div>
            </div>
            {/* Main Content Area */}
            <div className="flex-1 space-y-2 pt-1">
               <div className="space-y-1">
                 <div className="w-full h-1 bg-zinc-200 rounded-full" />
                 <div className="w-full h-0.5 bg-zinc-100 rounded-full" />
                 <div className="w-5/6 h-0.5 bg-zinc-100 rounded-full" />
               </div>
               <div className="space-y-1 pt-1">
                 <div className="w-full h-1 bg-zinc-200 rounded-full" />
                 <div className="w-full h-0.5 bg-zinc-100 rounded-full" />
                 <div className="w-4/6 h-0.5 bg-zinc-100 rounded-full" />
               </div>
            </div>
          </div>
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        {/* --- End of preview --- */}

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
            Curriculum Vitae
          </h3>
          <p className="text-xs text-zinc-400 mb-4 font-mono">
            {fileName} • {fileSize}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <a
              href={downloadUrl}
              download
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              <Download size={14} />
              Download PDF
            </a>

            <button 
              onClick={() => window.open(downloadUrl, '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium rounded-xl transition-all"
            >
              <Eye size={14} />
              View
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-y-2">
         {[
           'Tech Stack Summary', 
           'Project Deep-dives', 
           'Education Credentials', 
           'Contact Details'
         ].map((item, i) => (
           <div key={i} className="flex items-center gap-2 text-[10px] text-zinc-500">
              <CheckCircle size={10} className="text-cyan-500/60" />
              {item}
           </div>
         ))}
      </div>
    </div>
  )
}