import { ReactNode, useEffect, useRef, useState } from 'react';

interface DropdownProps {
  // Content shown inside the trigger button.
  trigger: ReactNode;
  triggerClassName?: string;
  // Menu panel content. Receives a `close` callback so items can dismiss the menu.
  children: (close: () => void) => ReactNode;
  align?: 'left' | 'right';
  menuClassName?: string;
}

// Replaces MUI <Button> + <Menu>: a button that toggles an absolutely-positioned
// panel, closing on outside-click or Escape.
const Dropdown = ({ trigger, triggerClassName = '', children, align = 'left', menuClassName = '' }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button type="button" onClick={() => setOpen((v) => !v)} className={triggerClassName}>
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-1 min-w-[220px] rounded border border-gray-300 bg-white py-1 shadow-lg ${align === 'right' ? 'right-0' : 'left-0'} ${menuClassName}`}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
};

export const MenuItem = ({
  onClick,
  children,
  className = '',
}: {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center px-3 py-1 text-left text-[11px] hover:bg-gray-100 ${className}`}
  >
    {children}
  </button>
);

// Non-clickable row (e.g. a label paired with a Switch) so we don't nest buttons.
export const MenuRow = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`flex w-full items-center px-3 py-1 text-[11px] ${className}`}>{children}</div>
);

export const MenuDivider = () => <div className="my-1 border-t border-gray-200" />;

export default Dropdown;
