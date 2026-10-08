import { User, Lock } from 'lucide-react';
import { ShopLogo, ShopName } from '../../../components/admin/BrandLogo';

export default function LoginBoxUI({ shopData }: { shopData: any }) {
    const config = shopData.login_config;
    const brand = shopData.brand_config || {};

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 relative z-10 pointer-events-none select-none">
            <div className="flex flex-col items-center mb-8 w-full">
                {/* 🟢 เพิ่ม ShopLogo เข้ามาในหน้าพรีวิว */}
                <ShopLogo 
                    logoUrl={shopData.logo_url} 
                    brandConfig={brand} 
                    className="mb-4"
                />
                
                <ShopName 
                    name={shopData.name} 
                    brandConfig={brand}
                />
            </div>
            
            {/* ส่วน Input ฟอร์ม (แสดงเป็นตัวอย่าง) */}
            <div className="space-y-4 md:space-y-5 w-full relative z-10 px-2 md:px-0">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><User size={18} /></div>
                    <div className="w-full h-11 md:h-[52px] bg-black/40 border border-white/10 rounded-xl flex items-center px-11 shadow-inner backdrop-blur-md">
                        <span className="text-gray-500 text-sm">กรอกชื่อผู้ใช้งาน</span>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Lock size={18} /></div>
                    <div className="w-full h-11 md:h-[52px] bg-black/40 border border-white/10 rounded-xl flex items-center px-11 shadow-inner backdrop-blur-md">
                        <span className="text-gray-500 text-sm">กรอกรหัสผ่าน</span>
                    </div>
                </div>
                <div className="w-full py-3.5 md:py-4 rounded-xl text-sm md:text-base font-bold text-black uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center mt-4" style={{ background: `linear-gradient(135deg, ${config.name_color_to || '#b8860b'} 0%, #ffd700 50%, ${config.name_color_to || '#b8860b'} 100%)` }}>
                    LOGIN ACCESS
                </div>
            </div>
        </div>
    );
}