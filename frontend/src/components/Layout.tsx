import React from 'react';
import ResponsiveView from './responsive/ResponsiveView';
import LayoutDesktop from './Layout/LayoutDesktop';
import LayoutMobile from './Layout/LayoutMobile';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <ResponsiveView
    desktop={<LayoutDesktop>{children}</LayoutDesktop>}
    mobile={<LayoutMobile>{children}</LayoutMobile>}
  />
);

export default Layout;
