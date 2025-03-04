import React, { createContext, useCallback, useContext, useState } from 'react';

interface AnimationContextTypes {
  animatingIds: Set<number>;
  registerAnimation: (animationId: number) => void;
  completeAnimation: (animationId: number) => void;
}

export const AnimationContext = createContext<AnimationContextTypes | undefined>(undefined);

export function useMessageAnimation() {
  const context = useContext(AnimationContext);

  if(!context) {
    throw new Error('useAnimating: useAnimating must be used within a motion');
  }
  return context;
}

export const MessageAnimationProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [animatingIds, setAnimatingIds] = useState(new Set<number>());

  const registerAnimation = useCallback((id: number) => {
    setAnimatingIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const completeAnimation = useCallback((id: number) => {
    setAnimatingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        animatingIds,
        registerAnimation,
        completeAnimation,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};