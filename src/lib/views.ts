import { View, ViewLayout } from '@/types';

export function findView(views: View[], id: string): View | undefined {
  for(const view of views) {
    if(view.view_id === id) {
      return view;
    }

    if(view.children.length) {
      const found = findView(view.children, id);
      if(found) {
        return found;
      }
    }
  }

  return undefined;
}

export function filterDocumentViews(views: View[]): View[] {
  return views
    .filter(view => view.layout === ViewLayout.Document)
    .map(view => ({
      ...view,
      children: view.children.length ? filterDocumentViews(view.children) : [],
    }));
}

export function searchViews(views: View[], searchValue: string): View[] {
  if(!searchValue.trim()) {
    return views;
  }

  const searchLower = searchValue.toLowerCase();

  return views
    .filter(view => view.layout === ViewLayout.Document)
    .reduce<View[]>((acc, view) => {
      const currentMatches = view.name.toLowerCase().includes(searchLower);

      const matchingChildren = view.children.length
        ? searchViews(view.children, searchValue)
        : [];

      if(currentMatches || matchingChildren.length > 0) {
        acc.push({
          ...view,
          children: matchingChildren,
        });
      }

      return acc;
    }, []);
}