import React from 'react';
import { useDevice } from '../../hooks/useDevice';

interface ResponsiveViewProps {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
}

/**
 * Renders desktop or mobile presentation based on runtime width (< 1024px = mobile).
 */
const ResponsiveView: React.FC<ResponsiveViewProps> = ({ desktop, mobile }) => {
  const { isMobile } = useDevice();
  return <>{isMobile ? mobile : desktop}</>;
};

export default ResponsiveView;
