import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === "de" ? "en" : "de")}
      title={`Switch to ${language === "de" ? "English" : "Deutsch"}`}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}