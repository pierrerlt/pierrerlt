import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DevToolsPage } from '@/components/DevToolsProtection';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Upload as UploadIcon, 
  MessageSquare as MessageSquareIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon 
} from 'lucide-react';

interface Stats {
  uploaded: string;
  storage: string;
  views: string;
}

interface AnimatedStats {
  uploaded: number;
  storage: number;
  views: number;
}

export default function MainPage() {
  const { t } = useLanguage();
  const { loading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<Stats>({
    uploaded: "0",
    storage: "0", 
    views: "0"
  });
  
  const [animatedStats, setAnimatedStats] = useState<AnimatedStats>({
    uploaded: 0,
    storage: 0,
    views: 0
  });

  useEffect(() => {
    if (!loading) {
      fetch("/api/global")
        .then(response => response.json())
        .then(data => {
          const targetStats = {
            uploaded: data.uploaded,
            storage: data.storage,
            views: data.views
          };
          
          const startTime = performance.now();
          
          // Animate the statistics counters
          function animate(currentTime: number) {
            const progress = Math.min((currentTime - startTime) / 1500, 1);
            
            setAnimatedStats({
              uploaded: Math.floor(progress * targetStats.uploaded),
              storage: Math.floor(progress * targetStats.storage),
              views: Math.floor(progress * targetStats.views)
            });
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }
          
          requestAnimationFrame(animate);
        })
        .catch(error => {
          console.error('Failed to fetch stats:', error);
        });
    }
  }, [loading]);

  // Format storage size helper
  const formatStorageSize = (bytes: number): string => {
    if (bytes >= 0x40000000) { // 1GB
      return (bytes / 0x40000000).toFixed(1) + "GB";
    } else if (bytes >= 1048576) { // 1MB
      return (bytes / 1048576).toFixed(1) + "MB";
    } else if (bytes >= 1024) { // 1KB
      return (bytes / 1024).toFixed(1) + "KB";
    }
    return bytes + "B";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <DevToolsPage>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <UploadIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">{t("main.title")}</span>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Professional File Hosting
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("main.title")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("main.description")}
            </p>
            <Button 
              size="lg" 
              onClick={() => { window.location.href = "/login"; }}
              className="gap-2"
            >
              <MessageSquareIcon className="w-5 h-5" />
              {t("main.cta")}
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <ShieldIcon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{t("main.features.secure")}</CardTitle>
                <CardDescription>{t("main.features.secure.desc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <ZapIcon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{t("main.features.fast")}</CardTitle>
                <CardDescription>{t("main.features.fast.desc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <MessageSquareIcon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{t("main.features.discord")}</CardTitle>
                <CardDescription>{t("main.features.discord.desc")}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {animatedStats.uploaded.toLocaleString()}
              </div>
              <div className="text-muted-foreground">Uploaded Files</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {formatStorageSize(animatedStats.storage)}
              </div>
              <div className="text-muted-foreground">Storage Used</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {animatedStats.views.toLocaleString()}
              </div>
              <div className="text-muted-foreground">File Views</div>
            </div>
          </div>
        </main>
      </div>
    </DevToolsPage>
  );
}