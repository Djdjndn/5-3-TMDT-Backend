import React from 'react';
import ResponsiveView from './responsive/ResponsiveView';
import HeaderDesktopView from './header/HeaderDesktopView';
import HeaderMobileView from './header/HeaderMobileView';
import { useHeaderLogic, refreshHeaderNotifications } from '../hooks/useHeaderLogic';

export { refreshHeaderNotifications };

const Header: React.FC = () => {
  const logic = useHeaderLogic();

  return (
    <ResponsiveView
      desktop={<HeaderDesktopView logic={logic} />}
      mobile={<HeaderMobileView logic={logic} />}
    />
  );
};

export default Header;
