
import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (cmd: string) => Promise<string>;
  theme: 'light' | 'dark';
}

const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose, onCommand, theme }) => {
  const [history, setHistory] = useState<string[]>(['Microsoft Windows [Version 10.0.19045.3803]', '(c) NtricAcid Corporation. All rights reserved.', '']);
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    setHistory(prev => [...prev, `C:\\Users\\Researcher> ${cmd}`]);
    setInput('');

    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setHistory(['']);
      return;
    }

    if (lowerCmd === 'exit' || lowerCmd === 'quit') {
      onClose();
      return;
    }

    if (lowerCmd === 'help') {
      setHistory(prev => [...prev, 
        'HELP          Provides help information for NtricAcid commands.',
        'CLS           Clears the screen.',
        'EXIT          Quits the CMD.EXE program (command interpreter).',
        'VER           Displays the NtricAcid version.',
        'WHOAMI        Displays the current user name.',
        'SYSTEMINFO    Displays machine-specific properties and configuration.',
        'QUERY [text]  Sends a direct neural query to the AI core.',
        ''
      ]);
      return;
    }

    if (lowerCmd === 'ver') {
      setHistory(prev => [...prev, 'NtricAcid OS [Version 5.2.2024]', '']);
      return;
    }

    if (lowerCmd === 'whoami') {
      setHistory(prev => [...prev, 'ntricacid\\researcher', '']);
      return;
    }

    if (lowerCmd === 'systeminfo') {
      setHistory(prev => [...prev, 
        'Host Name:                 NTRICACID-V5',
        'OS Name:                   NtricAcid OS',
        'System Manufacturer:       SIAN Labs',
        'System Model:              Neural Core v3',
        'Processor(s):              Quantum RISC v9 @ 4.2THz',
        'Total Physical Memory:     1,024,000 MB',
        ''
      ]);
      return;
    }

    // Default: AI Query
    setHistory(prev => [...prev, 'Processing neural response...']);
    try {
      const response = await onCommand(cmd);
      setHistory(prev => [...prev, response, '']);
    } catch (err) {
      setHistory(prev => [...prev, 'ERROR: Command not recognized or neural link timed out.', '']);
    }
  };

  const bgClass = theme === 'dark' ? 'bg-[#0c0c0c]' : 'bg-[#f0f0f0]';
  const textClass = theme === 'dark' ? 'text-[#cccccc]' : 'text-[#333333]';
  const borderClass = theme === 'dark' ? 'border-[#333333]' : 'border-[#cccccc]';

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10 pointer-events-none`}>
      <div 
        className={`pointer-events-auto flex flex-col transition-all duration-300 shadow-2xl border ${bgClass} ${borderClass} 
        ${isMaximized ? 'w-full h-full' : 'w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden'}`}
      >
        {/* Title Bar */}
        <div className={`h-8 flex items-center justify-between px-3 shrink-0 ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#e1e1e1]'} border-b ${borderClass}`}>
          <div className="flex items-center gap-2">
            <TerminalIcon size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            <span className={`text-xs font-sans font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Command Prompt</span>
          </div>
          <div className="flex items-center">
            <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 hover:bg-gray-500/20 transition-colors">
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-red-600 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-2 font-mono text-sm whitespace-pre-wrap leading-relaxed custom-scrollbar"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <div key={i} className={textClass}>{line}</div>
          ))}
          <form onSubmit={handleCommand} className="flex items-center mt-1">
            <span className={textClass}>C:\Users\Researcher&gt;&nbsp;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none ${textClass} font-mono caret-white`}
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;
