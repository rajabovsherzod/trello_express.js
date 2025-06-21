import { useEffect } from 'react';
import type { RefObject } from 'react';

type AnyEvent = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void,
): void {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref?.current;
      // Hech narsa qilma, agar bosilgan element ref'ning o'zi yoki uning ichidagi element bo'lsa
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener(`mousedown`, listener);
    document.addEventListener(`touchstart`, listener);
    return () => {
      document.removeEventListener(`mousedown`, listener);
      document.removeEventListener(`touchstart`, listener);
    };
  }, [ref, handler]); // Faqat ref yoki handler o'zgarganda qayta ishga tushir
}