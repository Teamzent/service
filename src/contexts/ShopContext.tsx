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
      const urlParams = new URLSearchParams(window.location.search);
      const shopParam = urlParams.get('shop');

      // 1. ถ้าเข้าผ่านลิงก์ที่มี ?shop= ให้จำค่าร้านไว้ใน session ทันที
      if (shopParam) {
        sessionStorage.setItem('current_shop_identifier', shopParam);
      }
      const savedShop = sessionStorage.getItem('current_shop_identifier');

      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      let subdomain = '';

      // 2. เช็คว่าเข้าหน้า SuperAdmin โดยตรงหรือไม่
      if (window.location.pathname.startsWith('/super')) {
        subdomain = '';
      } else if (shopParam || savedShop) {
        subdomain = shopParam || savedShop || '';
      } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        subdomain = parts[0] === 'localhost' || parts[0] === '127' ? '' : parts[0];
      } else if (hostname.endsWith('.vercel.app')) {
        subdomain = parts.length > 3 ? parts[0] : '';
      } else if (parts.length > 2) {
        subdomain = parts[0];
      }

      // 3. กรณีเป็น System Admin (ไม่มีชื่อร้าน)
      if (!subdomain || subdomain === 'www') {
        sessionStorage.removeItem('current_shop_identifier');
        setShop(null);
        setError(false);
        setIsLoading(false);
        return;
      }

      // 4. ดึงข้อมูลร้านค้า
      try {
        const res = await client.get(`/shops/config/${subdomain}`);
        setShop(res.data);
        if (res.data.name) document.title = res.data.name;
        setError(false);

        // ✅ แสดง ?shop=ชื่อร้าน เฉพาะตอนอยู่หน้าแรก (/) หรือหน้า (/login) เท่านั้น
        const path = window.location.pathname;
        if ((path === '/' || path === '/login') && !urlParams.get('shop')) {
          urlParams.set('shop', res.data.subdomain || subdomain);
          window.history.replaceState({}, '', `${path}?${urlParams.toString()}`);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
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
