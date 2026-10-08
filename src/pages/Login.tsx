import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { ShopLogo, ShopName } from '../components/admin/BrandLogo';
import LottoCardWrapper from '../components/admin/LottoCardWrapper';
import PayoutRateBox from '../components/admin/PayoutRateBox';
import { loginApi, registerApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    Loader2, User, Lock, Eye, EyeOff, ShieldCheck, MessageCircle, Trophy
} from 'lucide-react';
import client from '../api/client';

export default function Login() {
    const { shop } = useShop(); 
    
    // ตั้งค่า Default กรณี Database ส่งค่ามาไม่ครบ
    const config = shop?.login_config || {};
    const position = config.box_position || { x: 50, y: 50 };
    const style = config.box_style || {};
    const hero = config.hero_login || { is_visible: false, Hero_url: '', Hero_position: {x: 50, y: 50}, config: {width: 40, height: 50} };
    const payout = config.payout_config || { is_visible: false, position: {x: 20, y: 65}, config: {width: 25} };

    const { login } = useAuth();
    const navigate = useNavigate();

    // States
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // States สำหรับเก็บผลหวย
    const [publicResults, setPublicResults] = useState<any[]>([]);
    const [loadingResults, setLoadingResults] = useState(true);

    // 🟢 ดึงข้อมูลผลหวยเมื่อเปิดหน้าเว็บ
    useEffect(() => {
        const fetchPublicResults = async () => {
            try {
                // เรียกใช้ API เส้นใหม่ที่เราเพิ่งสร้างใน Step 1
                const res = await client.get('/reward/public/daily-results');
                setPublicResults(res.data);
            } catch (err) {
                console.error("Failed to load public results", err);
            } finally {
                setLoadingResults(false);
            }
        };
        fetchPublicResults();
    }, []);

    useEffect(() => {
        if (shop) {
            // 1. เปลี่ยนชื่อแท็บ (Document Title)
            document.title = shop.name ? `${shop.name} - เข้าสู่ระบบ` : 'เข้าสู่ระบบ';
            
            // 2. เปลี่ยนไอคอนแท็บ (Favicon)
            if (shop.logo_url) {
                let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = shop.logo_url;
            }
        }
    }, [shop]);
    // ----------------------------------------------------
    // 1. รับ Token จาก URL (Impersonate / Auto Login) 
    // ----------------------------------------------------
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl) {
            const autoLogin = async () => {
                try {
                    localStorage.setItem('token', tokenFromUrl);
                    localStorage.setItem('is_impersonating', 'true');
                    await login(tokenFromUrl); 
                    
                    toast.success('ยืนยันตัวตนสำเร็จ');
                    window.history.replaceState({}, document.title, window.location.pathname);
                    setTimeout(() => navigate('/', { replace: true }), 100);
                } catch (err: any) {
                    toast.error(err.response?.data?.detail || 'Token ไม่ถูกต้อง หรือ หมดอายุ');
                    localStorage.removeItem('token');
                }
            };
            autoLogin();
        }
    }, [login, navigate]);

    // ----------------------------------------------------
    // 2. Login
    // ----------------------------------------------------
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return toast.error('กรุณากรอกข้อมูลให้ครบ');
        setIsLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await loginApi(formData as any); 
            await login(res.access_token);
            
            toast.success('เข้าสู่ระบบสำเร็จ');
            navigate('/');
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
            toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setIsLoading(false);
        }
    };

    // ----------------------------------------------------
    // 3. Register
    // ----------------------------------------------------
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username || !password || !confirmPassword) return toast.error('กรุณากรอกข้อมูลให้ครบ');
        if (password !== confirmPassword) return toast.error('รหัสผ่านไม่ตรงกัน');
        if (!shop?.id) return toast.error('ไม่พบข้อมูลร้านค้า (Shop ID)');

        setIsLoading(true);
        try {
            await registerApi({
                username: username,
                password: password,
                shop_id: shop.id
            });
            
            toast.success('สมัครสมาชิกสำเร็จ กำลังเข้าสู่ระบบ...');

            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            const res = await loginApi(formData as any); 
            await login(res.access_token);
            
            navigate('/');
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'การสมัครสมาชิกผิดพลาด';
            toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setIsLoading(false);
        }
    };


    return (
        // 🟢 เปลี่ยนจาก min-h-dvh ธรรมดา เป็น Container ที่เลื่อนลงได้ (overflow-x-hidden)
        <div className="w-full min-h-screen bg-slate-950 overflow-x-hidden font-sans">
            
            {/* ========================================== */}
            {/* 🟢 SECTION 1: พื้นที่เข้าสู่ระบบและภาพ Hero (เต็ม 1 หน้าจอแรก) */}
            {/* ========================================== */}
            <section 
                className="relative w-full h-screen min-h-[600px] bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: config.background_url ? `url(${config.background_url})` : 'none' }}
            >
                {/* Overlay พื้นหลัง */}
                <div 
                    className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
                    style={{ backgroundColor: `rgba(0, 0, 0, ${config.background_overlay ?? 0.3})` }}
                />

                {/* 🟢 1. ภาพประกอบ Hero (ดึงมาแสดงแล้ว!) */}
                {hero.is_visible && hero.Hero_url && (
                    <div
                        className="absolute z-[5] flex items-center justify-center pointer-events-none select-none overflow-hidden"
                        style={{
                            left: `${hero.Hero_position?.x ?? 50}%`,
                            top: `${hero.Hero_position?.y ?? 50}%`,
                            transform: 'translate(-50%, -50%)',
                            width: `clamp(100px, ${hero.config?.width ?? 40}%, 100vw)`,
                            height: `clamp(100px, ${hero.config?.height ?? 50}%, 100vh)`,
                        }}
                    >
                        <img 
                            src={hero.Hero_url} 
                            alt="Hero Presenter" 
                            className="w-full h-full object-cover drop-shadow-[0_0_40px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-700" 
                        />
                    </div>
                )}

                {/* 🟢 3. กล่องแสดงโฆษณาเรทจ่าย (Payout Rate Box) */}
                {payout.is_visible && (
                    <div 
                        className="absolute z-10 transition-all duration-700 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-10"
                        style={{ 
                            left: `${payout.position?.x ?? 20}%`,
                            top: `${payout.position?.y ?? 65}%`,
                            transform: 'translate(-50%, -50%)',
                            width: `clamp(280px, ${payout.config?.width ?? 25}%, 95vw)`,
                            height: payout.config?.height ?? 'auto',
                            margin: 0 
                        }}
                    >
                        <PayoutRateBox config={payout} brandColors={shop?.brand_config?.name_colors} />
                    </div>
                )}
                
                {/* 🟢 2. กล่อง Login (รับค่า CSS จาก Settings เหมือนเดิม) */}
                <div 
                    className="absolute z-10 p-6 sm:p-8 transition-all duration-500 flex flex-col justify-center overflow-hidden"
                    style={{ 
                        left: `${position.x ?? 50}%`,
                        top: `${position.y ?? 50}%`,
                        transform: 'translate(-50%, -50%)',
                        width: `clamp(340px, ${style.width ?? 40}%, 95vw)`,
                        minHeight: `clamp(400px, ${style.height ?? 50}%, 90vh)`,
                        borderRadius: `${style.border_radius ?? 24}px`,
                        borderStyle: 'solid',
                        borderWidth: `${style.border_width ?? 2}px`,
                        borderColor: style.border_color ?? '#ffd700',
                        boxShadow: `${style.shadow_x ?? 0}px ${style.shadow_y ?? 20}px ${style.shadow_blur ?? 50}px ${style.shadow_color ?? 'rgba(0,0,0,0.5)'}`,
                        backgroundColor: style.is_glassmorphism 
                            ? `rgba(${parseInt((style.box_bg_color || '#ffffff').slice(1, 3), 16)}, ${parseInt((style.box_bg_color || '#ffffff').slice(3, 5), 16)}, ${parseInt((style.box_bg_color || '#ffffff').slice(5, 7), 16)}, ${style.box_bg_opacity ?? 0.1})` 
                            : (style.box_bg_color || '#0f172a'),
                        backdropFilter: style.is_glassmorphism ? `blur(${style.box_bg_blur ?? 20}px)` : 'none',
                        WebkitBackdropFilter: style.is_glassmorphism ? `blur(${style.box_bg_blur ?? 20}px)` : 'none',
                        margin: 0 
                    }}
                >
                    <div className="flex flex-col items-center mb-8 relative z-10 w-full">
                        {/* 1. โลโก้ร้าน */}
                        <ShopLogo logoUrl={shop?.logo_url} brandConfig={shop?.brand_config} className="mb-4"/>
                        
                        {/* 2. ชื่อร้าน (แสดงอยู่บนหัวตลอดเวลา ไม่โดนคำอื่นเขียนทับแล้ว) */}
                        <ShopName name={shop?.name || 'Thailot'} brandConfig={shop?.brand_config} />
                        
                        {/* 3. ข้อความบอกสถานะ (สลับระหว่าง LOG IN และ REGISTER ตัวหนา ดีไซน์เข้ากับธีมกล่อง) */}
                        <h2 className="text-sm font-black tracking-widest text-yellow-500/90 uppercase mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            {isRegister ? 'REGISTER' : 'LOG IN'}
                        </h2>
                    </div>

                    <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5 relative z-10">
                        {/* Username Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest ml-1 drop-shadow-sm">
                                {isRegister ? 'Phone Number / Username' : 'Username'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-500 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/50 transition-all shadow-inner backdrop-blur-md"
                                    placeholder={isRegister ? "เบอร์โทรศัพท์ของคุณ" : "กรอกชื่อผู้ใช้งาน"}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest ml-1 drop-shadow-sm">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/50 transition-all shadow-inner backdrop-blur-md"
                                    placeholder="กรอกรหัสผ่าน"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        {isRegister && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                <label className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest ml-1 drop-shadow-sm">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/50 transition-all shadow-inner backdrop-blur-md"
                                        placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                                    />
                                </div>
                            </div>
                        )}

                        {/* 🟢 ปุ่ม Login ที่ดึงสีจากแบรนด์อัตโนมัติ */}
                        <button 
                            type="submit" disabled={isLoading}
                            className="w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 relative overflow-hidden group/btn"
                            style={{ 
                                background: `linear-gradient(135deg, ${shop?.brand_config?.name_colors?.[0] || '#2563EB'} 0%, ${shop?.brand_config?.name_colors?.slice(-1)[0] || '#4F46E5'} 50%, ${shop?.brand_config?.name_colors?.[0] || '#2563EB'} 100%)` 
                            }}
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover/btn:translate-x-full transition-transform duration-500 ease-in-out skew-x-12 -ml-20 w-1/2 h-full"></div>
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isRegister ? 'CREATE ACCOUNT' : 'LOGIN ACCESS')}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col items-center gap-4 relative z-10">
                        <button 
                            onClick={() => { setIsRegister(!isRegister); setUsername(''); setPassword(''); setConfirmPassword(''); }}
                            className="text-sm text-gray-300 hover:text-yellow-400 transition-colors flex items-center gap-2 drop-shadow-md"
                        >
                            {isRegister ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิกที่นี่'}
                        </button>

                        {shop?.line_id && (
                            <a 
                                href={shop.line_id.startsWith('http') ? shop.line_id : shop.line_id.startsWith('@') ? `https://line.me/R/ti/p/${shop.line_id}` : `https://line.me/ti/p/~${shop.line_id}`} 
                                target="_blank" rel="noreferrer" 
                                className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 transition-colors bg-green-900/40 px-5 py-2.5 rounded-full border border-green-500/30 backdrop-blur-md shadow-lg"
                            >
                                <MessageCircle size={14} /> สมัครผ่านแอดมิน
                            </a>
                        )}
                    </div>

                    <div className="mt-6 flex justify-center opacity-40 hover:opacity-100 transition-opacity relative z-10">
                        <div className="flex items-center gap-1.5 text-[10px] text-white uppercase tracking-widest drop-shadow-md">
                            <ShieldCheck size={12} className="text-yellow-500" />
                            <span>SECURE CONNECTION SYSTEM</span>
                        </div>
                    </div>
                </div>

                {/* 🟢 3. ปุ่มลูกศรเลื่อนลง (Scroll Indicator) บอกผู้เล่นว่ามีตารางหวยอยู่ข้างล่าง */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce opacity-60 hover:opacity-100 transition-opacity hidden md:flex">
                    <span className="text-[9px] text-white/80 uppercase tracking-widest mb-2 font-bold drop-shadow-md">ดูผลรางวัล</span>
                    <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5 shadow-lg bg-black/20 backdrop-blur-sm">
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                    </div>
                </div>

            </section>

            {/* ========================================== */}
            {/* 🟢 SECTION 2: พื้นที่ตารางผลหวยล่าสุด */}
            {/* ========================================== */}
            {config.results_section?.is_visible && (
            <section className="min-h-screen w-full bg-[#050810] relative z-20 p-6 md:p-12 flex flex-col items-center border-t border-white/5 pb-32">
                
                {/* เอฟเฟกต์แสงพื้นหลัง */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

                <div className="max-w-6xl w-full mx-auto space-y-12 mt-10 md:mt-20 relative z-10">
                    {/* หัวข้อ Section */}
                    <div className="text-center space-y-4">
                        <h2 
                            className="text-3xl md:text-5xl font-black uppercase tracking-tight"
                            style={{
                                background: `linear-gradient(to right, ${shop?.brand_config?.name_colors?.[0] || '#FFF'}, ${shop?.brand_config?.name_colors?.slice(-1)[0] || '#D4AF37'})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {config.results_section?.title || "ผลรางวัลล่าสุด"}
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base font-medium">
                            อัปเดตผลรางวัลรวดเร็ว แม่นยำ ส่งตรงจากระบบ
                        </p>
                    </div>

                    {/* พื้นที่แสดงการ์ดผลหวย */}
                    {loadingResults ? (
                        <div className="flex flex-col justify-center items-center py-20 text-blue-500">
                            <Loader2 className="animate-spin mb-4" size={48} />
                            <span className="font-bold tracking-widest text-sm uppercase">Loading Results...</span>
                        </div>
                    ) : publicResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {publicResults.slice(0, config.results_section.display_limit).map((lotto: any) => (
                                <LottoCardWrapper 
                                    key={lotto.id} 
                                    lotto={lotto} 
                                    config={config.results_section} 
                                    brandColors={shop?.brand_config?.name_colors} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 text-slate-500 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-sm border-dashed">
                            <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold text-lg">ยังไม่มีการประกาศผลรางวัลในวันนี้</p>
                            <p className="text-sm mt-2 opacity-50">กรุณารอการอัปเดตจากระบบเร็วๆ นี้</p>
                        </div>
                    )}
                </div>
            </section>
            )}

        </div>
    );
}