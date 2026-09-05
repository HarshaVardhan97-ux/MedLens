import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface antialiased">
      <Header />
      <Sidebar />
      <div className="lg:pl-sidebar-width">
        <main className="w-full pt-24 bg-background min-h-screen px-space-md lg:px-space-lg py-space-lg max-w-container-max mx-auto pb-24 lg:pb-12">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
