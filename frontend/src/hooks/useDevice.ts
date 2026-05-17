import { useCallback, useEffect, useState } from 'react';
import { DESKTOP_MIN_WIDTH, MOBILE_MEDIA_QUERY } from '../constants/breakpoints';

export interface DeviceInfo {
  width: number;
  isMobile: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
}

function getDeviceInfo(): DeviceInfo {
  const width = typeof window !== 'undefined' ? window.innerWidth : DESKTOP_MIN_WIDTH;
  const isMobile = width < DESKTOP_MIN_WIDTH;
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return {
    width,
    isMobile,
    isDesktop: !isMobile,
    isTouchDevice,
  };
}

/**
 * Runtime device detection for responsive layout switching.
 * Desktop UI at >= 1024px; mobile UI below.
 */
export function useDevice(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>(getDeviceInfo);

  const update = useCallback(() => {
    setDevice(getDeviceInfo());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const onMediaChange = () => update();
    const onResize = () => update();

    mediaQuery.addEventListener('change', onMediaChange);
    window.addEventListener('resize', onResize);

    update();

    return () => {
      mediaQuery.removeEventListener('change', onMediaChange);
      window.removeEventListener('resize', onResize);
    };
  }, [update]);

  return device;
}

export default useDevice;
