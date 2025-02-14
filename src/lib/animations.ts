export const ANIMATION_PRESETS = {
  SPRING_GENTLE: {
    type: 'spring',
    stiffness: 500,
    damping: 40,
    mass: 1,
  },
  SPRING_BOUNCY: {
    type: 'spring',
    stiffness: 700,
    damping: 30,
    mass: 1,
  },
  TWEEN_SMOOTH: {
    type: 'tween',
    duration: 0.2,
    ease: 'easeInOut',
  },
} as const;

export const MESSAGE_VARIANTS = {
  getMessageVariants: () => ({
    hidden: {
      y: 20,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        y: {
          type: 'spring',
          stiffness: 600,
          damping: 30,
          mass: 1,
        },
        opacity: {
          type: 'tween',
          duration: 0.15,
          ease: 'easeOut',
        },
        scale: {
          type: 'spring',
          stiffness: 600,
          damping: 30,
          mass: 1,
        },
      },
    },
  }),
  getSuggestionsVariants: () => ({
    hidden: {
      x: -100,
      opacity: 0,
      height: 0,
      scale: 0.95,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      height: 'auto',
      transition: ANIMATION_PRESETS.SPRING_GENTLE,
    },
  }),
  getInputVariants: () => ({
    hidden: {
      y: 100,  // 向下移动
      opacity: 0,
      transition: {
        y: {
          type: 'tween',
          duration: 0.2,
          ease: 'easeIn',
        },
        opacity: {
          type: 'tween',
          duration: 0.1,
        },
      },
    },
    visible: {
      y: 0,    // 原始位置
      opacity: 1,
      transition: {
        y: {
          type: 'spring',
          stiffness: 500,
          damping: 30,
          mass: 1,
        },
        opacity: {
          type: 'tween',
          duration: 0.2,
        },
      },
    },
  }),
};