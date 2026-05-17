import React from 'react';
import ResponsiveView from '../responsive/ResponsiveView';
import LayoutDesktop from './LayoutDesktop';
import LayoutMobile from './LayoutMobile';

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
