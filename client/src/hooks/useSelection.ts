import { useState } from 'react';

export const useSelection = <T extends { id: number }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(items.map(item => item.id)) : new Set());
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
