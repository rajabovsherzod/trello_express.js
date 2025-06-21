import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Lock, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBoard } from '@/api/board-create';
import { boardCreateSchema } from '@/lib/board-create-validation';
import type { BoardCreateValues } from '@/lib/board-create-validation';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const boardColors = [
  '#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91', '#4bbf6b', '#00aecc'
];
const boardImages = [
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887&auto=format&fit=crop',
];

interface BoardCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BoardCreateModal: React.FC<BoardCreateModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();

    const form = useForm<BoardCreateValues>({
        resolver: zodResolver(boardCreateSchema),
        defaultValues: {
            name: '',
            description: '',
            background: boardColors[0],
            visibility: 'private',
        },
    });

    const watchedName = form.watch('name');
    const watchedBackground = form.watch('background');
    
    const { mutate: createBoardMutation, isPending } = useMutation({
        mutationFn: createBoard,
        onSuccess: (newBoard) => {
            toast.success(`Board "${newBoard.name}" created successfully!`);
            queryClient.invalidateQueries({ queryKey: ['boards-list'] });
            onClose();
            form.reset();
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create board.');
        }
    });

    const onSubmit = (values: BoardCreateValues) => {
        createBoardMutation(values);
    };

    const handleClose = () => {
        if (isPending) return;
        onClose();
        setTimeout(() => form.reset(), 200);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        className="relative w-full max-w-4xl bg-background rounded-xl border border-border shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Form {...form}>
                            <div className="flex flex-col sm:flex-row">
                                <div className="hidden sm:flex flex-col justify-center p-8 bg-muted/20 rounded-l-xl border-r border-border sm:w-2/5">
                                   <p className="text-sm font-semibold text-muted-foreground mb-4 self-start">PREVIEW</p>
                                   <div className="aspect-video w-full rounded-lg shadow-xl p-3 flex flex-col justify-between bg-cover bg-center transition-all duration-300" style={{ 
                                        backgroundColor: boardColors.includes(watchedBackground) ? watchedBackground : '#1c1c1c',
                                        backgroundImage: boardImages.includes(watchedBackground) ? `url(${watchedBackground})` : 'none'
                                    }}>
                                        <h3 className="font-bold text-white text-lg [text-shadow:_0_1px_3px_rgb(0_0_0_/_50%)] break-words">
                                            {watchedName || 'New Awesome Board'}
                                        </h3>
                                        <div className="flex items-center justify-end">
                                            <div className="flex items-center -space-x-2">
                                                <span className="w-8 h-8 rounded-full bg-gray-200/90 border-2 border-white/80 flex items-center justify-center text-sm font-bold text-gray-700">SR</span>
                                                <span className="w-8 h-8 rounded-full bg-orange-300/90 border-2 border-white/80 flex items-center justify-center text-sm font-bold text-orange-800">AI</span>
                                            </div>
                                        </div>
                                   </div>
                                </div>

                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow p-6 space-y-4">
                                    <h2 className="text-2xl font-bold text-foreground">Create a new board</h2>
                                    
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Board Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Agile Sprint Board" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Add a short description to your board" className="resize-none" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="background"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Background</FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {boardColors.map(color => (
                                                            <button type="button" key={color} onClick={() => field.onChange(color)} className={`w-full h-10 rounded transition-all transform hover:scale-105 ${field.value === color ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`} style={{ backgroundColor: color }}></button>
                                                        ))}
                                                        {boardImages.map(img => (
                                                            <button type="button" key={img} onClick={() => field.onChange(img)} className={`w-full h-10 rounded bg-cover bg-center transition-all transform hover:scale-105 ${field.value === img ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`} style={{ backgroundImage: `url(${img})` }}></button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={form.control}
                                        name="visibility"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Visibility</FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost"
                                                            onClick={() => field.onChange('private')} 
                                                            className={cn(
                                                                "flex items-center justify-center gap-2 p-3 rounded-md transition-colors w-full h-auto text-base",
                                                                field.value === 'private' && "ring-2 ring-primary bg-muted"
                                                            )}
                                                        >
                                                            <Lock size={16}/> Private
                                                        </Button>
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost"
                                                            onClick={() => field.onChange('public')} 
                                                            className={cn(
                                                                "flex items-center justify-center gap-2 p-3 rounded-md transition-colors w-full h-auto text-base",
                                                                field.value === 'public' && "ring-2 ring-primary bg-muted"
                                                            )}
                                                        >
                                                            <Eye size={16}/> Public
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="pt-4 flex justify-center">
                                        <Button 
                                            type="submit" 
                                            disabled={isPending}
                                            className="px-12 py-2 rounded-md bg-[linear-gradient(110deg,hsl(var(--primary)),hsl(var(--accent)))] text-white font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isPending ? (
                                                <>
                                                    <LoaderCircle size={18} className="animate-spin" /> 
                                                    <span>Creating...</span>
                                                </>
                                            ) : (
                                                'Create'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Form>
                         <button onClick={handleClose} disabled={isPending} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted disabled:opacity-50">
                            <X size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 