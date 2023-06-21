import { useEffect, useState } from 'react';

type IBodyScrollbarHook = {
  lockBody: () => void;
  unlockBody: () => void;
  isBodyLocked: boolean;
};

const useBodyScrollbar = (): IBodyScrollbarHook => {
  const [isBodyLocked, setIsBodyLocked] = useState(false);

  useEffect(() => {
    if (isBodyLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isBodyLocked]);

  const lockBody = () => setIsBodyLocked(true);
  const unlockBody = () => setIsBodyLocked(false);

  return { lockBody, unlockBody, isBodyLocked };
};

export { useBodyScrollbar };
