# Puzlino — Mach dein Bild zum Puzzle

Foto auswählen, Teilezahl wählen, mit dem Finger zusammensetzen.
Eine Web-App in einer Datei: läuft offline, als App installierbar, zur echten Android-`.apk` verpackbar.

## Dateien (alle in EINEN Ordner)
- `index.html` — komplette App (Splash, Startseite, Spiel)
- `intro.mp4` — Logo-Animation für den Startbildschirm
- `manifest.json`, `sw.js` — PWA (Installation, Offline)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`

## Bedienung
- **Vier Bereiche** über die untere Navigationsleiste:
  *Start* (Bild auswählen, Beispiel, Weiterspielen, Hell/Dunkel),
  *Meine Puzzle* (Galerie aller Spielstände mit Fortschritt, Filter Alle/Offen/Fertig/Favoriten, Löschen — mehrere Puzzles laufen parallel),
  *Entdecken* (Tagespuzzle, Serien-Zähler mit Monatskalender, Statistik, Erfolge, Sammlungen — in Vorbereitung),
  *Einstellungen* (Design, Musik, Toneffekte, Vollbild, Datenschutz, Intro erneut ansehen).
- Beim Erststart führt ein kurzes **Onboarding** (3 Karten) durch das Spiel.
- Im Spiel markiert der **Stern** das aktuelle Puzzle als Favorit.
- **Teilezahl** ≈12–≈150; das Raster passt sich dem Seitenverhältnis des Fotos an.
- **Vier Stufen** (Schieberegler-Button öffnet den Dialog mit Teilezahl + Stufe):
  *Entspannt* — Vorlage auf dem Brett, Teile rasten überall richtig ein.
  *Klassisch* — ohne Vorlage, Teile rasten nur aneinander.
  *Profi* — Teile sind gedreht: **Doppeltipp/Doppelklick** dreht (rechts der Teilmitte = rechtsherum, links = linksherum).
  *Meister* — gedreht **und gespiegelt**: **kräftig auf ein Teil drücken** spiegelt es (Force-Touch). Gespiegelte Teile wirken leicht entsättigt.
  Langes Halten löst ein Teil aus seiner Gruppe.
  Einrasten nur in richtiger Position, Ausrichtung und unspiegelt.
- **Einrasten beim Loslassen**: Teil dorthin legen, wo es hingehört, loslassen — passt Position (mit Toleranz) und Ausrichtung, rastet es ein.
- **Abdocken**: Teil ~0,5 s gedrückt halten löst es aus seiner Gruppe.
- **Musik** und **Toneffekte** getrennt schaltbar (Notensymbol / Lautsprecher).
- **Tray-Werkzeuge** (links an der Teile-Leiste): **Randteile-Filter** zeigt nur Randteile (schaltet sich aus, wenn alle platziert sind) und **Sortieren** wechselt zwischen gemischt, hell→dunkel und dunkel→hell.
- **Hinweis** (Glühbirne unten links, 3 pro Puzzle): markiert ein falsch ausgerichtetes Teil, oder hebt ein passendes Teil in der Leiste hervor und zeigt die Zielstelle gestrichelt auf dem Brett.
- **Teilezahl** jetzt bis ≈300 (für Tablets).
- **Auge** = Vorschau (PC: Taste V) · **Mischen** = neu starten.
- Schwebende Buttons unten rechts: **Vorlage** an/aus, **Einpassen**, **Zoom sperren**, **Vollbild** (startet automatisch beim ersten Tipp; über den Button verlassen merkt sich die App).
- Mobil: 1 Finger verschieben, 2 Finger zoomen. PC: Mausrad-Zoom, Tasten `+ − 0/F`. Einpassen über den Ziel-Button unten rechts (Doppeltipp auf die Fläche ist bewusst ohne Funktion, damit beim Drehen nichts verspringt).
- **Autosave**: Foto, Lage, Drehung, Zeit und Züge bleiben erhalten. Bestzeiten je Teilezahl/Modus.
- **Sieg**: Das fertige Bild pulsiert mit goldblauem Leuchtrand — Statistik-Karte dazu.

## Direkt öffnen (ohne Server)
Logo, Intro-Video und das Beispielbild (Villa) sind in die `index.html` eingebettet — die Datei läuft
auch direkt vom Handy-Speicher oder per Doppelklick. Nur Installation/Offline-Cache (PWA) brauchen Hosting.

## 1. Lokal testen
```bash
python3 -m http.server 8000
```
Am Handy `http://<PC-IP>:8000` öffnen (gleiches WLAN). `file://` reicht für den Service Worker nicht.

