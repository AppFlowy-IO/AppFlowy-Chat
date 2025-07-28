import { useToast } from '@/hooks/use-toast';
import { filterDocumentViews } from '@/lib/views';
import { View } from '@/types/request';
import { createContext, useCallback, useContext, useState } from 'react';

interface ViewLoaderProviderProps {
  viewsLoading: boolean;
  fetchViews: (filter?: (v: View[]) => View[]) => Promise<View | undefined>;
  getView: (
    viewId: string,
    forceRefresh?: boolean,
  ) => Promise<View | undefined>;
}

export const ViewLoaderContext = createContext<
  ViewLoaderProviderProps | undefined
>(undefined);

export function useViewLoader() {
  const context = useContext(ViewLoaderContext);

  if (!context) {
    throw new Error(
      'useViewLoader: useViewLoader must be used within a ViewLoaderProvider',
    );
  }
  return context;
}

export const ViewLoaderProvider = ({
  getView,
  fetchViews,
  children,
}: {
  getView: (viewId: string, forceRefresh?: boolean) => Promise<View>;
  fetchViews: (forceRefresh?: boolean) => Promise<View>;
  children: React.ReactNode;
}) => {
  const { toast } = useToast();

  const [viewsLoading, setViewsLoading] = useState(false);

  const fetchViewsImpl = useCallback(
    async (filter?: (v: View[]) => View[]) => {
      try {
        setViewsLoading(true);
        const view = await fetchViews(true);
        const result = {
          ...view,
          children: filter
            ? filter(view.children)
            : filterDocumentViews(view.children),
        };
        setViewsLoading(false);
        return result;
        // eslint-disable-next-line
      } catch (e: any) {
        // do not show toast for no views
      }
    },
    [fetchViews],
  );

  const getViewImpl = useCallback(
    async (viewId: string, forceRefresh = true) => {
      try {
        return await getView(viewId, forceRefresh);
        // eslint-disable-next-line
      } catch (e: any) {
        toast({
          variant: 'destructive',
          description: e.message,
        });
      }
    },
    [getView, toast],
  );

  return (
    <ViewLoaderContext.Provider
      value={{ viewsLoading, getView: getViewImpl, fetchViews: fetchViewsImpl }}
    >
      {children}
    </ViewLoaderContext.Provider>
  );
};
