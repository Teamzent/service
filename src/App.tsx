import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Loader2, AlertTriangle, Store } from 'lucide-react';

import { useShop } from './contexts/ShopContext';

// Components & Pages
import Login from './pages/Login';
import { RoleGuard } from './components/RoleGuard';

// Pages - Dashboard
import ShopHistory from './pages/dashboard/ShopHistory';

// Pages - SuperAdmin
import SuperAdminLayout from './layouts/SuperAdminLayout';
import SuperShopManagement from './pages/superadmin/SuperShopManagement';
import SuperDashboard from './pages/superadmin/SuperDashboard';
import ManageLottoTemplates from './pages/superadmin/ManageLottoTemplates';
import ManageRates from './pages/admin/ManageRates'; // ใช้ร่วมกัน

// Pages - Admin
import AdminLayout from './layouts/AdminLayout';
import ShopThemeManagement from './pages/admin/ShopThemeManagement'; 
import LottoManagement from './pages/admin/LottoManagement'; 
import ManageResults from './pages/admin/ManageResults';
import Dashboard from './pages/admin/Dashboard';

// Pages - Member
import MemberLayout from './layouts/MemberLayout';
import History from './pages/dashboard/History';
import LottoMarket from './pages/member/LottoMarket';
import BettingRoom from './pages/member/BettingRoom';
import MemberResults from './pages/member/MemberResults';
import Profile from './pages/member/Profile';
import LottoResultLinks from './pages/member/LottoResultLinks';

// --- Logic การ Redirect ตาม Role ---
const RedirectBasedOnRole = () => {
  const { user, isLoading } = useAuth();
  // 1. ถ้ากำลังโหลด User อยู่ ให้หมุนติ้วๆ รอก่อน (อย่าเพิ่งดีด)
  if (isLoading) {
      return (
          <div className="h-screen flex items-center justify-center bg-slate-50">
             <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
      );
  }

  // 2. ถ้าโหลดเสร็จแล้ว แต่ไม่มี User ค่อยดีดไป Login
  if (!user) return <Navigate to="/login" />;

  // 3. ถ้ามี User ก็ไปตาม Role
  switch (user.role) {
    case 'superadmin': return <Navigate to="/super/dashboard" />;
    case 'admin': return <Navigate to="/admin/dashboard" />;
    case 'member': return <Navigate to="/play" />;
    default: return <div className="text-center p-10 text-red-500">Unknown Role</div>;
  }
};

// --- Main App Component ---
function App() {
  // 1. เรียกใช้ Hook ตรวจสอบร้านค้า (Subdomain)
  const { shop, isLoading, error } = useShop();

  // 2. แสดงหน้า Loading ระหว่างเช็ค Subdomain
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Store size={24} className="text-blue-600 opacity-50" />
            </div>
        </div>
        <p className="mt-4 text-slate-400 font-medium animate-pulse text-sm">กำลังเชื่อมต่อเข้าร้านค้า...</p>
      </div>
    );
  }

  // 3. แสดงหน้า 404 (Not Found) ถ้าร้านปิด หรือไม่มีอยู่จริง
  // นี่คือจุดสำคัญที่ทำให้เหมือน "เว็บหายไป" เมื่อปิดร้าน
  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 text-slate-500 p-4 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-2">404</h1>
            <h2 className="text-lg font-bold mb-4 text-slate-600">ไม่พบร้านค้าที่คุณต้องการ</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
                ลิงก์ที่คุณเข้าถึงอาจไม่ถูกต้อง
            </p>
            <div className="mt-8 border-t border-gray-100 pt-6">
                <a href="/" className="text-blue-600 font-bold hover:underline text-sm transition-all hover:text-blue-700">
                    กลับสู่หน้าหลัก
                </a>
            </div>
        </div>
      </div>
    );
  }

  // 4. ถ้าผ่านหมด (ร้านเปิดปกติ) ให้โหลดระบบ Router
  // (ถ้ามี shop object กลับมา แสดงว่าเป็นร้านค้า จะเอา shop.name ไปแปะหัวเว็บก็ได้)
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { background: '#333', color: '#fff', borderRadius: '12px', fontSize: '14px' },
            success: { style: { background: '#10B981', color: 'white' }, iconTheme: { primary: 'white', secondary: '#10B981' } },
            error: { style: { background: '#EF4444', color: 'white' }, iconTheme: { primary: 'white', secondary: '#EF4444' } },
          }}
        />
        
        {import.meta.env.DEV && shop && (
            <div className="fixed bottom-2 right-2 z-9999 bg-black/80 text-white text-[10px] px-3 py-1 rounded-full pointer-events-none shadow-lg backdrop-blur-sm">
                🏬 Shop Mode: <span className="font-bold text-yellow-400">{shop.name}</span>
            </div>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<div className="h-screen flex items-center justify-center text-red-500 font-bold">ไม่มีสิทธิ์เข้าถึงส่วนนี้</div>} />

          {/* --- SuperAdmin Zone --- */}
          <Route element={<RoleGuard allowedRoles={['superadmin']} />}>
            <Route path="/super" element={<SuperAdminLayout />}>
              <Route path="dashboard" element={<SuperDashboard />} /> 
              <Route path="shops" element={<SuperShopManagement />} />
              <Route path="lottos" element={<ManageLottoTemplates />} /> 
              <Route path="rates" element={<ManageRates />} />
            </Route>
          </Route>

          {/* --- Admin Zone --- */}
          <Route element={<RoleGuard allowedRoles={['superadmin', 'admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="shop-lotto" element={<LottoManagement />} /> 
              <Route path="shop-theme" element={<ShopThemeManagement />} /> 
              <Route path="ShopHistory" element={<ShopHistory />} />
              <Route path="results" element={<ManageResults />} />
            </Route>
          </Route>

          {/* --- Member Zone --- */}
          <Route element={<RoleGuard allowedRoles={['member', 'admin', 'superadmin']} />}>
            <Route element={<MemberLayout />}>
              <Route path="play" element={<LottoMarket />} />
              <Route path="play/:id" element={<BettingRoom />} />
              <Route path="history" element={<History />} />
              <Route path="results" element={<MemberResults />} />
              <Route path="profile" element={<Profile />} />
              <Route path="resultslink" element={<LottoResultLinks />} />
            </Route>
          </Route>

          <Route path="/" element={<RedirectBasedOnRole />} />
          
          {/* Catch all 404 สำหรับ Path ที่ไม่เจอภายในร้าน */}
          <Route path="*" element={<RedirectBasedOnRole />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;