import { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Monitor, Tablet, Smartphone, MousePointer2, Move } from 'lucide-react';
import LoginBoxUI from './LoginBoxUI';
import LottoCardWrapper from '../../../components/admin/LottoCardWrapper';
import PayoutRateBox from '../../../components/admin/PayoutRateBox';

const hexToRgba = (hex: string, alpha: number) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
    const r = parseInt(cleanHex.substring(0, 2), 16) || 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ThemeSimulator({ shopData, setShopData }: { shopData: any, setShopData: any }) {
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [scale, setScale] = useState(1);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
    const [heroDragPos, setHeroDragPos] = useState({ x: 0, y: 0 }); 
    const [payoutDragPos, setPayoutDragPos] = useState({ x: 0, y: 0 });

    const previewWrapperRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const draggableNodeRef = useRef<HTMLDivElement>(null);
    const heroNodeRef = useRef<HTMLDivElement>(null);
    const payoutNodeRef = useRef<HTMLDivElement>(null);

    const style = shopData.login_config.box_style;
    const position = shopData.login_config.box_position;

    const hero = shopData.login_config.hero_login || { is_visible: true, Hero_url: '', Hero_position: {x: 50, y: 50}, config: {width: 40, height: 50} };
    const payout = shopData.login_config.payout_config || { is_visible: true, position: {x: 20, y: 65}, config: {width: 25} };
    const mockLottos = [
        { id: '1', name: 'หวยรัฐบาลไทย', top_3: '123', bottom_2: '45', announced_at: new Date().toISOString() },
        { id: '2', name: 'หวยลาวพัฒนา', top_3: '987', bottom_2: '12', announced_at: new Date().toISOString() },
        { id: '3', name: 'หวยฮานอยพิเศษ', top_3: '555', bottom_2: '99', announced_at: new Date().toISOString() },
    ];
    
    const getBaseDims = () => {
        switch (viewMode) {
            case 'mobile': return { width: 390, height: 844, borderRadius: 40 };
            case 'tablet': return { width: 820, height: 1180, borderRadius: 32 };
            default: return { width: 1440, height: 900, borderRadius: 16 };
        }
    };

    useEffect(() => {
        const updateScale = () => {
            if (previewWrapperRef.current) {
                const wrapperW = previewWrapperRef.current.clientWidth;
                const wrapperH = previewWrapperRef.current.clientHeight;
                const dims = getBaseDims();
                const scaleW = (wrapperW * 0.95) / dims.width;
                const scaleH = (wrapperH * 0.95) / dims.height;
                setScale(Math.min(scaleW, scaleH, 1));
            }
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [viewMode]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (previewRef.current && draggableNodeRef.current) {
                const containerW = previewRef.current.clientWidth;
                const containerH = previewRef.current.clientHeight;
                const boxW = draggableNodeRef.current.offsetWidth;
                const boxH = draggableNodeRef.current.offsetHeight;
                const centerX = (position.x * containerW) / 100;
                const centerY = (position.y * containerH) / 100;
                setDragPos({ x: centerX - (boxW / 2), y: centerY - (boxH / 2) });

                if (heroNodeRef.current) {
                    const heroW = heroNodeRef.current.offsetWidth;
                    const heroH = heroNodeRef.current.offsetHeight;
                    const hCenterX = (hero.Hero_position.x * containerW) / 100;
                    const hCenterY = (hero.Hero_position.y * containerH) / 100;
                    setHeroDragPos({ x: hCenterX - (heroW / 2), y: hCenterY - (heroH / 2) });
                }
                if (payoutNodeRef.current) {
                    const payW = payoutNodeRef.current.offsetWidth;
                    const payH = payoutNodeRef.current.offsetHeight;
                    const pCenterX = (payout.position.x * containerW) / 100;
                    const pCenterY = (payout.position.y * containerH) / 100;
                    setPayoutDragPos({ x: pCenterX - (payW / 2), y: pCenterY - (payH / 2) });
                }
            }
        }, 150); 
       return () => clearTimeout(timer);
    }, [viewMode, scale, style.width, style.height, position.x, position.y, hero.Hero_position?.x, hero.Hero_position?.y, hero.config?.width, hero.config?.height, payout.position.x, payout.position.y]);

    const handleDrag = (_e: any, data: any) => setDragPos({ x: data.x, y: data.y });
    const handleHeroDrag = (_e: any, data: any) => setHeroDragPos({ x: data.x, y: data.y });
    const handlePayoutDrag = (_e: any, data: any) => setPayoutDragPos({ x: data.x, y: data.y });

    const handleDragStop = (_e: any, data: any) => {
        if (!previewRef.current || !draggableNodeRef.current) return;
        const containerW = previewRef.current.clientWidth;
        const containerH = previewRef.current.clientHeight;
        const boxW = draggableNodeRef.current.offsetWidth;
        const boxH = draggableNodeRef.current.offsetHeight;

        const centerX = data.x + (boxW / 2);
        const centerY = data.y + (boxH / 2);

        const xPercent = Math.round((centerX / containerW) * 100);
        const yPercent = Math.round((centerY / containerH) * 100);

        setShopData((prev: any) => ({
            ...prev,
            login_config: { ...prev.login_config, box_position: { x: xPercent, y: yPercent } }
        }));
    };
    const handleHeroDragStop = (_e: any, data: any) => {
        if (!previewRef.current || !heroNodeRef.current) return;
        const containerW = previewRef.current.clientWidth;
        const containerH = previewRef.current.clientHeight;
        const boxW = heroNodeRef.current.offsetWidth;
        const boxH = heroNodeRef.current.offsetHeight;

        const centerX = data.x + (boxW / 2);
        const centerY = data.y + (boxH / 2);

        const xPercent = Math.round((centerX / containerW) * 100);
        const yPercent = Math.round((centerY / containerH) * 100);

        setShopData((prev: any) => ({
            ...prev,
            login_config: { ...prev.login_config, hero_login: { ...prev.login_config.hero_login, Hero_position: { x: xPercent, y: yPercent } } }
        }));
    };

    const handlePayoutDragStop = (_e: any, data: any) => {
        if (!previewRef.current || !payoutNodeRef.current) return;
        const containerW = previewRef.current.clientWidth;
        const containerH = previewRef.current.clientHeight;
        const boxW = payoutNodeRef.current.offsetWidth;
        const boxH = payoutNodeRef.current.offsetHeight;

        const centerX = data.x + (boxW / 2);
        const centerY = data.y + (boxH / 2);

        setShopData((prev: any) => ({
            ...prev,
            login_config: { ...prev.login_config, payout_config: { ...prev.login_config.payout_config, position: { x: Math.round((centerX / containerW) * 100), y: Math.round((centerY / containerH) * 100) } } }
        }));
    };

    return (
        <div className="order-1 md:order-2 flex-1 flex flex-col h-[55vh] md:h-full bg-[#050810] relative overflow-hidden">
            <div className="absolute top-2 md:top-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <div className="flex items-center bg-white/10 backdrop-blur-md p-1 md:p-1.5 rounded-full md:rounded-2xl border border-white/20 gap-1 pointer-events-auto scale-90 md:scale-100">
                    <button onClick={() => setViewMode('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'desktop' ? 'bg-white text-slate-900' : 'text-white/70 hover:bg-white/20'}`}><Monitor size={16} /><span className="hidden sm:block">Desktop</span></button>
                    <button onClick={() => setViewMode('tablet')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'tablet' ? 'bg-white text-slate-900' : 'text-white/70 hover:bg-white/20'}`}><Tablet size={16} /><span className="hidden sm:block">Tablet</span></button>
                    <button onClick={() => setViewMode('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'mobile' ? 'bg-white text-slate-900' : 'text-white/70 hover:bg-white/20'}`}><Smartphone size={16} /><span className="hidden sm:block">Mobile</span></button>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 z-50 pointer-events-none hidden md:flex">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white flex items-center gap-2">
                    <MousePointer2 size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">X: {position.x}%, Y: {position.y}%</span>
                </div>
            </div>

            <div ref={previewWrapperRef} className="flex-1 flex items-center justify-center p-0 md:p-4 w-full h-full overflow-hidden">
                <div 
                    ref={previewRef}
                    // 🟢 3. แก้เป็น overflow-y-auto ให้เลื่อนเมาส์ลงได้
                    className={`relative bg-slate-950 overflow-x-hidden overflow-y-auto custom-scrollbar shrink-0 ${viewMode !== 'desktop' ? 'ring-8 ring-slate-800 border-[12px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)]' : 'shadow-2xl border border-white/10'}`}
                    style={{ 
                        width: `${getBaseDims().width}px`, height: `${getBaseDims().height}px`, borderRadius: `${getBaseDims().borderRadius}px`,
                        transform: `scale(${scale})`, transformOrigin: 'center center',
                    }}
                >
                    {/* ========================================== */}
                    {/* 🟢 SECTION 1: พื้นที่เข้าสู่ระบบและภาพ Hero (1 หน้าจอแรก) */}
                    {/* ========================================== */}
                    <div 
                        className="relative w-full h-full shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${shopData.login_config.background_url})` }}
                    >
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0, ${shopData.login_config.background_overlay})` }}/>

                        {hero.is_visible && hero.Hero_url && (
                            <Draggable key={`hero-${viewMode}`} scale={scale} nodeRef={heroNodeRef} bounds="parent" position={heroDragPos} onDrag={handleHeroDrag} onStop={handleHeroDragStop}>
                                <div 
                                    ref={heroNodeRef}
                                    className="absolute z-0 cursor-move flex items-center justify-center transition-shadow duration-300 group hover:ring-4 hover:ring-purple-500/50 overflow-hidden"
                                    style={{ 
                                        width: `clamp(100px, ${hero.config?.width ?? 40}%, 100%)`, 
                                        height: `clamp(100px, ${hero.config?.height ?? 50}%, 100%)`,
                                        margin: 0
                                    }}
                                >
                                    <div className="absolute top-4 right-4 text-white/50 opacity-0 md:group-hover:opacity-100 transition-opacity z-20 bg-black/50 p-2 rounded-full"><Move size={16} /></div>
                                    <img src={hero.Hero_url} alt="Hero" className="w-full h-full object-cover drop-shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-none select-none" />
                                </div>
                            </Draggable>
                        )}

                        {/* 🟢 กล่อง Draggable สำหรับ Payout Rate */}
                        {payout.is_visible && (
                            <Draggable key={`pay-${viewMode}`} scale={scale} nodeRef={payoutNodeRef} bounds="parent" position={payoutDragPos} onDrag={handlePayoutDrag} onStop={handlePayoutDragStop}>
                                <div 
                                    ref={payoutNodeRef}
                                    className="absolute z-10 cursor-move transition-shadow duration-300 group hover:ring-4 hover:ring-green-500/50"
                                    style={{ 
                                        width: `clamp(280px, ${payout.config?.width ?? 25}%, 95%)`, 
                                        height: payout.config?.height ?? 'auto',
                                        margin: 0
                                    }}
                                >
                                    <div className="absolute -top-3 -right-3 text-white/50 opacity-0 md:group-hover:opacity-100 transition-opacity z-30 bg-black/50 p-2 rounded-full"><Move size={16} /></div>
                                    <PayoutRateBox config={payout} brandColors={shopData.brand_config?.name_colors} />
                                </div>
                            </Draggable>
                        )}
                        
                        <Draggable key={viewMode} scale={scale} nodeRef={draggableNodeRef} bounds="parent" position={dragPos} onDrag={handleDrag} onStop={handleDragStop}>
                            <div 
                                ref={draggableNodeRef}
                                className="absolute z-10 cursor-move flex flex-col justify-center overflow-hidden transition-shadow duration-300 group hover:ring-4 hover:ring-blue-500/50"
                                style={{ 
                                    width: `clamp(320px, ${style.width ?? 40}%, 95%)`, minHeight: `clamp(400px, ${style.height ?? 50}%, 90%)`,
                                    borderRadius: `${style.border_radius ?? 24}px`, borderWidth: `${style.border_width ?? 2}px`,
                                    borderStyle: 'solid', borderColor: style.border_color ?? '#ffd700',
                                    boxShadow: `${style.shadow_x ?? 0}px ${style.shadow_y ?? 20}px ${style.shadow_blur ?? 50}px ${style.shadow_color ?? 'rgba(0,0,0,0.5)'}`,
                                    backgroundColor: style.is_glassmorphism ? hexToRgba(style.box_bg_color || '#ffffff', style.box_bg_opacity ?? 0.1) : (style.box_bg_color || '#0f172a'),
                                    backdropFilter: style.is_glassmorphism ? `blur(${style.box_bg_blur ?? 20}px)` : 'none',
                                    WebkitBackdropFilter: style.is_glassmorphism ? `blur(${style.box_bg_blur ?? 20}px)` : 'none',
                                    margin: 0
                                }}
                            >
                                <div className="absolute top-4 right-4 text-white/50 opacity-0 md:group-hover:opacity-100 transition-opacity z-20"><Move size={20} className="animate-bounce" /></div>
                                <LoginBoxUI shopData={shopData} />
                            </div>
                        </Draggable>
                    </div>

                    {/* ========================================== */}
                    {/* 🟢 SECTION 2: พื้นที่ตารางผลหวยล่าสุด (จำลอง) */}
                    {/* ========================================== */}
                    {shopData.login_config.results_section?.is_visible && (
                        <div className="w-full min-h-full bg-[#050810] p-6 md:p-12 flex flex-col items-center border-t border-white/5 pb-24 relative z-20">
                            
                            {/* เอฟเฟกต์แสงพื้นหลัง */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

                            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mt-10">
                                <h2 
                                    className="text-3xl md:text-5xl font-black mb-10 text-center uppercase tracking-tight"
                                    style={{
                                        background: `linear-gradient(to right, ${shopData.brand_config?.name_colors?.[0] || '#FFF'}, ${shopData.brand_config?.name_colors?.slice(-1)[0] || '#D4AF37'})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {shopData.login_config.results_section.title || "ผลรางวัลล่าสุด"}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    {mockLottos.slice(0, shopData.login_config.results_section.display_limit).map(lotto => (
                                        <LottoCardWrapper 
                                            key={lotto.id} 
                                            lotto={lotto} 
                                            config={shopData.login_config.results_section} 
                                            brandColors={shopData.brand_config?.name_colors} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}