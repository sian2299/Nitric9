
import React, { useRef, useEffect, useState } from 'react';
import { Message } from '../types';
import { User, Shield, ExternalLink, ShieldAlert, Volume2, Download, Image as ImageIcon, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  theme: 'light' | 'dark';
  onPlay?: () => void;
  onRetry?: (messageId: string) => void;
  aiName?: string;
  userName?: string;
}

const COPY_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ message, theme, onPlay, onRetry, aiName = 'NTRICACID', userName = 'RESEARCHER' }) => {
  const isAssistant = message.role === 'assistant';
  const isError = message.status === 'error';
  const isRootResponse = message.content.includes("ROOT") || (isAssistant && isError);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;
    
    const buttons = contentRef.current.querySelectorAll('.copy-code-btn');
    const cleanupFns: (() => void)[] = [];

    buttons.forEach((btn) => {
      const handler = () => {
        const pre = btn.parentElement?.querySelector('pre code');
        if (pre) {
          const text = pre.textContent || '';
          navigator.clipboard.writeText(text).then(() => {
            const label = btn.querySelector('.btn-label');
            const icon = btn.querySelector('.btn-icon');
            if (label && icon) {
              const originalLabel = label.textContent;
              const originalIcon = icon.innerHTML;
              
              label.textContent = 'Copied!';
              icon.innerHTML = CHECK_ICON_SVG;
              btn.classList.add('text-green-400', 'border-green-500/50', 'bg-green-500/10');
              
              setTimeout(() => {
                label.textContent = originalLabel;
                icon.innerHTML = originalIcon;
                btn.classList.remove('text-green-400', 'border-green-500/50', 'bg-green-500/10');
              }, 2000);
            }
          });
        }
      };
      
      btn.addEventListener('click', handler);
      cleanupFns.push(() => btn.removeEventListener('click', handler));
    });

    return () => cleanupFns.forEach(fn => fn());
  }, [message.content]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatContent = (content: string) => {
    const escaped = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const h3Color = theme === 'dark' ? 'text-green-400' : 'text-green-600';
    const h2Color = theme === 'dark' ? 'text-green-500' : 'text-green-700';
    const strongColor = theme === 'dark' ? 'text-white' : 'text-slate-900 font-bold';
    const inlineCodeBg = theme === 'dark' ? 'bg-slate-800 text-pink-400' : 'bg-slate-200 text-pink-600';
    const preBg = theme === 'dark' ? 'bg-black border-slate-800' : 'bg-slate-900 border-slate-700';
    const codeColor = theme === 'dark' ? 'text-blue-300' : 'text-blue-200';

    return escaped
      .replace(/### (.*)/g, `<h3 class="text-base font-bold ${h3Color} mt-3 mb-1">$1</h3>`)
      .replace(/## (.*)/g, `<h2 class="text-lg font-bold ${h2Color} mt-4 mb-2">$1</h2>`)
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${strongColor}">$1</strong>`)
      .replace(/`(.*?)`/g, `<code class="${inlineCodeBg} px-1 rounded font-mono text-xs">$1</code>`)
      .replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<div class="relative group my-4">
          <button class="copy-code-btn absolute right-2 top-2 px-2 py-1 rounded border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center gap-1.5 font-sans" title="Copy Code">
            <span class="btn-icon">${COPY_ICON_SVG}</span>
            <span class="btn-label text-[10px] font-medium uppercase tracking-tight">Copy</span>
          </button>
          <pre class="${preBg} border p-4 rounded-xl font-mono text-[11px] overflow-x-auto ${codeColor} whitespace-pre"><code>${code}</code></pre>
        </div>`;
      })
      .replace(/\n/g, '<br />');
  };

  const bubbleThemeClasses = theme === 'dark'
    ? {
        container: isAssistant ? (isError ? 'bg-red-500/5' : 'bg-slate-900/30') : 'bg-transparent',
        border: isError ? 'border-red-900/40' : 'border-slate-900/50',
        avatar: isAssistant 
          ? (isError ? 'bg-red-500/10 border-red-500/50 text-red-500' : (isRootResponse ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500')) 
          : 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        label: isAssistant ? (isError ? 'text-red-500' : (isRootResponse ? 'text-red-500' : 'text-green-500')) : 'text-blue-400',
        text: isError ? 'text-red-200/70' : 'text-slate-300',
        timestamp: 'text-slate-600',
        groundingBg: 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-blue-400'
      }
    : {
        container: isAssistant ? (isError ? 'bg-red-50' : 'bg-slate-100/50') : 'bg-white',
        border: isError ? 'border-red-200' : 'border-slate-200',
        avatar: isAssistant 
          ? (isError ? 'bg-red-100 border-red-400 text-red-600' : (isRootResponse ? 'bg-red-100 border-red-400 text-red-600' : 'bg-green-100 border-green-400 text-green-700')) 
          : 'bg-blue-100 border-blue-400 text-blue-700',
        label: isAssistant ? (isError ? 'text-red-600' : (isRootResponse ? 'text-red-600' : 'text-green-700')) : 'text-blue-700',
        text: isError ? 'text-red-900/80' : 'text-slate-800',
        timestamp: 'text-slate-400',
        groundingBg: 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-blue-700'
      };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `NtricAcid_Gen_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex gap-3 p-4 md:p-6 ${bubbleThemeClasses.container} transition-colors border-b ${bubbleThemeClasses.border}`}>
      <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 border ${bubbleThemeClasses.avatar}`}>
        {isAssistant ? (isError ? <AlertCircle size={18} /> : (isRootResponse ? <ShieldAlert size={18} /> : <Shield size={18} />)) : <User size={18} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${bubbleThemeClasses.label}`}>
              {isAssistant ? (isError ? 'SYSTEM_FAIL' : (isRootResponse ? 'KERNEL_ROOT' : aiName.toUpperCase())) : userName.toUpperCase()}
            </span>
            <span className={`text-[9px] ${bubbleThemeClasses.timestamp} font-mono`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isError && (
              <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 rounded uppercase tracking-tighter border border-red-500/20">
                ERROR_{message.errorType?.toUpperCase() || 'UNKNOWN'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleCopyMessage}
              className={`p-1 rounded-md hover:bg-slate-500/10 transition-colors ${copied ? 'text-green-500' : (theme === 'dark' ? 'text-slate-600' : 'text-slate-400')}`}
              title="Copy Message"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {message.imageUrl && !isError && (
              <button 
                onClick={() => downloadImage(message.imageUrl!)}
                className={`p-1 rounded-md hover:bg-slate-500/10 transition-colors ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}
                title="Download Image"
              >
                <Download size={14} />
              </button>
            )}
            {isAssistant && !isError && (
              <button 
                onClick={onPlay}
                className={`p-1 rounded-md hover:bg-slate-500/10 transition-colors ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}
                title="Speak Message"
              >
                <Volume2 size={14} />
              </button>
            )}
          </div>
        </div>
        
        {message.imageUrl && !isError && (
          <div className="mb-4 relative group max-w-lg">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-2xl -z-10 group-hover:bg-blue-500/10 transition-all"></div>
            <img 
              src={message.imageUrl} 
              alt="Generated Content" 
              className="w-full rounded-2xl border border-slate-800 shadow-2xl object-cover aspect-square"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/60 backdrop-blur-md text-[9px] px-2 py-1 rounded text-white font-mono flex items-center gap-1.5 border border-white/10 uppercase tracking-tighter">
                <ImageIcon size={10} />
                N_IMAGE_GEN
              </span>
            </div>
          </div>
        )}

        <div 
          ref={contentRef}
          className={`${bubbleThemeClasses.text} leading-relaxed text-xs md:text-sm break-words font-sans chat-content ${isError ? 'italic font-mono' : ''}`}
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />

        {isError && onRetry && (
          <div className="mt-4">
            <button 
              onClick={() => onRetry(message.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95"
            >
              <RefreshCw size={12} />
              RETRY_MODULE
            </button>
          </div>
        )}

        {message.groundingLinks && message.groundingLinks.length > 0 && !isError && (
          <div className={`mt-4 pt-3 border-t ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200'}`}>
            <div className="flex flex-wrap gap-2">
              {message.groundingLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[10px] ${bubbleThemeClasses.groundingBg} px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-2`}
                >
                  <span className="truncate max-w-[120px]">{link.title}</span>
                  <ExternalLink size={10} className="shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;
