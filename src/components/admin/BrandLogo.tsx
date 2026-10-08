import React from 'react';

export interface BrandConfig {
    logo_type?: 'image' | 'emoji';
    logo_emoji?: string;
    font_family?: string;
    text_shadow?: string;
    text_stroke?: string;
    fill_type?: 'color' | 'animated' | 'texture'; 
    name_colors?: string[]; 
    texture_url?: string;
}

// ==========================================
// 1. COMPONENT: โลโก้ร้าน (ShopLogo)
// ==========================================
export function ShopLogo({ 
    logoUrl, 
    brandConfig, 
    className = "flex justify-center items-center" 
}: { 
    logoUrl?: string; 
    brandConfig?: BrandConfig; 
    className?: string; 
}) {
    const config = brandConfig || {};
    
    return (
        <div className={`relative z-10 ${className}`}>
            {config.logo_type === 'emoji' ? (
                <div className="relative flex justify-center items-center group">
                    <div className="absolute -inset-4 bg-yellow-500/20 blur-2xl rounded-full group-hover:bg-yellow-500/30 transition duration-700"></div>
                    <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border border-yellow-500/30 bg-black/50 shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]">
                        <span className="text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] relative z-10">
                            {config.logo_emoji || '👑'}
                        </span>
                    </div>
                </div>
            ) : logoUrl ? (
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <img src={logoUrl} alt="Shop Logo" className="relative w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl" />
                </div>
            ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-yellow-500/30 bg-black/50 shadow-inner flex items-center justify-center">
                    <span className="text-yellow-500 text-3xl font-black">L</span>
                </div>
            )}
        </div>
    );
}

// ==========================================
// 2. COMPONENT: ชื่อร้านและแสงเงา (ShopName)
// ==========================================
export function ShopName({ 
    name, 
    brandConfig, 
    className = "flex flex-col items-center", 
    textClassName = "text-2xl md:text-4xl", // ให้ส่งขนาดจากข้างนอกได้
    overrideName,
    showUnderline = true 
}: { 
    name: string; 
    brandConfig?: BrandConfig; 
    className?: string; 
    textClassName?: string;
    overrideName?: string;
    showUnderline?: boolean;
}) {
    const config = brandConfig || {};
    const displayName = overrideName || name || 'Thailot';
    const fillType = config.fill_type || 'color';
    const colors = config.name_colors?.length ? config.name_colors : ['#D4AF37', '#FFF7CC']; 

    let textStyle: React.CSSProperties = {
        fontFamily: config.font_family || 'sans-serif',
        filter: config.text_shadow ? `drop-shadow(${config.text_shadow})` : 'drop-shadow(0px 4px 10px rgba(0,0,0,0.4))',
        WebkitTextStroke: config.text_stroke || 'none',
    };

    if (fillType === 'texture' && config.texture_url) {
        textStyle = { ...textStyle, backgroundImage: `url(${config.texture_url})`, backgroundSize: 'cover', backgroundPosition: 'center', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
    } else if (fillType === 'animated') {
        const animatedColors = [...colors, colors[0]].join(', ');
        textStyle = { ...textStyle, backgroundImage: `linear-gradient(-45deg, ${animatedColors})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
    } else {
        if (colors.length === 1) {
            textStyle.color = colors[0];
        } else {
            textStyle = { ...textStyle, backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
        }
    }

    return (
        <div className={`relative z-10 ${className}`}>
            {fillType === 'animated' && (
                <style>{`
                    @keyframes text-shimmer-fast { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
                    .animate-text-shimmer { background-size: 200% auto !important; animation: text-shimmer-fast 3s linear infinite !important; }
                `}</style>
            )}

            <h1 className={`font-black tracking-tighter text-center uppercase ${textClassName} ${fillType === 'animated' ? 'animate-text-shimmer' : ''}`} style={textStyle}>
                {displayName}
            </h1>
            
            {showUnderline && (
                <div 
                    className="h-1 w-12 mt-2 rounded-full shadow-lg mx-auto"
                    style={{
                        background: colors.length === 1 ? colors[0] : `linear-gradient(to right, transparent, ${colors[colors.length - 1]}, transparent)`,
                        boxShadow: config.text_shadow ? `0 0 10px ${colors[colors.length - 1]}` : 'none'
                    }}
                ></div>
            )}
        </div>
    );
}