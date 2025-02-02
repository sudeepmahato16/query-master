import { ReactElement, useEffect, useRef, useState } from 'react';
import ContextMenu, { ContextMenuItemProps } from '.';

interface AttachedContextMenuProps {
  activator: (props: { isOpened: boolean }) => ReactElement;
  items: ContextMenuItemProps[];
}

export default function AttachedContextMenu({
  activator,
  items,
}: AttachedContextMenuProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [minWidth, setMinWidth] = useState(300);

  const [open, setOpen] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (wrapperRef.current) {
      setMinWidth(wrapperRef.current.getBoundingClientRect().width);
    }
  }, [open, wrapperRef]);

  return (
    <>
      <div
        ref={wrapperRef}
        onClick={(e) => {
          if (!open) {
            setOpen(true);
            const bound = e.currentTarget.getBoundingClientRect();
            setX(bound.left);
            setY(bound.bottom);
          }
        }}
      >
        {activator({ isOpened: open })}
      </div>
      <ContextMenu
        status={{ open, x, y }}
        minWidth={minWidth}
        onClose={() => {
          setOpen(false);
        }}
      >
        {items.map((item, idx) => (
          <ContextMenu.Item {...item} key={idx} />
        ))}
      </ContextMenu>
    </>
  );
}
