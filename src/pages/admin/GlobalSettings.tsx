import { useEffect, useState } from 'react';
import client from '../../api/client';
import { 
    Settings, Loader2, CheckCircle2, 
    Image as ImageIcon, X, Palette, MessageCircle, Store, Sparkles, ChevronLeft, ChevronRight, Plus, Trash2, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ShopName } from '../../components/admin/BrandLogo';

// 🟢 อัปเดต Presets ให้รองรับโครงสร้างใหม่ (Array สี และ Fill Type)
const brandPresets = [
    { id: 'solid-white', name: 'Solid White', font: "'Prompt', sans-serif", colors: ['#ffffff'], shadow: 'none', stroke: 'none', type: 'color', texture: '' },
    { id: '3d-gold', name: '3D Royal Gold', font: "'Prompt', sans-serif", colors: ['#FFF7CC', '#D4AF37'], shadow: '0px 2px 1px #996515, 0px 10px 15px rgba(0,0,0,0.5)', stroke: 'none', type: 'color', texture: '' },
    { id: 'cyber-neon', name: 'Neon Cyberpunk', font: "'Prompt', sans-serif", colors: ['#FF00FF', '#00FFFF'], shadow: '0px 0px 8px rgba(255,0,255,0.8), 0px 0px 20px rgba(0,255,255,0.6)', stroke: 'none', type: 'animated', texture: '' },
    { id: 'metal-silver', name: 'Chrome Metal', font: "'Kanit', sans-serif", colors: ['#E0E1E2', '#ffffff', '#8A939C', '#ffffff', '#E0E1E2'], shadow: '0px 4px 10px rgba(0,0,0,0.5)', stroke: '0.5px rgba(255,255,255,0.4)', type: 'color', texture: '' },
    { id: 'gold-foil', name: 'Gold Foil Texture', font: "'Chonburi', cursive", colors: ['#D4AF37'], shadow: '0px 4px 10px rgba(0,0,0,0.8)', stroke: '1px #ffffff', type: 'texture', texture: 'https://www.transparenttextures.com/patterns/gold-scale.png' },
];

const fontOptions = [
    { label: 'Prompt (ทันสมัย)', value: "'Prompt', sans-serif" },
    { label: 'Kanit (วัยรุ่น)', value: "'Kanit', sans-serif" },
    { label: 'Sarabun (ทางการ)', value: "'Sarabun', sans-serif" },
    { label: 'Chonburi (ไทยย้อนยุค)', value: "'Chonburi', cursive" },
];

const fillModes = [
    { id: 'color', label: '🎨 สีทึบ / ไล่เฉดสี / โลหะ' },
    { id: 'animated', label: '✨ แสงวิ่งแอนิเมชัน' },
    { id: 'texture', label: '🌌 ลวดลายพื้นผิว (Texture)' }
];

