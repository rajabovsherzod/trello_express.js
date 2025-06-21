import React from 'react';
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Image, Activity, X, Settings, User, Edit2 } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- Tiplarni aniqlash ---
interface Board {
  title: string;
  description: string;
  // ... va boshqa maydonlar
}

interface BoardMenuProps {
  board: Board;
  setPreviewBackground: (bg: string | null) => void;
}

// --- Mock Data ---
const boardData = {
  title: "WOOOOOOW Project Board",
  description: "This is the master plan for conquering the digital world with the WOOOOOOW Project. Only elite execution is accepted here.",
  author: { name: "Project Lead", avatar: "https://i.pravatar.cc/40?u=lead" },
  createdAt: "2024-05-20",
};

const colors = ["#0c2b4d", "#b04632", "#519839", "#0079bf", "#89609e", "#4b32b0", "#cd5a91", "#d29034"];
const images = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=300",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300",
  "https://images.unsplash.com/photo-1504639725590-7ea024b4b23c?q=80&w=300",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=300"
];

const activities = {
    "Today": [{ user: { name: "Alisher", avatar: "https://i.pravatar.cc/40?u=alisher" }, action: "moved card 'Design WOOOOOW Header' to 'In Progress'", time: "5m ago" },],
    "Yesterday": [{ user: { name: "Zarina", avatar: "https://i.pravatar.cc/40?u=zarina" }, action: "added 'Fix the bug in production'", time: "11:23 AM" },]
}

const SectionCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
    >
        <Card className={`bg-neutral-900/50 border-cyan-500/10 ${className}`}>
            {children}
        </Card>
    </motion.div>
);

const BoardMenu: React.FC<BoardMenuProps> = ({ board, setPreviewBackground }) => {
    const { setOpen } = useSidebar();

    const handleBgHover = (bg: string | null) => {
        setPreviewBackground(bg);
    };

    return (
        <Sidebar side="right" collapsible="offcanvas" className="bg-neutral-950/80 border-l-cyan-500/20 text-neutral-200 backdrop-blur-xl p-0 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-cyan-500/10 flex-shrink-0">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-teal-200">Board Center</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={() => setOpen(false)}>
                    <X size={20} />
                </Button>
            </div>
            <SidebarContent className="p-0 flex-grow">
                <Tabs defaultValue="details" className="h-full w-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent p-2 rounded-none flex-shrink-0">
                        <TabsTrigger value="details"><Info className="w-5 h-5"/></TabsTrigger>
                        <TabsTrigger value="design"><Image className="w-5 h-5"/></TabsTrigger>
                        <TabsTrigger value="activity"><Activity className="w-5 h-5"/></TabsTrigger>
                        <TabsTrigger value="settings"><Settings className="w-5 h-5"/></TabsTrigger>
                    </TabsList>
                    
                    <div className="flex-grow overflow-y-auto p-3">
                      <AnimatePresence mode="wait">
                          <TabsContent value="details" className="space-y-4">
                              <SectionCard>
                                  <CardHeader><CardTitle className="flex items-center gap-2 text-base text-cyan-300"><Edit2 size={16}/> Board Title</CardTitle></CardHeader>
                                  <CardContent><Input className="bg-neutral-950" defaultValue={boardData.title} /></CardContent>
                              </SectionCard>
                              <SectionCard>
                                  <CardHeader><CardTitle className="flex items-center gap-2 text-base text-cyan-300"><User size={16}/> Author & Members</CardTitle></CardHeader>
                                  <CardContent className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10"><AvatarImage src={boardData.author.avatar} /><AvatarFallback>{boardData.author.name.charAt(0)}</AvatarFallback></Avatar>
                                      <div>
                                          <p className="font-medium">{boardData.author.name}</p>
                                          <p className="text-xs text-neutral-400">Created on {boardData.createdAt}</p>
                                      </div>
                                  </CardContent>
                              </SectionCard>
                          </TabsContent>
                          <TabsContent value="design" className="space-y-4">
                              <SectionCard>
                                  <CardHeader><CardTitle className="text-base text-cyan-300">Colors</CardTitle></CardHeader>
                                  <CardContent className="grid grid-cols-4 gap-2">
                                      {colors.map(color => <button key={color} onMouseEnter={() => handleBgHover(color)} onMouseLeave={() => handleBgHover(null)} className="h-12 w-full rounded-lg ring-offset-2 ring-offset-neutral-900 transition-all hover:ring-2 ring-cyan-400" style={{backgroundColor: color}}/>)}
                                  </CardContent>
                              </SectionCard>
                              <SectionCard>
                                  <CardHeader><CardTitle className="text-base text-cyan-300">Images</CardTitle></CardHeader>
                                  <CardContent className="grid grid-cols-2 gap-2">
                                      {images.map(img => <button key={img} onMouseEnter={() => handleBgHover(img)} onMouseLeave={() => handleBgHover(null)} className="h-20 w-full rounded-lg bg-cover bg-center ring-offset-2 ring-offset-neutral-900 transition-all hover:ring-2 ring-cyan-400" style={{backgroundImage: `url(${img})`}} />)}
                                  </CardContent>
                              </SectionCard>
                          </TabsContent>
                          <TabsContent value="activity" className="space-y-4">
                              <SectionCard>
                                  <CardHeader><CardTitle className="text-base text-cyan-300">Activity Log</CardTitle></CardHeader>
                                  <CardContent>
                                  {Object.entries(activities).map(([date, items]) => (
                                      <div key={date} className="relative">
                                          <h4 className="font-semibold text-sm text-neutral-400 my-2">{date}</h4>
                                          <ul className="space-y-3">
                                              {items.map((act, i) => (
                                                  <li key={i} className="flex items-center gap-3">
                                                      <Avatar className="h-8 w-8"><AvatarImage src={act.user.avatar} /><AvatarFallback>{act.user.name.charAt(0)}</AvatarFallback></Avatar>
                                                      <p className="text-sm text-neutral-300"><span className="font-semibold text-white">{act.user.name}</span> {act.action}</p>
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                  ))}
                                  </CardContent>
                              </SectionCard>
                          </TabsContent>
                          <TabsContent value="settings" className="space-y-4">
                              <SectionCard>
                                  <CardHeader><CardTitle className="text-base text-cyan-300">Power-Ups</CardTitle></CardHeader>
                                  <CardContent><p className="text-sm text-neutral-400">No active Power-Ups.</p></CardContent>
                              </SectionCard>
                          </TabsContent>
                      </AnimatePresence>
                    </div>
                </Tabs>
            </SidebarContent>
        </Sidebar>
    );
};

export default BoardMenu; 