## 2. Hosten + als App installieren (PWA)
1. Ordnerinhalt in ein GitHub-Repo → Settings → Pages → Branch `main`, `/root`.
2. Die `…github.io/…`-URL am Handy in Chrome öffnen → Menü → **App installieren**.
Ergebnis: Icon am Homescreen, Vollbild, offline. (Netlify/Vercel/Cloudflare gehen genauso — HTTPS genügt.)

## 3. Echte Android-.apk
**A — PWABuilder (ohne Android Studio):**
1. App wie unter 2. hosten.
2. Auf https://www.pwabuilder.com die URL eingeben → Android-Paket generieren.
3. `.apk` herunterladen und per Sideload installieren (Entwicklermodus/Unbekannte Quellen).

**B — Capacitor (eigenständige App, Assets gebündelt):**
```bash
npm create @capacitor/app puzlino-app
cd puzlino-app
# alle Dateien aus diesem Ordner nach  www/  kopieren
npm install && npx cap add android && npx cap sync
npx cap open android      # Android Studio: Build → Build APK
```

## Grenzen
- Spielstände liegen lokal in der App (IndexedDB, kein Geräte-Sync); mehrere Puzzles parallel möglich.
- Tagespuzzle nutzt vorerst ein lokales Motiv; echte tägliche Inhalte folgen mit einem Server.
- Drehung gibt es bewusst nur als 90°-Schritte (Schwer-Modus).

## Paket D — Tägliches Spielen & Erfolge
- **Tagespuzzle**: jeden Tag ein neues, am Datum festgelegtes Motiv (offline generiert, ≈48 Teile). Für alle gleich.
- **Serie & Kalender**: Lösen des Tagespuzzles verlängert die Serie; ein Monatskalender markiert erledigte Tage.
- **Statistik**: gelöste Puzzles, gelegte Teile gesamt, schnellste Zeit, längste Serie.
- **Erfolge**: 10 Abzeichen (erstes Puzzle, 10/50 gelöst, Profi/Meister gelöst, 150/300 Teile, 1000 Teile gelegt, Blitz unter 60 s, 7-Tage-Serie).
- **Sieg-Screen**: Button „Eine Stufe schwerer" startet dasselbe Bild eine Schwierigkeit höher.

## Paket E — Foto-Challenges
- **Als Challenge senden** (Sieg-Screen): erzeugt eine kleine `.puzlino`-Datei (Bild, Teilezahl, Stufe, exakter Schnitt und deine Zeit) und teilt sie über das Android-Teilen-Menü (z. B. WhatsApp). Ohne Teilen-Funktion wird die Datei stattdessen gespeichert.
- **Challenge öffnen** (Startseite): importiert eine empfangene `.puzlino`-Datei und startet exakt dasselbe Puzzle frisch gemischt. Nach dem Lösen vergleicht der Sieg-Screen deine Zeit mit der des Absenders (🏆 schneller / Gleichstand / Rückstand).
- Auf installierten Geräten lässt sich eine `.puzlino`-Datei teils direkt aus der Datei-App öffnen (PWA-Dateihandler); der Import-Knopf funktioniert immer.

## Start & Intro
- Installiert startet die App im **Vollbild** (Manifest `display: fullscreen`). Im Browser wird beim ersten Tippen in den Vollbild gewechselt (Browser verlangen dafür eine Nutzergeste).
- Beim Intro-Video erklingt eine **kurze Logo-Melodie**. Hinweis: Browser erlauben Ton erst nach einer Nutzergeste — im installierten App-Start klappt es meist automatisch, sonst beim ersten Tippen.

