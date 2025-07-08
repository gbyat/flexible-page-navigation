# Flexible Page Navigation

Ein WordPress-Plugin für flexible Seiten-Navigation - entwickelt als Test- und Trainingsprojekt für moderne WordPress-Plugin-Entwicklung mit automatischem GitHub-Update-System, CI/CD-Pipeline und moderner Entwicklungsumgebung.

> **Hinweis**: Dieses Plugin wurde als Lernprojekt entwickelt, um moderne WordPress-Plugin-Entwicklung, GitHub Actions, CI/CD-Pipelines und Gutenberg-Block-Entwicklung zu erlernen und zu testen. Es ist funktional und einsatzbereit, aber primär für Bildungszwecke konzipiert.

## 🚀 Features

### ✅ **Flexible Navigation Block**

- **Inhaltstyp-Auswahl**: Seiten, Beiträge oder Custom Post Types
- **Sortierung**: Nach Menüreihenfolge, Titel, Datum oder ID
- **Sortierreihenfolge**: Aufsteigend oder absteigend
- **Tiefe**: Konfigurierbare Hierarchie-Tiefe (1-5 Ebenen)
- **Child Selection**: "Current" (Kinder der aktuellen Seite) oder "Custom" (Kinder einer bestimmten Seite)

### ✅ **Design & Formatierung**

- **Aktiver Hauptlink**: Hervorhebung der aktuellen Seite
- **Aktiver Parent-Link**: Hervorhebung der übergeordneten Seite
- **Accordion-Funktionalität**: Aufklappbare Navigation für Top-Level-Items
- **Farbanpassung**: Hintergrundfarbe, Textfarbe, aktive Zustände
- **Responsive Design**: Optimiert für alle Bildschirmgrößen

### ✅ **Automatisches Update-System**

- GitHub Releases Integration
- WordPress Dashboard Update-Benachrichtigungen
- Sichere Token-basierte Authentifizierung
- Automatische Version-Erkennung

### ✅ **CI/CD Pipeline**

- GitHub Actions für automatische Releases
- Automatisches Build und Packaging
- Version-Synchronisation zwischen package.json und PHP
- ZIP-Asset Upload zu GitHub Releases

### ✅ **Entwicklungstools**

- Webpack-basiertes Build-System
- Hot-Reload für Block-Entwicklung
- Automatische Changelog-Generierung
- Version-Management mit npm scripts

### ✅ **Admin Interface**

- Tab-basierte Einstellungsseite
- Debug-Informationen
- Cache-Management
- GitHub API-Tests

## 📦 Installation

### 1. Repository klonen

```bash
git clone https://github.com/gbyat/flexible-page-navigation.git
cd flexible-page-navigation
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Plugin anpassen

- `flexible-page-navigation.php` anpassen (Name, Version, etc.)
- GitHub Repository in `flexible-page-navigation.php` aktualisieren
- Plugin-spezifische Funktionalität hinzufügen

### 4. Build erstellen

```bash
npm run build
```

### 5. Plugin installieren

Das Plugin kann direkt in WordPress installiert werden oder über den Plugin-Upload.

## 🔧 Konfiguration

### GitHub Token einrichten

1. Gehe zu GitHub Settings → Developer settings → Personal access tokens
2. Erstelle einen neuen Token mit `repo` und `workflow` Berechtigungen
3. Kopiere den Token
4. Gehe zu WordPress Admin → Einstellungen → Flexible Page Navigation
5. Füge den Token ein und speichere

### Block-Konfiguration

Der Block bietet folgende Einstellungen:

#### Navigation Settings

- **Content Type**: Seiten, Beiträge oder Custom Post Types
- **Sort By**: Menüreihenfolge, Titel, Datum, ID
- **Sort Order**: Aufsteigend oder absteigend
- **Depth**: Hierarchie-Tiefe (1-5 Ebenen)
- **Child Selection**:
  - "Current": Kinder der aktuellen Seite
  - "Custom": Kinder einer bestimmten Seite (mit Page-ID-Auswahl)
- **Enable Accordion**: Accordion-Funktionalität für Top-Level-Items

#### Colors

- **Background Color**: Hintergrundfarbe der Navigation
- **Text Color**: Textfarbe der Links
- **Active Background Color**: Hintergrundfarbe für aktive Links
- **Active Text Color**: Textfarbe für aktive Links

## 🚀 Entwicklung

### Build-System

```bash
# Development Build
npm run build

# Production Build
npm run build:prod

# Watch Mode
npm run start
```

### Version Management

```bash
# Patch Version (1.0.0 → 1.0.1)
npm run release:patch

# Minor Version (1.0.0 → 1.1.0)
npm run release:minor

