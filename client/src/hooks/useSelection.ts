import { useEffect, useRef, useState } from 'react';

export const useSelection = <T extends { id: number }>(items: T[]) => {
  const itemsRef = useRef(items);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(itemsRef.current.map(item => item.id)) : new Set());
  };

  const toggleSelectItem = (id: number) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
      return newSelected;
    });
  };

  return {
    selectedIds,
    allSelected,
    someSelected,
    toggleSelectAll,
    toggleSelectItem
  };
};