## Stufe „Lebendig" (neu, frei kombinierbar)
- Schalter im „Puzzle einstellen"-Dialog (unter den Stufen). Lässt sich mit jeder Schwierigkeit kombinieren.
- **Keine Leiste**: alle Teile liegen von Anfang an zufällig auf dem Feld und **bewegen sich** wie kleine Tiere — vier Gangarten (krabbeln, laufen, hüpfen, gleiten), jedes Teil mit eigener Richtung und Geschwindigkeit.
- **Antippen hält ein Teil sofort an** (fangen statt jagen); loslassen lässt es weiterlaufen, falls noch nicht fest verbunden.
- **Verbinden beruhigt**: 1 Teil volle Geschwindigkeit, 2 verbundene ~35 %, ab 3 verbundenen stehen sie still. Das fertige Bild kommt so von selbst zur Ruhe.
- Empfohlen für 12–48 Teile; bei mehr erscheint ein Hinweis. Nur sichtbare, bewegte Gruppen werden animiert (akkuschonend; pausiert im Hintergrund).
- **Großes Bewegungsfeld** (doppelt so groß wie das Bild). Ziehst du ein Teil heraus, springt es nicht zurück, sondern wandert von der abgelegten Stelle sanft und zügig ins Feld zurück.
- Korrekt aufs Brett gesetzte Teile (mit Vorlage) bleiben liegen und zappeln nicht mehr. Am Ende zentriert sich die Ansicht auf das fertige Bild, damit der pulsierende Leuchtrahmen vollständig sichtbar ist.

## Letzte Anpassungen
- Startseite: Logo oben, Mond-Symbol mit Abstand zur Ecke, Karte mit etwas Luft zum Rand.
- Spiegeln (Meister): **Teil gedrückt halten** (oder fest drücken, falls das Gerät Druck meldet) spiegelt es — funktioniert auf jedem Gerät. Drehen weiterhin per Doppeltipp links/rechts.
- Nach dem Lösen erscheint das Sieg-Fenster erst nach **2 Sekunden** — das fertige Bild lässt sich vorher betrachten.
- „Als Challenge senden" öffnet **direkt das Teilen-Menü** (z. B. WhatsApp) mit der `.puzlino`-Datei; kein manuelles Speichern mehr nötig (sofern in sicherem Kontext/installiert). Eigener Name für Challenges in den Einstellungen hinterlegbar.
- Hinweis zum Direkt-Öffnen beim Empfänger: Damit ein Tippen auf die `.puzlino`-Datei in WhatsApp Puzlino direkt öffnet, muss die installierte App die Dateizuordnung mitbringen. Das Web-Manifest deklariert sie (`file_handlers`); beim APK-Bau mit PWABuilder/Bubblewrap wird daraus die Android-Dateizuordnung erzeugt.

## Feinschliff Startseite & Vollbild
- Oberes Symbol mit Abstand zur Ecke; die weiße Karte hat seitlich etwas Luft zum Rand.
- Auto-Vollbild versucht es jetzt bei jeder Geste erneut, bis es greift (Browser verlangen eine Nutzergeste). Für echtes randloses Vollbild ohne Browserleiste die App installieren (Manifest `display: fullscreen`) — im Browser-Tab lässt sich die Browserleiste technisch nicht vollständig entfernen.

## Korrekturen
- **Fortschrittsanzeige** zählt jetzt nur korrekt zusammengesetzte Teile (vorher zeigte besonders der Lebendig-Modus fälschlich 100 % von Anfang an). Gilt für die Anzeige im Spiel und die Galerie.
- **Sieg-Rahmen**: der pulsierende Leuchtrahmen passt jetzt garantiert vollständig ins Bild (Ansicht reserviert genügend Rand, Glow etwas kompakter).
- **Vollbild** reflowt das Layout beim Ein-/Austreten, damit nichts mehr versetzt ist. Hinweis bleibt: automatisches Vollbild ganz ohne Tippen geht nur in der installierten App (Manifest `display: fullscreen`); im Browser braucht es die erste Geste.
