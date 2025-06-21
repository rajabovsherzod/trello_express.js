import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

import { cardCreateSchema, type CardCreateValues } from '@/lib/card-create-validation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AddCardFormProps {
  // listId prop'ini qo'shamiz, chunki ListComponent uni yuboradi
  listId: string;
  onAddCard: (cardName: string) => void;
  onClose: () => void;
  isAdding: boolean;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ listId, onAddCard, onClose, isAdding }) => {
  const form = useForm<CardCreateValues>({
    resolver: zodResolver(cardCreateSchema),
    defaultValues: {
      name: '',
    },
  });

  const { control, handleSubmit, setFocus } = form;

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  const onSubmit = (values: CardCreateValues) => {
    onAddCard(values.name);
    // Bu yerda reset() yo'q, chunki u ListComponent'da, onSuccess'da hal bo'ladi
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        onClose();
    }
  };
  
  return (
    <div onBlur={handleBlur}>
        <Form {...form}>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2"
        >
            <div className="p-1 rounded-lg bg-black/30 shadow-inner">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Textarea
                        {...field}
                        placeholder="Enter a title for this card..."
                        className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-neutral-400 resize-none shadow-none text-base"
                        onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(onSubmit)();
                        }
                        if (e.key === 'Escape') {
                            onClose();
                        }
                        }}
                    />
                    </FormControl>
                    <FormMessage className="px-1 text-rose-400" />
                </FormItem>
                )}
            />
            </div>
            <div className="flex items-center justify-between">
                <Button type="submit" size="sm" disabled={isAdding} className="bg-cyan-600 hover:bg-cyan-700 h-9">
                  {isAdding ? "Adding..." : "Add card"}
                </Button>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose}
                    className="h-9 w-9 shrink-0 rounded-md text-neutral-400 hover:text-cyan-200 hover:bg-cyan-500/20"
                >
                    <X size={20} />
                </Button>
            </div>
        </form>
        </Form>
    </div>
  );
};