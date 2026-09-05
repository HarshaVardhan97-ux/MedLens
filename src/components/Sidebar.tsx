import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Patient Details', path: '/patient', icon: 'person' },
  { name: 'Encounter Overview', path: '/dashboard', icon: 'monitoring' },
  { name: 'Diagnostic Labs', path: '/diagnostic-labs', icon: 'chips' },
  { name: 'AI Insights', path: '/ai-insights', icon: 'psychology' },
  { name: 'Imaging & Radiology', path: '/imaging-radiology', icon: 'radiology' },
  { name: 'Clinical Notes', path: '/clinical-notes', icon: 'clinical_notes' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-24 bottom-0 w-sidebar-width bg-surface-container-lowest z-40 flex flex-col justify-between py-space-md hidden lg:flex border-r border-surface-container-low">
      <div className="px-space-md">
        <div className="px-space-sm py-space-xs mb-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Clinical Dossier
          </span>
        </div>
        <nav className="flex flex-col gap-space-xxs">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: active }) =>
                  `flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all ${
                    active || isActive
                      ? 'bg-primary-container text-on-primary font-title-sm shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-md'
                  }`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="px-space-md pt-space-sm">
        <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-title-sm text-secondary">cloud_done</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">EHR Sync Active</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
        </div>
      </div>
    </aside>
  );
};
