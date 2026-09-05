import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Patient', path: '/patient', icon: 'person' },
  { name: 'Encounter', path: '/dashboard', icon: 'monitoring' },
  { name: 'Labs', path: '/diagnostic-labs', icon: 'chips' },
  { name: 'AI Insights', path: '/ai-insights', icon: 'psychology' },
  { name: 'Imaging', path: '/imaging-radiology', icon: 'radiology' },
  { name: 'Notes', path: '/clinical-notes', icon: 'clinical_notes' },
];

export const MobileNav: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-surface-container shadow-lg px-2 py-1 flex items-center justify-around">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
              isActive
                ? 'text-primary font-bold bg-primary-container/20'
                : 'text-on-surface-variant hover:text-on-surface'
            }`
          }
        >
          <span className="material-symbols-outlined text-lg">{item.icon}</span>
          <span className="text-[10px] whitespace-nowrap">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};
