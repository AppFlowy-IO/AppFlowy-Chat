import { useChatContext } from '@/chat/context';
import { useToast } from '@/hooks/use-toast';
import { filterDocumentViews } from '@/lib/views';
import { EditorData } from '@appflowyinc/editor';
import { useCallback, useState } from 'react';

export function useViewsLoader() {
  const [viewsLoading, setViewsLoading] = useState(false);

  const {
    toast,
  } = useToast();
  const {
    requestInstance,
  } = useChatContext();

  const fetchViews = useCallback(async() => {
    try {
      setViewsLoading(true);
      const view = await requestInstance.fetchViews(true);
      const result = {
        ...view,
        children: filterDocumentViews(view.children),
      };
      setViewsLoading(false);
      return result;
      // eslint-disable-next-line
    } catch(e: any) {
      // do not show toast for no views
    }
  }, [requestInstance]);

  const insertContentToView = useCallback(async(viewId: string, data: EditorData) => {
    try {
      await requestInstance.insertContentToView(viewId, data);
      // eslint-disable-next-line
    } catch(e: any) {
      return Promise.reject(e);
    }
  }, [requestInstance]);

  const createViewWithContent = useCallback(async(parentViewId: string, name: string, data: EditorData) => {
    try {
      await requestInstance.createViewWithContent(parentViewId, name, data);
      // eslint-disable-next-line
    } catch(e: any) {
      return Promise.reject(e);
    }
  }, [requestInstance]);

  const getView = useCallback(async(viewId: string, forceRefresh = true) => {
    try {
      const view = await requestInstance.getView(viewId, forceRefresh);
      return view;
      // eslint-disable-next-line
    } catch(e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      });
    }
  }, [requestInstance, toast]);

  return {
    getView,
    fetchViews,
    insertContentToView,
    createViewWithContent,
    viewsLoading,
  };
}