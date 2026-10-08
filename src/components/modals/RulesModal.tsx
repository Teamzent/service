import { X, FileText, AlertCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <FileText className="text-amber-400" /> กฎและกติกา  Thailot
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-700 space-y-6 text-sm leading-relaxed">
          
          {/* Section 1: Intro */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={24} />
            <div>
              <p className="font-bold text-amber-800 mb-1">ข้อตกลงเบื้องต้น</p>
              <p className="text-amber-700 text-xs">
               Thailot ยึดเอาข้อมูลที่เอเย่นต์และสมาชิกทุกคนทำรายการบนหน้าเว็บไซต์เป็นหลัก กรุณาตรวจสอบรายการเล่นและพิมพ์เก็บไว้เป็นหลักฐานเสมอ 
                หากมีข้อสงสัยโปรดติดต่อต้นสายของท่านก่อนออกผลรางวัล มิเช่นนั้นบริษัทจะถือเอารายการแทงและข้อมูลที่เกิดขึ้นในเว็บไซต์เป็นหลักเสมอ
              </p>
            </div>
          </div>

          {/* Section 2: General Rules */}
          <div>
            <h4 className="font-black text-slate-800 text-base mb-3 border-b pb-2 border-slate-200">
              1. กติกาและข้อกำหนดทั่วไป
            </h4>
            <ol className="list-decimal pl-5 space-y-3 marker:font-bold marker:text-blue-600">
              <li>
                <span className="font-bold text-slate-900">การแทงหวย:</span> สมาชิกสามารถเข้าเล่นที่เมนู "แทงหวย" 
                <span className="text-red-600 font-bold block mt-1">**สำคัญ** โปรดตรวจทานทุกครั้งก่อนกดยืนยัน เพราะแทงแล้วยกเลิกไม่ได้</span>
                แนะนำให้บันทึกภาพ/พิมพ์หลักฐานการแทงเก็บไว้ทุกครั้ง
              </li>
              <li>ตรวจสอบรายการที่แทงแล้วได้ที่ "ส่วนขวาของหน้าแทงหวย" และเมนู "รายการแทง"</li>
              <li>ตรวจสอบรายการที่ประกาศผลแล้วได้ที่เมนู "รายการการเงิน"</li>
              <li>เช็คผลรางวัลแต่ละตลาดได้ที่เมนู "ตรวจผลรางวัล" (หากไม่มีหลักฐานมายืนยัน บริษัทยึดตามข้อมูลในระบบเป็นหลัก)</li>
              <li>หากพบปัญหาการแทงหรือระบบบัญชี โปรดติดต่อเอเย่นต์ภายใน 1 ชม. ก่อนหวยออก</li>
              <li>การเปลี่ยนแปลงผลรางวัล ทางบริษัทจะแจ้งผ่านตัวอักษรวิ่งหน้าเว็บ หรือแจ้งผ่านเอเย่นต์</li>
              <li>สมาชิกควรดูแลรหัสผ่านและข้อมูลส่วนตัวเป็นอย่างดีเพื่อผลประโยชน์ของท่านเอง</li>
              <li><span className="text-red-600 font-bold">บทลงโทษ:</span> บริษัทปฏิเสธการจ่ายเงินรางวัลและยกเลิกสมาชิก หากตรวจพบการโกงหรือทุจริตทุกรูปแบบ</li>
              <li>เอเย่นต์ต้องรับผิดชอบยอดภายใต้สายงานตนเองทุกกรณี และบริษัทมีสิทธิ์ยกเลิกยอดที่แทงเข้ามาหลังหวยออก</li>
            </ol>
          </div>

          {/* Section 3: Lottery Rules */}
          <div>
            <h4 className="font-black text-slate-800 text-base mb-4 border-b pb-2 border-slate-200 mt-6">
              2. กติกาการออกรางวัลแต่ละประเภท
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thai Lotto */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-blue-700 mb-2 flex items-center gap-2">🇹🇭 หวยรัฐบาลไทย</h5>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                  <li><b className="text-slate-800">3 ตัวบน:</b> 3 ตัวท้ายของรางวัลที่ 1</li>
                  <li><b className="text-slate-800">2 ตัวบน:</b> 2 ตัวท้ายของรางวัลที่ 1</li>
                  <li><b className="text-slate-800">3 ตัวโต้ด:</b> 3 ตัวท้ายรางวัลที่ 1 (สลับตำแหน่งได้)</li>
                  <li><b className="text-slate-800">วิ่งบน:</b> เลขตัวเดียวที่ตรงกับ 3 ตัวท้ายรางวัลที่ 1</li>
                  <li><b className="text-slate-800">2 ตัวล่าง:</b> รางวัลเลขท้าย 2 ตัว</li>
                  <li><b className="text-slate-800">วิ่งล่าง:</b> เลขตัวเดียวที่ตรงกับเลขท้าย 2 ตัว</li>
                  <li><b className="text-slate-800">3 ตัวล่าง:</b> เลขท้าย 3 ตัว (2 รางวัล) และ เลขหน้า 3 ตัว (2 รางวัล)</li>
                  <li><b className="text-slate-800">สูง-ต่ำ (บน/ล่าง):</b> วัดจากหลักสิบ (0-4 ต่ำ, 5-9 สูง)</li>
                </ul>
              </div>

              {/* Lao Lotto */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-green-700 mb-2 flex items-center gap-2">🇱🇦 หวยลาว</h5>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                  <li>ใช้เลข 4 หลักในการออกรางวัล</li>
                  <li><b className="text-slate-800">3 ตัวบน:</b> 3 ตัวท้ายของรางวัล 4 ตัว</li>
                  <li><b className="text-slate-800">2 ตัวบน:</b> 2 ตัวท้ายของรางวัล 4 ตัว</li>
                  <li><b className="text-slate-800">2 ตัวล่าง:</b> 2 ตัวหน้าของรางวัล 4 ตัว</li>
                  <li><b className="text-slate-800">วิ่ง/โต้ด:</b> ใช้หลักการเดียวกับหวยไทย</li>
                  <li><b className="text-slate-800">สูง-ต่ำ:</b> วัดจากหลักสิบของ 2 ตัวบน/ล่าง</li>
                </ul>
              </div>

              {/* Hanoi Lotto */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-red-700 mb-2 flex items-center gap-2">🇻🇳 หวยฮานอย (เวียดนาม)</h5>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                  <li><b className="text-slate-800">3/2 ตัวบน:</b> อ้างอิงจากรางวัลพิเศษ (รางวัลที่ 1)</li>
                  <li><b className="text-slate-800">2 ตัวล่าง:</b> อ้างอิงจากรางวัลที่ 2 (2 ตัวท้าย)</li>
                  <li><b className="text-slate-800">3 ตัวล่าง:</b> อ้างอิงจากรางวัลที่ 2 (3 ตัวท้าย)</li>
                  <li><b className="text-slate-800">วิ่ง/โต้ด:</b> ใช้หลักเกณฑ์เดียวกับหวยไทย</li>
                </ul>
              </div>

              {/* Malay Lotto */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-amber-700 mb-2 flex items-center gap-2">🇲🇾 หวยมาเลเซีย</h5>
                <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                  <li><b className="text-slate-800">3/2 ตัวบน:</b> อ้างอิงจากรางวัลที่ 1 (A1)</li>
                  <li><b className="text-slate-800">2 ตัวล่าง:</b> อ้างอิงจากรางวัลที่ 2 (B1)</li>
                  <li><b className="text-slate-800">3 ตัวล่าง:</b> อ้างอิงจากรางวัลที่ 2 (B1)</li>
                  <li><b className="text-slate-800">วิ่ง/โต้ด:</b> ใช้หลักเกณฑ์เดียวกับหวยไทย</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-900 active:scale-95 transition-all"
          >
            รับทราบและปิดหน้านี้
          </button>
        </div>

      </div>
    </div>
  );
}