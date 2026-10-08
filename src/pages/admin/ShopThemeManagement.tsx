import { useState } from 'react';
import { Store, MonitorPlay, Settings, Palette } from 'lucide-react';
import ManageShopTheme from './ManageShopTheme'; 
import GlobalSettings from './GlobalSettings'; // 🟢 Import GlobalSettings เข้ามา

export default function ShopThemeManagement() {
  const [isEditing, setIsEditing] = useState(false);
  
  // 🟢 State สำหรับควบคุม Tab ปัจจุบัน ('global' หรือ 'theme')
  const [activeTab, setActiveTab] = useState<'global' | 'theme'>('global');

  // ถ้าเปิดโหมดแก้ไข ให้โหลดคอมโพเนนต์แต่งหน้าเว็บเต็มจอ (ปิด Tab ไปเลย)
  if (isEditing) {
    return <ManageShopTheme onClose={() => setIsEditing(false)} />;
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-10 animate-fade-in font-sans">
      
      {/* ========================================== */}
      {/* 🟢 ส่วน Header และเมนู Tabs */}
      {/* ========================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* หัวข้อ */}
            <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                    <Store className="text-blue-600 hidden md:block" size={28} />
                    จัดการธีมสีและรูปแบบร้านค้า
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                    ตั้งค่าข้อมูลร้าน โลโก้ และปรับแต่งหน้า Login
                </p>
            </div>

            {/* 🟢 ปุ่ม Tabs สลับหน้า */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 shadow-inner w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('global')} 
                    className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        activeTab === 'global' 
                        ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-blue-600' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                    <Settings size={18} /> ข้อมูลร้าน & โลโก้
                </button>
                <button 
                    onClick={() => setActiveTab('theme')} 
                    className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        activeTab === 'theme' 
                        ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-blue-600' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                    <Palette size={18} /> แต่งหน้า Login
                </button>
            </div>
            
        </div>
      </div>

      {/* ========================================== */}
      {/* 🟢 ส่วนพื้นที่แสดงเนื้อหา (Content Area) */}
      {/* ========================================== */}
      <div className="mt-6">
          {activeTab === 'global' ? (
              
              /* ---------------- แถบที่ 1: ตั้งค่า Global Settings ---------------- */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <GlobalSettings />
              </div>

          ) : (

              /* ---------------- แถบที่ 2: ปุ่มเปิดหน้าต่าง Login Builder ---------------- */
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                 <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                    <MonitorPlay size={40} className="text-blue-600" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">หน้าต่างปรับแต่ง Login แบบอิสระ</h3>
                 <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    เข้าสู่โหมดหน้าต่างจำลอง (Simulator) เพื่อให้คุณสามารถลากวางตำแหน่งกล่อง และตั้งค่าการแสดงผลได้แม่นยำ 100%
                 </p>
                 <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-slate-200 transition-all flex items-center gap-2 active:scale-95 group"
                 >
                    <MonitorPlay size={20} className="group-hover:scale-110 transition-transform" />
                    เปิดตัวปรับแต่งธีม (Full Screen)
                 </button>
              </div>

          )}
      </div>
      
    </div>
  );
}