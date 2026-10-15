import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

interface Shop {
  id: string;
  name: string;
  subdomain: string;
  logo_url?: string;
  theme_color?: string;
  line_id?: string;
  login_config?: any;
  brand_config?: any;
}

interface ShopContextType {
  shop: Shop | null;
  isLoading: boolean;     // ✅ ชื่อที่ถูกต้อง
  isSystemAdmin: boolean;
  error: boolean;         // ✅ เพิ่มตัวนี้กลับมา
}

const ShopContext = createContext<ShopContextType | null>(null);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initShop = async () => {
      // 1. ตรวจสอบ Query Parameter ?shop= จาก URL ก่อน
      const urlParams = new URLSearchParams(window.location.search);
      const shopParam = urlParams.get('shop');

      // จดจำค่า shop ไว้ใน sessionStorage เผื่อผู้ใช้เปลี่ยนหน้าแล้ว query param หาย
      if (shopParam) {
        sessionStorage.setItem('current_shop_identifier', shopParam);
      }
      const savedShop = sessionStorage.getItem('current_shop_identifier');

      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      let subdomain = '';

      // 2. ลำดับการตรวจสอบ Subdomain:
      // A. ถ้ามีระบุผ่าน ?shop= หรือมีค่าที่จำไว้ใน Session ให้ใช้อันนี้ก่อน
      if (shopParam || savedShop) {
        subdomain = shopParam || savedShop || '';
      } 
      // B. ตรวจสอบ localhost / 127.0.0.1
      else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        subdomain = parts[0] === 'localhost' || parts[0] === '127' ? '' : parts[0];
      } 
      // C. โดเมนฟรี Vercel (service-zeta-nine.vercel.app)
      else if (hostname.endsWith('.vercel.app')) {
        subdomain = parts.length > 3 ? parts[0] : '';
      } 
      // D. Custom Domain จริง (เช่น shop1.yourdomain.com)
      else if (parts.length > 2) {
        subdomain = parts[0];
      }

      // 3. กรณีเป็น System Admin (ไม่มี Subdomain หรือเข้าผ่านหน้าหลัก SuperAdmin)
      // เคลียร์ session ทิ้งหากเข้าหน้าหลักแบบไม่มี ?shop เพื่อกลับสู่โหมด SuperAdmin
      if (!subdomain || subdomain === 'www') {
        sessionStorage.removeItem('current_shop_identifier');
        setShop(null);
        setError(false);
        setIsLoading(false);
        return;
      }

      // 4. กรณีเป็นร้านค้า -> ยิง API ดึงข้อมูล
      try {
        const res = await client.get(`/shops/config/${subdomain}`);
        setShop(res.data);
        if (res.data.name) document.title = res.data.name;
        setError(false);
      } catch (err: any) {
        // 5. ถ้าหาไม่เจอ (404) -> ถือว่าเป็น Error (ร้านปิด/ไม่มีจริง)
        if (err.response?.status === 404) {
          console.warn("Shop not found");
          sessionStorage.removeItem('current_shop_identifier');
          setShop(null);
          setError(true);
        } else {
          console.error("Failed to load shop config:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initShop();
  }, []);

  const isSystemAdmin = !shop && !error;

  return (
    <ShopContext.Provider value={{ shop, isLoading, isSystemAdmin, error }}>
      {children}
    </ShopContext.Provider>
  );
};
