import { Wallet } from 'lucide-react';

export default function PayoutCascade({ config, brandColors }: { config: any, brandColors: string[] }) {
    const rates = config.rates || { top3: 900, tod3: 120, top2: 90, bottom2: 90, run_top: 3.2, run_bottom: 4.2 };
    const primaryColor = brandColors && brandColors.length > 0 ? brandColors[brandColors.length - 1] : '#D4AF37';

    return (
        <div className="relative w-full py-6 flex flex-col justify-center">
            {/* แสงวงกว้างด้านหลัง */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[80px] opacity-20 rounded-full pointer-events-none" style={{ backgroundColor: primaryColor }} />

            {/* หัวข้อ */}
            <div className="relative z-[5] bg-black/60 backdrop-blur-md border-l-4 rounded-r-xl p-3 shadow-xl mb-4 self-start flex items-center gap-3" style={{ borderColor: primaryColor }}>
                <Wallet size={18} style={{ color: primaryColor }} />
                <h3 className="text-white font-black text-sm md:text-base tracking-widest uppercase">อัตราจ่ายสูงสุด</h3>
            </div>

            {/* การ์ด 1: 3 ตัวบน (ใหญ่สุดและเด่นสุด) */}
            <div className="relative z-[4] bg-white/10 backdrop-blur-xl border-t border-l border-white/20 rounded-2xl p-4 md:p-5 shadow-2xl ml-0 sm:ml-4 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-2 w-[85%] sm:w-[80%] group overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-white/90 font-black text-sm md:text-base drop-shadow-md">3 ตัวบน</span>
                    <div className="text-3xl md:text-4xl font-black font-mono text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{rates.top3} <span className="text-sm">฿</span></div>
                 </div>
            </div>

            {/* การ์ด 2: 3 โต๊ด (ซ้อนเฉียงลงมา) */}
            <div className="relative z-[3] bg-white/5 backdrop-blur-xl border-t border-l border-white/10 rounded-2xl p-3 md:p-4 shadow-2xl ml-6 sm:ml-12 -mt-3 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 w-[85%] sm:w-[80%]">
                 <div className="flex justify-between items-center">
                    <span className="text-white/70 font-bold text-xs md:text-sm">3 ตัวโต๊ด</span>
                    <div className="text-xl md:text-2xl font-black font-mono text-white/90">{rates.tod3 ?? 120} <span className="text-xs">฿</span></div>
                 </div>
            </div>

            {/* การ์ด 3: 2 ตัวบน/ล่าง (ซ้อนเฉียงลงมาอีก) */}
            <div className="relative z-[2] bg-white/5 backdrop-blur-xl border-t border-l border-white/10 rounded-2xl p-3 md:p-4 shadow-2xl ml-12 sm:ml-20 -mt-3 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 w-[85%] sm:w-[80%]">
                 <div className="flex justify-between items-center">
                    <span className="text-white/70 font-bold text-xs md:text-sm">2 ตัวบน / ล่าง</span>
                    <div className="text-xl md:text-2xl font-black font-mono text-white/90">{rates.top2 ?? 90} <span className="text-xs">฿</span></div>
                 </div>
            </div>

            {/* การ์ด 4: วิ่ง */}
            <div className="relative z-[1] bg-white/5 backdrop-blur-xl border-t border-l border-white/10 rounded-2xl p-3 md:p-4 shadow-2xl ml-16 sm:ml-28 -mt-3 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1 w-[85%] sm:w-[80%]">
                 <div className="flex justify-between items-center">
                    <span className="text-white/70 font-bold text-xs md:text-sm">วิ่งบน / ล่าง</span>
                    <div className="text-lg md:text-xl font-black font-mono text-white/80">{rates.run_top} <span className="opacity-50">/</span> {rates.run_bottom}</div>
                 </div>
            </div>
        </div>
    );
}