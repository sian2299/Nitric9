
import React, { useState, useEffect } from 'react';
import { Shield, Terminal, Search, Code, Cpu, X, Download, HelpCircle, ChevronDown, ChevronUp, Share } from 'lucide-react';
import Logo from './Logo';
import { LEARNING_TRACKS } from '../constants';
import { LearningTrack } from '../types';

interface SidebarProps {
  onSelectTrack: (track: LearningTrack) => void;
  activeTrackId?: string;
  isOpen: boolean;
  onClose: () => void;
  isRoot: boolean;
  theme: 'light' | 'dark';
  onInstall?: () => void;
}

const IconMap: Record<string, React.ReactNode> = {
  Shield: <Shield size={20} />,
  Terminal: <Terminal size={20} />,
  Search: <Search size={20} />,
  Cpu: <Cpu size={20} />,
  Code: <Code size={20} />
};

const Sidebar: React.FC<SidebarProps> = ({ onSelectTrack, activeTrackId, isOpen, onClose, isRoot, theme, onInstall }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) setPlatform('ios');
    else if (/android/.test(userAgent)) setPlatform('android');
  }, []);

  const themeClasses = theme === 'dark' 
    ? {
        sidebar: isRoot ? 'bg-black border-red-900/50' : 'bg-[#020617] border-slate-900',
        headerText: isRoot ? 'text-red-500' : 'text-slate-400',
        subText: 'text-slate-700',
        sectionLabel: 'text-slate-700',
        guideBg: 'bg-slate-900/40 border-slate-800/50',
        guideText: 'text-slate-400',
        trackBg: 'bg-slate-900/20',
        trackHover: 'hover:bg-slate-900/50',
        trackActive: isRoot ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-300',
        footerText: 'text-slate-800'
      }
    : {
        sidebar: isRoot ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200',
        headerText: isRoot ? 'text-red-600' : 'text-slate-600',
        subText: 'text-slate-400',
        sectionLabel: 'text-slate-400',
        guideBg: 'bg-slate-100 border-slate-200',
        guideText: 'text-slate-500',
        trackBg: 'bg-slate-50',
        trackHover: 'hover:bg-slate-100',
        trackActive: isRoot ? 'bg-red-100 border-red-400 text-red-700' : 'bg-slate-100 border-slate-300 text-slate-900',
        footerText: 'text-slate-300'
      };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0 md:flex
    ${themeClasses.sidebar}
    border-r flex flex-col safe-pt
  `;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={sidebarClasses}>
        <div className={`p-5 border-b ${theme === 'dark' ? 'border-slate-900' : 'border-slate-200'} flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <h2 className={`text-xl font-bold ${themeClasses.headerText} font-mono tracking-tighter`}>
                {isRoot ? 'ROOT_CMD' : 'NtricAcid'}
              </h2>
              <p className={`text-[10px] ${themeClasses.subText} uppercase tracking-widest font-mono italic`}>Mobile Core</p>
            </div>
          </div>
          <button onClick={onClose} className={`md:hidden p-2 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {onInstall && (
            <button
              onClick={onInstall}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border mb-2 ${isRoot ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-[#2E5C99]/10 border-[#2E5C99] text-[#2E5C99]'}`}
            >
              <Download size={20} className="animate-bounce" />
              <div>
                <div className="font-bold text-xs font-mono uppercase">Install Native</div>
                <div className="text-[9px] opacity-70">App Store Experience</div>
              </div>
            </button>
          )}

          {/* Native Install Guide */}
          <div className={`${themeClasses.guideBg} rounded-xl overflow-hidden border`}>
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className={`w-full flex items-center justify-between p-3 ${themeClasses.guideText} hover:text-slate-900 dark:hover:text-slate-200 transition-colors`}
            >
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider font-mono">
                <HelpCircle size={14} />
                <span>Mobile Setup Guide</span>
              </div>
              {showGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showGuide && (
              <div className={`px-3 pb-3 text-[10px] ${themeClasses.guideText} font-mono space-y-3 border-t ${theme === 'dark' ? 'border-slate-800/30' : 'border-slate-200'} pt-3`}>
                {platform === 'ios' ? (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">1</div>
                      <p>Tap <Share size={10} className="inline mx-1" /> "Share" in Safari</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">2</div>
                      <p>Scroll & select <strong>"Add to Home Screen"</strong></p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">1</div>
                      <p>Tap the 3 dots (⋮) menu in Chrome</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">2</div>
                      <p>Select <strong>"Install App"</strong></p>
                    </div>
                  </>
                )}
                <p className="text-[#2E5C99] italic text-[9px] border-t border-blue-500/10 pt-2">Unlocks full-screen native mode!</p>
              </div>
            )}
          </div>

          <div>
            <h3 className={`text-[10px] font-bold ${themeClasses.sectionLabel} uppercase tracking-widest px-2 mb-3 font-mono`}>Modules</h3>
            <div className="space-y-2">
              {LEARNING_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => {
                    onSelectTrack(track);
                    onClose();
                  }}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left border ${
                    activeTrackId === track.id 
                      ? themeClasses.trackActive
                      : `${themeClasses.trackHover} border-transparent text-slate-500 ${themeClasses.trackBg}`
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {IconMap[track.icon]}
                  </div>
                  <div>
                    <div className="font-bold text-sm font-mono">{track.title}</div>
                    <div className="text-[11px] opacity-60 line-clamp-2">{track.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-900' : 'border-slate-200'} text-center pb-8 md:pb-4 safe-pb`}>
          <p className={`text-[9px] ${themeClasses.footerText} font-mono uppercase tracking-widest`}>v1.0.4-Native-Shell</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
