import { useEffect, useState } from 'react';
import client from '../../api/client';
import { Layers, RefreshCw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/toastUtils';
import { useShop } from '../../contexts/ShopContext';


export default function CategoryColorSettings() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { shop } = useShop();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
        const res = await client.get('/play/categories');
        setCategories(res.data);
    } catch (err) {
        console.error("Fetch categories error:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleInitDefaultCategories = async () => {
        confirmAction("ยืนยันการเพิ่มหมวดหมู่มาตรฐาน?\n(ระบบจะเพิ่มเฉพาะหมวดหมู่ที่ยังไม่มี)", async () => {
            setLoading(true);
            try {
                const res = await client.post('/play/categories/init_defaults');
                toast.success(res.data.message);
                fetchCategories(); // รีเฟรชข้อมูลทันที
            } catch (err: any) {
                console.error(err);
                toast.error('ทำรายการไม่สำเร็จ');
            } finally {
                setLoading(false);
            }
        });
    };

  // ฟังก์ชันบันทึกสีหมวดหมู่ (แยกออกมาทำทีละอัน)
  const handleUpdateCategoryColor = async (catId: string, newColor: string) => {
      // 1. อัปเดต State ให้เห็นผลทันที (Optimistic UI) เพื่อความลื่นไหล
      setCategories(prev => prev.map(c => c.id === catId ? { ...c, color: newColor } : c));

      // 2. ส่ง API บันทึกลงฐานข้อมูล
      try {
          const cat = categories.find(c => c.id === catId);
          if (!cat) return;

          // ส่งค่าไปอัปเดต (ส่ง label เดิมกลับไปด้วย เพราะ API อาจจะต้องการ)
          await client.put(`/play/categories/${catId}`, {
              label: cat.label,
              color: newColor 
          });
      } catch (err) {
          console.error(err);
          toast.error('บันทึกสีหมวดหมู่ไม่สำเร็จ');
          fetchCategories(); // โหลดค่าเดิมกลับมาถ้าพัง
      }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Layers size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-800">2. แยกสีตามหมวดหมู่ (Category Theme)</h3>
                    <p className="text-xs text-slate-500">กำหนดสีเฉพาะกลุ่ม (เช่น หวยรัฐบาลสีแดง, หวยหุ้นสีเขียว)</p>
                </div>
            </div>
            <button 
                onClick={handleInitDefaultCategories}
                className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg font-bold transition-all flex items-center gap-2 border border-transparent hover:border-blue-100"
                title="สร้างหมวดหมู่พื้นฐาน (รัฐบาล, ฮานอย, ลาว...)"
            >
                <Layers size={14}/> + หมวดหมู่พื้นฐาน
            </button>
            <button 
                onClick={fetchCategories} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-colors"
                title="โหลดข้อมูลใหม่"
            >
                <RefreshCw size={18}/>
            </button>
        </div>

        {categories.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                ยังไม่มีหมวดหมู่หวยในระบบ
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((cat) => {
                    // เช็คว่าเป็น Hex Color หรือไม่ (ถ้าเป็น class เช่น bg-red-500 แสดงว่ายังไม่ได้ตั้งค่าสีแบบใหม่)
                    const isHex = cat.color?.startsWith('#');
                    const currentColor = isHex ? cat.color : (shop?.theme_color || '#2563EB')

                    return (
                        <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all bg-white">
                            {/* Color Picker Wrapper */}
                            <div className="relative group cursor-pointer shrink-0">
                                <input 
                                    type="color" 
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                    value={currentColor}
                                    // ใช้ onBlur เพื่อบันทึกเมื่อปล่อยเมาส์/เลือกเสร็จ (ลด Request)
                                    onChange={(e) => {
                                        // อัปเดต UI ทันที
                                        setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, color: e.target.value } : c));
                                    }}
                                    onBlur={(e) => handleUpdateCategoryColor(cat.id, e.target.value)}
                                />
                                <div 
                                    className="w-12 h-12 rounded-lg shadow-sm border-2 border-white ring-1 ring-slate-200 transition-transform group-hover:scale-105"
                                    style={{ backgroundColor: currentColor }}
                                ></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-700 text-sm truncate" title={cat.label}>{cat.label}</div>
                                <div className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1">
                                    {isHex ? (
                                        <span className="uppercase">{cat.color}</span>
                                    ) : (
                                        <span className="text-slate-300 italic flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div> ใช้สีร้าน
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isHex && (
                                <button 
                                    // รีเซ็ตกลับไปเป็นค่า Default (เช่น bg-gray-100 หรือค่าว่าง) เพื่อให้ไปดึงสีร้าน
                                    onClick={() => handleUpdateCategoryColor(cat.id, 'bg-gray-100 text-gray-700')} 
                                    className="text-[10px] text-slate-400 hover:text-red-500 hover:bg-red-50 px-2 py-1.5 rounded transition-colors"
                                    title="รีเซ็ตไปใช้สีร้าน"
                                >
                                    รีเซ็ต
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
        )}
    </section>
  );
  
}