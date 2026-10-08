import LottoCardClassic from './results-styles/LottoCardClassic';
import LottoCardTicket from './results-styles/LottoCardTicket';
import LottoCardMinimal from './results-styles/LottoCardMinimal';

export default function LottoCardWrapper({ lotto, config, brandColors }: { lotto: any, config: any, brandColors: string[] }) {
    // อ่านค่า results_style จาก DB (ถ้าไม่มีให้เป็น classic)
    const style = config.results_style || 'classic';

    switch (style) {
        case 'ticket':
            return <LottoCardTicket lotto={lotto} brandColors={brandColors} />;
        case 'minimal':
            return <LottoCardMinimal lotto={lotto} brandColors={brandColors} />;
        case 'classic':
        default:
            return <LottoCardClassic lotto={lotto} config={config} brandColors={brandColors} />;
    }
}