import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listCreateValidation, type listCreateValues } from '@/lib/list-create-validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface AddListFormProps {
  onAdd: (title: string) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export const AddListForm: React.FC<AddListFormProps> = ({ onAdd, onClose, isSubmitting = false }) => {
  const form = useForm<listCreateValues>({
    resolver: zodResolver(listCreateValidation),
    defaultValues: {
      name: "",
    },
  });

  // Komponent paydo bo'lganda input'ga fokus berish
  useEffect(() => {
    form.setFocus('name');
  }, [form]);

  const onSubmit = (data: listCreateValues) => {
    onAdd(data.name);
  };
  
  const titleValue = form.watch('name');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter list title..."
                    className="bg-black/40 border-2 h-12 border-cyan-500/60 focus-visible:ring-cyan-400 focus-visible:ring-offset-0 pr-24" // O'ng tomonda joy qoldiramiz
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') onClose();
                    }}
                  />
                </FormControl>
                <FormMessage className="px-1" />
              </FormItem>
            )}
          />
          <AnimatePresence>
            {titleValue && (
                <motion.div 
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                >
                    <Button type="button" variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                      <X size={18} className="text-neutral-400" />
                    </Button>
                    <Button type="submit" size="sm" disabled={isSubmitting} className="h-8 bg-cyan-600 hover:bg-cyan-700">
                      {isSubmitting ? 'Adding...' : 'Add'}
                    </Button>
                </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>
    </motion.div>
  );
};