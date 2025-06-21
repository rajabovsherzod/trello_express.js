import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import BoardHeader from '@/components/board/BoardHeader';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import BoardMenu from '@/components/board/BoardMenu';
import { useMediaQuery } from '@/hooks/use-media-query';

// Mock ma'lumotlar vaqtincha olib tashlandi.
const mockBoard = {
  id: 'board-1',
  title: 'WOOOOOOW Project Board',
  description: 'The definitive plan for the WOOOOOOW project.',
  background: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
  members: [
    { id: '1', name: 'Alisher', avatar: 'https://i.pravatar.cc/40?u=alisher' },
    { id: '2', name: 'Diyor', avatar: 'https://i.pravatar.cc/40?u=diyor' },
    { id: '3', name: 'Zarina', avatar: 'https://i.pravatar.cc/40?u=zarina' },
  ],
  lists: [], // Listlar tozalandi
};

const BoardPageContent = () => {
  const [boardData, setBoardData] = useState(mockBoard);
  const [previewBackground, setPreviewBackground] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);

  const backgroundStyle = {
    transition: 'background 0.3s ease-in-out',
    ...( (previewBackground || boardData.background).startsWith('http')
      ? { backgroundImage: `url(${previewBackground || boardData.background})` }
      : { backgroundColor: previewBackground || boardData.background }
    ),
  };

  return (
    <>
      <div className="h-screen w-full bg-cover bg-center" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex h-full w-full flex-col">
          <BoardHeader board={boardData} />
          <SidebarInset className="flex-grow overflow-hidden">
            <main
              ref={viewportRef}
              className="h-full w-full"
            >
              {/* Yangi kontent shu yerda quriladi */}
              <div className="h-full w-full flex items-center justify-center">
                  <p className="text-2xl text-white/50 font-semibold">Kontent qaytadan quriladi...</p>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
      <BoardMenu board={boardData} setPreviewBackground={setPreviewBackground} />
    </>
  );
}

const BoardPage = () => {
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getSidebarWidth = () => {
    if (isTablet) return '380px';
    return '400px';
  };

  return (
    <SidebarProvider style={{ '--sidebar-width': getSidebarWidth() } as React.CSSProperties}>
      <BoardPageContent />
    </SidebarProvider>
  );
};

export default BoardPage; 