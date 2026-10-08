import { Wallet } from 'lucide-react';

export default function PayoutClassic({ config, brandColors }: { config: any, brandColors: string[] }) {
    const rates = config.rates || { top3: 900, tod3: 120, top2: 90, bottom2: 90, run_top: 3.2, run_bottom: 4.2 };
    const primaryColor = brandColors && brandColors.length > 0 ? brandColors[brandColors.length - 1] : '#D4AF37';

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group w-full flex flex-col justify-center">
            <div className="absolute -top-10 -right-10 w-40 h-40 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full pointer-events-none" style={{ backgroundColor: primaryColor }} />
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/5 shadow-inner backdrop-blur-md">
                    <Wallet size={24} style={{ color: primaryColor }} />
                </div>
                <div>
                    <h3 className="text-white font-black text-xl tracking-wide leading-tight drop-shadow-md">อัตราจ่ายสูงสุด</h3>
                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mt-0.5">VIP Payout Rates</p>
                </div>
            </div>
            <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors shadow-inner">
                    <span className="text-slate-300 font-bold text-sm">3 ตัวบน</span>
                    <div className="text-2xl font-black font-mono text-white leading-none">{rates.top3} <span className="text-xs text-white/50">฿</span></div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors shadow-inner">
                    <span className="text-slate-300 font-bold text-sm">3 ตัวโต๊ด</span>
                    <div className="text-2xl font-black font-mono text-white leading-none">{rates.tod3 ?? 120} <span className="text-xs text-white/50">฿</span></div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors shadow-inner">
                    <span className="text-slate-300 font-bold text-sm">2 ตัวบน/ล่าง</span>
                    <div className="text-2xl font-black font-mono text-white leading-none">{rates.top2 ?? 90} <span className="text-xs text-white/50">฿</span></div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors shadow-inner">
                    <span className="text-slate-300 font-bold text-sm">วิ่งบน/ล่าง</span>
                    <div className="text-xl font-black font-mono text-white leading-none">{rates.run_top} <span className="text-white/20 font-sans mx-1">/</span> {rates.run_bottom}</div>
                </div>
            </div>
        </div>
    );
}