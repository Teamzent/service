// 1. แยกไฟล์สไตล์ย่อยๆ ออกมา (โค้ดจะสะอาดและแก้ไขเลย์เอาต์แยกกันได้อิสระ)
import PayoutClassic from './payout-styles/PayoutClassic';
import PayoutCascade from './payout-styles/PayoutCascade';
import PayoutGrid from './payout-styles/PayoutGrid';

export default function PayoutRateBox({ config, brandColors }: { config: any, brandColors: string[] }) {
    if (!config?.is_visible) return null;

    // ดึงชื่อสไตล์จาก Database ถ้าไม่มีให้ใช้ 'classic' เป็นตัวเริ่มต้น (Fallback)
    const currentStyle = config.payout_style || 'classic'; 

    // ทำหน้าที่สลับไฟล์ Component ตามชื่อคีย์ที่ส่งมาจากหลังบ้าน
    switch (currentStyle) {
        case 'cascade':
            return <PayoutCascade config={config} brandColors={brandColors} />;
        case 'grid':
            return <PayoutGrid config={config} brandColors={brandColors} />;
        case 'classic':
        default:
            return <PayoutClassic config={config} brandColors={brandColors} />;
    }
}