export default function GlobalSettings() {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingType, setUploadingType] = useState<'logo'|'texture'|null>(null);
    
    const [globalData, setGlobalData] = useState({
        name: '',
        logo_url: '',
        theme_color: '#ffd700',
        line_channel_token: '',
        line_target_id: '',
        line_id: '',
        brand_config: {
            font_family: "'Prompt', sans-serif",
            fill_type: "color" as 'color' | 'animated' | 'texture',
            name_colors: ["#FFF7CC", "#D4AF37"],
            texture_url: "",
            text_shadow: "0px 2px 1px #996515, 0px 10px 15px rgba(0,0,0,0.5)",
            text_stroke: 'none',
            logo_type: "image" as 'image'|'emoji',
            logo_emoji: "👑"
        }
    });

    useEffect(() => {
        fetchShopData();
    }, []);

    const fetchShopData = async () => {
        setLoading(true);
        try {
            const res = await client.get('/shops/');
            if (res.data && res.data.length > 0) {
                const shop = res.data[0];
                const dbBrand = shop.brand_config || {};
                
                // 🔴 ทำ Fallback กันพัง (ดึงค่าจากของเดิมมาใส่โครงสร้างใหม่)
                const mappedColors = dbBrand.name_colors || [dbBrand.name_color_from || "#FFF7CC", dbBrand.name_color_to || "#D4AF37"];

                setGlobalData({
                    name: shop.name || '',
                    logo_url: shop.logo_url || '',
                    theme_color: shop.theme_color || '#ffd700',
                    line_channel_token: shop.line_channel_token || '',
                    line_target_id: shop.line_target_id || '',
                    line_id: shop.line_id || '',
                    brand_config: {
                        font_family: dbBrand.font_family || "'Prompt', sans-serif",
                        fill_type: dbBrand.fill_type || "color",
                        name_colors: mappedColors,
                        texture_url: dbBrand.texture_url || "",
                        text_shadow: dbBrand.text_shadow || "0px 2px 1px #996515, 0px 10px 15px rgba(0,0,0,0.5)",
                        text_stroke: dbBrand.text_stroke || 'none',
                        logo_type: dbBrand.logo_type || "image",
                        logo_emoji: dbBrand.logo_emoji || "👑"
                    }
                });
            }
        } catch (err) {
            toast.error('โหลดข้อมูลการตั้งค่าไม่สำเร็จ');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File, type: 'logo' | 'texture') => {
        setUploadingType(type);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'theme');

        try {
            const res = await client.post('/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (type === 'logo') {
                setGlobalData(prev => ({ ...prev, logo_url: res.data.url }));
            } else {
                setGlobalData(prev => ({ ...prev, brand_config: { ...prev.brand_config, texture_url: res.data.url } }));
            }
            toast.success('อัปโหลดสำเร็จ');
        } catch (err) {
            toast.error('อัปโหลดล้มเหลว');
        } finally {
            setUploadingType(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.put('/shops/config', globalData);
            toast.success('บันทึกการตั้งค่าสำเร็จ');
        } catch (err: any) {
            toast.error('บันทึกไม่สำเร็จ');
        } finally {
            setSubmitting(false);
        }
    };

    // --- ฟังก์ชันจัดการ Array สี ---
    const addColor = () => {
        setGlobalData(prev => ({...prev, brand_config: {...prev.brand_config, name_colors: [...prev.brand_config.name_colors, '#ffffff']}}));
    };
    const updateColor = (idx: number, val: string) => {
        const newColors = [...globalData.brand_config.name_colors];
        newColors[idx] = val;
        setGlobalData(prev => ({...prev, brand_config: {...prev.brand_config, name_colors: newColors}}));
    };
    const removeColor = (idx: number) => {
        if (globalData.brand_config.name_colors.length <= 1) return;
        const newColors = globalData.brand_config.name_colors.filter((_, i) => i !== idx);
        setGlobalData(prev => ({...prev, brand_config: {...prev.brand_config, name_colors: newColors}}));
    };

    // --- ฟังก์ชันเปลี่ยนโหมด < โหมด > ---
    const currentModeIndex = fillModes.findIndex(m => m.id === globalData.brand_config.fill_type);
    const switchMode = (direction: 'next'|'prev') => {
        let newIndex = direction === 'next' ? currentModeIndex + 1 : currentModeIndex - 1;
        if (newIndex >= fillModes.length) newIndex = 0;
        if (newIndex < 0) newIndex = fillModes.length - 1;
        setGlobalData(prev => ({...prev, brand_config: {...prev.brand_config, fill_type: fillModes[newIndex].id as any}}));
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
            <p className="animate-pulse font-medium">กำลังโหลดข้อมูล...</p>
        </div>
    );

    return (
        <div className="pb-20 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Settings size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Global Settings</h1>
                        <p className="text-slate-500 text-sm">ตั้งค่าระบบและแบรนด์</p>
                    </div>
                </div>
                <button onClick={handleSave} disabled={submitting} className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all flex items-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />} บันทึกการตั้งค่า
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                
                <section className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 space-y-8 relative overflow-hidden">
                    <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl shadow-inner border border-blue-200/50"><Store size={22} strokeWidth={2.5} /></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">ข้อมูลและอัตลักษณ์แบรนด์</h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">ตั้งค่าชื่อร้าน โลโก้ และรูปแบบตัวอักษร</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        
                        {/* 🟢 ส่วน Live Preview & Edit ชื่อร้าน (ใช้ BrandLogo แทน Input ธรรมดา) */}
                        <div className="space-y-3 md:col-span-2 group">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                <span>ชื่อร้าน (Brand Name)</span>
                                <span className="text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md text-[10px] animate-pulse flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Live Preview
                                </span>
                            </label>
                            
                            {/* Premium Dark Canvas */}
                            <div className="relative w-full bg-[#0B1120] rounded-[2rem] p-6 border border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[220px] group/canvas transition-all duration-500 hover:border-blue-500/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[60px] pointer-events-none transition-all duration-500 group-focus-within/canvas:opacity-100 opacity-50"></div>
                                
                                {/* 🟢 เรียกใช้เฉพาะ ShopName และปิดเส้นใต้ เพื่อให้จัดกึ่งกลางเป๊ะ */}
                                <ShopName 
                                    name={globalData.name || 'พิมพ์ชื่อร้าน'} 
                                    brandConfig={globalData.brand_config}
                                    showUnderline={false}
                                    className="pointer-events-none w-full"
                                    textClassName="text-[clamp(2rem,5vw,4rem)]" // กำหนดให้ตัวใหญ่ยืดหยุ่นได้
                                />

                                {/* กล่องซ่อนสำหรับพิมพ์ (พิมพ์ทับ Live Preview) */}
                                <input 
                                    type="text" 
                                    value={globalData.name} 
                                    onChange={e => setGlobalData({...globalData, name: e.target.value})}
                                    className="absolute inset-0 w-full h-full bg-transparent text-transparent text-center outline-none caret-white z-20"
                                    placeholder=""
                                />
                                <div className="absolute bottom-4 right-6 text-slate-500 text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover/canvas:opacity-100 transition-opacity pointer-events-none">Click to Edit Name</div>
                            </div>
                        </div>

                        {/* Presets สำเร็จรูป */}
                        <div className="space-y-4 md:col-span-2 mt-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={16} className="text-yellow-500 animate-pulse"/> รูปแบบชื่อแบรนด์สำเร็จรูป (Presets)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {brandPresets.map(preset => {
                                    const isActive = globalData.brand_config.name_colors.join() === preset.colors.join() && globalData.brand_config.fill_type === preset.type;
                                    return (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => setGlobalData({
                                                ...globalData, 
                                                brand_config: {
                                                    ...globalData.brand_config, 
                                                    font_family: preset.font, 
                                                    name_colors: preset.colors,
                                                    text_shadow: preset.shadow,
                                                    text_stroke: preset.stroke,
                                                    fill_type: preset.type as any,
                                                    texture_url: preset.texture
                                                }
                                            })}
                                            className={`py-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                                                isActive ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 hover:border-blue-200 text-slate-500'
                                            }`}
                                        >
                                            <span className="text-[11px] font-bold uppercase tracking-wider">{preset.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 🟢 ปรับแต่งเอง (Advanced Tuning แบบเต็มระบบ) */}
                        <div className="md:col-span-2 relative bg-[#0B1120] rounded-[2rem] p-7 md:p-8 border border-slate-800 shadow-2xl overflow-hidden mt-4">
                            <div className="relative z-10 space-y-6">
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
                                    <div className="flex items-center gap-3 text-white font-bold text-sm">
                                        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700"><Palette size={16} className="text-blue-400" /></div>
                                        ปรับแต่งแบบเจาะลึก (Advanced Customization)
                                    </div>

                                    {/* 🟢 ระบบ < โหมดสไตล์ > */}
                                    <div className="flex items-center gap-2 bg-slate-800/80 rounded-xl p-1.5 border border-slate-700/80">
                                        <button type="button" onClick={() => switchMode('prev')} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><ChevronLeft size={16}/></button>
                                        <span className="text-xs font-bold text-white w-32 text-center">{fillModes[currentModeIndex].label}</span>
                                        <button type="button" onClick={() => switchMode('next')} className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><ChevronRight size={16}/></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* 🟢 การจัดการสีแบบ Array (แสดงเมื่อเป็นโหมด color หรือ animated) */}
                                    {(globalData.brand_config.fill_type === 'color' || globalData.brand_config.fill_type === 'animated') && (
                                        <div className="space-y-3 md:col-span-2 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    เฉดสี (มี 1 สี = สีทึบ | มี 2 สีขึ้นไป = สีไล่เฉด/โลหะ)
                                                </label>
                                                <button type="button" onClick={addColor} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full"><Plus size={12}/> เพิ่มสี</button>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center gap-3">
                                                {globalData.brand_config.name_colors.map((color, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1.5 pr-2 relative group">
                                                        <input type="color" value={color} onChange={e => updateColor(idx, e.target.value)} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                                                        <input type="text" value={color} onChange={e => updateColor(idx, e.target.value)} className="w-16 bg-transparent text-xs text-slate-300 font-mono outline-none uppercase" />
                                                        
                                                        {globalData.brand_config.name_colors.length > 1 && (
                                                            <button type="button" onClick={() => removeColor(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                                                <Trash2 size={10} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 🟢 โหมด Texture (อัปโหลดลวดลาย) */}
                                    {globalData.brand_config.fill_type === 'texture' && (
                                        <div className="space-y-3 md:col-span-2 bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ลวดลายพื้นผิว (Texture Image URL)</label>
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="text" 
                                                    value={globalData.brand_config.texture_url}
                                                    onChange={e => setGlobalData({...globalData, brand_config: {...globalData.brand_config, texture_url: e.target.value}})}
                                                    className="flex-1 bg-slate-800 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-slate-600"
                                                    placeholder="ใส่ URL รูปภาพ หรือกดอัปโหลด"
                                                />
                                                <div className="relative">
                                                    <button type="button" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold transition-colors">
                                                        {uploadingType === 'texture' ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16} />}
                                                        อัปโหลด
                                                    </button>
                                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'texture')} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* เลือกฟอนต์ */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เลือกฟอนต์ (Font Family)</label>
                                        <select 
                                            value={globalData.brand_config.font_family}
                                            onChange={e => setGlobalData({...globalData, brand_config: {...globalData.brand_config, font_family: e.target.value}})}
                                            className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                        >
                                            {fontOptions.map(f => <option key={f.value} value={f.value} className="bg-slate-800">{f.label}</option>)}
                                        </select>
                                    </div>

                                    {/* 🟢 ส่วนปรับแต่งเงาแบบละเอียด (Interactive Shadow) */}
                                    <div className="space-y-4 bg-slate-800/20 p-4 rounded-2xl border border-slate-700/50">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            เงาเรืองแสง / 3D (Text Shadow)
                                        </label>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* ระยะแกน X */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                                    <span>แกน X (Horizontal)</span>
                                                    <span>{globalData.brand_config.text_shadow.split('px')[0] || 0}px</span>
                                                </div>
                                                <input 
                                                    type="range" min="-20" max="20" 
                                                    value={parseInt(globalData.brand_config.text_shadow.split('px')[0]) || 0}
                                                    onChange={e => {
                                                        const parts = (globalData.brand_config.text_shadow === 'none' ? '0px 0px 0px #000' : globalData.brand_config.text_shadow).split(' ');
                                                        parts[0] = `${e.target.value}px`;
                                                        setGlobalData({...globalData, brand_config: {...globalData.brand_config, text_shadow: parts.join(' ')}});
                                                    }}
                                                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 appearance-none cursor-pointer"
                                                />
                                            </div>

                                            {/* ระยะแกน Y */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                                    <span>แกน Y (Vertical)</span>
                                                    <span>{globalData.brand_config.text_shadow.split('px')[1]?.trim() || 0}px</span>
                                                </div>
                                                <input 
                                                    type="range" min="-20" max="20" 
                                                    value={parseInt(globalData.brand_config.text_shadow.split('px')[1]?.trim()) || 0}
                                                    onChange={e => {
                                                        const parts = (globalData.brand_config.text_shadow === 'none' ? '0px 0px 0px #000' : globalData.brand_config.text_shadow).split(' ');
                                                        parts[1] = `${e.target.value}px`;
                                                        setGlobalData({...globalData, brand_config: {...globalData.brand_config, text_shadow: parts.join(' ')}});
                                                    }}
                                                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 appearance-none cursor-pointer"
                                                />
                                            </div>

                                            {/* ความเบลอ (Blur) */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                                    <span>ความฟุ้ง (Blur)</span>
                                                    <span>{globalData.brand_config.text_shadow.split('px')[2]?.trim() || 0}px</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="50" 
                                                    value={parseInt(globalData.brand_config.text_shadow.split('px')[2]?.trim()) || 0}
                                                    onChange={e => {
                                                        const parts = (globalData.brand_config.text_shadow === 'none' ? '0px 0px 0px #000' : globalData.brand_config.text_shadow).split(' ');
                                                        parts[2] = `${e.target.value}px`;
                                                        setGlobalData({...globalData, brand_config: {...globalData.brand_config, text_shadow: parts.join(' ')}});
                                                    }}
                                                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 appearance-none cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* สีของเงา */}
                                        <div className="flex items-center gap-3 pt-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">สีเงา</label>
                                            <input 
                                                type="color" 
                                                value={globalData.brand_config.text_shadow.split(' ').pop()?.includes('#') ? globalData.brand_config.text_shadow.split(' ').pop() : '#000000'}
                                                onChange={e => {
                                                    const parts = (globalData.brand_config.text_shadow === 'none' ? ['0px', '0px', '0px', '#000'] : globalData.brand_config.text_shadow.split(' '));
                                                    parts[3] = e.target.value;
                                                    setGlobalData({...globalData, brand_config: {...globalData.brand_config, text_shadow: parts.join(' ')}});
                                                }}
                                                className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setGlobalData({...globalData, brand_config: {...globalData.brand_config, text_shadow: 'none'}})}
                                                className="text-[9px] font-bold text-red-400 border border-red-400/30 px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
                                            >
                                                ล้างเงา
                                            </button>
                                        </div>
                                    </div>

                                    {/* 🟢 ส่วนปรับแต่งขอบตัวอักษร (Interactive Stroke) */}
                                    <div className="space-y-4 bg-slate-800/20 p-4 rounded-2xl border border-slate-700/50 md:col-span-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            ขอบตัวอักษร (Text Stroke)
                                        </label>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                            {/* ความหนาขอบ */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                                    <span>ความหนา (Width)</span>
                                                    <span>{globalData.brand_config.text_stroke === 'none' ? 0 : parseInt(globalData.brand_config.text_stroke)}px</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="10" step="0.5"
                                                    value={globalData.brand_config.text_stroke === 'none' ? 0 : parseFloat(globalData.brand_config.text_stroke) || 0}
                                                    onChange={e => {
                                                        const color = globalData.brand_config.text_stroke.split(' ')[1] || '#000000';
                                                        const newVal = e.target.value === '0' ? 'none' : `${e.target.value}px ${color}`;
                                                        setGlobalData({...globalData, brand_config: {...globalData.brand_config, text_stroke: newVal}});
                                                    }}
                                                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 appearance-none cursor-pointer"
                                                />
                                            </div>

                                            {/* สีของขอบ */}
                                            <div className="flex items-center gap-4">
                                                <div className="space-y-1 flex-1">
                                                    <label className="text-[9px] text-slate-500 font-bold uppercase block">สีขอบ</label>
                                                    <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-2 border border-slate-700">
                                                        <input 
                                                            type="color" 
                                                            value={globalData.brand_config.text_stroke.split(' ')[1] || '#000000'}
                                                            onChange={e => {
                                                                const size = globalData.brand_config.text_stroke === 'none' ? '1px' : globalData.brand_config.text_stroke.split(' ')[0];
                                                                setGlobalData({...globalData, brand_config: {...globalData.brand_config, text_stroke: `${size} ${e.target.value}`}});
                                                            }}
                                                            className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                                                        />
                                                        <span className="text-xs font-mono text-slate-400 uppercase">
                                                            {globalData.brand_config.text_stroke.split(' ')[1] || '#000000'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🟢 ส่วนสีธีมหลักของเว็บ */}
                        <div className="space-y-3 md:col-span-2 mt-6 pt-6 border-t border-slate-100">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-md"><Palette size={14}/></div>
                                สีธีมหลักของเว็บ (Primary App Color)
                            </label>
                            <div className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100/50 p-2.5 rounded-2xl border border-slate-200 max-w-sm transition-colors shadow-sm">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-black/5">
                                    <input 
                                        type="color" 
                                        value={globalData.theme_color} 
                                        onChange={e => setGlobalData({...globalData, theme_color: e.target.value})}
                                        className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                                    />
                                </div>
                                <input 
                                    type="text" 
                                    value={globalData.theme_color}
                                    onChange={e => setGlobalData({...globalData, theme_color: e.target.value})}
                                    className="flex-1 bg-transparent border-none outline-none font-mono uppercase text-slate-700 font-bold text-lg"
                                />
                            </div>
                        </div>


                        {/* โลโก้ */}
                        <div className="space-y-4 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <span className="flex items-center gap-2">
                                    <div className="p-1.5 bg-pink-50 text-pink-500 rounded-md"><ImageIcon size={14}/></div>
                                    โลโก้ร้าน (Shop Logo)
                                </span>
                                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
                                    <button type="button" onClick={() => setGlobalData({...globalData, brand_config: {...globalData.brand_config, logo_type: 'image'}})} className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${globalData.brand_config.logo_type !== 'emoji' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>อัปโหลดรูปภาพ</button>
                                    <button type="button" onClick={() => setGlobalData({...globalData, brand_config: {...globalData.brand_config, logo_type: 'emoji'}})} className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${globalData.brand_config.logo_type === 'emoji' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-yellow-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>อีโมจิเรืองแสง</button>
                                </div>
                            </label>

                            {globalData.brand_config.logo_type === 'emoji' ? (
                                <div className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-[2rem] border border-yellow-100/80 flex flex-col items-center justify-center relative overflow-hidden">
                                    <input type="text" maxLength={2} value={globalData.brand_config.logo_emoji} onChange={e => setGlobalData({...globalData, brand_config: {...globalData.brand_config, logo_emoji: e.target.value}})} className="w-28 h-28 text-6xl text-center bg-white border-2 border-yellow-200 rounded-full shadow-[0_0_40px_rgba(234,179,8,0.15)] outline-none focus:ring-4 focus:ring-yellow-400/30 focus:border-yellow-400 transition-all z-10 relative" />
                                    <p className="text-xs text-yellow-700 mt-4 font-bold tracking-wide uppercase bg-yellow-100/50 px-4 py-1.5 rounded-full">พิมพ์อีโมจิที่ต้องการ</p>
                                </div>
                            ) : (
                                <div className="relative group w-48 h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300">
                                    {globalData.logo_url ? (
                                        <>
                                            <img src={globalData.logo_url} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" alt="Logo" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <button type="button" onClick={() => setGlobalData({...globalData, logo_url: ''})} className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"><X size={20} strokeWidth={2.5} /></button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center transform group-hover:-translate-y-1 transition-transform duration-300">
                                            {uploadingType === 'logo' ? <Loader2 className="animate-spin text-blue-500 mx-auto" size={36} /> : <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 group-hover:text-blue-500 transition-colors"><ImageIcon size={24} /></div>}
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">อัปโหลดโลโก้</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')} />
                                </div>
                            )}
                        </div>

                    </div>
                </section>
                
                {/* 2. การเชื่อมต่อ API & LINE (โค้ดส่วนนี้ยกของเดิมมาต่อท้ายได้เลยครับ) */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4">
                        <MessageCircle size={20} className="text-green-500" /> การเชื่อมต่อ LINE (LINE OA Integration)
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">LINE Channel Token</label>
                            <textarea 
                                rows={3}
                                value={globalData.line_channel_token} 
                                onChange={e => setGlobalData({...globalData, line_channel_token: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">LINE Target ID (กลุ่มเป้าหมาย)</label>
                            <input 
                                type="text" 
                                value={globalData.line_target_id} 
                                onChange={e => setGlobalData({...globalData, line_target_id: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                ไอดีไลน์สำหรับติดต่อ
                            </label>
                            <p className="text-[14px] text-slate-500 mb-2">ใส่ ID (มี @) หรือลิงก์ (https://lin.ee/...) เพื่อให้ผู้เล่นกดติดต่อจากหน้า Login</p>
                            <input 
                                type="text" 
                                value={globalData.line_id} 
                                onChange={e => setGlobalData({...globalData, line_id: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                placeholder="เช่น @thailotto หรือลิงก์สั้น"
                            />
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}