/**
 * KRUSHIDRISHTI AI — Navigation Bar Component
 * Developed by Sopan Pandit Gavali
 */

import React, { useState } from 'react';
import { Sprout, Scan, History, BookOpen, ShieldCheck, Settings, Info, LogIn, LogOut, Menu, X, User as UserIcon, Globe } from 'lucide-react';
import { Language, UserProfile } from '../types.js';
import { TRANSLATIONS } from '../i18n.js';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Sprout },
    { id: 'scan', label: t.nav.scan, icon: Scan, highlight: true },
    { id: 'history', label: t.nav.history, icon: History },
    { id: 'knowledge', label: t.nav.knowledge, icon: BookOpen },
    { id: 'expert', label: t.nav.expert, icon: ShieldCheck, badge: user?.role === 'expert' || user?.role === 'admin' },
    { id: 'admin', label: t.nav.admin, icon: Settings, adminOnly: true },
    { id: 'about', label: t.nav.about, icon: Info },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/30 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            id="brand-logo-button"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <div className="absolute inset-0 bg-emerald-500/10" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white font-['Outfit']">
                  KRUSHI<span className="text-emerald-400">DRISHTI</span> <span className="text-teal-300 text-xs px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/50">AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-tight font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== 'admin') return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`ml-1 px-3.5 py-1.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-all shadow-sm ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls (Language + User Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg p-0.5 text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('mr')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  lang === 'mr' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  lang === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Auth Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                    {user.full_name}
                  </span>
                  <span className="text-[10px] text-emerald-400 capitalize font-mono">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  id="user-logout-button"
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="user-login-button"
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.nav.login}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg md:hidden text-slate-300 hover:text-white bg-slate-800/80"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
