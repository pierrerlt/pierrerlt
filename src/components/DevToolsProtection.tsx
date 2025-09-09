import React, { useState, useEffect, ReactNode } from 'react';

interface DevToolsBlockerProps {
  show: boolean;
}

function DevToolsBlocker({ show }: DevToolsBlockerProps) {
  const [visible, setVisible] = useState(show);
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!mounted) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#000",
      color: "#ff1a1a",
      fontFamily: "'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      zIndex: 9999,
      padding: "2rem",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease-in-out"
    }}>
      <h1 style={{
        fontSize: "4rem",
        textShadow: "0 0 15px #ff1a1a, 0 0 30px #ff1a1a",
        margin: "0",
        letterSpacing: "2px"
      }}>
        ACCESS DENIED
      </h1>
      <div style={{
        fontSize: "6rem",
        fontWeight: "bold",
        margin: "20px 0",
        textShadow: "0 0 20px #ff1a1a, 0 0 40px #ff1a1a"
      }}>
        403
      </div>
      <p style={{
        fontSize: "1.5rem",
        color: "#fff",
        maxWidth: "600px",
        lineHeight: "1.5"
      }}>
        Sorry, you don't have permission to access this content while DevTools are open.
      </p>
    </div>
  );
}

function useDevToolsDetection(): boolean {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Prevent common dev tools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Simple devtools detection using console
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          setIsOpen(true);
        }
      } else {
        if (devtools.open) {
          devtools.open = false;
          setIsOpen(false);
        }
      }
    }, 500);

    // Prevent debugger statements by overriding Function constructor
    const originalConstructor = Function.prototype.constructor;
    Function.prototype.constructor = function(...args: any[]) {
      const code = args[args.length - 1] || "";
      if (typeof code === 'string' && code.includes("debugger")) {
        return () => {};
      }
      return originalConstructor.apply(this, args);
    };

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      Function.prototype.constructor = originalConstructor;
    };
  }, []);

  return isOpen;
}

interface DevToolsPageProps {
  children: ReactNode;
}

export function DevToolsPage({ children }: DevToolsPageProps) {
  const isDevToolsOpen = useDevToolsDetection();
  
  return (
    <>
      <DevToolsBlocker show={isDevToolsOpen} />
      {!isDevToolsOpen && children}
    </>
  );
}