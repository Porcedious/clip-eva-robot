# 🤖 clip-eva-robot

> **Interactive Three.js OLED Robot Visualizer & Procedural Neon Emotion System for Angular**

A reusable Angular library providing 3D robot rendering, dynamic procedural OLED face expressions, floating hover physics, auto-blinking, and customizable lighting/color themes.

---

## 📦 Installation

### From Private Git Repo
```bash
npm install git+ssh://git@github.com:yourcompany/clip-eva-robot.git
```
*(Or if using HTTPS token: `npm install https://<TOKEN>@github.com/yourcompany/clip-eva-robot.git`)*

### Peer Dependencies
Ensure `three` is installed in your host Angular app:
```bash
npm install three
npm install --save-dev @types/three
```

---

## 🚀 Quick Start

### 1. Import Component
In your standalone component or NgModule:
```typescript
import { Component } from '@angular/core';
import { ClipEvaRobotComponent, RobotEmotion } from 'clip-eva-robot';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [ClipEvaRobotComponent],
  template: `
    <div style="width: 100%; height: 500px;">
      <clip-eva-robot [emotion]="currentEmotion"></clip-eva-robot>
    </div>
  `
})
export class MyPageComponent {
  currentEmotion: RobotEmotion = 'happy';
}
```

---

## 🎛️ Full Component API Reference

```html
<clip-eva-robot
  <!-- 1. Emotion & Expressions -->
  [emotion]="'excited'"             <!-- 'happy' | 'surprised' | 'confused' | 'neutral' | 'sad' | 'angry' | 'sleepy' | 'excited' | 'love' -->

  <!-- 2. Dynamic Behaviors -->
  [autoBlink]="true"                <!-- Automatic natural blinking intervals -->
  [hoverMode]="true"                <!-- Subtle hovering/floating animation -->
  [breathingPulse]="true"           <!-- Idle breathing luminescence pulse -->

  <!-- 3. OLED Display & Colors -->
  [colorPreset]="'cyan'"            <!-- 'cyan' | 'violet' | 'rose' | 'emerald' | 'amber' -->
  [primaryColor]="'#00f0ff'"        <!-- Custom neon glow color -->
  [secondaryColor]="'#3b82f6'"      <!-- Custom gradient secondary color -->
  [glowPower]="1.2"                 <!-- Glow intensity (0.4 - 2.5) -->
  [eyeScale]="1.0"                  <!-- Eye size scale (0.5 - 1.6) -->
  [eyeSpacing]="160"                <!-- Distance between eyes in px (80 - 240) -->

  <!-- 4. Custom Face Texture -->
  [customFaceImage]="uploadedUrl"   <!-- Custom PNG/SVG mapped to visor screen -->

  <!-- 5. Built-in Controls Panel (Optional) -->
  [showControls]="false"            <!-- Floating control panel inside the viewport -->
  [controlsPosition]="'top-right'"  <!-- 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' -->

  <!-- 6. Model Asset Configuration -->
  [modelUrl]="'assets/models/clip-eva.glb'"
  [backgroundColor]="'#0f172a'"

  <!-- 7. Events -->
  (emotionChange)="onEmotionChanged($event)"
  (modelLoaded)="onRobotReady($event)"
  (modelProgress)="onProgress($event)"
  (modelError)="onError($event)">
</clip-eva-robot>
```

---

## ⚡ Programmatic API (@ViewChild)

Control the robot directly from TypeScript methods:

```typescript
import { Component, ViewChild } from '@angular/core';
import { ClipEvaRobotComponent } from 'clip-eva-robot';

@Component({
  template: `
    <button (click)="triggerBlink()">Blink Now</button>
    <button (click)="setAngry()">Make Angry</button>
    <clip-eva-robot #robot></clip-eva-robot>
  `
})
export class DemoComponent {
  @ViewChild('robot') robot!: ClipEvaRobotComponent;

  triggerBlink() {
    this.robot.blink(); // or this.robot.triggerBlink()
  }

  setAngry() {
    this.robot.setEmotion('angry');
  }

  setColors(primary: string, secondary: string) {
    this.robot.setCustomColors(primary, secondary);
  }

  resetCamera() {
    this.robot.resetCamera();
  }
}
```

---

## 🛠️ Standalone Control Panel (`<clip-eva-controls>`)

You can also place the control panel separately anywhere on your layout:

```html
<div class="sidebar">
  <clip-eva-controls
    [activeEmotion]="currentEmotion"
    (emotionChange)="currentEmotion = $event"
    (blinkTrigger)="robot.blink()"
    (autoBlinkToggle)="robot.setAutoBlink($event)"
    (hoverToggle)="robot.setHoverEnabled($event)"
    (pulseToggle)="robot.setIdlePulse($event)"
    (glowIntensityChange)="robot.setGlowIntensity($event)"
    (eyeScaleChange)="robot.setEyeScale($event)"
    (eyeSpacingChange)="robot.setEyeSpacing($event)"
    (colorThemeChange)="robot.setCustomColors($event.primary, $event.secondary)"
    (customImageSelect)="robot.setCustomImage($event)">
  </clip-eva-controls>
</div>
```

---

## 🚀 Building & Publishing to a Private GitHub Repo

### Step 1: Build the Library
```bash
npm run build:lib
```
This compiles the package to `dist/clip-eva-robot`.

### Step 2: Push to Private GitHub Repo
1. Create a new private repository on GitHub, e.g. `yourcompany/clip-eva-robot`.
2. Push the built package:
```bash
cd dist/clip-eva-robot
git init
git add -A
git commit -m "feat: release clip-eva-robot v0.1.0"
git branch -M main
git remote add origin git@github.com:yourcompany/clip-eva-robot.git
git push -u origin main --force
```

### Step 3: Install in Any Project
```bash
npm install git+ssh://git@github.com:yourcompany/clip-eva-robot.git
```
