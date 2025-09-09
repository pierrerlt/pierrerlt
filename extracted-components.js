// Extracted and formatted components from the minified bundle

// Main page component - appears to be a landing page for a file hosting service
function MainPage() {
  const { t } = useLanguage();
  const { loading } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({
    uploaded: "0",
    storage: "0", 
    views: "0"
  });
  
  const [animatedStats, setAnimatedStats] = useState({
    uploaded: 0,
    storage: 0,
    views: 0
  });

  useEffect(() => {
    if (!loading) {
      fetch("/api/global")
        .then(e => e.json())
        .then(data => {
          const targetStats = {
            uploaded: data.uploaded,
            storage: data.storage,
            views: data.views
          };
          
          const startTime = performance.now();
          
          // Animate the statistics counters
          function animate(currentTime) {
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
        });
    }
  }, [loading]);

  // Format storage size helper
  const formatStorageSize = (bytes) => {
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
                {animatedStats.uploaded}
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
                {animatedStats.views}
              </div>
              <div className="text-muted-foreground">File Views</div>
            </div>
          </div>
        </main>
      </div>
    </DevToolsPage>
  );
}

// Auth Provider Context
const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // If user is approved, update session
        if (userData.status === "approved") {
          await fetch("/api/auth/session", {
            method: "PUT",
            body: JSON.stringify({
              username: userData.username,
              userId: userData.id
            })
          });
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const login = () => {
    window.location.href = "/api/auth/discord";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Language Provider with translations
const LanguageContext = createContext(undefined);

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
};

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("de");

  useEffect(() => {
    const defaultLang = navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
    setLanguage(localStorage.getItem("language") || defaultLang);
  }, []);

  const updateLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Language Toggle Component
function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === "de" ? "en" : "de")}
    >
      <LanguageIcon className="h-4 w-4" />
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// DevTools Protection Component
function DevToolsPage({ children }) {
  const isDevToolsOpen = useDevToolsDetection();
  
  return (
    <>
      <DevToolsBlocker show={isDevToolsOpen} />
      {!isDevToolsOpen && children}
    </>
  );
}

function DevToolsBlocker({ show }) {
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

function useDevToolsDetection() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Prevent common dev tools shortcuts
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // DevTools detection logic (using external library)
    const handleDevToolsChange = (isOpen) => {
      setIsOpen(isOpen);
    };

    // Start detection
    devtools.addListener(handleDevToolsChange);
    devtools.launch();

    // Prevent debugger statements
    const originalConstructor = Function.prototype.constructor;
    Function.prototype.constructor = function(...args) {
      const code = args[args.length - 1] || "";
      if (code.includes("debugger")) {
        return () => {};
      }
      return originalConstructor.apply(this, args);
    };

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      devtools.removeListener(handleDevToolsChange);
      Function.prototype.constructor = originalConstructor;
    };
  }, []);

  return isOpen;
}

export default MainPage;