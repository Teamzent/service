import { Wallet } from 'lucide-react';

export default function PayoutGrid({ config, brandColors }: { config: any, brandColors: string[] }) {
    const rates = config.rates || { top3: 900, tod3: 120, top2: 90, bottom2: 90, run_top: 3.2, run_bottom: 4.2 };
    const primaryColor = brandColors && brandColors.length > 0 ? brandColors[brandColors.length - 1] : '#D4AF37';

    return (
        <div className="bg-[#0B1120] border-2 rounded-3xl p-5 shadow-2xl relative w-full" style={{ borderColor: `${primaryColor}40` }}>
            <div className="flex justify-center mb-5">
                <div className="bg-black/50 border rounded-full px-5 py-1.5 flex items-center gap-2" style={{ borderColor: primaryColor }}>
                    <Wallet size={16} style={{ color: primaryColor }} />
                    <span className="text-white font-bold text-sm tracking-widest">VIP RATES</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 bg-gradient-to-br from-white/10 to-transparent p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-slate-400 text-xs font-bold mb-1">3 ตัวบน</div>
                    <div className="text-3xl font-black text-white">{rates.top3}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-slate-400 text-[10px] font-bold mb-1">3 ตัวโต๊ด</div>
                    <div className="text-xl font-black text-white">{rates.tod3 ?? 120}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                    <div className="text-slate-400 text-[10px] font-bold mb-1">2 ตัวบน/ล่าง</div>
                    <div className="text-xl font-black text-white">{rates.top2 ?? 90}</div>
                </div>
                <div className="col-span-2 bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center px-6">
                    <div className="text-slate-400 text-xs font-bold">วิ่งบน / ล่าง</div>
                    <div className="text-lg font-black text-white">{rates.run_top} / {rates.run_bottom}</div>
                </div>
            </div>
        </div>
    );
}