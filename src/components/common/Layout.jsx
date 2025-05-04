// components/layout/Layout.jsx
import React from 'react';
import GlobalSidebar from '../common/GlobalSidebar';
import GlobalHeader from '../common/GlobalHeader';

const Layout = ({ children, title = 'Tableau de Bord', userRole = 'professor' }) => {
  return (
    <div className="layout-with-sidebar">
      <GlobalSidebar userRole={userRole} />
      <GlobalHeader title={title} />
      <main className="content-area">
        {children}
      </main>
    </div>
  );
};

export default Layout;