# Major Version (1.0.0 → 2.0.0)
npm run release:major
```

### Release erstellen

1. Änderungen committen
2. Version bumpen: `npm run release:patch`
3. GitHub Actions erstellt automatisch ein Release
4. WordPress erkennt das Update automatisch

### ZIP-Datei erstellen

Für manuelle Distributionen kann eine ZIP-Datei erstellt werden:

```bash
# ZIP-Datei erstellen (ohne Entwicklungsdateien)
npm run zip
```

Die ZIP-Datei wird im `release/` Verzeichnis erstellt und enthält nur die für den Plugin-Betrieb erforderlichen Dateien:

- `flexible-page-navigation.php` (Haupt-Plugin-Datei)
- `build/` (kompilierte Block-Dateien)
- `assets/` (CSS/JS Assets)
- `README.md`, `CHANGELOG.md`, `LICENSE` (Dokumentation)

**Ausgeschlossen werden:**

- `src/` (Quelldateien)
- `webpack.config.js` (Build-Konfiguration)
- `.gitignore` (Git-Konfiguration)
- `package.json`, `package-lock.json` (Dependencies)
- `scripts/` (Entwicklungsskripte)
- `node_modules/` (Dependencies)

## 📁 Projektstruktur

```
flexible-page-navigation/
├── .github/
│   └── workflows/
│       └── release.yml          # GitHub Actions für Releases
├── src/
│   ├── block.json              # Block-Konfiguration
│   ├── index.js                # Block-Editor Code
│   ├── index.css               # Editor Styles
│   ├── style.css               # Frontend Styles
│   ├── frontend.js             # Frontend JavaScript
│   └── admin.js                # Admin JavaScript
├── scripts/
│   └── sync-version.js         # Version-Synchronisation
├── languages/                  # Übersetzungen
├── flexible-page-navigation.php # Haupt-Plugin-Datei
├── package.json                # Dependencies und Scripts
├── webpack.config.js           # Build-Konfiguration
├── CHANGELOG.md                # Automatisch generiert
└── README.md                   # Diese Datei
```

## 🔍 Admin Interface

Das Plugin bietet eine tab-basierte Admin-Oberfläche:

### ⚙️ **Settings**

- GitHub Token Konfiguration
- Plugin-spezifische Einstellungen

### 🐛 **Debug Info**

- Update-System Status
- GitHub API Tests
- Cache-Status
- System-Informationen

## 🎨 Verwendung

### Block hinzufügen

1. Im WordPress-Editor den "Flexible Page Navigation" Block hinzufügen
2. Einstellungen im Sidebar-Panel konfigurieren
3. Navigation wird automatisch gerendert

### Shortcode (optional)

```php
[fpn_navigation content_type="page" depth="2" child_selection="current"]
```

### Template Integration

```php
<?php
// In einem Template
echo do_shortcode('[fpn_navigation content_type="page" depth="3"]');
?>
```

## 🌐 Übersetzungen

Das Plugin ist vollständig übersetzbar:

1. Übersetzungsdateien in `/languages/` erstellen
2. Text Domain: `flexible-page-navigation`
3. POEdit oder ähnliche Tools verwenden

## 🛠️ Anpassungen

### Custom Styling

```css
/* Custom CSS für die Navigation */
.fpn-navigation {
  /* Ihre Anpassungen */
}

.fpn-item.fpn-active > a {
  /* Aktiver Link Styling */
}
```

### JavaScript Events

```javascript
// Accordion Events
document.addEventListener("fpnAccordionExpanded", function (e) {
  console.log("Accordion expanded:", e.detail.item);
});

document.addEventListener("fpnAccordionCollapsed", function (e) {
  console.log("Accordion collapsed:", e.detail.item);
});
```

## 📝 Changelog

Das Changelog wird automatisch über Git Hooks generiert. Jeder Commit wird automatisch dokumentiert.

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

GPL v2 oder später - siehe LICENSE Datei für Details.

## 🎓 Lernziele & Erkenntnisse

Dieses Projekt wurde entwickelt, um folgende Technologien und Konzepte zu erlernen und zu testen:

### **WordPress Plugin Development**

- Moderne Plugin-Architektur mit OOP
- Gutenberg Block-Entwicklung
- WordPress Hooks und Filters
- Admin Interface Entwicklung

### **CI/CD & DevOps**

- GitHub Actions für automatische Releases
- Automatische Version-Management
- Build-Pipelines mit Webpack
- Deployment-Automatisierung

### **Frontend Development**

- React-basierte Block-Editor-Komponenten
- CSS-Module und Styling-Strategien
- JavaScript Event-Handling
- Responsive Design

### **Backend Development**

- PHP 8+ Features und Best Practices
- REST API Integration
- Caching-Strategien
- Security (Nonces, Sanitization)

### **Version Control & Collaboration**

- Git Workflows
- Automated Changelog Generation
- Release Management
- Code Quality Tools

---

**Hinweis:** Dieses Plugin ist vollständig funktional und einsatzbereit, wurde aber primär als Lernprojekt entwickelt. Es demonstriert moderne WordPress-Plugin-Entwicklung und kann als Referenz für ähnliche Projekte dienen.

```

```
