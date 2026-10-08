import { Trophy } from 'lucide-react';

export default function LottoCardTicket({ lotto, brandColors }: { lotto: any, brandColors: string[] }) {
    const primaryColor = brandColors && brandColors.length > 0 ? brandColors[brandColors.length - 1] : '#D4AF37';

    return (
        <div className="relative bg-[#ffffff] rounded-xl flex shadow-lg hover:-translate-y-1 transition-transform duration-300 overflow-hidden group">
            {/* รอยบากตรงกลางตั๋ว (ซ้าย-ขวา) */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#050810] rounded-full z-10 shadow-inner"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#050810] rounded-full z-10 shadow-inner"></div>

            {/* ฝั่งซ้าย: โลโก้และชื่อ (ตั๋วส่วนต้น) */}
            <div className="w-[45%] p-4 bg-slate-50 border-r-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm mb-2 border border-slate-100 overflow-hidden">
                    {lotto.img_url ? <img src={lotto.img_url} className="w-full h-full object-cover" /> : <Trophy size={20} style={{ color: primaryColor }} />}
                </div>
                <h3 className="font-black text-sm text-slate-800 leading-tight">{lotto.name}</h3>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                    {new Date(lotto.announced_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute:'2-digit' })} น.
                </p>
            </div>

            {/* ฝั่งขวา: ผลรางวัล (ตั๋วส่วนหาง) */}
            <div className="w-[55%] p-4 flex flex-col justify-center bg-white relative">
                {/* ลายน้ำด้านหลัง */}
                <Trophy size={60} className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none transform -rotate-12" style={{ color: primaryColor }} />
                
                <div className="space-y-2">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 ตัวบน</span>
                        <span className="text-2xl font-black font-mono text-slate-800 leading-none">{lotto.top_3 || '-'}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2 ตัวล่าง</span>
                        <span className="text-xl font-black font-mono text-slate-600 leading-none">{lotto.bottom_2 || '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}