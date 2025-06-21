// client/src/components/ui/BoardCard.tsx
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect } from 'react';
import { Heart, MessageCircle, Users } from 'lucide-react';

interface BoardCardProps {
  boardId: string;
  title: string;
  authorName: string;
  // Karta dizayni uchun doskaning foni va a'zolari sonini olamiz
  background: string; 
  memberCount: number;
}

const DEFAULT_FALLBACK_COLOR = '#0079BF'; // Trello's classic blue

// Yorqinlikni hisoblash uchun yordamchi funksiya
const getBrightness = (hex: string) => {
    if (!hex.startsWith('#')) return 129; // Assume bright for non-color strings
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
};

export const BoardCard = ({ boardId, title, authorName, background, memberCount }: BoardCardProps) => {
    const [imageError, setImageError] = useState(false);

    const isUrl = background.startsWith('http');
    const displayBackground = isUrl && !imageError ? background : (isUrl && imageError ? DEFAULT_FALLBACK_COLOR : background);
    
    useEffect(() => {
        // Reset error state when background url changes
        if(isUrl) {
            setImageError(false);
        }
    }, [background, isUrl]);

    const textColor = useMemo(() => {
        // This only works for solid colors, not for URLs
        if (isUrl) return 'text-white';
        const brightness = getBrightness(displayBackground);
        return brightness > 150 ? 'text-black' : 'text-white';
    }, [displayBackground, isUrl]);
    
    const isTextWhite = textColor === 'text-white';

    const cardStyle = isUrl && !imageError 
        ? { backgroundImage: `url(${displayBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: displayBackground };

    const cardVariants: Variants = {
        initial: { scale: 1, opacity: 0.8 },
        hover: { 
            scale: 1.05, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 20 }
        }
    };

    return (
        <>
            {isUrl && <img src={background} onError={() => setImageError(true)} className="hidden" alt="" />}
            <Link to={`/board/${boardId}`} className="block relative">
                <motion.div
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                    className={cn(
                        "rounded-xl h-40 p-5 flex flex-col justify-between overflow-hidden relative group",
                        textColor
                    )}
                    style={cardStyle}
                >
                    {/* Overlay for background images to ensure text readability */}
                    {isUrl && <div className="absolute inset-0 bg-black/40 z-0" />}

                    {/* Orqa fondagi naqshlar - faqat matn oq bo'lganda ko'rsatiladi */}
                    {isTextWhite && (
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 group-hover:opacity-30 transition-opacity z-0"></div>
                    )}
                    
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl line-clamp-2 leading-tight [text-shadow:_0_1px_4px_rgb(0_0_0_/_30%)]">{title}</h3>
                        <p className="text-sm opacity-90 mt-1 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">by {authorName}</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-xs opacity-90">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{memberCount}</span>
                            </div>
                            {/* Kelajakda bu yerga kommentlar sonini ham qo'shish mumkin */}
                             <div className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                <span>0</span>
                            </div>
                        </div>
                        <Heart size={16} className="group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
                    </div>

                    {/* Hover effekti - endi barcha kartalar uchun ishlaydi */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                        <span className="font-bold text-white text-lg">Open Board</span>
                    </div>
                </motion.div>
            </Link>
        </>
    );
};