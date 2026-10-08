
export default function LottoCardMinimal({ lotto, brandColors }: { lotto: any, brandColors: string[] }) {
    const primaryColor = brandColors && brandColors.length > 0 ? brandColors[brandColors.length - 1] : '#D4AF37';

    return (
        <div className="bg-transparent border border-white/10 rounded-[2rem] p-5 hover:bg-white/5 transition-all duration-300 group flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-2 h-12 rounded-full" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}80` }}></div>
                <div>
                    <h3 className="font-black text-white text-lg">{lotto.name}</h3>
                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">{new Date(lotto.announced_at).toLocaleDateString('th-TH')} • {new Date(lotto.announced_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute:'2-digit' })}</p>
                </div>
            </div>
            <div className="flex gap-4 text-center">
                <div>
                    <div className="text-[9px] text-white/40 uppercase font-bold tracking-widest">3 บน</div>
                    <div className="text-2xl font-black text-white font-mono">{lotto.top_3 || '-'}</div>
                </div>
                <div className="w-px h-10 bg-white/10 self-center"></div>
                <div>
                    <div className="text-[9px] text-white/40 uppercase font-bold tracking-widest">2 ล่าง</div>
                    <div className="text-2xl font-black text-white/80 font-mono">{lotto.bottom_2 || '-'}</div>
                </div>
            </div>
        </div>
    );
}