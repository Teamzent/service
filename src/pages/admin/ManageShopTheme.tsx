import { useEffect, useState } from 'react';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import ThemeSidebar from './ThemeBuilder/ThemeSidebar';
import ThemeSimulator from './ThemeBuilder/ThemeSimulator';

export default function ManageShopTheme({ onClose }: { onClose?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // โครงสร้างหลัก (แยก brand_config ออกมาจาก login_config)
    const [shopData, setShopData] = useState({
        name: 'Thailot',
        logo_url: '',
        brand_config: {
            font_family: "Kanit",
            fill_type: "color",
            name_colors: ["#f3f4f6", "#ca8a04"],
            texture_url: "",
            text_shadow: "0px 2px 1px #996515, 0px 10px 15px rgba(0,0,0,0.5)",
            text_stroke: 'none',
            logo_type: "image",
            logo_emoji: "👑"
        },
        login_config: {
            background_url: '',
            background_overlay: 0.3,
            box_position: { x: 50, y: 50 },
            box_style: { 
                is_glassmorphism: true, border_color: '#ffd700', border_width: 2,
                width: 40, height: 50, border_radius: 24,
                shadow_x: 0, shadow_y: 20, shadow_blur: 50, shadow_color: '#00000080',
                box_bg_opacity: 0.1, box_bg_blur: 20, box_bg_color: '#ffffff'
            },
            hero_login: {
                Hero_url: "",
                is_visible: true,
                Hero_position:  { x: 50, y: 50 },
                config: { width: 40, height: 50 }
            },
            results_section: {
                is_visible: true,
                title: "ผลรางวัลล่าสุด",
                display_limit: 10,
                theme: "glass"
            },
            payout_config: {
                is_visible: true,
                position: { x: 20, y: 65 },
                config: { width: 25, height: "auto" },
                rates: { top3: 900, tod3: 120, top2: 90, bottom2: 90, run_top: 3.2, run_bottom: 4.2 }
            }
        }
    });
    useEffect(() => {
        const fetchShopConfig = async () => {
            setLoading(true);
            try {
                const res = await client.get('/shops/');
                if (res.data && res.data.length > 0) {
                    const myShop = res.data[0];
                    setShopData(prev => ({
                        ...prev,
                        name: myShop.name || prev.name,
                        logo_url: myShop.logo_url || prev.logo_url,
                        brand_config: { ...prev.brand_config, ...(myShop.brand_config || {}) },
                        login_config: {
                            ...prev.login_config,
                            ...myShop.login_config,
                            hero_login: { 
                                ...prev.login_config.hero_login, 
                                ...(myShop.login_config?.hero_login || {}) 
                            },
                            box_style: { ...prev.login_config.box_style, ...(myShop.login_config?.box_style || {}) },
                            box_position: { ...prev.login_config.box_position, ...(myShop.login_config?.box_position || {}) },

                            results_section: {
                                ...prev.login_config.results_section,
                                ...(myShop.login_config?.results_section || {})
                            },
                            payout_config: {
                                ...(prev.login_config.payout_config || { is_visible: true, position: {x:20, y:65}, config: {width: 25, height: "auto"}, rates: {top3: 900, tod3: 120, top2: 90, bottom2: 90, run_top: 3.2, run_bottom: 4.2} }),
                                ...(myShop.login_config?.payout_config || {})
                            }
                        }
                    }));
                }
            } catch (err) {
                toast.error('โหลดข้อมูลร้านไม่สำเร็จ');
            } finally {
                setLoading(false);
            }
        };
        fetchShopConfig();
    }, []);

    const handleFileUploadBg = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'theme');
        try {
            const res = await client.post('/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            setShopData(prev => ({ ...prev, login_config: { ...prev.login_config, background_url: res.data.url }}));
            toast.success('อัปโหลดรูปภาพสำเร็จ');
        } catch (err) {
            toast.error('อัปโหลดรูปภาพไม่สำเร็จ');
        }
    };

    const handleFileUploadHero = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'theme');
        try {
            const res = await client.post('/upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            setShopData(prev => ({ 
                ...prev, 
                login_config: { 
                    ...prev.login_config, 
                    hero_login: { ...prev.login_config.hero_login, Hero_url: res.data.url }
                }
            }));
            toast.success('อัปโหลดภาพ Hero สำเร็จ');
        } catch (err) {
            toast.error('อัปโหลดภาพ Hero ไม่สำเร็จ');
        }
    };

    const handleSaveShop = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.put('/shops/config', shopData);
            toast.success('บันทึกข้อมูลร้านค้าเรียบร้อย');
            if(onClose) onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'บันทึกไม่สำเร็จ');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
            <p className="animate-pulse font-medium">กำลังเตรียมสตูดิโอออกแบบของคุณ...</p>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-[#0f172a] overflow-hidden font-sans">
            <ThemeSimulator shopData={shopData} setShopData={setShopData} />
            <ThemeSidebar 
                shopData={shopData} 
                setShopData={setShopData} 
                onClose={onClose} 
                onSave={handleSaveShop} 
                submitting={submitting} 
                onUploadBg={handleFileUploadBg} 
                onUploadHero={handleFileUploadHero}
            />
        </div>
    );
}