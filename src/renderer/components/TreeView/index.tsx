import styles from './styles.module.scss';
import ListViewItem from '../ListViewItem';
import { ReactElement, useCallback } from 'react';

export interface TreeViewItemData<T> {
  id: string;
  text?: string;
  icon?: ReactElement;
  data?: T;
  children?: TreeViewItemData<T>[];
}

interface TreeViewProps<T> {
  items: TreeViewItemData<T>[];
  selected?: TreeViewItemData<T>;
  collapsedKeys?: string[];
  onCollapsedChange?: (value?: string[]) => void;
  onSelectChange?: (value?: TreeViewItemData<T>) => void;
  onDoubleClick?: (value: TreeViewItemData<T>) => void;
  onContextMenu?: React.MouseEventHandler;
  highlight?: string;
  highlightDepth?: number;
}

function TreeViewItem<T>({
  item,
  depth,

  selected,
  onSelectChange,

  collapsedKeys,
  onCollapsedChange,
  onDoubleClick,

  highlight,
  highlightDepth,
}: {
  item: TreeViewItemData<T>;
  depth: number;

  selected?: TreeViewItemData<T>;
  onSelectChange?: (value?: TreeViewItemData<T>) => void;

  onCollapsedChange?: (value?: string[]) => void;
  collapsedKeys?: string[];
  onDoubleClick?: (value: TreeViewItemData<T>) => void;
  highlight?: string;
  highlightDepth?: number;
}) {
  const hasCollapsed = item.children && item.children.length > 0;
  const isCollapsed = collapsedKeys?.includes(item.id);

  const onSelectChangeCallback = useCallback(() => {
    if (onSelectChange) {
      onSelectChange(item);
    }
  }, [onSelectChange, item]);

  return (
    <div>
      <ListViewItem
        key={item.id}
        text={item.text || ''}
        icon={item.icon}
        depth={depth}
        onDoubleClick={() => {
          if (onDoubleClick) {
            onDoubleClick(item);
          }
        }}
        highlight={depth === highlightDepth ? highlight : undefined}
        hasCollapsed={hasCollapsed}
        collapsed={isCollapsed}
        selected={selected?.id === item.id}
        onClick={onSelectChangeCallback}
        onContextMenu={onSelectChangeCallback}
        onCollapsedClick={() => {
          if (onCollapsedChange) {
            if (isCollapsed) {
              onCollapsedChange(
                collapsedKeys?.filter(
                  (collapsedKey) => collapsedKey !== item.id
                )
              );
            } else {
              onCollapsedChange([...(collapsedKeys || []), item.id]);
            }
          }
        }}
      />
      {isCollapsed && (
        <div>
          {item.children?.map((item) => {
            return (
              <TreeViewItem
                key={item.id}
                item={item}
                depth={depth + 1}
                highlight={highlight}
                highlightDepth={highlightDepth}
                selected={selected}
                onSelectChange={onSelectChange}
                collapsedKeys={collapsedKeys}
                onCollapsedChange={onCollapsedChange}
                onDoubleClick={onDoubleClick}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TreeView<T>({
  items,
  selected,
  onSelectChange,
  onCollapsedChange,
  collapsedKeys,
  onDoubleClick,
  onContextMenu,
  highlight,
  highlightDepth,
}: TreeViewProps<T>) {
  return (
    <div className={`${styles.treeView} scroll`} onContextMenu={onContextMenu}>
      {items.map((item) => {
        return (
          <TreeViewItem
            key={item.id}
            item={item}
            depth={0}
            highlight={highlight}
            highlightDepth={highlightDepth}
            selected={selected}
            onSelectChange={onSelectChange}
            onDoubleClick={onDoubleClick}
            onCollapsedChange={onCollapsedChange}
            collapsedKeys={collapsedKeys}
          />
        );
      })}
    </div>
  );
}
