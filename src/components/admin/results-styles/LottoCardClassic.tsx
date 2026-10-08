import { Trophy } from 'lucide-react';

export default function LottoCardClassic({ lotto, config, brandColors }: { lotto: any, config: any, brandColors: string[] }) {
    // เช็คสไตล์ว่าแอดมินเลือกแบบ ใส (Glass) หรือ ทึบ (Solid)
    const isGlass = config?.theme === 'glass';
    // ดึงสีหลักของแบรนด์มาใช้ตกแต่ง (ถ้าไม่มีใช้สีทอง)
    const primaryColor = brandColors && brandColors.length > 0 ? brandColors[brandColors.length - 1] : '#D4AF37';

    return (
        <div className={`relative overflow-hidden rounded-3xl p-5 transition-all duration-500 hover:-translate-y-2 group ${
            isGlass 
            ? 'bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
            : 'bg-white border border-slate-100 shadow-xl'
        }`}>
            {/* 🔴 เอฟเฟกต์แสงเรืองแสงด้านหลัง (Glow) */}
            {isGlass && (
                <div 
                    className="absolute -top-20 -right-20 w-40 h-40 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                />
            )}

            {/* Header: รูปภาพและชื่อหวย */}
            <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner ${isGlass ? 'bg-white/10' : 'bg-slate-50 border border-slate-100'}`}>
                    {lotto.img_url ? (
                        <img src={lotto.img_url} className="w-full h-full object-cover" alt={lotto.name} />
                    ) : (
                        <Trophy size={24} style={{ color: primaryColor }} />
                    )}
                </div>
                <div>
                    <h3 className={`font-black text-lg ${isGlass ? 'text-white' : 'text-slate-800'}`}>{lotto.name}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isGlass ? 'text-white/50' : 'text-slate-400'}`}>
                        ประกาศผล: {new Date(lotto.announced_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute:'2-digit' })} น.
                    </p>
                </div>
            </div>

            {/* Body: ผลรางวัล 3 บน 2 ล่าง */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className={`text-center p-3 sm:p-4 rounded-2xl ${isGlass ? 'bg-black/40 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isGlass ? 'text-white/40' : 'text-slate-400'}`}>3 ตัวบน</div>
                    <div className={`text-2xl sm:text-3xl font-black font-mono tracking-widest ${isGlass ? 'text-white' : 'text-slate-800'}`}>
                        {lotto.top_3 || '-'}
                    </div>
                </div>
                <div className={`text-center p-3 sm:p-4 rounded-2xl ${isGlass ? 'bg-black/40 border border-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isGlass ? 'text-white/40' : 'text-slate-400'}`}>2 ตัวล่าง</div>
                    <div className={`text-2xl sm:text-3xl font-black font-mono tracking-widest ${isGlass ? 'text-white' : 'text-slate-800'}`}>
                        {lotto.bottom_2 || '-'}
                    </div>
                </div>
            </div>
        </div>
    );
}