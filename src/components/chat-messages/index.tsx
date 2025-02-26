import { useChatContext } from '@/chat/context';
import { EmptyMessages } from '@/components/chat-messages/empty-messages';
import { Message } from '@/components/chat-messages/message';
import { useChatMessages } from '@/components/chat-messages/use-chat-messages';
import { Button } from '@/components/ui/button';
import LoadingDots from '@/components/ui/loading-dots';
import { useUserLoader } from '@/hooks/use-user-loader';
import { ANIMATION_PRESETS } from '@/lib/animations';
import { User } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingIndicator = () => (
  <div className="flex items-center justify-center w-full h-[48px]">
    <LoadingDots />
  </div>
);

export function ChatMessages({ currentUser }: {
  currentUser?: User;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoadRef = useRef(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const {
    fetchMember,
  } = useUserLoader();
  const {
    selectionMode,
  } = useChatContext();

  const {
    messageIds,
    hasMore,
    isLoading,
    fetchInitialMessages,
    loadMoreMessages,
  } = useChatMessages();

  const scrollToBottom = useCallback((immediate = false) => {
    const container = scrollContainerRef.current;
    if(!container) return;

    if(immediate) {
      container.scrollTop = container.scrollHeight;
      return;
    }
    container.scroll({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if(!container) return;

    const scrollTop = container.scrollTop;
    const distanceFromBottom = Math.abs(scrollTop);

    setShowScrollButton(distanceFromBottom > 100);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if(!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, [checkScrollPosition]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if(!container || !isFirstLoadRef.current || messageIds.length === 0) return;
    const observer = new MutationObserver(() => {
      scrollToBottom(true);
      isFirstLoadRef.current = false;
      observer.disconnect();
    });

    observer.observe(scrollContainerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();

  }, [scrollToBottom, messageIds]);

  useEffect(() => {
    isFirstLoadRef.current = true;
    void fetchInitialMessages();
  }, [fetchInitialMessages]);

  return (
    <div
      className="relative w-full flex-1 overflow-hidden"
    >
      <motion.div
        layout
        transition={ANIMATION_PRESETS.SPRING_GENTLE}
        id="messages-scroller"
        ref={scrollContainerRef}
        style={{ flexDirection: 'column-reverse', paddingBottom: selectionMode ? '72px' : '0px' }}
        className="flex px-1 relative py-8 appflowy-scrollbar overflow-x-hidden gap-4 h-full w-full overflow-auto"
      >
        <InfiniteScroll
          dataLength={messageIds.length}
          next={loadMoreMessages}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
          inverse={true}
          scrollableTarget="messages-scroller"
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          className="flex flex-col-reverse"
          scrollThreshold="200px"
        >
          {messageIds.map((id) => (
            <div
              onMouseMove={() => setHoveredId(id)}
              key={id}
              className={'overflow-x-hidden'}
            >
              <Message
                id={id}
                isHovered={hoveredId === id}
                fetchMember={fetchMember}
              />
            </div>

          ))}

        </InfiniteScroll>
        {messageIds.length === 0 && !isLoading &&
          <div className={'absolute top-0 left-0 w-full h-full'}>
            <EmptyMessages currentUser={currentUser} />
          </div>}

      </motion.div>
      {showScrollButton && (
        <div className={'absolute left-1/2 bottom-2 transform -translate-x-1/2'}>
          <Button
            variant={'outline'}
            size={'icon'}
            onClick={() => {
              scrollToBottom();
            }}
            className="w-8 h-8 rounded-full shadow-md"
          >
            <ArrowDown size={24} />
          </Button>
        </div>

      )}
    </div>
  );
}