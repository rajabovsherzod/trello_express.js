import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { boardSchema, allowedColors } from "@/lib/board-create-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type BoardCreateSheetValues } from "@/lib/board-create-validation";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createBoard } from "@/api/board-create";
import { useBoardsStore } from "@/store/boards-store";
import { toast } from "sonner";

interface BoardCreateSheetProps { 
  isOpen: boolean;
  onClose: () => void;
}

// Ranglar va ularning nomlari
const boardColors = [
    { name: 'Green', value: '#0079BF' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Yellow', value: '#FBBF24' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Lime', value: '#84CC16' }
];

export const BoardCreateSheet: React.FC<BoardCreateSheetProps> = ({ isOpen, onClose }) => {
  const [visibility, setVisibility] = useState('private');
  const [selectedColor, setSelectedColor] = useState('#0079BF');

  const form = useForm<BoardCreateSheetValues>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'private',
      background: '#01514e'
    },
  });


  const { mutate, isPending} = useMutation({
    mutationKey: ["create-board"],
    mutationFn: createBoard,
    onSuccess: data => {
      useBoardsStore.getState().addBoard(data)
      toast.success("Board added successfully")
    },
    onError: error => {
      useBoardsStore.getState().setError(error.message)
      toast.error(`Failed to create board: ${error.message}`)
    }
  })

  const navigate = useNavigate()

  const onSubmit = (values: BoardCreateSheetValues) => {
    mutate(values)
    onClose();
    navigate('/dashboard')
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-[hsl(var(--background))]">
        <SheetHeader>
          <SheetTitle>Create New Board</SheetTitle>
          <SheetDescription>
            Add a new board to organize your work.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Project Management"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of your board"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-[hsl(var(--board-card))] text-[hsl(var(--board-card-foreground))]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--background))] text-[hsl(var(--board-card-foreground))]">
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-[hsl(var(--board-card))] text-[hsl(var(--board-card-foreground))]">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--background))] text-[hsl(var(--board-card-foreground))]">
                        {allowedColors.map((color) => (
                          <SelectItem key={color} value={color}>
                            <span style={{ color }}>{color}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <SheetFooter>
            <Button 
              type="submit" 
              className="w-full mt-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--background))] text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:shadow-lg transition-all duration-300"
              
            >
              {isPending ? "Creating..." : "Creat Board"}
            </Button>
          </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};