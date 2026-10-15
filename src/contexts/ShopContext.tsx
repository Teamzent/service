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
  isLoading: boolean;
  isSystemAdmin: boolean;
  error: boolean;
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
      if (shopParam || savedShop) {
        subdomain = shopParam || savedShop || '';
      } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        subdomain = parts[0] === 'localhost' || parts[0] === '127' ? '' : parts[0];
      } else if (hostname.endsWith('.vercel.app')) {
        subdomain = parts.length > 3 ? parts[0] : '';
      } else if (parts.length > 2) {
        subdomain = parts[0];
      }

      // 3. กรณีเป็น System Admin (ไม่มี Subdomain หรือเป็น 'www')
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

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
};
