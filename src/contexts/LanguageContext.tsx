import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  de: {
    "nav.home": "Startseite",
    "nav.login": "Anmelden",
    "nav.dashboard": "Dashboard",
    "nav.settings": "Einstellungen",
    "nav.admin": "Admin",
    "nav.logout": "Abmelden",
    "main.title": "FileHoster",
    "main.subtitle": "Professionelles File-Hosting mit Discord-Integration",
    "main.description": "Sichere, schnelle und zuverlässige Dateifreigabe für Entwickler und Teams.",
    "main.features.secure": "Sicher",
    "main.features.secure.desc": "Ende-zu-Ende-Verschlüsselung für alle Dateien",
    "main.features.fast": "Schnell",
    "main.features.fast.desc": "Blitzschnelle Uploads und Downloads",
    "main.features.discord": "Discord-Integration",
    "main.features.discord.desc": "Nahtlose Anmeldung mit Discord",
    "main.cta": "Mit Discord anmelden",
    "auth.login": "Anmelden",
    "auth.login.discord": "Mit Discord anmelden",
    "auth.request.title": "Zugang beantragen",
    "auth.request.desc": "Ihr Konto wartet auf Genehmigung durch einen Administrator.",
    "auth.request.pending": "Antrag ausstehend",
    "auth.login.nocode": "Autorisierung fehlgeschlagen. Bitte versuche es erneut.",
    "auth.login.failed": "Anmeldung fehlgeschlagen. Bitte versuche es erneut.",
    "auth.login.sessionNotFound": "Sitzung nicht gefunden. Bitte logge dich erneut ein.",
    "dashboard.title": "Dashboard",
    "dashboard.storage": "Speicher",
    "dashboard.files": "Dateien",
    "dashboard.views": "Aufrufe",
    "dashboard.bandwidth": "Bandbreite",
    "dashboard.upload": "Dateien hochladen",
    "dashboard.sharex": "ShareX Config herunterladen",
    "common.loading": "Lädt...",
    "common.error": "Fehler",
    "common.success": "Erfolgreich",
    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.copy": "Kopieren",
    "common.download": "Herunterladen"
  },
  en: {
    "nav.home": "Home",
    "nav.login": "Login",
    "nav.dashboard": "Dashboard",
    "nav.settings": "Settings",
    "nav.admin": "Admin",
    "nav.logout": "Logout",
    "main.title": "FileHoster",
    "main.subtitle": "Professional File Hosting with Discord Integration",
    "main.description": "Secure, fast, and reliable file sharing for developers and teams.",
    "main.features.secure": "Secure",
    "main.features.secure.desc": "End-to-end encryption for all files",
    "main.features.fast": "Fast",
    "main.features.fast.desc": "Lightning-fast uploads and downloads",
    "main.features.discord": "Discord Integration",
    "main.features.discord.desc": "Seamless login with Discord",
    "main.cta": "Login with Discord",
    "auth.login": "Login",
    "auth.login.discord": "Login with Discord",
    "auth.request.title": "Request Access",
    "auth.request.desc": "Your account is pending approval from an administrator.",
    "auth.request.pending": "Request Pending",
    "auth.login.nocode": "Authorization failed. Please check your input and try again.",
    "auth.login.failed": "Login failed. Please check your credentials and try again.",
    "auth.login.sessionNotFound": "Session not found. Please log in again.",
    "dashboard.title": "Dashboard",
    "dashboard.storage": "Storage",
    "dashboard.files": "Files",
    "dashboard.views": "Views",
    "dashboard.bandwidth": "Bandwidth",
    "dashboard.upload": "Upload Files",
    "dashboard.sharex": "Download ShareX Config",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.copy": "Copy",
    "common.download": "Download"
  }
} as const;

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("de");

  useEffect(() => {
    // Check if running in browser
    if (typeof window !== 'undefined') {
      const defaultLang = navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
      const savedLang = localStorage.getItem("language") as Language;
      setLanguageState(savedLang || defaultLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", lang);
    }
  };

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    return translation || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}