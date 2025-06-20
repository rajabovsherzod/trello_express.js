import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '../ui/button';
import { LayoutDashboard, LogOut, User, Settings, Menu } from 'lucide-react';
import { userAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router-dom';
import { Separator } from "../ui/separator";
import { motion } from 'framer-motion';

// Panel ichidagi menyu bandlari uchun animatsiyali komponent
const NavLink = ({ icon, text, onClick, isLast = false }: { icon: React.ReactNode, text: string, onClick?: () => void, isLast?: boolean }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
        >
            <Button
                variant="ghost"
                onClick={onClick}
                className="w-full flex items-center justify-start gap-4 p-6 text-lg h-auto"
            >
                <span className="text-primary">{icon}</span>
                <span>{text}</span>
            </Button>
            {!isLast && <Separator className="bg-primary/10 mt-1" />}
        </motion.div>
    )
}

export const UserProfileSheet = () => {
    const user = userAuthStore((state) => state.user);
    const logout = userAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Har bir bola element 0.15s kechikish bilan chiqadi
                delayChildren: 0.2,    // Animatsiya boshlanishidan oldin kutish
            }
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors duration-300">
                        <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.username}`} alt={user?.username} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[320px] sm:w-[400px] bg-background/80 backdrop-blur-xl border-l-primary/10 p-0 flex flex-col">
                <SheetHeader className="p-6">
                    <SheetTitle className="text-2xl font-bold text-center text-primary">
                        My Profile
                    </SheetTitle>
                </SheetHeader>
                <Separator className="bg-primary/20" />

                {/* Foydalanuvchi ma'lumotlari */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="flex flex-col items-center gap-4 p-8"
                >
                    <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
                        <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user?.username}`} alt={user?.username} />
                        <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <p className="text-xl font-bold text-foreground">{user?.username}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </motion.div>

                <Separator className="bg-primary/20" />

                {/* Navigatsiya tugmalari */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-grow flex flex-col items-start p-4"
                >
                    <NavLink icon={<LayoutDashboard size={22} />} text="Dashboard" onClick={() => navigate('/dashboard')} />
                    <NavLink icon={<User size={22} />} text="Profile" />
                    <NavLink icon={<Settings size={22} />} text="Settings" isLast={true}/>
                </motion.div>

                {/* Chiqish tugmasi */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: 0.8 }}
                    className="p-4"
                >
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-6 text-lg h-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                    >
                        <LogOut size={22} />
                        <span>Log Out</span>
                    </Button>
                </motion.div>
            </SheetContent>
        </Sheet>
    );
};