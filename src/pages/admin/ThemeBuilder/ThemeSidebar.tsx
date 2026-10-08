import { useState } from 'react';
import { 
    Loader2, Camera, ChevronUp, ChevronDown, 
    Square, Maximize, Image as ImageIcon, Droplets, 
    ArrowLeft, CheckCircle2, PaintBucket,
    Eye, EyeOff, LayoutTemplate, Trophy, Wallet
} from 'lucide-react';

export default function ThemeSidebar({ 
    shopData, setShopData, onClose, onSave, submitting, onUploadBg, onUploadHero 
}: { 
    shopData: any, setShopData: any, onClose?: () => void, onSave: (e: any) => void, submitting: boolean, onUploadBg: (file: File) => void, onUploadHero: (file: File) => void 
}) {
    const [openSection, setOpenSection] = useState<string>('brand');
    const [uploadingBg, setUploadingBg] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false); 

    const toggleSection = (section: string) => setOpenSection(prev => prev === section ? '' : section);

    // Helper ช่วยย่นโค้ดการอัปเดต State
    const updateBoxStyle = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, box_style: { ...prev.login_config.box_style, [key]: value } } }));
    const updateConfig = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, [key]: value } }));
    
    // 🟢 Helper สำหรับ Hero
    const hero = shopData.login_config.hero_login || { is_visible: true, config: { width: 40, height: 50 } };
    const updateHero = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, hero_login: { ...prev.login_config.hero_login, [key]: value } } }));
    const updateHeroConfig = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, hero_login: { ...prev.login_config.hero_login, config: { ...prev.login_config.hero_login.config, [key]: value } } } }));
    const resultsConfig = shopData.login_config.results_section || { is_visible: true, title: "ผลรางวัลล่าสุด", display_limit: 10, theme: "glass" };
    const updateResultsConfig = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, results_section: { ...prev.login_config.results_section, [key]: value } } }));
    
    const payoutConfig = shopData.login_config.payout_config || { is_visible: true, position: {x: 20, y: 65}, config: {width: 25}, rates: {top3: 900, tod3: 120, top2: 90, bottom2: 90, run_top: 3.2, run_bottom: 4.2} };
    const updatePayoutConfig = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, payout_config: { ...prev.login_config.payout_config, [key]: value } } }));
    const updatePayoutRates = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, payout_config: { ...prev.login_config.payout_config, rates: { ...prev.login_config.payout_config?.rates, [key]: value } } } }));
    const updatePayoutBoxSize = (key: string, value: any) => setShopData((prev: any) => ({ ...prev, login_config: { ...prev.login_config, payout_config: { ...prev.login_config.payout_config, config: { ...prev.login_config.payout_config?.config, [key]: value } } } }));
    
    const config = shopData.login_config;
    const style = config.box_style;

    return (
        <div className="order-2 md:order-1 h-[45vh] md:h-full w-full md:w-[380px] bg-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.2)] z-20 shrink-0">
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50 shrink-0">
                <button onClick={onClose} className="p-2 bg-white text-slate-600 rounded-lg border hover:bg-slate-100 transition-colors"><ArrowLeft size={20} /></button>
                <div className="text-right">
                    <h1 className="text-base md:text-lg font-black text-slate-800 leading-tight">Theme Builder</h1>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">100% Scale Precision</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">

                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <button onClick={() => toggleSection('bg')} className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><ImageIcon size={18} className="text-indigo-500" /> พื้นหลังหน้าเว็บ</h3>
                        {openSection === 'bg' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    {openSection === 'bg' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="relative h-28 bg-slate-900 rounded-xl overflow-hidden border">
                                {config.background_url && <img src={config.background_url} className="w-full h-full object-cover opacity-50"/>}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none hover:bg-black/20 transition-colors">
                                    {uploadingBg ? <Loader2 className="animate-spin"/> : <Camera size={24}/>}
                                    <span className="text-[10px] font-bold mt-1 uppercase">เปลี่ยนพื้นหลัง</span>
                                </div>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                                    if(e.target.files?.[0]){
                                        setUploadingBg(true);
                                        await onUploadBg(e.target.files[0]);
                                        setUploadingBg(false);
                                    }
                                }}/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>Overlay ความมืด</span><span>{Math.round(config.background_overlay * 100)}%</span></div>
                                <input type="range" min="0" max="1" step="0.05" value={config.background_overlay} onChange={(e) => updateConfig('background_overlay', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-indigo-500 appearance-none cursor-pointer"/>
                            </div>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <button onClick={() => toggleSection('size')} className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Maximize size={18} className="text-blue-500" /> ขนาดกล่อง</h3>
                        {openSection === 'size' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    {openSection === 'size' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>กว้าง (Width)</span><span>{style.width ?? 40}%</span></div>
                                <input type="range" min="10" max="100" value={style.width ?? 40} onChange={(e) => updateBoxStyle('width', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-blue-500 appearance-none cursor-pointer"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>สูง (Min-Height)</span><span>{style.height ?? 50}%</span></div>
                                <input type="range" min="10" max="100" value={style.height ?? 50} onChange={(e) => updateBoxStyle('height', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-blue-500 appearance-none cursor-pointer"/>
                            </div>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <button onClick={() => toggleSection('border')} className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Square size={18} className="text-emerald-500" /> ขอบและเงา (Shadow)</h3>
                        {openSection === 'border' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    {openSection === 'border' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>ความมน (Radius)</span><span>{style.border_radius ?? 24}px</span></div>
                                <input type="range" min="0" max="100" value={style.border_radius ?? 24} onChange={(e) => updateBoxStyle('border_radius', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-emerald-500 appearance-none cursor-pointer"/>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">ขนาดขอบ (px)</label>
                                    <input type="number" value={style.border_width ?? 2} onChange={(e) => updateBoxStyle('border_width', parseInt(e.target.value))} className="w-full bg-slate-50 border rounded-lg px-3 py-1.5 text-sm outline-none"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">สีขอบ</label>
                                    <input type="color" value={style.border_color ?? '#ffd700'} onChange={(e) => updateBoxStyle('border_color', e.target.value)} className="w-10 h-10 block bg-transparent border-none cursor-pointer p-0"/>
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">เงาแกน X (px)</label>
                                        <input type="number" value={style.shadow_x ?? 0} onChange={(e) => updateBoxStyle('shadow_x', parseInt(e.target.value))} className="w-full bg-slate-50 border rounded-lg px-3 py-1.5 text-sm outline-none"/>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">เงาแกน Y (px)</label>
                                        <input type="number" value={style.shadow_y ?? 20} onChange={(e) => updateBoxStyle('shadow_y', parseInt(e.target.value))} className="w-full bg-slate-50 border rounded-lg px-3 py-1.5 text-sm outline-none"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>ความฟุ้งกระจาย (Blur)</span><span>{style.shadow_blur ?? 50}px</span></div>
                                    <input type="range" min="0" max="100" value={style.shadow_blur ?? 50} onChange={(e) => updateBoxStyle('shadow_blur', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-orange-500 appearance-none cursor-pointer"/>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">สีเงา (Color)</label>
                                    <input type="color" value={(style.shadow_color || '#000000').slice(0, 7)} onChange={(e) => updateBoxStyle('shadow_color', e.target.value)} className="w-8 h-8 cursor-pointer border-0 bg-transparent p-0"/>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <button onClick={() => toggleSection('effects')} className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Droplets size={18} className="text-cyan-500" /> เอฟเฟกต์และสีกล่อง</h3>
                        {openSection === 'effects' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    {openSection === 'effects' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                                <div className="flex items-center gap-2">
                                    <PaintBucket size={16} className="text-slate-500" />
                                    <span className="text-sm font-bold text-slate-700">สีกล่อง (Base Color)</span>
                                </div>
                                <input type="color" value={style.box_bg_color || '#ffffff'} onChange={(e) => updateBoxStyle('box_bg_color', e.target.value)} className="w-8 h-8 block bg-transparent border-none cursor-pointer p-0"/>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                                <span className="text-sm font-bold text-slate-700">เปิดใช้ความโปร่งใส (Glass)</span>
                                <input type="checkbox" checked={style.is_glassmorphism} onChange={(e) => updateBoxStyle('is_glassmorphism', e.target.checked)} className="w-5 h-5 accent-cyan-600"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>ความโปร่งใส (Opacity)</span><span>{Math.round((style.box_bg_opacity ?? 0.1) * 100)}%</span></div>
                                <input type="range" min="0" max="1" step="0.01" value={style.box_bg_opacity ?? 0.1} onChange={(e) => updateBoxStyle('box_bg_opacity', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-cyan-500 appearance-none cursor-pointer"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>ความเบลอ (Blur)</span><span>{style.box_bg_blur ?? 20}px</span></div>
                                <input type="range" min="0" max="40" step="1" value={style.box_bg_blur ?? 20} onChange={(e) => updateBoxStyle('box_bg_blur', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-100 rounded-lg accent-cyan-500 appearance-none cursor-pointer"/>
                            </div>
                        </div>
                    )}
                </section>

                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <button onClick={() => toggleSection('hero')} className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><LayoutTemplate size={18} className="text-purple-500" /> ภาพประกอบ (Hero Image)</h3>
                        {openSection === 'hero' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    {openSection === 'hero' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                                <div className="flex items-center gap-2">
                                    {hero.is_visible ? <Eye size={16} className="text-emerald-500" /> : <EyeOff size={16} className="text-slate-400" />}
                                    <span className="text-sm font-bold text-slate-700">แสดงภาพประกอบ</span>
                                </div>
                                <input type="checkbox" checked={hero.is_visible} onChange={(e) => updateHero('is_visible', e.target.checked)} className="w-5 h-5 accent-purple-600"/>
                            </div>

                            {/* อัปโหลดภาพ */}
                            <div className={`relative h-32 bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed ${hero.is_visible ? 'border-purple-300 hover:border-purple-500' : 'opacity-50 pointer-events-none'} transition-colors`}>
                     
                                {hero.Hero_url && <img src={hero.Hero_url} className="w-full h-full object-cover p-2"/>}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
                                    {uploadingHero ? <Loader2 className="animate-spin text-purple-500"/> : (!hero.Hero_url && <ImageIcon size={24}/>)}
                                    {!hero.Hero_url && <span className="text-[10px] font-bold mt-1 uppercase">อัปโหลดภาพ (PNG/WebP ลบพื้นหลัง)</span>}
                                </div>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => {
                                    if(e.target.files?.[0]){
                                        setUploadingHero(true);
                                        await onUploadHero(e.target.files[0]);
                                        setUploadingHero(false);
                                    }
                                }}/>
                            </div>

                            {/* ปรับขนาด Hero */}
                            <div className={`space-y-4 ${hero.is_visible ? '' : 'opacity-50 pointer-events-none'}`}>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>กว้าง (Width)</span><span>{hero.config?.width ?? 40}%</span></div>
                                    <input type="range" min="10" max="100" value={hero.config?.width ?? 40} onChange={(e) => updateHeroConfig('width', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg accent-purple-500 appearance-none cursor-pointer"/>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase"><span>สูง (Height)</span><span>{hero.config?.height ?? 50}%</span></div>
                                    <input type="range" min="10" max="100" value={hero.config?.height ?? 50} onChange={(e) => updateHeroConfig('height', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg accent-purple-500 appearance-none cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 🟢 Section ใหม่: ตารางผลรางวัล */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <button onClick={() => toggleSection('results')} className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> ตารางผลรางวัล</h3>
                        {openSection === 'results' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    {openSection === 'results' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            {/* เปิด/ปิดตาราง */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                                <div className="flex items-center gap-2">
                                    {resultsConfig.is_visible ? <Eye size={16} className="text-emerald-500" /> : <EyeOff size={16} className="text-slate-400" />}
                                    <span className="text-sm font-bold text-slate-700">แสดงผลรางวัลหน้า Login</span>
                                </div>
                                <input type="checkbox" checked={resultsConfig.is_visible} onChange={(e) => updateResultsConfig('is_visible', e.target.checked)} className="w-5 h-5 accent-amber-500"/>
                            </div>

                            {/* ตั้งค่าข้อความและอื่นๆ */}
                            <div className={`space-y-4 ${resultsConfig.is_visible ? '' : 'opacity-50 pointer-events-none'}`}>
                                
                                {/* 🟢 เพิ่มส่วนนี้: เลือกรูปแบบการ์ด */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รูปแบบการ์ด (Card Style)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button 
                                            onClick={() => updateResultsConfig('results_style', 'classic')} 
                                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${resultsConfig.results_style === 'classic' || !resultsConfig.results_style ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            มาตรฐาน (Glass)
                                        </button>
                                        <button 
                                            onClick={() => updateResultsConfig('results_style', 'ticket')} 
                                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${resultsConfig.results_style === 'ticket' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            ตั๋วหวย (Ticket)
                                        </button>
                                        <button 
                                            onClick={() => updateResultsConfig('results_style', 'minimal')} 
                                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${resultsConfig.results_style === 'minimal' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            เรียบหรู (Minimal)
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">ข้อความหัวเรื่อง (Title)</label>
                                    <input 
                                        type="text" 
                                        value={resultsConfig.title} 
                                        onChange={(e) => updateResultsConfig('title', e.target.value)}
                                        className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                        <span>จำนวนที่แสดง (รายการ)</span>
                                        <span>{resultsConfig.display_limit}</span>
                                    </div>
                                    <input 
                                        type="range" min="4" max="20" step="2"
                                        value={resultsConfig.display_limit} 
                                        onChange={(e) => updateResultsConfig('display_limit', parseInt(e.target.value))} 
                                        className="w-full h-1.5 bg-slate-200 rounded-lg accent-amber-500 appearance-none cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">สไตล์ตาราง (Theme)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => updateResultsConfig('theme', 'glass')}
                                            className={`py-2 text-xs font-bold rounded-lg border ${resultsConfig.theme === 'glass' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 text-slate-500'}`}
                                        >
                                            ใส (Glassmorphism)
                                        </button>
                                        <button 
                                            onClick={() => updateResultsConfig('theme', 'solid')}
                                            className={`py-2 text-xs font-bold rounded-lg border ${resultsConfig.theme === 'solid' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 text-slate-500'}`}
                                        >
                                            ทึบ (Solid)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* 🟢 Section ใหม่: กล่องโฆษณาเรทจ่าย */}
                <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <button onClick={() => toggleSection('payout')} className="flex items-center justify-between w-full mb-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Wallet size={18} className="text-green-500" /> โฆษณาเรทจ่ายสูงสุด</h3>
                        {openSection === 'payout' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    {openSection === 'payout' && (
                        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
                            {/* เปิด/ปิดกล่อง */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                                <div className="flex items-center gap-2">
                                    {payoutConfig.is_visible ? <Eye size={16} className="text-emerald-500" /> : <EyeOff size={16} className="text-slate-400" />}
                                    <span className="text-sm font-bold text-slate-700">แสดงกล่องเรทจ่าย</span>
                                </div>
                                <input type="checkbox" checked={payoutConfig.is_visible} onChange={(e) => updatePayoutConfig('is_visible', e.target.checked)} className="w-5 h-5 accent-green-500"/>
                            </div>

                            <div className={`space-y-4 ${payoutConfig.is_visible ? '' : 'opacity-50 pointer-events-none'}`}>
                                
                                {/* 🟢 เพิ่มส่วนนี้: ปุ่มเลือกสไตล์ (Layout Style) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รูปแบบการแสดงผล (Style)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button 
                                            onClick={() => updatePayoutConfig('payout_style', 'classic')} 
                                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${payoutConfig.payout_style === 'classic' || !payoutConfig.payout_style ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            มาตรฐาน
                                        </button>
                                        <button 
                                            onClick={() => updatePayoutConfig('payout_style', 'cascade')} 
                                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${payoutConfig.payout_style === 'cascade' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            การ์ดเฉียง
                                        </button>
                                        <button 
                                            onClick={() => updatePayoutConfig('payout_style', 'grid')} 
                                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${payoutConfig.payout_style === 'grid' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                        >
                                            ตาราง 2 ช่อง
                                        </button>
                                    </div>
                                </div>

                                {/* ปรับขนาด */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                                        <span>ความกว้างกล่อง (Width)</span>
                                        <span>{payoutConfig.config?.width ?? 25}%</span>
                                    </div>
                                    <input 
                                        type="range" min="15" max="50" step="1"
                                        value={payoutConfig.config?.width ?? 25} 
                                        onChange={(e) => updatePayoutBoxSize('width', parseInt(e.target.value))} 
                                        className="w-full h-1.5 bg-slate-200 rounded-lg accent-green-500 appearance-none cursor-pointer"
                                    />
                                </div>

                                {/* ตั้งค่าตัวเลขเรทจ่าย */}
                                <div className="p-3 bg-slate-50 rounded-xl border space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">ปรับแต่งตัวเลข</h4>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* 3 ตัวบน */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-600">3 ตัวบน</label>
                                            <input 
                                                type="number" 
                                                value={payoutConfig.rates?.top3 ?? 900} 
                                                onChange={(e) => updatePayoutRates('top3', Number(e.target.value))}
                                                className="w-full bg-white border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 font-bold text-green-600"
                                            />
                                        </div>
                                        {/* 🟢 3 ตัวโต๊ด (เพิ่มใหม่) */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-600">3 ตัวโต๊ด</label>
                                            <input 
                                                type="number" 
                                                value={payoutConfig.rates?.tod3 ?? 120} 
                                                onChange={(e) => updatePayoutRates('tod3', Number(e.target.value))}
                                                className="w-full bg-white border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 font-bold text-green-600"
                                            />
                                        </div>
                                        {/* 🟢 2 ตัวบน (เพิ่มใหม่) */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-600">2 ตัวบน</label>
                                            <input 
                                                type="number" 
                                                value={payoutConfig.rates?.top2 ?? 90} 
                                                onChange={(e) => updatePayoutRates('top2', Number(e.target.value))}
                                                className="w-full bg-white border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 font-bold text-green-600"
                                            />
                                        </div>
                                        {/* 2 ตัวล่าง */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-600">2 ตัวล่าง</label>
                                            <input 
                                                type="number" 
                                                value={payoutConfig.rates?.bottom2 ?? 90} 
                                                onChange={(e) => updatePayoutRates('bottom2', Number(e.target.value))}
                                                className="w-full bg-white border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 font-bold text-green-600"
                                            />
                                        </div>
                                        {/* วิ่งบน */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-600">วิ่งบน</label>
                                            <input 
                                                type="number" step="0.1"
                                                value={payoutConfig.rates?.run_top ?? 3.2} 
                                                onChange={(e) => updatePayoutRates('run_top', Number(e.target.value))}
                                                className="w-full bg-white border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 font-bold text-green-600"
                                            />
                                        </div>
                                        {/* วิ่งล่าง */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-600">วิ่งล่าง</label>
                                            <input 
                                                type="number" step="0.1"
                                                value={payoutConfig.rates?.run_bottom ?? 4.2} 
                                                onChange={(e) => updatePayoutRates('run_bottom', Number(e.target.value))}
                                                className="w-full bg-white border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-500 font-bold text-green-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
                
            </div>

            <div className="p-3 md:p-4 border-t bg-white shrink-0">
                <button onClick={onSave} disabled={submitting} className="w-full bg-slate-900 hover:bg-black text-white px-6 py-3 md:py-3.5 rounded-xl text-sm md:text-base font-bold shadow-lg shadow-slate-200 transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />} บันทึกธีม
                </button>
            </div>
        </div>
        
    );
}