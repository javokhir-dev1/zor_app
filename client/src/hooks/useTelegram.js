import { useMemo } from 'react';

export function useTelegram() {
  const tg = useMemo(() => window.Telegram?.WebApp, []);

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    initData: tg?.initData,
    colorScheme: tg?.colorScheme,
    isExpanded: tg?.isExpanded,
    ready: () => tg?.ready(),
    expand: () => tg?.expand(),
    close: () => tg?.close(),
    showAlert: (msg) => tg?.showAlert(msg),
    hapticFeedback: tg?.HapticFeedback,
  };
}
