import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ComponentProps } from "react"; // Bu qator qo'shiladi

type ToasterProps = ComponentProps<typeof Sonner>; // Bu qator qo'shiladi

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // ... qolgan kod o'zgarishsiz qoladi
    />
  )
}

export { Toaster }