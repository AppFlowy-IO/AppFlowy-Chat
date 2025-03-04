import { View } from '@/types';
import { CheckStatus } from '@/types/checkbox';
import { useCallback, useEffect, useState } from 'react';

export const useCheckboxTree = (initialSelected: string[] = []) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSelected),
  );

  useEffect(() => {
    setSelected(new Set(initialSelected));
  }, [initialSelected]);

  // Get all descendant IDs of a view
  const getDescendantIds = useCallback((view: View): string[] => {
    const ids: string[] = [view.view_id];
    view.children.forEach(child => {
      ids.push(...getDescendantIds(child));
    });
    return ids;
  }, []);

  // Get the check status of a view
  const getCheckStatus = useCallback((view: View): CheckStatus => {
    const isCurrentSelected = selected.has(view.view_id);

    if(view.children.length === 0) {
      return isCurrentSelected ? CheckStatus.Checked : CheckStatus.Unchecked;
    }

    const childrenStatuses = view.children.map(child =>
      getCheckStatus(child),
    );

    if(childrenStatuses.every(status => status === 'unchecked')) {
      if(isCurrentSelected) {
        setSelected(prev => {
          const next = new Set(prev);
          next.delete(view.view_id);
          return next;
        });
      }
      return CheckStatus.Unchecked;
    }

    if(childrenStatuses.every(status => status === 'checked')) {
      return CheckStatus.Checked;
    }

    return CheckStatus.Indeterminate;
  }, [selected]);

  const toggleNode = useCallback((view: View) => {
    const status = getCheckStatus(view);
    const descendantIds = getDescendantIds(view);

    const next = new Set(selected);
    if(status === CheckStatus.Checked) {
      descendantIds.forEach(id => next.delete(id));
    } else {
      descendantIds.forEach(id => next.add(id));
    }

    setSelected(next);
    return next;
  }, [getCheckStatus, getDescendantIds, selected]);

  const selectAll = useCallback((views: View[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      views.forEach(view => {
        getDescendantIds(view).forEach(id => next.add(id));
      });
      return next;
    });
  }, [getDescendantIds]);

  const unselectAll = useCallback((views: View[]) => {
    setSelected(prev => {
      const next = new Set(prev);
      views.forEach(view => {
        getDescendantIds(view).forEach(id => next.delete(id));
      });
      return next;
    });
  }, [getDescendantIds]);

  const getSelected = useCallback(() => {
    return Array.from(selected);
  }, [selected]);

  return {
    selected,
    getCheckStatus,
    toggleNode,
    selectAll,
    unselectAll,
    getSelected,
  };
};