import * as i0 from '@angular/core';
import { EventEmitter, signal, Output, Input, ChangeDetectionStrategy, Component, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as i2 from '@angular/forms';
import { FormsModule } from '@angular/forms';

const EMOTION_PRESETS = {
    happy: {
        id: 'happy',
        label: 'Happy',
        icon: '✨',
        description: 'Upward glowing chevron eyes (^^) with neon cyan-blue gradient',
        config: {
            primaryColor: '#00f0ff',
            secondaryColor: '#3b82f6',
            glowIntensity: 1.3,
            leftEyeShape: 'chevron-up',
            rightEyeShape: 'chevron-up',
            eyebrowAngle: 0.1,
            eyebrowHeight: 12,
            eyeScaleX: 1.05,
            eyeScaleY: 1.0,
            pupilScale: 1.0
        }
    },
    surprised: {
        id: 'surprised',
        label: 'Surprised',
        icon: '😲',
        description: 'Wide-open round glowing eyes with a sharp startled pupil (O O)',
        config: {
            primaryColor: '#00e5ff',
            secondaryColor: '#0099ff',
            glowIntensity: 1.5,
            leftEyeShape: 'wide-eye',
            rightEyeShape: 'wide-eye',
            eyebrowAngle: 0.0,
            eyebrowHeight: 22,
            eyeScaleX: 1.05,
            eyeScaleY: 1.05,
            pupilScale: 1.0
        }
    },
    confused: {
        id: 'confused',
        label: 'Confused',
        icon: '🤔',
        description: 'Asymmetric eyes (horizontal C-shape + chevron ^) with purple-cyan gradient',
        config: {
            primaryColor: '#00f0ff',
            secondaryColor: '#8b5cf6',
            glowIntensity: 1.3,
            leftEyeShape: 'crescent-c',
            rightEyeShape: 'chevron-up',
            eyebrowAngle: -0.2,
            eyebrowHeight: 5,
            eyeScaleX: 1.0,
            eyeScaleY: 1.0,
            pupilScale: 1.0
        }
    },
    neutral: {
        id: 'neutral',
        label: 'Neutral',
        icon: '🙂',
        description: 'Relaxed rounded oval eyes with soft cyan OLED glow',
        config: {
            primaryColor: '#00e5ff',
            secondaryColor: '#2563eb',
            glowIntensity: 1.1,
            leftEyeShape: 'pill',
            rightEyeShape: 'pill',
            eyebrowAngle: 0.0,
            eyebrowHeight: 0,
            eyeScaleX: 0.95,
            eyeScaleY: 1.0,
            pupilScale: 1.0
        }
    },
    sad: {
        id: 'sad',
        label: 'Sad',
        icon: '🥺',
        description: 'Downward drooping gentle arcs with inward raised eyebrows',
        config: {
            primaryColor: '#60a5fa',
            secondaryColor: '#38bdf8',
            glowIntensity: 0.9,
            leftEyeShape: 'chevron-down',
            rightEyeShape: 'chevron-down',
            eyebrowAngle: -0.3,
            eyebrowHeight: 10,
            eyeScaleX: 0.95,
            eyeScaleY: 0.85,
            pupilScale: 0.9
        }
    },
    angry: {
        id: 'angry',
        label: 'Angry',
        icon: '😠',
        description: 'Narrowed sharp diagonal glowing chevrons with furrowed brow',
        config: {
            primaryColor: '#f43f5e',
            secondaryColor: '#f97316',
            glowIntensity: 1.4,
            leftEyeShape: 'narrow',
            rightEyeShape: 'narrow',
            eyebrowAngle: 0.45,
            eyebrowHeight: -8,
            eyeScaleX: 1.1,
            eyeScaleY: 0.75,
            pupilScale: 1.1
        }
    },
    sleepy: {
        id: 'sleepy',
        label: 'Sleepy',
        icon: '😴',
        description: 'Nearly closed relaxed horizontal glowing arcs with soft pulse',
        config: {
            primaryColor: '#38bdf8',
            secondaryColor: '#818cf8',
            glowIntensity: 0.7,
            leftEyeShape: 'closed-arc',
            rightEyeShape: 'closed-arc',
            eyebrowAngle: 0.0,
            eyebrowHeight: -4,
            eyeScaleX: 0.9,
            eyeScaleY: 0.35,
            pupilScale: 0.5
        }
    },
    excited: {
        id: 'excited',
        label: 'Excited',
        icon: '🤩',
        description: 'Extra bright energetic glowing chevrons with high-frequency pulse',
        config: {
            primaryColor: '#38bdf8',
            secondaryColor: '#a855f7',
            glowIntensity: 1.6,
            leftEyeShape: 'chevron-up',
            rightEyeShape: 'chevron-up',
            eyebrowAngle: 0.15,
            eyebrowHeight: 16,
            eyeScaleX: 1.15,
            eyeScaleY: 1.1,
            pupilScale: 1.2
        }
    },
    love: {
        id: 'love',
        label: 'Love',
        icon: '💖',
        description: 'Vibrant neon glowing heart shapes (♥♥) with magenta-rose aura',
        config: {
            primaryColor: '#f43f5e',
            secondaryColor: '#ec4899',
            glowIntensity: 1.5,
            leftEyeShape: 'heart',
            rightEyeShape: 'heart',
            eyebrowAngle: 0.1,
            eyebrowHeight: 8,
            eyeScaleX: 1.05,
            eyeScaleY: 1.05,
            pupilScale: 1.1
        }
    }
};

class EmotionRenderer {
    canvas;
    ctx;
    texture;
    // Render resolution (crisp 1024x1024)
    width = 1024;
    height = 1024;
    // Current & Target state for smooth transitions
    currentConfig;
    targetConfig;
    currentEmotion = 'neutral';
    targetEmotion = 'neutral';
    transitionProgress = 1.0;
    transitionDuration = 0.35; // seconds
    // Dynamic parameters
    eyeSpacing = 160; // Distance from center
    eyeCenterY = 512;
    globalScale = 1.0;
    customGlowIntensity = 1.2;
    // Animation states
    eyelidOpenness = 1.0; // 0 = closed (blink), 1 = open
    isBlinking = false;
    blinkTimer = 0;
    blinkDuration = 0.18; // Fast natural blink (180ms)
    // Idle pulse
    idleTime = 0;
    idlePulseEnabled = true;
    // Custom user image sprite if supplied
    customImage = null;
    constructor(initialEmotion = 'neutral') {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const context = this.canvas.getContext('2d', { willReadFrequently: false });
        if (!context) {
            throw new Error('Failed to get 2D context for EmotionRenderer canvas');
        }
        this.ctx = context;
        this.currentEmotion = initialEmotion;
        this.targetEmotion = initialEmotion;
        this.currentConfig = { ...EMOTION_PRESETS[initialEmotion].config };
        this.targetConfig = { ...EMOTION_PRESETS[initialEmotion].config };
        // Create Three.js CanvasTexture
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        this.texture.generateMipmaps = true;
        this.texture.minFilter = THREE.LinearMipmapLinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.needsUpdate = true;
        // Initial render
        this.render();
    }
    /**
     * Sets target emotion with smooth transition interpolation.
     */
    setEmotion(emotion, transitionSec = 0.35) {
        if (this.currentEmotion === emotion && this.transitionProgress >= 1.0) {
            return;
        }
        const preset = EMOTION_PRESETS[emotion];
        if (!preset)
            return;
        this.targetEmotion = emotion;
        this.targetConfig = { ...preset.config };
        this.transitionDuration = Math.max(transitionSec, 0.05);
        this.transitionProgress = 0.0;
        this.customImage = null;
    }
    getEmotion() {
        return this.targetEmotion;
    }
    /**
     * Triggers a natural eyelid blink animation.
     */
    triggerBlink() {
        this.isBlinking = true;
        this.blinkTimer = 0;
    }
    /**
     * Sets custom glow intensity multiplier.
     */
    setGlowIntensity(intensity) {
        this.customGlowIntensity = Math.max(0.1, Math.min(3.0, intensity));
        this.render();
    }
    /**
     * Sets eye scale factor.
     */
    setEyeScale(scale) {
        this.globalScale = Math.max(0.4, Math.min(2.0, scale));
        this.render();
    }
    /**
     * Sets eye horizontal spacing from center.
     */
    setEyeSpacing(spacing) {
        this.eyeSpacing = Math.max(60, Math.min(280, spacing));
        this.render();
    }
    /**
     * Sets custom primary & secondary glow colors.
     */
    setCustomColors(primary, secondary) {
        this.targetConfig.primaryColor = primary;
        this.targetConfig.secondaryColor = secondary;
        this.currentConfig.primaryColor = primary;
        this.currentConfig.secondaryColor = secondary;
        this.render();
    }
    /**
     * Loads a custom image texture directly onto the face screen.
     */
    setCustomImage(imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.customImage = img;
            this.render();
        };
        img.src = imageUrl;
    }
    setIdlePulseEnabled(enabled) {
        this.idlePulseEnabled = enabled;
    }
    /**
     * Main update tick called per frame.
     */
    update(deltaTime) {
        let needsRedraw = false;
        // 1. Handle Emotion Transition Lerp
        if (this.transitionProgress < 1.0) {
            this.transitionProgress = Math.min(1.0, this.transitionProgress + deltaTime / this.transitionDuration);
            this.interpolateConfig(this.transitionProgress);
            needsRedraw = true;
            if (this.transitionProgress >= 1.0) {
                this.currentEmotion = this.targetEmotion;
                this.currentConfig = { ...this.targetConfig };
            }
        }
        // 2. Handle Blink Animation (ease down then ease up)
        if (this.isBlinking) {
            this.blinkTimer += deltaTime;
            const progress = this.blinkTimer / this.blinkDuration;
            if (progress <= 0.5) {
                // Closing
                this.eyelidOpenness = 1.0 - progress * 2;
            }
            else if (progress <= 1.0) {
                // Opening
                this.eyelidOpenness = (progress - 0.5) * 2;
            }
            else {
                // Finished blink
                this.eyelidOpenness = 1.0;
                this.isBlinking = false;
            }
            needsRedraw = true;
        }
        // 3. Handle Subtle Idle Pulse
        if (this.idlePulseEnabled) {
            this.idleTime += deltaTime;
            needsRedraw = true;
        }
        if (needsRedraw) {
            this.render();
        }
    }
    /**
     * Interpolates numeric parameters between current and target configs.
     */
    interpolateConfig(t) {
        // Smooth cosine ease
        const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
        this.currentConfig = {
            primaryColor: t >= 0.5 ? this.targetConfig.primaryColor : this.currentConfig.primaryColor,
            secondaryColor: t >= 0.5 ? this.targetConfig.secondaryColor : this.currentConfig.secondaryColor,
            glowIntensity: this.lerp(this.currentConfig.glowIntensity, this.targetConfig.glowIntensity, ease),
            leftEyeShape: t >= 0.5 ? this.targetConfig.leftEyeShape : this.currentConfig.leftEyeShape,
            rightEyeShape: t >= 0.5 ? this.targetConfig.rightEyeShape : this.currentConfig.rightEyeShape,
            eyebrowAngle: this.lerp(this.currentConfig.eyebrowAngle, this.targetConfig.eyebrowAngle, ease),
            eyebrowHeight: this.lerp(this.currentConfig.eyebrowHeight, this.targetConfig.eyebrowHeight, ease),
            eyeScaleX: this.lerp(this.currentConfig.eyeScaleX, this.targetConfig.eyeScaleX, ease),
            eyeScaleY: this.lerp(this.currentConfig.eyeScaleY, this.targetConfig.eyeScaleY, ease),
            pupilScale: this.lerp(this.currentConfig.pupilScale, this.targetConfig.pupilScale, ease)
        };
    }
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    /**
     * Main rendering pass onto the 2D canvas.
     */
    render() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        // 0. Fully clear (transparent) so anything outside the dome mask lets the
        // physical visor rim show through instead of a hard rectangular edge.
        ctx.clearRect(0, 0, w, h);
        // 1. Clip to a dome/arch shape inset from the plane edges so opaque
        // pixels never reach past the physical cavity opening, regardless of
        // small calibration drift. Radii are asymmetric (wide top, tighter
        // bottom) to hug the visor's dome silhouette.
        ctx.save();
        this.clipToVisorDome(ctx, w, h);
        // 2. Fill the visible dome with deep glossy black visor background
        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, 0, w, h);
        // If custom image is set, render it centered with glossy screen aura
        if (this.customImage) {
            const aspect = this.customImage.width / this.customImage.height;
            const drawWidth = w * 0.75;
            const drawHeight = drawWidth / aspect;
            ctx.drawImage(this.customImage, (w - drawWidth) / 2, (h - drawHeight) / 2, drawWidth, drawHeight);
            ctx.restore();
            this.texture.needsUpdate = true;
            return;
        }
        const cfg = this.currentConfig;
        const pulseFactor = this.idlePulseEnabled ? 1.0 + Math.sin(this.idleTime * 2.8) * 0.04 : 1.0;
        const totalGlow = cfg.glowIntensity * this.customGlowIntensity * pulseFactor;
        const leftCenterX = w / 2 - this.eyeSpacing;
        const rightCenterX = w / 2 + this.eyeSpacing;
        const centerY = this.eyeCenterY;
        // Compute Eye Scaling
        const scaleX = cfg.eyeScaleX * this.globalScale;
        const scaleY = cfg.eyeScaleY * this.globalScale * Math.max(0.05, this.eyelidOpenness);
        // 2. Render Left Eye
        ctx.save();
        ctx.translate(leftCenterX, centerY);
        ctx.scale(scaleX, scaleY);
        this.drawEyeShape(ctx, cfg.leftEyeShape, cfg.primaryColor, cfg.secondaryColor, totalGlow, false);
        ctx.restore();
        // 3. Render Right Eye
        ctx.save();
        ctx.translate(rightCenterX, centerY);
        ctx.scale(scaleX, scaleY);
        this.drawEyeShape(ctx, cfg.rightEyeShape, cfg.primaryColor, cfg.secondaryColor, totalGlow, true);
        ctx.restore();
        // 4. Render Eyebrows if applicable
        if (Math.abs(cfg.eyebrowAngle) > 0.05 || Math.abs(cfg.eyebrowHeight) > 2) {
            this.drawEyebrows(ctx, leftCenterX, rightCenterX, centerY, cfg, totalGlow);
        }
        ctx.restore(); // pop the dome clip
        // 5. Update Three.js Texture
        this.texture.needsUpdate = true;
    }
    /**
     * Clips the canvas to an inset dome/arch shape matching the visor cavity's
     * silhouette (narrow rounded top, wider flatter bottom). Keeps opaque
     * pixels safely inside the physical cutout at every edge so the overlay
     * blends into the cavity instead of showing a hard rectangular seam.
     */
    clipToVisorDome(ctx, w, h) {
        const sideMargin = w * 0.05;
        const topMargin = h * 0.08;
        const bottomMargin = h * 0.02;
        const x = sideMargin;
        const y = topMargin;
        const rectW = w - sideMargin * 2;
        const rectH = h - topMargin - bottomMargin;
        const topRadius = rectW * 0.42;
        const bottomRadius = rectW * 0.09;
        ctx.beginPath();
        ctx.roundRect(x, y, rectW, rectH, [topRadius, topRadius, bottomRadius, bottomRadius]);
        ctx.clip();
    }
    /**
     * Draws procedural eye graphics with neon glow & gradients.
     */
    drawEyeShape(ctx, shape, primaryColor, secondaryColor, glow, isRightEye) {
        // Create vibrant linear/radial gradient
        const gradient = ctx.createLinearGradient(-60, -70, 60, 70);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);
        // Multi-pass neon glow bloom
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 32 * glow;
        ctx.strokeStyle = gradient;
        ctx.fillStyle = gradient;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        switch (shape) {
            case 'chevron-up':
                // Upward chevron (^^) as seen in Happy reference image
                this.drawChevronUp(ctx, 42);
                break;
            case 'concentric-rings':
                // Concentric rings (◎◎) as seen in Surprised reference image
                this.drawConcentricRings(ctx, primaryColor, secondaryColor, glow);
                break;
            case 'wide-eye':
                // Natural wide-open startled eye for Surprised (O O)
                this.drawWideEye(ctx, primaryColor);
                break;
            case 'crescent-c':
                // Horizontal C shape as seen in Confused reference image (media_1786837702656.png)
                this.drawCrescentC(ctx, 42);
                break;
            case 'pill':
                // Relaxed rounded vertical pill for Neutral
                this.drawPill(ctx, 50, 85);
                break;
            case 'chevron-down':
                // Downward soft arc for Sad
                this.drawChevronDown(ctx, 42);
                break;
            case 'narrow':
                // Sharp aggressive chevron for Angry
                this.drawNarrowAngry(ctx, isRightEye);
                break;
            case 'closed-arc':
                // Sleepy horizontal curve
                this.drawClosedArc(ctx);
                break;
            case 'heart':
                // Neon Heart for Love
                this.drawHeart(ctx, 48);
                break;
            default:
                this.drawPill(ctx, 48, 80);
                break;
        }
    }
    /**
     * Upward inverted-V Chevron (^^)
     */
    drawChevronUp(ctx, thickness = 42) {
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(-65, 35);
        ctx.quadraticCurveTo(0, -55, 65, 35);
        ctx.stroke();
        // Inner bright core highlight
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = thickness * 0.35;
        ctx.beginPath();
        ctx.moveTo(-55, 30);
        ctx.quadraticCurveTo(0, -45, 55, 30);
        ctx.stroke();
        ctx.restore();
    }
    /**
     * Concentric circular glowing rings (◎◎)
     */
    drawConcentricRings(ctx, primaryColor, secondaryColor, glow) {
        // Outer Ring
        ctx.lineWidth = 26;
        ctx.beginPath();
        ctx.arc(0, 0, 78, 0, Math.PI * 2);
        ctx.stroke();
        // Inner Ring
        ctx.lineWidth = 22;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.stroke();
        // Center Pupil Dot
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        // Center White Glow Core
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    /**
     * Wide-open round startled eye: soft outer glow disc, dark iris and a
     * bright off-center highlight — a natural "O O" surprised look rather
     * than a hypnotic target/ring pattern.
     */
    drawWideEye(ctx, primaryColor) {
        const outerRadius = 62;
        // Outer glowing white-hot rim (the "wide open" sclera glow)
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius, 0, Math.PI * 2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = primaryColor;
        ctx.stroke();
        ctx.restore();
        // Dark iris fill so the eye reads as an open pupil, not a solid disc
        ctx.save();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#04121a';
        ctx.beginPath();
        ctx.arc(0, 0, outerRadius - 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Bright pupil core
        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = primaryColor;
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Small off-center specular highlight for a natural startled sparkle
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-18, -18, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    /**
     * Horizontal C / Arch shape from reference image input_file_0.png
     */
    drawCrescentC(ctx, thickness = 42) {
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(55, -45);
        ctx.lineTo(-20, -45);
        ctx.arcTo(-70, -45, -70, 0, 45);
        ctx.arcTo(-70, 45, -20, 45, 45);
        ctx.lineTo(55, 45);
        ctx.stroke();
        // Core Highlight
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = thickness * 0.3;
        ctx.beginPath();
        ctx.moveTo(45, -45);
        ctx.lineTo(-15, -45);
        ctx.arcTo(-60, -45, -60, 0, 35);
        ctx.arcTo(-60, 45, -15, 45, 35);
        ctx.lineTo(45, 45);
        ctx.stroke();
        ctx.restore();
    }
    /**
     * Rounded vertical capsule / pill eye
     */
    drawPill(ctx, radius = 50, height = 85) {
        ctx.beginPath();
        ctx.roundRect(-radius, -height / 2, radius * 2, height, radius);
        ctx.fill();
        // Bright inner core
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.roundRect(-radius * 0.5, -height * 0.35, radius, height * 0.7, radius * 0.5);
        ctx.fill();
        ctx.restore();
    }
    /**
     * Downward soft droop arc for Sad
     */
    drawChevronDown(ctx, thickness = 40) {
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(-60, -25);
        ctx.quadraticCurveTo(0, 50, 60, -25);
        ctx.stroke();
        // Highlight
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = thickness * 0.3;
        ctx.beginPath();
        ctx.moveTo(-50, -20);
        ctx.quadraticCurveTo(0, 40, 50, -20);
        ctx.stroke();
        ctx.restore();
    }
    /**
     * Narrowed aggressive angled eye for Angry
     */
    drawNarrowAngry(ctx, isRightEye) {
        const dir = isRightEye ? -1 : 1;
        ctx.lineWidth = 36;
        ctx.beginPath();
        ctx.moveTo(-55 * dir, -30);
        ctx.lineTo(55 * dir, 25);
        ctx.stroke();
    }
    /**
     * Sleepy relaxed horizontal closed eye
     */
    drawClosedArc(ctx) {
        ctx.lineWidth = 34;
        ctx.beginPath();
        ctx.moveTo(-60, 0);
        ctx.quadraticCurveTo(0, 20, 60, 0);
        ctx.stroke();
    }
    /**
     * Neon Glowing Heart for Love
     */
    drawHeart(ctx, size = 48) {
        ctx.beginPath();
        ctx.moveTo(0, size * 0.4);
        ctx.bezierCurveTo(-size * 1.3, -size * 0.4, -size * 0.8, -size * 1.3, 0, -size * 0.6);
        ctx.bezierCurveTo(size * 0.8, -size * 1.3, size * 1.3, -size * 0.4, 0, size * 0.4);
        ctx.fill();
        // Bright core
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-size * 0.35, -size * 0.55, size * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    /**
     * Draws subtle emotive eyebrows above eyes
     */
    drawEyebrows(ctx, leftX, rightX, centerY, cfg, glow) {
        const browY = centerY - 120 - cfg.eyebrowHeight;
        ctx.lineWidth = 20;
        ctx.shadowBlur = 20 * glow;
        ctx.shadowColor = cfg.primaryColor;
        ctx.strokeStyle = cfg.primaryColor;
        // Left Eyebrow
        ctx.save();
        ctx.translate(leftX, browY);
        ctx.rotate(cfg.eyebrowAngle);
        ctx.beginPath();
        ctx.moveTo(-45, 0);
        ctx.lineTo(45, 0);
        ctx.stroke();
        ctx.restore();
        // Right Eyebrow
        ctx.save();
        ctx.translate(rightX, browY);
        ctx.rotate(-cfg.eyebrowAngle);
        ctx.beginPath();
        ctx.moveTo(-45, 0);
        ctx.lineTo(45, 0);
        ctx.stroke();
        ctx.restore();
    }
    dispose() {
        this.texture.dispose();
    }
}

class FaceOverlay {
    group;
    mesh = null;
    geometry = null;
    material = null;
    // Calibrated positioning matching the robot visor facing +X in GLB mesh coords
    config = {
        position: new THREE.Vector3(0.338, 0.2195, -0.0095),
        rotation: new THREE.Euler(0, Math.PI / 2, 0.0),
        scale: new THREE.Vector3(0.5789, 0.3122, 1.0),
        curvature: 0.045
    };
    constructor(texture) {
        this.group = new THREE.Group();
        this.group.name = 'FaceEmotionOverlayGroup';
        this.createCurvedMesh(texture);
    }
    createCurvedMesh(texture) {
        const width = this.config.scale.x;
        const height = this.config.scale.y;
        const segsX = 32;
        const segsY = 32;
        this.geometry = new THREE.PlaneGeometry(width, height, segsX, segsY);
        // Parabolic dome curvature hugging the spherical face screen
        const posAttr = this.geometry.attributes['position'];
        const cur = this.config.curvature;
        for (let i = 0; i < posAttr.count; i++) {
            const x = posAttr.getX(i);
            const y = posAttr.getY(i);
            const normalizedX = x / (width / 2);
            const normalizedY = y / (height / 2);
            const zOffset = -cur * (normalizedX * normalizedX * 0.7 + normalizedY * normalizedY * 0.35);
            posAttr.setZ(i, zOffset);
        }
        this.geometry.computeVertexNormals();
        // Overlay always renders on top of the concave visor cavity so its edges
        // never get clipped/occluded by the physical rim geometry beneath it.
        this.material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1.0,
            depthTest: false,
            depthWrite: false
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = 'FaceEmotionMesh';
        this.mesh.position.copy(this.config.position);
        this.mesh.rotation.copy(this.config.rotation);
        this.mesh.renderOrder = 20;
        this.group.add(this.mesh);
    }
    /**
     * Adjusts overlay transform in real-time.
     */
    updateTransform(pos, rot, scale) {
        if (!this.mesh)
            return;
        if (pos) {
            this.mesh.position.set(pos.x, pos.y, pos.z);
        }
        if (rot) {
            this.mesh.rotation.set(rot.x, rot.y, rot.z);
        }
        if (scale) {
            this.mesh.scale.set(scale.x, scale.y, 1.0);
        }
    }
    getTransform() {
        if (!this.mesh) {
            return {
                position: { x: 0.338, y: 0.180, z: 0.0 },
                rotation: { x: 0, y: Math.PI / 2, z: 0.10 },
                scale: { x: 1, y: 1, z: 1 }
            };
        }
        return {
            position: { x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z },
            rotation: { x: this.mesh.rotation.x, y: this.mesh.rotation.y, z: this.mesh.rotation.z },
            scale: { x: this.mesh.scale.x, y: this.mesh.scale.y, z: this.mesh.scale.z }
        };
    }
    setVisible(visible) {
        this.group.visible = visible;
    }
    dispose() {
        if (this.geometry) {
            this.geometry.dispose();
            this.geometry = null;
        }
        if (this.material) {
            this.material.dispose();
            this.material = null;
        }
        this.mesh = null;
    }
}

class EmotionManager {
    renderer;
    overlay;
    // Auto-Blink Logic
    autoBlinkEnabled = true;
    nextBlinkTime = 3.0; // Random seconds until next blink
    autoBlinkTimer = 0;
    // Floating / Hover Animation on Robot Group (idle robot hovering in air)
    hoverEnabled = true;
    hoverTime = 0;
    initialModelY = 0;
    attachedModelGroup = null;
    constructor(initialEmotion = 'happy') {
        this.renderer = new EmotionRenderer(initialEmotion);
        this.overlay = new FaceOverlay(this.renderer.texture);
    }
    /**
     * Attaches the face overlay to the robot model group and initializes hover baseline.
     */
    attachToModel(modelGroup) {
        this.attachedModelGroup = modelGroup;
        this.initialModelY = modelGroup.position.y;
        modelGroup.add(this.overlay.group);
    }
    /**
     * Updates emotion expression with smooth crossfade.
     */
    setEmotion(emotion, transitionSec = 0.35) {
        this.renderer.setEmotion(emotion, transitionSec);
    }
    getEmotion() {
        return this.renderer.getEmotion();
    }
    triggerBlink() {
        this.renderer.triggerBlink();
    }
    setAutoBlink(enabled) {
        this.autoBlinkEnabled = enabled;
    }
    setIdlePulse(enabled) {
        this.renderer.setIdlePulseEnabled(enabled);
    }
    setHoverEnabled(enabled) {
        this.hoverEnabled = enabled;
        if (!enabled && this.attachedModelGroup) {
            this.attachedModelGroup.position.y = this.initialModelY;
        }
    }
    setGlowIntensity(intensity) {
        this.renderer.setGlowIntensity(intensity);
    }
    setEyeScale(scale) {
        this.renderer.setEyeScale(scale);
    }
    setEyeSpacing(spacing) {
        this.renderer.setEyeSpacing(spacing);
    }
    setCustomColors(primary, secondary) {
        this.renderer.setCustomColors(primary, secondary);
    }
    setCustomImage(imageUrl) {
        this.renderer.setCustomImage(imageUrl);
    }
    /**
     * Per-frame animation update.
     */
    update(deltaTime) {
        // 1. Update Canvas Texture (transitions, blinking, pulse)
        this.renderer.update(deltaTime);
        // 2. Auto Blink Interval
        if (this.autoBlinkEnabled) {
            this.autoBlinkTimer += deltaTime;
            if (this.autoBlinkTimer >= this.nextBlinkTime) {
                this.renderer.triggerBlink();
                this.autoBlinkTimer = 0;
                this.nextBlinkTime = 2.5 + Math.random() * 4.0; // Random interval between 2.5s and 6.5s
            }
        }
        // 3. Gentle Robot Hovering / Floating Animation
        if (this.hoverEnabled && this.attachedModelGroup) {
            this.hoverTime += deltaTime;
            // Gentle sine-wave hover (±3mm) + subtle tilt — slow, barely-perceptible drift
            const hoverOffset = Math.sin(this.hoverTime * 0.32) * 0.0036;
            const subtleTilt = Math.sin(this.hoverTime * 0.16) * 0.0024;
            this.attachedModelGroup.position.y = this.initialModelY + hoverOffset;
            this.attachedModelGroup.rotation.z = subtleTilt;
        }
    }
    dispose() {
        this.renderer.dispose();
        this.overlay.dispose();
        this.attachedModelGroup = null;
    }
}

/**
 * Chest wordmark decal, ported from clipeva_logo_animation.html.
 *
 * The source is a CSS-keyframe SVG (CLIPEVA <-> CE loop) — CSS animations
 * inside an <img>/static texture don't play, so the C/E translate + L,I,P,V,A
 * fade timing is reimplemented directly against a canvas each frame and
 * pushed into a THREE.CanvasTexture. Path data and colors are copied
 * verbatim from the source SVG; only the secondary glow/highlight/shadow
 * polish layers are dropped since the decal already sits under real scene
 * lighting on the curved chest surface.
 */
const VIEW_W = 3670;
const VIEW_H = 1000;
const CYCLE_SECONDS = 16;
const STOPS = [0, 0.3125, 0.5, 0.8125, 1.0];
function smoothstep(t) {
    return t * t * (3 - 2 * t);
}
/** Value holds at `from` on [0,0.3125] and [0.8125,1], eases to `to` on [0.3125,0.5] and holds on [0.5,0.8125]. */
function segmentValue(t, from, to) {
    const vals = [from, from, to, to, from];
    for (let i = 0; i < STOPS.length - 1; i++) {
        if (t >= STOPS[i] && t <= STOPS[i + 1]) {
            const localT = (t - STOPS[i]) / (STOPS[i + 1] - STOPS[i]);
            return vals[i] + (vals[i + 1] - vals[i]) * smoothstep(localT);
        }
    }
    return from;
}
// Lazily constructed (not module-level `const`s) — Path2D is a browser-only Canvas API with no
// Node/SSR equivalent. A module-level `new Path2D(...)` runs the instant this file is imported,
// regardless of whether ChestLogoAnimator is ever instantiated, which throws
// `ReferenceError: Path2D is not defined` in any SSR-rendered consumer app (confirmed: this
// broke every route's server render in clip-eva-site the moment this file started being
// imported transitively). Building them on first actual use instead means they're only ever
// constructed from render(), which itself only ever runs after the constructor's
// `document.createElement('canvas')` has already succeeded — i.e., only in a real browser.
let cachedLogoPaths = null;
function getLogoPaths() {
    if (!cachedLogoPaths) {
        cachedLogoPaths = {
            c: new Path2D('M 580 300 L 440 300 A 200 200 0 0 0 440 700 L 580 700'),
            l: new Path2D('M 743 300 A 60 60 0 0 1 863 300 L 863 560 A 80 80 0 0 0 943 640 L 1063 640 A 60 60 0 0 1 1063 760 L 853 760 A 110 110 0 0 1 743 650 Z'),
            i: new Path2D('M 1273 300 L 1273 700'),
            p: new Path2D('M 1483 300 L 1483 700 M 1508 350 A 140 140 0 1 1 1494 510'),
        };
    }
    return cachedLogoPaths;
}
class ChestLogoAnimator {
    mesh;
    canvas;
    ctx;
    texture;
    elapsed = 0;
    drawScale;
    drawX;
    drawY;
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1200;
        this.canvas.height = Math.round((1200 * VIEW_H) / VIEW_W);
        this.ctx = this.canvas.getContext('2d');
        const drawWidth = this.canvas.width * 0.82;
        this.drawScale = drawWidth / VIEW_W;
        this.drawX = (this.canvas.width - drawWidth) / 2;
        this.drawY = (this.canvas.height - VIEW_H * this.drawScale) / 2;
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        const geometry = new THREE.PlaneGeometry(0.46, (0.46 * VIEW_H) / VIEW_W);
        const material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = 'ChestLogoAnimator';
        this.mesh.position.set(0.3, -0.079, 0.008);
        this.mesh.rotation.set(0, Math.PI / 2, 0);
        this.mesh.renderOrder = 15;
        this.render();
    }
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.render();
    }
    drawPatchBackground() {
        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const bodyGradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        bodyGradient.addColorStop(0, '#7f889d');
        bodyGradient.addColorStop(0.5, '#9aa0ab');
        bodyGradient.addColorStop(1, '#a4a6ae');
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'destination-in';
        const feather = ctx.createRadialGradient(cx, cy, this.canvas.height * 0.12, cx, cy, this.canvas.width * 0.46);
        feather.addColorStop(0, 'rgba(255,255,255,1)');
        feather.addColorStop(0.82, 'rgba(255,255,255,1)');
        feather.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = feather;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPatchBackground();
        const t = (this.elapsed % CYCLE_SECONDS) / CYCLE_SECONDS;
        const cOffset = segmentValue(t, 0, 1165);
        const eOffset = segmentValue(t, 0, 28);
        const midOpacity = segmentValue(t, 1, 0);
        ctx.save();
        ctx.translate(this.drawX, this.drawY);
        ctx.scale(this.drawScale, this.drawScale);
        const rimGrad = ctx.createLinearGradient(150, 500, 1807, 500);
        rimGrad.addColorStop(0, '#9A3FEA');
        rimGrad.addColorStop(0.5, '#5A4CF0');
        rimGrad.addColorStop(1, '#2F86F5');
        const darkGrad = ctx.createLinearGradient(0, 220, 0, 780);
        darkGrad.addColorStop(0, '#3a3f4c');
        darkGrad.addColorStop(0.45, '#1c1f28');
        darkGrad.addColorStop(1, '#08090c');
        const mainGrad = ctx.createLinearGradient(1837, 500, 3517, 500);
        mainGrad.addColorStop(0, '#9A2FEB');
        mainGrad.addColorStop(0.3, '#7C3AEA');
        mainGrad.addColorStop(0.5, '#4C4FEE');
        mainGrad.addColorStop(0.7, '#2F7FF5');
        mainGrad.addColorStop(1, '#22C9F2');
        const logoPaths = getLogoPaths();
        // ---- C (glossy dark, colored rim) — translates ----
        ctx.save();
        ctx.translate(cOffset, 0);
        this.strokeGlowRimFill(logoPaths.c, rimGrad, darkGrad, 140, 132, 120, 1);
        ctx.restore();
        // ---- L, I, P (glossy dark, colored rim) — fade with the rest of CLIP ----
        ctx.save();
        this.strokeGlowRimFill(logoPaths.l, rimGrad, darkGrad, 20, 10, 0, midOpacity, true);
        this.strokeGlowRimFill(logoPaths.i, rimGrad, darkGrad, 140, 132, 120, midOpacity);
        this.strokeGlowRimFill(logoPaths.p, rimGrad, darkGrad, 140, 132, 120, midOpacity);
        ctx.restore();
        // ---- E (vivid gradient bars) — translates ----
        ctx.save();
        ctx.translate(eOffset, 0);
        ctx.fillStyle = mainGrad;
        [240, 442, 644].forEach(y => {
            ctx.beginPath();
            ctx.roundRect(1867, y, 430, 116, 58);
            ctx.fill();
        });
        ctx.restore();
        // ---- V, A (vivid gradient chevrons) — fade ----
        ctx.save();
        ctx.globalAlpha = midOpacity;
        ctx.strokeStyle = mainGrad;
        ctx.lineWidth = 120;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(2447, 300);
        ctx.lineTo(2637, 700);
        ctx.lineTo(2827, 300);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(3037, 700);
        ctx.lineTo(3232, 300);
        ctx.lineTo(3427, 700);
        ctx.stroke();
        ctx.fillStyle = mainGrad;
        ctx.beginPath();
        ctx.arc(3232, 645, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.restore(); // pop the viewBox transform
        this.texture.needsUpdate = true;
    }
    /** Layered glow + rim + dark-fill treatment matching the CLIP letters in the source SVG. */
    strokeGlowRimFill(path, rimGrad, darkGrad, glowWidth, rimWidth, fillWidth, alpha, closedFill = false) {
        const ctx = this.ctx;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.save();
        ctx.globalAlpha = alpha * 0.22;
        ctx.filter = 'blur(14px)';
        ctx.strokeStyle = rimGrad;
        ctx.lineWidth = glowWidth;
        ctx.stroke(path);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.strokeStyle = rimGrad;
        ctx.lineWidth = rimWidth;
        ctx.stroke(path);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = alpha;
        if (closedFill) {
            ctx.fillStyle = darkGrad;
            ctx.fill(path);
        }
        else {
            ctx.strokeStyle = darkGrad;
            ctx.lineWidth = fillWidth;
            ctx.stroke(path);
        }
        ctx.restore();
    }
    dispose() {
        this.texture.dispose();
    }
}

class ClipEvaControlsComponent {
    activeEmotion = 'happy';
    emotionChange = new EventEmitter();
    blinkTrigger = new EventEmitter();
    autoBlinkToggle = new EventEmitter();
    hoverToggle = new EventEmitter();
    pulseToggle = new EventEmitter();
    glowIntensityChange = new EventEmitter();
    eyeScaleChange = new EventEmitter();
    eyeSpacingChange = new EventEmitter();
    colorThemeChange = new EventEmitter();
    customImageSelect = new EventEmitter();
    visorTransformChange = new EventEmitter();
    emotionList = Object.values(EMOTION_PRESETS);
    // Settings State Signals
    autoBlink = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "autoBlink" }] : /* istanbul ignore next */ []));
    hoverEnabled = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "hoverEnabled" }] : /* istanbul ignore next */ []));
    pulseEnabled = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "pulseEnabled" }] : /* istanbul ignore next */ []));
    glowIntensity = signal(1.2, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "glowIntensity" }] : /* istanbul ignore next */ []));
    eyeScale = signal(1.0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "eyeScale" }] : /* istanbul ignore next */ []));
    eyeSpacing = signal(160, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "eyeSpacing" }] : /* istanbul ignore next */ []));
    isTuningOpen = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "isTuningOpen" }] : /* istanbul ignore next */ []));
    // Visor fine-tuning values
    visorPosX = signal(0.338, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visorPosX" }] : /* istanbul ignore next */ []));
    visorPosY = signal(0.180, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visorPosY" }] : /* istanbul ignore next */ []));
    visorPosZ = signal(0.0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visorPosZ" }] : /* istanbul ignore next */ []));
    visorRotX = signal(0.10, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visorRotX" }] : /* istanbul ignore next */ []));
    visorScaleX = signal(1.0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visorScaleX" }] : /* istanbul ignore next */ []));
    visorScaleY = signal(1.0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "visorScaleY" }] : /* istanbul ignore next */ []));
    colorThemes = [
        { name: 'Cyan Neon', primary: '#00f0ff', secondary: '#3b82f6', previewClass: 'theme-cyan' },
        { name: 'Cyber Violet', primary: '#a855f7', secondary: '#3b82f6', previewClass: 'theme-violet' },
        { name: 'Neon Rose', primary: '#f43f5e', secondary: '#ec4899', previewClass: 'theme-rose' },
        { name: 'Emerald OLED', primary: '#10b981', secondary: '#06b6d4', previewClass: 'theme-emerald' },
        { name: 'Solar Amber', primary: '#f59e0b', secondary: '#ef4444', previewClass: 'theme-amber' }
    ];
    selectEmotion(emotion) {
        this.emotionChange.emit(emotion);
    }
    onTriggerBlink() {
        this.blinkTrigger.emit();
    }
    onAutoBlinkToggle() {
        this.autoBlink.update((v) => !v);
        this.autoBlinkToggle.emit(this.autoBlink());
    }
    onHoverToggle() {
        this.hoverEnabled.update((v) => !v);
        this.hoverToggle.emit(this.hoverEnabled());
    }
    onPulseToggle() {
        this.pulseEnabled.update((v) => !v);
        this.pulseToggle.emit(this.pulseEnabled());
    }
    onGlowChange(value) {
        this.glowIntensity.set(value);
        this.glowIntensityChange.emit(value);
    }
    onScaleChange(value) {
        this.eyeScale.set(value);
        this.eyeScaleChange.emit(value);
    }
    onSpacingChange(value) {
        this.eyeSpacing.set(value);
        this.eyeSpacingChange.emit(value);
    }
    onThemeSelect(theme) {
        this.colorThemeChange.emit({ primary: theme.primary, secondary: theme.secondary });
    }
    onCustomFileSelected(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const blobUrl = URL.createObjectURL(file);
            this.customImageSelect.emit(blobUrl);
        }
    }
    toggleTuning() {
        this.isTuningOpen.update((v) => !v);
    }
    emitVisorTransform() {
        this.visorTransformChange.emit({
            position: { x: this.visorPosX(), y: this.visorPosY(), z: this.visorPosZ() },
            rotation: { x: this.visorRotX(), y: 0, z: 0 },
            scale: { x: this.visorScaleX(), y: this.visorScaleY() }
        });
    }
    onVisorPosXChange(val) {
        this.visorPosX.set(val);
        this.emitVisorTransform();
    }
    onVisorPosYChange(val) {
        this.visorPosY.set(val);
        this.emitVisorTransform();
    }
    onVisorPosZChange(val) {
        this.visorPosZ.set(val);
        this.emitVisorTransform();
    }
    onVisorRotXChange(val) {
        this.visorRotX.set(val);
        this.emitVisorTransform();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClipEvaControlsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.1.2", type: ClipEvaControlsComponent, isStandalone: true, selector: "clip-eva-controls", inputs: { activeEmotion: "activeEmotion" }, outputs: { emotionChange: "emotionChange", blinkTrigger: "blinkTrigger", autoBlinkToggle: "autoBlinkToggle", hoverToggle: "hoverToggle", pulseToggle: "pulseToggle", glowIntensityChange: "glowIntensityChange", eyeScaleChange: "eyeScaleChange", eyeSpacingChange: "eyeSpacingChange", colorThemeChange: "colorThemeChange", customImageSelect: "customImageSelect", visorTransformChange: "visorTransformChange" }, ngImport: i0, template: "<div class=\"emotion-panel-card\">\n  <!-- Emotion Presets Selector -->\n  <div class=\"panel-section\">\n    <div class=\"section-title-row\">\n      <span class=\"section-title\">Robot Expressions</span>\n      <span class=\"active-badge\">Active: {{ activeEmotion | uppercase }}</span>\n    </div>\n\n    <div class=\"emotion-grid\">\n      @for (preset of emotionList; track preset.id) {\n        <button\n          type=\"button\"\n          class=\"emotion-btn\"\n          [class.active]=\"activeEmotion === preset.id\"\n          (click)=\"selectEmotion(preset.id)\"\n          [title]=\"preset.description\"\n        >\n          <span class=\"btn-icon\">{{ preset.icon }}</span>\n          <span class=\"btn-label\">{{ preset.label }}</span>\n        </button>\n      }\n    </div>\n  </div>\n\n  <!-- Live Animation Triggers -->\n  <div class=\"panel-section\">\n    <div class=\"section-title-row\">\n      <span class=\"section-title\">Dynamic Behaviors</span>\n    </div>\n\n    <div class=\"actions-row\">\n      <button class=\"action-pill-btn\" (click)=\"onTriggerBlink()\" title=\"Trigger manual eye blink\">\n        \uD83D\uDE09 Blink Now\n      </button>\n\n      <button\n        class=\"action-pill-btn toggle\"\n        [class.active]=\"autoBlink()\"\n        (click)=\"onAutoBlinkToggle()\"\n        title=\"Toggle automatic natural blinking\"\n      >\n        <span class=\"toggle-dot\"></span>\n        Auto-Blink\n      </button>\n\n      <button\n        class=\"action-pill-btn toggle\"\n        [class.active]=\"hoverEnabled()\"\n        (click)=\"onHoverToggle()\"\n        title=\"Toggle floating robot hover animation\"\n      >\n        <span class=\"toggle-dot\"></span>\n        Hover Mode\n      </button>\n\n      <button\n        class=\"action-pill-btn toggle\"\n        [class.active]=\"pulseEnabled()\"\n        (click)=\"onPulseToggle()\"\n        title=\"Toggle subtle idle eye breathing pulse\"\n      >\n        <span class=\"toggle-dot\"></span>\n        Breathing Pulse\n      </button>\n    </div>\n  </div>\n\n  <!-- Display & Theme Adjustments -->\n  <div class=\"panel-section\">\n    <div class=\"section-title-row\">\n      <span class=\"section-title\">OLED Display & Colors</span>\n    </div>\n\n    <!-- Color Themes -->\n    <div class=\"themes-row\">\n      @for (theme of colorThemes; track theme.name) {\n        <button\n          class=\"theme-chip\"\n          (click)=\"onThemeSelect(theme)\"\n          [title]=\"theme.name\"\n        >\n          <span class=\"theme-swatch\" [ngClass]=\"theme.previewClass\"></span>\n          <span class=\"theme-name\">{{ theme.name }}</span>\n        </button>\n      }\n    </div>\n\n    <!-- Sliders Grid -->\n    <div class=\"sliders-grid\">\n      <div class=\"slider-group\">\n        <div class=\"slider-header\">\n          <label>Glow Power</label>\n          <span class=\"val-tag\">{{ glowIntensity() | number:'1.1-1' }}x</span>\n        </div>\n        <input\n          type=\"range\"\n          min=\"0.4\"\n          max=\"2.5\"\n          step=\"0.1\"\n          [ngModel]=\"glowIntensity()\"\n          (ngModelChange)=\"onGlowChange($event)\"\n          class=\"cyber-slider\"\n        />\n      </div>\n\n      <div class=\"slider-group\">\n        <div class=\"slider-header\">\n          <label>Eye Scale</label>\n          <span class=\"val-tag\">{{ eyeScale() | number:'1.1-1' }}x</span>\n        </div>\n        <input\n          type=\"range\"\n          min=\"0.5\"\n          max=\"1.6\"\n          step=\"0.05\"\n          [ngModel]=\"eyeScale()\"\n          (ngModelChange)=\"onScaleChange($event)\"\n          class=\"cyber-slider\"\n        />\n      </div>\n\n      <div class=\"slider-group\">\n        <div class=\"slider-header\">\n          <label>Eye Spacing</label>\n          <span class=\"val-tag\">{{ eyeSpacing() }}px</span>\n        </div>\n        <input\n          type=\"range\"\n          min=\"80\"\n          max=\"240\"\n          step=\"5\"\n          [ngModel]=\"eyeSpacing()\"\n          (ngModelChange)=\"onSpacingChange($event)\"\n          class=\"cyber-slider\"\n        />\n      </div>\n    </div>\n  </div>\n\n  <!-- Custom Face Texture & Visor Tuning -->\n  <div class=\"panel-footer-actions\">\n    <label class=\"custom-sprite-btn\" title=\"Map custom face PNG/SVG image directly onto the robot screen\">\n      \uD83D\uDDBC\uFE0F Upload Custom Face Image\n      <input type=\"file\" accept=\"image/*\" (change)=\"onCustomFileSelected($event)\" class=\"hidden-input\" />\n    </label>\n\n    <button class=\"tune-btn\" (click)=\"toggleTuning()\" title=\"Fine-tune 3D screen overlay position\">\n      \u2699\uFE0F {{ isTuningOpen() ? 'Close Visor Tuner' : 'Fine-Tune 3D Visor' }}\n    </button>\n  </div>\n\n  <!-- Realtime Visor 3D Calibration Panel -->\n  @if (isTuningOpen()) {\n    <div class=\"tuning-drawer\">\n      <div class=\"drawer-header\">\n        <span>\uD83D\uDD27 3D Screen Overlay Calibration</span>\n      </div>\n      <div class=\"tuning-grid\">\n        <div class=\"tune-item\">\n          <label>Height (Y): {{ visorPosY() | number:'1.3-3' }}</label>\n          <input\n            type=\"range\"\n            min=\"0.05\"\n            max=\"0.28\"\n            step=\"0.002\"\n            [ngModel]=\"visorPosY()\"\n            (ngModelChange)=\"onVisorPosYChange($event)\"\n          />\n        </div>\n        <div class=\"tune-item\">\n          <label>Depth (Z): {{ visorPosZ() | number:'1.3-3' }}</label>\n          <input\n            type=\"range\"\n            min=\"0.25\"\n            max=\"0.45\"\n            step=\"0.002\"\n            [ngModel]=\"visorPosZ()\"\n            (ngModelChange)=\"onVisorPosZChange($event)\"\n          />\n        </div>\n        <div class=\"tune-item\">\n          <label>Tilt Angle: {{ visorRotX() | number:'1.2-2' }}</label>\n          <input\n            type=\"range\"\n            min=\"-0.3\"\n            max=\"0.1\"\n            step=\"0.01\"\n            [ngModel]=\"visorRotX()\"\n            (ngModelChange)=\"onVisorRotXChange($event)\"\n          />\n        </div>\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block;width:100%}.emotion-panel-card{background:#0f172aeb;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px 20px;box-shadow:0 12px 36px #00000073;display:flex;flex-direction:column;gap:14px}.panel-section{display:flex;flex-direction:column;gap:10px}.section-title-row{display:flex;justify-content:space-between;align-items:center}.section-title{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8}.active-badge{font-size:.72rem;font-weight:700;color:#38bdf8;background:#38bdf81f;border:1px solid rgba(56,189,248,.3);padding:2px 8px;border-radius:9999px;letter-spacing:.04em}.emotion-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px}.emotion-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#1e293bbf;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:9px 12px;color:#e2e8f0;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s cubic-bezier(.4,0,.2,1);-webkit-user-select:none;user-select:none}.emotion-btn:hover{background:#334155e6;border-color:#38bdf866;transform:translateY(-2px);box-shadow:0 4px 12px #38bdf826}.emotion-btn.active{background:linear-gradient(135deg,#0ea5e94d,#6366f159);border-color:#38bdf8;color:#fff;box-shadow:0 0 16px #38bdf859;transform:translateY(-1px)}.btn-icon{font-size:1rem}.btn-label{font-size:.8rem}.actions-row{display:flex;flex-wrap:wrap;gap:8px}.action-pill-btn{display:inline-flex;align-items:center;gap:6px;background:#1e293bcc;border:1px solid rgba(255,255,255,.1);color:#f1f5f9;padding:6px 14px;border-radius:8px;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .2s ease}.action-pill-btn:hover{background:#334155;border-color:#fff3}.action-pill-btn.toggle.active{background:#10b9812e;border-color:#10b981;color:#34d399}.toggle-dot{width:6px;height:6px;border-radius:50%;background:#64748b}.action-pill-btn.toggle.active .toggle-dot{background:#10b981;box-shadow:0 0 6px #10b981}.themes-row{display:flex;flex-wrap:wrap;gap:8px}.theme-chip{display:flex;align-items:center;gap:6px;background:#1e293b99;border:1px solid rgba(255,255,255,.08);padding:4px 10px;border-radius:6px;color:#cbd5e1;font-size:.74rem;font-weight:500;cursor:pointer;transition:all .2s}.theme-chip:hover{background:#334155e6;border-color:#fff3}.theme-swatch{width:10px;height:10px;border-radius:50%}.theme-cyan{background:linear-gradient(135deg,#00f0ff,#3b82f6);box-shadow:0 0 4px #00f0ff}.theme-violet{background:linear-gradient(135deg,#a855f7,#3b82f6);box-shadow:0 0 4px #a855f7}.theme-rose{background:linear-gradient(135deg,#f43f5e,#ec4899);box-shadow:0 0 4px #f43f5e}.theme-emerald{background:linear-gradient(135deg,#10b981,#06b6d4);box-shadow:0 0 4px #10b981}.theme-amber{background:linear-gradient(135deg,#f59e0b,#ef4444);box-shadow:0 0 4px #f59e0b}.sliders-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.slider-group{display:flex;flex-direction:column;gap:4px}.slider-header{display:flex;justify-content:space-between;align-items:center;font-size:.72rem;color:#94a3b8}.val-tag{font-family:ui-monospace,SFMono-Regular,monospace;font-weight:600;color:#38bdf8}.cyber-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:#ffffff26;outline:none}.cyber-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:#38bdf8;cursor:pointer;box-shadow:0 0 8px #38bdf8;transition:transform .1s}.cyber-slider::-webkit-slider-thumb:hover{transform:scale(1.25)}.panel-footer-actions{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.08);padding-top:12px;gap:10px}.custom-sprite-btn{display:inline-flex;align-items:center;gap:6px;background:#1e293be6;border:1px solid rgba(255,255,255,.15);color:#f8fafc;padding:6px 12px;border-radius:8px;font-size:.76rem;font-weight:600;cursor:pointer;transition:all .2s}.custom-sprite-btn:hover{background:#334155;border-color:#38bdf8}.hidden-input{display:none}.tune-btn{background:transparent;border:1px solid rgba(255,255,255,.12);color:#94a3b8;padding:6px 12px;border-radius:8px;font-size:.76rem;cursor:pointer;transition:all .2s}.tune-btn:hover{color:#f1f5f9;background:#ffffff0d}.tuning-drawer{background:#0f172ad9;border:1px solid rgba(56,189,248,.2);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}.drawer-header{font-size:.74rem;font-weight:700;color:#38bdf8;text-transform:uppercase}.tuning-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}.tune-item{display:flex;flex-direction:column;gap:2px;font-size:.7rem;color:#cbd5e1}.tune-item input{width:100%}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.RangeValueAccessor, selector: "input[type=range]:not([ngNoCva])[formControlName],input[type=range]:not([ngNoCva])[formControl],input[type=range]:not([ngNoCva])[ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "pipe", type: i1.UpperCasePipe, name: "uppercase" }, { kind: "pipe", type: i1.DecimalPipe, name: "number" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClipEvaControlsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'clip-eva-controls', standalone: true, imports: [CommonModule, FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"emotion-panel-card\">\n  <!-- Emotion Presets Selector -->\n  <div class=\"panel-section\">\n    <div class=\"section-title-row\">\n      <span class=\"section-title\">Robot Expressions</span>\n      <span class=\"active-badge\">Active: {{ activeEmotion | uppercase }}</span>\n    </div>\n\n    <div class=\"emotion-grid\">\n      @for (preset of emotionList; track preset.id) {\n        <button\n          type=\"button\"\n          class=\"emotion-btn\"\n          [class.active]=\"activeEmotion === preset.id\"\n          (click)=\"selectEmotion(preset.id)\"\n          [title]=\"preset.description\"\n        >\n          <span class=\"btn-icon\">{{ preset.icon }}</span>\n          <span class=\"btn-label\">{{ preset.label }}</span>\n        </button>\n      }\n    </div>\n  </div>\n\n  <!-- Live Animation Triggers -->\n  <div class=\"panel-section\">\n    <div class=\"section-title-row\">\n      <span class=\"section-title\">Dynamic Behaviors</span>\n    </div>\n\n    <div class=\"actions-row\">\n      <button class=\"action-pill-btn\" (click)=\"onTriggerBlink()\" title=\"Trigger manual eye blink\">\n        \uD83D\uDE09 Blink Now\n      </button>\n\n      <button\n        class=\"action-pill-btn toggle\"\n        [class.active]=\"autoBlink()\"\n        (click)=\"onAutoBlinkToggle()\"\n        title=\"Toggle automatic natural blinking\"\n      >\n        <span class=\"toggle-dot\"></span>\n        Auto-Blink\n      </button>\n\n      <button\n        class=\"action-pill-btn toggle\"\n        [class.active]=\"hoverEnabled()\"\n        (click)=\"onHoverToggle()\"\n        title=\"Toggle floating robot hover animation\"\n      >\n        <span class=\"toggle-dot\"></span>\n        Hover Mode\n      </button>\n\n      <button\n        class=\"action-pill-btn toggle\"\n        [class.active]=\"pulseEnabled()\"\n        (click)=\"onPulseToggle()\"\n        title=\"Toggle subtle idle eye breathing pulse\"\n      >\n        <span class=\"toggle-dot\"></span>\n        Breathing Pulse\n      </button>\n    </div>\n  </div>\n\n  <!-- Display & Theme Adjustments -->\n  <div class=\"panel-section\">\n    <div class=\"section-title-row\">\n      <span class=\"section-title\">OLED Display & Colors</span>\n    </div>\n\n    <!-- Color Themes -->\n    <div class=\"themes-row\">\n      @for (theme of colorThemes; track theme.name) {\n        <button\n          class=\"theme-chip\"\n          (click)=\"onThemeSelect(theme)\"\n          [title]=\"theme.name\"\n        >\n          <span class=\"theme-swatch\" [ngClass]=\"theme.previewClass\"></span>\n          <span class=\"theme-name\">{{ theme.name }}</span>\n        </button>\n      }\n    </div>\n\n    <!-- Sliders Grid -->\n    <div class=\"sliders-grid\">\n      <div class=\"slider-group\">\n        <div class=\"slider-header\">\n          <label>Glow Power</label>\n          <span class=\"val-tag\">{{ glowIntensity() | number:'1.1-1' }}x</span>\n        </div>\n        <input\n          type=\"range\"\n          min=\"0.4\"\n          max=\"2.5\"\n          step=\"0.1\"\n          [ngModel]=\"glowIntensity()\"\n          (ngModelChange)=\"onGlowChange($event)\"\n          class=\"cyber-slider\"\n        />\n      </div>\n\n      <div class=\"slider-group\">\n        <div class=\"slider-header\">\n          <label>Eye Scale</label>\n          <span class=\"val-tag\">{{ eyeScale() | number:'1.1-1' }}x</span>\n        </div>\n        <input\n          type=\"range\"\n          min=\"0.5\"\n          max=\"1.6\"\n          step=\"0.05\"\n          [ngModel]=\"eyeScale()\"\n          (ngModelChange)=\"onScaleChange($event)\"\n          class=\"cyber-slider\"\n        />\n      </div>\n\n      <div class=\"slider-group\">\n        <div class=\"slider-header\">\n          <label>Eye Spacing</label>\n          <span class=\"val-tag\">{{ eyeSpacing() }}px</span>\n        </div>\n        <input\n          type=\"range\"\n          min=\"80\"\n          max=\"240\"\n          step=\"5\"\n          [ngModel]=\"eyeSpacing()\"\n          (ngModelChange)=\"onSpacingChange($event)\"\n          class=\"cyber-slider\"\n        />\n      </div>\n    </div>\n  </div>\n\n  <!-- Custom Face Texture & Visor Tuning -->\n  <div class=\"panel-footer-actions\">\n    <label class=\"custom-sprite-btn\" title=\"Map custom face PNG/SVG image directly onto the robot screen\">\n      \uD83D\uDDBC\uFE0F Upload Custom Face Image\n      <input type=\"file\" accept=\"image/*\" (change)=\"onCustomFileSelected($event)\" class=\"hidden-input\" />\n    </label>\n\n    <button class=\"tune-btn\" (click)=\"toggleTuning()\" title=\"Fine-tune 3D screen overlay position\">\n      \u2699\uFE0F {{ isTuningOpen() ? 'Close Visor Tuner' : 'Fine-Tune 3D Visor' }}\n    </button>\n  </div>\n\n  <!-- Realtime Visor 3D Calibration Panel -->\n  @if (isTuningOpen()) {\n    <div class=\"tuning-drawer\">\n      <div class=\"drawer-header\">\n        <span>\uD83D\uDD27 3D Screen Overlay Calibration</span>\n      </div>\n      <div class=\"tuning-grid\">\n        <div class=\"tune-item\">\n          <label>Height (Y): {{ visorPosY() | number:'1.3-3' }}</label>\n          <input\n            type=\"range\"\n            min=\"0.05\"\n            max=\"0.28\"\n            step=\"0.002\"\n            [ngModel]=\"visorPosY()\"\n            (ngModelChange)=\"onVisorPosYChange($event)\"\n          />\n        </div>\n        <div class=\"tune-item\">\n          <label>Depth (Z): {{ visorPosZ() | number:'1.3-3' }}</label>\n          <input\n            type=\"range\"\n            min=\"0.25\"\n            max=\"0.45\"\n            step=\"0.002\"\n            [ngModel]=\"visorPosZ()\"\n            (ngModelChange)=\"onVisorPosZChange($event)\"\n          />\n        </div>\n        <div class=\"tune-item\">\n          <label>Tilt Angle: {{ visorRotX() | number:'1.2-2' }}</label>\n          <input\n            type=\"range\"\n            min=\"-0.3\"\n            max=\"0.1\"\n            step=\"0.01\"\n            [ngModel]=\"visorRotX()\"\n            (ngModelChange)=\"onVisorRotXChange($event)\"\n          />\n        </div>\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block;width:100%}.emotion-panel-card{background:#0f172aeb;-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px 20px;box-shadow:0 12px 36px #00000073;display:flex;flex-direction:column;gap:14px}.panel-section{display:flex;flex-direction:column;gap:10px}.section-title-row{display:flex;justify-content:space-between;align-items:center}.section-title{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8}.active-badge{font-size:.72rem;font-weight:700;color:#38bdf8;background:#38bdf81f;border:1px solid rgba(56,189,248,.3);padding:2px 8px;border-radius:9999px;letter-spacing:.04em}.emotion-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px}.emotion-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:#1e293bbf;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:9px 12px;color:#e2e8f0;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s cubic-bezier(.4,0,.2,1);-webkit-user-select:none;user-select:none}.emotion-btn:hover{background:#334155e6;border-color:#38bdf866;transform:translateY(-2px);box-shadow:0 4px 12px #38bdf826}.emotion-btn.active{background:linear-gradient(135deg,#0ea5e94d,#6366f159);border-color:#38bdf8;color:#fff;box-shadow:0 0 16px #38bdf859;transform:translateY(-1px)}.btn-icon{font-size:1rem}.btn-label{font-size:.8rem}.actions-row{display:flex;flex-wrap:wrap;gap:8px}.action-pill-btn{display:inline-flex;align-items:center;gap:6px;background:#1e293bcc;border:1px solid rgba(255,255,255,.1);color:#f1f5f9;padding:6px 14px;border-radius:8px;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .2s ease}.action-pill-btn:hover{background:#334155;border-color:#fff3}.action-pill-btn.toggle.active{background:#10b9812e;border-color:#10b981;color:#34d399}.toggle-dot{width:6px;height:6px;border-radius:50%;background:#64748b}.action-pill-btn.toggle.active .toggle-dot{background:#10b981;box-shadow:0 0 6px #10b981}.themes-row{display:flex;flex-wrap:wrap;gap:8px}.theme-chip{display:flex;align-items:center;gap:6px;background:#1e293b99;border:1px solid rgba(255,255,255,.08);padding:4px 10px;border-radius:6px;color:#cbd5e1;font-size:.74rem;font-weight:500;cursor:pointer;transition:all .2s}.theme-chip:hover{background:#334155e6;border-color:#fff3}.theme-swatch{width:10px;height:10px;border-radius:50%}.theme-cyan{background:linear-gradient(135deg,#00f0ff,#3b82f6);box-shadow:0 0 4px #00f0ff}.theme-violet{background:linear-gradient(135deg,#a855f7,#3b82f6);box-shadow:0 0 4px #a855f7}.theme-rose{background:linear-gradient(135deg,#f43f5e,#ec4899);box-shadow:0 0 4px #f43f5e}.theme-emerald{background:linear-gradient(135deg,#10b981,#06b6d4);box-shadow:0 0 4px #10b981}.theme-amber{background:linear-gradient(135deg,#f59e0b,#ef4444);box-shadow:0 0 4px #f59e0b}.sliders-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.slider-group{display:flex;flex-direction:column;gap:4px}.slider-header{display:flex;justify-content:space-between;align-items:center;font-size:.72rem;color:#94a3b8}.val-tag{font-family:ui-monospace,SFMono-Regular,monospace;font-weight:600;color:#38bdf8}.cyber-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:#ffffff26;outline:none}.cyber-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:#38bdf8;cursor:pointer;box-shadow:0 0 8px #38bdf8;transition:transform .1s}.cyber-slider::-webkit-slider-thumb:hover{transform:scale(1.25)}.panel-footer-actions{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.08);padding-top:12px;gap:10px}.custom-sprite-btn{display:inline-flex;align-items:center;gap:6px;background:#1e293be6;border:1px solid rgba(255,255,255,.15);color:#f8fafc;padding:6px 12px;border-radius:8px;font-size:.76rem;font-weight:600;cursor:pointer;transition:all .2s}.custom-sprite-btn:hover{background:#334155;border-color:#38bdf8}.hidden-input{display:none}.tune-btn{background:transparent;border:1px solid rgba(255,255,255,.12);color:#94a3b8;padding:6px 12px;border-radius:8px;font-size:.76rem;cursor:pointer;transition:all .2s}.tune-btn:hover{color:#f1f5f9;background:#ffffff0d}.tuning-drawer{background:#0f172ad9;border:1px solid rgba(56,189,248,.2);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}.drawer-header{font-size:.74rem;font-weight:700;color:#38bdf8;text-transform:uppercase}.tuning-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}.tune-item{display:flex;flex-direction:column;gap:2px;font-size:.7rem;color:#cbd5e1}.tune-item input{width:100%}\n"] }]
        }], propDecorators: { activeEmotion: [{
                type: Input,
                args: [{ required: true }]
            }], emotionChange: [{
                type: Output
            }], blinkTrigger: [{
                type: Output
            }], autoBlinkToggle: [{
                type: Output
            }], hoverToggle: [{
                type: Output
            }], pulseToggle: [{
                type: Output
            }], glowIntensityChange: [{
                type: Output
            }], eyeScaleChange: [{
                type: Output
            }], eyeSpacingChange: [{
                type: Output
            }], colorThemeChange: [{
                type: Output
            }], customImageSelect: [{
                type: Output
            }], visorTransformChange: [{
                type: Output
            }] } });

/**
 * 2026-08-28: replaces an unconditional `antialias: true` + a flat `devicePixelRatio` cap of 2 -
 * the two settings a real chrome://gpu dump on a consuming app proved expensive on Intel
 * integrated GPUs (Chromium's own compatibility database documents MSAA as genuinely slow on
 * that GPU class, crbug.com/527565). Every consumer of this component previously had no way to
 * override either setting (no @Input exposed them), so this fix lives here once, in the shared
 * renderer setup, rather than needing to be duplicated per consuming app. Queried via a
 * disposable 1x1 probe context, since `antialias` is a WebGLRenderer CONSTRUCTOR option and the
 * renderer string isn't knowable until AFTER a context already exists.
 */
function isKnownSlowGpu() {
    try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl)
            return false;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        return /Intel/i.test(renderer);
    }
    catch {
        return false;
    }
}
class ClipEvaRobotComponent {
    platformId = inject(PLATFORM_ID);
    // Model & Canvas inputs
    modelUrl = 'assets/models/clip-eva.glb';
    backgroundColor = '#0f172a';
    // Emotion & Visuals API Inputs
    emotion = 'happy';
    autoBlink = true;
    hoverMode = true;
    breathingPulse = true;
    glowPower = 1.2;
    eyeScale = 1.0;
    eyeSpacing = 160;
    colorPreset;
    primaryColor;
    secondaryColor;
    customFaceImage;
    // Optional Controls / UI Panel Embed
    showControls = false;
    showHud = false;
    showTopBar = false;
    controlsPosition = 'top-right';
    // Events / Outputs
    emotionChange = new EventEmitter();
    modelLoaded = new EventEmitter();
    modelProgress = new EventEmitter();
    modelError = new EventEmitter();
    canvasContainerRef;
    // Component UI State signals
    isLoading = signal(true, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "isLoading" }] : /* istanbul ignore next */ []));
    loadingProgress = signal(0, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "loadingProgress" }] : /* istanbul ignore next */ []));
    errorMessage = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "errorMessage" }] : /* istanbul ignore next */ []));
    inspectionData = signal(null, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "inspectionData" }] : /* istanbul ignore next */ []));
    isLoaded = signal(false, /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "isLoaded" }] : /* istanbul ignore next */ []));
    internalEmotion = signal('happy', /* @ts-ignore */
    ...(ngDevMode ? [{ debugName: "internalEmotion" }] : /* istanbul ignore next */ []));
    // Three.js Core Instances
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    clock = new THREE.Clock();
    animationFrameId = null;
    resizeObserver = null;
    currentModel = null;
    // Emotion Layer
    emotionManager = null;
    chestLogoAnimator = null;
    presetColorMap = {
        cyan: { primary: '#00f0ff', secondary: '#3b82f6' },
        violet: { primary: '#a855f7', secondary: '#3b82f6' },
        rose: { primary: '#f43f5e', secondary: '#ec4899' },
        emerald: { primary: '#10b981', secondary: '#06b6d4' },
        amber: { primary: '#f59e0b', secondary: '#ef4444' }
    };
    ngOnInit() {
        this.internalEmotion.set(this.emotion);
        if (isPlatformBrowser(this.platformId)) {
            this.initThreeScene();
            this.loadModel(this.modelUrl);
        }
    }
    ngOnChanges(changes) {
        if (!this.emotionManager)
            return;
        if (changes['emotion'] && changes['emotion'].currentValue) {
            const em = changes['emotion'].currentValue;
            this.internalEmotion.set(em);
            this.emotionManager.setEmotion(em);
        }
        if (changes['autoBlink'] !== undefined) {
            this.emotionManager.setAutoBlink(this.autoBlink);
        }
        if (changes['hoverMode'] !== undefined) {
            this.emotionManager.setHoverEnabled(this.hoverMode);
        }
        if (changes['breathingPulse'] !== undefined) {
            this.emotionManager.setIdlePulse(this.breathingPulse);
        }
        if (changes['glowPower'] !== undefined) {
            this.emotionManager.setGlowIntensity(this.glowPower);
        }
        if (changes['eyeScale'] !== undefined) {
            this.emotionManager.setEyeScale(this.eyeScale);
        }
        if (changes['eyeSpacing'] !== undefined) {
            this.emotionManager.setEyeSpacing(this.eyeSpacing);
        }
        if (changes['colorPreset'] && this.colorPreset && this.presetColorMap[this.colorPreset]) {
            const c = this.presetColorMap[this.colorPreset];
            this.emotionManager.setCustomColors(c.primary, c.secondary);
        }
        else if (changes['primaryColor'] || changes['secondaryColor']) {
            if (this.primaryColor && this.secondaryColor) {
                this.emotionManager.setCustomColors(this.primaryColor, this.secondaryColor);
            }
        }
        if (changes['customFaceImage'] && this.customFaceImage) {
            this.emotionManager.setCustomImage(this.customFaceImage);
        }
        if (changes['modelUrl'] && !changes['modelUrl'].isFirstChange()) {
            this.loadModel(this.modelUrl);
        }
    }
    ngOnDestroy() {
        this.cleanupThreeResources();
    }
    /**
     * Initializes the Three.js Scene, Camera, Renderer, Controls, and Lights.
     */
    initThreeScene() {
        const container = this.canvasContainerRef.nativeElement;
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;
        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.backgroundColor);
        // Subtle atmospheric fog for visual depth
        this.scene.fog = new THREE.FogExp2(this.backgroundColor, 0.04);
        // 2. Perspective Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 1.5, 4);
        // 3. WebGLRenderer with high visual fidelity settings
        // 2026-08-28: antialias gated on isKnownSlowGpu() and pixel ratio capped at 1.5 (was an
        // unconditional true + a flat 2 cap) - see that function's own comment for the chrome://gpu
        // evidence. Still ~44% fewer pixels than an uncapped 2x retina display even on a fast GPU.
        this.renderer = new THREE.WebGLRenderer({
            antialias: !isKnownSlowGpu(),
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
        // 4. OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enablePan = false;
        this.controls.minDistance = 0.8;
        this.controls.maxDistance = 25;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.08;
        this.controls.target.set(0, 0.8, 0);
        // 5. Lighting Setup
        this.setupLighting();
        // 6. Ground Studio Stage
        this.setupGroundStage();
        // 7. Responsive handling via ResizeObserver
        this.setupResizeObserver();
        // 8. Initialize Emotion Manager
        this.emotionManager = new EmotionManager(this.emotion);
        this.applyInitialSettings();
        // 9. Start Render Loop
        this.clock.start();
        this.animate();
    }
    applyInitialSettings() {
        if (!this.emotionManager)
            return;
        this.emotionManager.setAutoBlink(this.autoBlink);
        this.emotionManager.setHoverEnabled(this.hoverMode);
        this.emotionManager.setIdlePulse(this.breathingPulse);
        this.emotionManager.setGlowIntensity(this.glowPower);
        this.emotionManager.setEyeScale(this.eyeScale);
        this.emotionManager.setEyeSpacing(this.eyeSpacing);
        if (this.colorPreset && this.presetColorMap[this.colorPreset]) {
            const c = this.presetColorMap[this.colorPreset];
            this.emotionManager.setCustomColors(c.primary, c.secondary);
        }
        else if (this.primaryColor && this.secondaryColor) {
            this.emotionManager.setCustomColors(this.primaryColor, this.secondaryColor);
        }
        if (this.customFaceImage) {
            this.emotionManager.setCustomImage(this.customFaceImage);
        }
    }
    /**
     * Sets up 3-point studio lighting + hemisphere lighting.
     */
    setupLighting() {
        if (!this.scene)
            return;
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.2);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
        keyLight.position.set(4, 6, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 25;
        keyLight.shadow.bias = -0.0001;
        this.scene.add(keyLight);
        const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
        fillLight.position.set(-5, 3, 2);
        this.scene.add(fillLight);
        const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
        rimLight.position.set(0, 5, -5);
        this.scene.add(rimLight);
    }
    /**
     * Adds ground shadow receiver floor and subtle grid.
     */
    setupGroundStage() {
        if (!this.scene)
            return;
        const groundGeo = new THREE.PlaneGeometry(30, 30);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.25 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.receiveShadow = true;
        this.scene.add(ground);
        const grid = new THREE.GridHelper(10, 20, 0x475569, 0x1e293b);
        grid.position.y = -0.001;
        this.scene.add(grid);
    }
    /**
     * Loads the GLB model using GLTFLoader.
     */
    loadModel(url) {
        if (!this.scene)
            return;
        this.isLoading.set(true);
        this.loadingProgress.set(0);
        this.errorMessage.set(null);
        this.isLoaded.set(false);
        if (this.currentModel) {
            this.scene.remove(this.currentModel);
            this.disposeObject(this.currentModel);
            this.currentModel = null;
        }
        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        loader.setDRACOLoader(dracoLoader);
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            this.currentModel = model;
            model.traverse((child) => {
                if (child.isMesh) {
                    const mesh = child;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                }
            });
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            model.position.x -= center.x;
            model.position.y -= box.min.y;
            model.position.z -= center.z;
            model.rotation.y = -Math.PI / 2;
            if (this.emotionManager) {
                this.emotionManager.attachToModel(model);
            }
            this.chestLogoAnimator = new ChestLogoAnimator();
            model.add(this.chestLogoAnimator.mesh);
            this.scene?.add(model);
            this.fitCameraToModel(size);
            const inspection = this.inspectAndLogGLTF(gltf, size);
            this.inspectionData.set(inspection);
            this.isLoading.set(false);
            this.isLoaded.set(true);
            this.modelLoaded.emit(inspection);
        }, (xhr) => {
            if (xhr.total > 0) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                this.loadingProgress.set(percent);
                this.modelProgress.emit(percent);
            }
        }, (error) => {
            console.error('[ClipEvaRobot] Error loading GLB model:', error);
            this.isLoading.set(false);
            const err = `Failed to load GLB from "${url}". Please ensure the model file path is valid.`;
            this.errorMessage.set(err);
            this.modelError.emit(err);
        });
    }
    fitCameraToModel(size) {
        if (!this.camera || !this.controls)
            return;
        const maxDim = Math.max(size.x, size.y, size.z, 0.5);
        const fov = (this.camera.fov * Math.PI) / 180;
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.8;
        cameraZ = Math.max(cameraZ, 2.0);
        const targetHeight = size.y * 0.55;
        this.controls.target.set(0, targetHeight, 0);
        this.camera.position.set(0, targetHeight + maxDim * 0.25, cameraZ);
        this.camera.lookAt(0, targetHeight, 0);
        this.controls.update();
    }
    inspectAndLogGLTF(gltf, size) {
        let totalObjects = 0;
        let meshCount = 0;
        const materialSet = new Set();
        const objectNames = [];
        gltf.scene.traverse((obj) => {
            totalObjects++;
            if (obj.name) {
                objectNames.push(obj.name);
            }
            else {
                objectNames.push(`(unnamed ${obj.type})`);
            }
            if (obj.isMesh) {
                meshCount++;
                const mesh = obj;
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((mat) => materialSet.add(mat));
                }
                else if (mesh.material) {
                    materialSet.add(mesh.material);
                }
            }
        });
        const animationCount = gltf.animations ? gltf.animations.length : 0;
        const materialCount = materialSet.size;
        return {
            totalObjects,
            meshCount,
            materialCount,
            animationCount,
            objectNames,
            boundingBoxSize: { x: size.x, y: size.y, z: size.z }
        };
    }
    // Public Programmatic API
    setEmotion(emotion, transitionSec = 0.35) {
        this.internalEmotion.set(emotion);
        this.emotionManager?.setEmotion(emotion, transitionSec);
        this.emotionChange.emit(emotion);
    }
    triggerBlink() {
        this.emotionManager?.triggerBlink();
    }
    blink() {
        this.triggerBlink();
    }
    setAutoBlink(enabled) {
        this.autoBlink = enabled;
        this.emotionManager?.setAutoBlink(enabled);
    }
    setHoverEnabled(enabled) {
        this.hoverMode = enabled;
        this.emotionManager?.setHoverEnabled(enabled);
    }
    setIdlePulse(enabled) {
        this.breathingPulse = enabled;
        this.emotionManager?.setIdlePulse(enabled);
    }
    setGlowIntensity(intensity) {
        this.glowPower = intensity;
        this.emotionManager?.setGlowIntensity(intensity);
    }
    setEyeScale(scale) {
        this.eyeScale = scale;
        this.emotionManager?.setEyeScale(scale);
    }
    setEyeSpacing(spacing) {
        this.eyeSpacing = spacing;
        this.emotionManager?.setEyeSpacing(spacing);
    }
    setCustomColors(primary, secondary) {
        this.primaryColor = primary;
        this.secondaryColor = secondary;
        this.emotionManager?.setCustomColors(primary, secondary);
    }
    setCustomImage(imageUrl) {
        this.customFaceImage = imageUrl;
        this.emotionManager?.setCustomImage(imageUrl);
    }
    updateVisorTransform(pos, rot, scale) {
        this.emotionManager?.overlay.updateTransform(pos, rot, scale);
    }
    onFileSelected(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            const blobUrl = URL.createObjectURL(file);
            this.loadModel(blobUrl);
        }
    }
    resetCamera() {
        if (this.inspectionData()?.boundingBoxSize) {
            const b = this.inspectionData().boundingBoxSize;
            this.fitCameraToModel(new THREE.Vector3(b.x, b.y, b.z));
        }
        else {
            this.camera?.position.set(0, 1.5, 4);
            this.controls?.target.set(0, 0.8, 0);
            this.controls?.update();
        }
    }
    setupResizeObserver() {
        const container = this.canvasContainerRef.nativeElement;
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    this.onResize(width, height);
                }
            }
        });
        this.resizeObserver.observe(container);
    }
    onResize(width, height) {
        if (!this.camera || !this.renderer)
            return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    }
    animate = () => {
        this.animationFrameId = requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();
        if (this.controls) {
            this.controls.update();
        }
        if (this.emotionManager) {
            this.emotionManager.update(delta);
        }
        if (this.chestLogoAnimator) {
            this.chestLogoAnimator.update(delta);
        }
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    };
    cleanupThreeResources() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.emotionManager) {
            this.emotionManager.dispose();
            this.emotionManager = null;
        }
        if (this.chestLogoAnimator) {
            this.chestLogoAnimator.dispose();
            this.chestLogoAnimator = null;
        }
        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
        if (this.currentModel && this.scene) {
            this.scene.remove(this.currentModel);
            this.disposeObject(this.currentModel);
            this.currentModel = null;
        }
        if (this.scene) {
            this.scene.traverse((obj) => {
                this.disposeObject(obj);
            });
            this.scene.clear();
            this.scene = null;
        }
        if (this.renderer) {
            this.renderer.dispose();
            const dom = this.renderer.domElement;
            if (dom && dom.parentNode) {
                dom.parentNode.removeChild(dom);
            }
            this.renderer = null;
        }
    }
    disposeObject(obj) {
        if (obj.isMesh) {
            const mesh = obj;
            if (mesh.geometry) {
                mesh.geometry.dispose();
            }
            if (mesh.material) {
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((mat) => this.disposeMaterial(mat));
                }
                else {
                    this.disposeMaterial(mesh.material);
                }
            }
        }
    }
    disposeMaterial(material) {
        material.dispose();
        for (const key of Object.keys(material)) {
            const value = material[key];
            if (value && typeof value === 'object' && 'isTexture' in value && value.isTexture) {
                value.dispose();
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClipEvaRobotComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "22.1.2", type: ClipEvaRobotComponent, isStandalone: true, selector: "clip-eva-robot", inputs: { modelUrl: "modelUrl", backgroundColor: "backgroundColor", emotion: "emotion", autoBlink: "autoBlink", hoverMode: "hoverMode", breathingPulse: "breathingPulse", glowPower: "glowPower", eyeScale: "eyeScale", eyeSpacing: "eyeSpacing", colorPreset: "colorPreset", primaryColor: "primaryColor", secondaryColor: "secondaryColor", customFaceImage: "customFaceImage", showControls: "showControls", showHud: "showHud", showTopBar: "showTopBar", controlsPosition: "controlsPosition" }, outputs: { emotionChange: "emotionChange", modelLoaded: "modelLoaded", modelProgress: "modelProgress", modelError: "modelError" }, viewQueries: [{ propertyName: "canvasContainerRef", first: true, predicate: ["canvasContainer"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"robot-viewer-container\">\n  <!-- 3D Canvas Host -->\n  <div #canvasContainer class=\"canvas-viewport\"></div>\n\n  <!-- Optional Top Overlay Bar -->\n  @if (showTopBar) {\n    <div class=\"viewer-top-bar\">\n      <div class=\"model-badge\">\n        <span class=\"badge-dot\" [class.active]=\"isLoaded()\"></span>\n        <span class=\"badge-title\">CLIP-EVA Robot</span>\n        <span class=\"badge-sub\">3D Viewer</span>\n      </div>\n\n      <div class=\"top-actions\">\n        <button class=\"action-btn\" (click)=\"resetCamera()\" title=\"Reset Camera\">\n          <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\">\n            <path d=\"M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.77 20 14.45 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 10.23 4 11.55 4 13c0 4.42 3.58 8 8 8v4l5-5-5-5v4c-3.31 0-6-2.69-6-6z\"/>\n          </svg>\n          Reset View\n        </button>\n\n        <label class=\"action-btn secondary file-input-label\" title=\"Load custom GLB directly\">\n          <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\">\n            <path d=\"M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z\"/>\n          </svg>\n          Select GLB\n          <input type=\"file\" accept=\".glb,.gltf\" (change)=\"onFileSelected($event)\" class=\"hidden-file-input\" />\n        </label>\n      </div>\n    </div>\n  }\n\n  <!-- Optional Embedded Floating Control Panel -->\n  @if (showControls) {\n    <aside class=\"embedded-controls-panel\" [ngClass]=\"'pos-' + controlsPosition\">\n      <clip-eva-controls\n        [activeEmotion]=\"internalEmotion()\"\n        (emotionChange)=\"setEmotion($event)\"\n        (blinkTrigger)=\"triggerBlink()\"\n        (autoBlinkToggle)=\"setAutoBlink($event)\"\n        (hoverToggle)=\"setHoverEnabled($event)\"\n        (pulseToggle)=\"setIdlePulse($event)\"\n        (glowIntensityChange)=\"setGlowIntensity($event)\"\n        (eyeScaleChange)=\"setEyeScale($event)\"\n        (eyeSpacingChange)=\"setEyeSpacing($event)\"\n        (colorThemeChange)=\"setCustomColors($event.primary, $event.secondary)\"\n        (customImageSelect)=\"setCustomImage($event)\"\n        (visorTransformChange)=\"updateVisorTransform($event.position, $event.rotation, $event.scale)\"\n      ></clip-eva-controls>\n    </aside>\n  }\n\n  <!-- Loading State Indicator -->\n  @if (isLoading()) {\n    <div class=\"loading-overlay\">\n      <div class=\"loader-card\">\n        <div class=\"spinner\"></div>\n        <div class=\"loader-text\">Loading CLIP-EVA Model...</div>\n        @if (loadingProgress() > 0) {\n          <div class=\"progress-container\">\n            <div class=\"progress-bar\" [style.width.%]=\"loadingProgress()\"></div>\n          </div>\n          <div class=\"progress-pct\">{{ loadingProgress() }}%</div>\n        }\n        <div class=\"loader-hint\">Reading GLB geometry & shaders</div>\n      </div>\n    </div>\n  }\n\n  <!-- Error State Overlay -->\n  @if (errorMessage()) {\n    <div class=\"error-overlay\">\n      <div class=\"error-card\">\n        <div class=\"error-icon\">\u26A0\uFE0F</div>\n        <h3 class=\"error-title\">Model File Not Found</h3>\n        <p class=\"error-description\">{{ errorMessage() }}</p>\n        <div class=\"error-instruction\">\n          <div class=\"inst-step\">\n            <strong>Configured Path:</strong>\n            <code>{{ modelUrl }}</code>\n          </div>\n          <div class=\"error-actions\">\n            <button class=\"primary-btn\" (click)=\"loadModel(modelUrl)\">\n              Retry Loading\n            </button>\n            <label class=\"file-picker-btn\">\n              Choose Local GLB\n              <input type=\"file\" accept=\".glb,.gltf\" (change)=\"onFileSelected($event)\" class=\"hidden-file-input\" />\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n  }\n\n  <!-- Optional Model Inspection HUD -->\n  @if (showHud && isLoaded() && inspectionData(); as data) {\n    <div class=\"inspection-hud\">\n      <div class=\"hud-header\">\n        <span class=\"hud-title\">\uD83D\uDCCA GLB Model Inspection</span>\n        <span class=\"hud-status\">Ready</span>\n      </div>\n      <div class=\"hud-metrics\">\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Objects</span>\n          <span class=\"chip-value\">{{ data.totalObjects }}</span>\n        </div>\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Meshes</span>\n          <span class=\"chip-value highlight\">{{ data.meshCount }}</span>\n        </div>\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Materials</span>\n          <span class=\"chip-value\">{{ data.materialCount }}</span>\n        </div>\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Animations</span>\n          <span class=\"chip-value\">{{ data.animationCount }}</span>\n        </div>\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block;width:100%;height:100%;position:relative;overflow:hidden;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;color:#f8fafc}.robot-viewer-container{width:100%;height:100%;position:relative;overflow:hidden;background:radial-gradient(circle at center,#1e293b,#0f172a)}.canvas-viewport{width:100%;height:100%;display:block;cursor:grab}.canvas-viewport:active{cursor:grabbing}.viewer-top-bar{position:absolute;top:16px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center;pointer-events:none;z-index:10}.model-badge{pointer-events:auto;display:flex;align-items:center;gap:10px;background:#0f172ad9;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);padding:8px 16px;border-radius:9999px;border:1px solid rgba(255,255,255,.1);box-shadow:0 4px 20px #0006}.badge-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;box-shadow:0 0 8px #f59e0b;transition:background .3s,box-shadow .3s}.badge-dot.active{background:#10b981;box-shadow:0 0 8px #10b981}.badge-title{font-weight:600;font-size:.9rem;letter-spacing:.02em;color:#f8fafc}.badge-sub{font-size:.75rem;color:#94a3b8;border-left:1px solid rgba(255,255,255,.15);padding-left:8px}.top-actions{pointer-events:auto;display:flex;gap:8px}.action-btn{display:inline-flex;align-items:center;gap:6px;background:#1e293bd9;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#f1f5f9;border:1px solid rgba(255,255,255,.12);padding:7px 14px;border-radius:8px;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .2s ease;-webkit-user-select:none;user-select:none}.action-btn:hover{background:#334155f2;border-color:#ffffff40;transform:translateY(-1px)}.action-btn.secondary{background:#0f172abf}.file-input-label{cursor:pointer}.hidden-file-input{display:none}.embedded-controls-panel{position:absolute;max-width:360px;width:calc(100% - 32px);z-index:15;max-height:calc(100% - 32px);overflow-y:auto}.embedded-controls-panel.pos-top-right{top:16px;right:16px}.embedded-controls-panel.pos-top-left{top:16px;left:16px}.embedded-controls-panel.pos-bottom-right{bottom:16px;right:16px}.embedded-controls-panel.pos-bottom-left{bottom:16px;left:16px}.loading-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172abf;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:20}.loader-card{display:flex;flex-direction:column;align-items:center;padding:32px 40px;background:#1e293be6;border:1px solid rgba(255,255,255,.1);border-radius:16px;box-shadow:0 20px 40px #00000080;text-align:center}.spinner{width:44px;height:44px;border:3px solid rgba(56,189,248,.2);border-top-color:#38bdf8;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:16px}@keyframes spin{to{transform:rotate(360deg)}}.loader-text{font-size:1rem;font-weight:600;color:#f8fafc;margin-bottom:8px}.progress-container{width:200px;height:6px;background:#ffffff1a;border-radius:9999px;overflow:hidden;margin-top:10px}.progress-bar{height:100%;background:linear-gradient(90deg,#38bdf8,#818cf8);transition:width .2s ease}.progress-pct{font-size:.75rem;color:#94a3b8;margin-top:4px}.loader-hint{font-size:.75rem;color:#64748b;margin-top:12px}.error-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172ad9;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);z-index:20;padding:20px}.error-card{max-width:480px;width:100%;background:#1e293bf2;border:1px solid rgba(239,68,68,.3);border-radius:16px;padding:28px;box-shadow:0 20px 50px #0009;text-align:center}.error-icon{font-size:2.2rem;margin-bottom:12px}.error-title{font-size:1.15rem;font-weight:600;color:#f87171;margin:0 0 10px}.error-description{font-size:.85rem;color:#cbd5e1;line-height:1.5;margin:0 0 16px}.error-instruction{background:#0f172a99;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;text-align:left}.inst-step{font-size:.82rem;color:#e2e8f0;margin-bottom:8px}.inst-step code{display:block;margin-top:4px;background:#090d16;color:#38bdf8;padding:6px 10px;border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.8rem;border:1px solid rgba(56,189,248,.2)}.error-actions{display:flex;gap:10px;justify-content:center;margin-top:14px}.primary-btn{background:#3b82f6;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:.82rem;font-weight:600;cursor:pointer;transition:background .2s}.primary-btn:hover{background:#2563eb}.file-picker-btn{background:#334155cc;color:#f1f5f9;border:1px solid rgba(255,255,255,.15);padding:8px 18px;border-radius:8px;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .2s}.file-picker-btn:hover{background:#475569}.inspection-hud{position:absolute;bottom:16px;right:16px;max-width:480px;background:#0f172ae0;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 18px;box-shadow:0 8px 32px #00000080;z-index:10;color:#f1f5f9}.hud-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.hud-title{font-size:.82rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8}.hud-status{font-size:.72rem;background:#10b98126;color:#34d399;border:1px solid rgba(16,185,129,.3);padding:2px 8px;border-radius:9999px;font-weight:600}.hud-metrics{display:flex;flex-wrap:wrap;gap:8px}.metric-chip{display:flex;flex-direction:column;background:#1e293bcc;border:1px solid rgba(255,255,255,.06);padding:6px 12px;border-radius:8px;min-width:68px}.chip-label{font-size:.68rem;color:#94a3b8;margin-bottom:2px}.chip-value{font-size:.92rem;font-weight:700;color:#f8fafc}.chip-value.highlight{color:#38bdf8}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: ClipEvaControlsComponent, selector: "clip-eva-controls", inputs: ["activeEmotion"], outputs: ["emotionChange", "blinkTrigger", "autoBlinkToggle", "hoverToggle", "pulseToggle", "glowIntensityChange", "eyeScaleChange", "eyeSpacingChange", "colorThemeChange", "customImageSelect", "visorTransformChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClipEvaRobotComponent, decorators: [{
            type: Component,
            args: [{ selector: 'clip-eva-robot', standalone: true, imports: [CommonModule, ClipEvaControlsComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"robot-viewer-container\">\n  <!-- 3D Canvas Host -->\n  <div #canvasContainer class=\"canvas-viewport\"></div>\n\n  <!-- Optional Top Overlay Bar -->\n  @if (showTopBar) {\n    <div class=\"viewer-top-bar\">\n      <div class=\"model-badge\">\n        <span class=\"badge-dot\" [class.active]=\"isLoaded()\"></span>\n        <span class=\"badge-title\">CLIP-EVA Robot</span>\n        <span class=\"badge-sub\">3D Viewer</span>\n      </div>\n\n      <div class=\"top-actions\">\n        <button class=\"action-btn\" (click)=\"resetCamera()\" title=\"Reset Camera\">\n          <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\">\n            <path d=\"M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.77 20 14.45 20 13c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74C4.46 10.23 4 11.55 4 13c0 4.42 3.58 8 8 8v4l5-5-5-5v4c-3.31 0-6-2.69-6-6z\"/>\n          </svg>\n          Reset View\n        </button>\n\n        <label class=\"action-btn secondary file-input-label\" title=\"Load custom GLB directly\">\n          <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\">\n            <path d=\"M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z\"/>\n          </svg>\n          Select GLB\n          <input type=\"file\" accept=\".glb,.gltf\" (change)=\"onFileSelected($event)\" class=\"hidden-file-input\" />\n        </label>\n      </div>\n    </div>\n  }\n\n  <!-- Optional Embedded Floating Control Panel -->\n  @if (showControls) {\n    <aside class=\"embedded-controls-panel\" [ngClass]=\"'pos-' + controlsPosition\">\n      <clip-eva-controls\n        [activeEmotion]=\"internalEmotion()\"\n        (emotionChange)=\"setEmotion($event)\"\n        (blinkTrigger)=\"triggerBlink()\"\n        (autoBlinkToggle)=\"setAutoBlink($event)\"\n        (hoverToggle)=\"setHoverEnabled($event)\"\n        (pulseToggle)=\"setIdlePulse($event)\"\n        (glowIntensityChange)=\"setGlowIntensity($event)\"\n        (eyeScaleChange)=\"setEyeScale($event)\"\n        (eyeSpacingChange)=\"setEyeSpacing($event)\"\n        (colorThemeChange)=\"setCustomColors($event.primary, $event.secondary)\"\n        (customImageSelect)=\"setCustomImage($event)\"\n        (visorTransformChange)=\"updateVisorTransform($event.position, $event.rotation, $event.scale)\"\n      ></clip-eva-controls>\n    </aside>\n  }\n\n  <!-- Loading State Indicator -->\n  @if (isLoading()) {\n    <div class=\"loading-overlay\">\n      <div class=\"loader-card\">\n        <div class=\"spinner\"></div>\n        <div class=\"loader-text\">Loading CLIP-EVA Model...</div>\n        @if (loadingProgress() > 0) {\n          <div class=\"progress-container\">\n            <div class=\"progress-bar\" [style.width.%]=\"loadingProgress()\"></div>\n          </div>\n          <div class=\"progress-pct\">{{ loadingProgress() }}%</div>\n        }\n        <div class=\"loader-hint\">Reading GLB geometry & shaders</div>\n      </div>\n    </div>\n  }\n\n  <!-- Error State Overlay -->\n  @if (errorMessage()) {\n    <div class=\"error-overlay\">\n      <div class=\"error-card\">\n        <div class=\"error-icon\">\u26A0\uFE0F</div>\n        <h3 class=\"error-title\">Model File Not Found</h3>\n        <p class=\"error-description\">{{ errorMessage() }}</p>\n        <div class=\"error-instruction\">\n          <div class=\"inst-step\">\n            <strong>Configured Path:</strong>\n            <code>{{ modelUrl }}</code>\n          </div>\n          <div class=\"error-actions\">\n            <button class=\"primary-btn\" (click)=\"loadModel(modelUrl)\">\n              Retry Loading\n            </button>\n            <label class=\"file-picker-btn\">\n              Choose Local GLB\n              <input type=\"file\" accept=\".glb,.gltf\" (change)=\"onFileSelected($event)\" class=\"hidden-file-input\" />\n            </label>\n          </div>\n        </div>\n      </div>\n    </div>\n  }\n\n  <!-- Optional Model Inspection HUD -->\n  @if (showHud && isLoaded() && inspectionData(); as data) {\n    <div class=\"inspection-hud\">\n      <div class=\"hud-header\">\n        <span class=\"hud-title\">\uD83D\uDCCA GLB Model Inspection</span>\n        <span class=\"hud-status\">Ready</span>\n      </div>\n      <div class=\"hud-metrics\">\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Objects</span>\n          <span class=\"chip-value\">{{ data.totalObjects }}</span>\n        </div>\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Meshes</span>\n          <span class=\"chip-value highlight\">{{ data.meshCount }}</span>\n        </div>\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Materials</span>\n          <span class=\"chip-value\">{{ data.materialCount }}</span>\n        </div>\n        <div class=\"metric-chip\">\n          <span class=\"chip-label\">Animations</span>\n          <span class=\"chip-value\">{{ data.animationCount }}</span>\n        </div>\n      </div>\n    </div>\n  }\n</div>\n", styles: [":host{display:block;width:100%;height:100%;position:relative;overflow:hidden;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;color:#f8fafc}.robot-viewer-container{width:100%;height:100%;position:relative;overflow:hidden;background:radial-gradient(circle at center,#1e293b,#0f172a)}.canvas-viewport{width:100%;height:100%;display:block;cursor:grab}.canvas-viewport:active{cursor:grabbing}.viewer-top-bar{position:absolute;top:16px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center;pointer-events:none;z-index:10}.model-badge{pointer-events:auto;display:flex;align-items:center;gap:10px;background:#0f172ad9;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);padding:8px 16px;border-radius:9999px;border:1px solid rgba(255,255,255,.1);box-shadow:0 4px 20px #0006}.badge-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;box-shadow:0 0 8px #f59e0b;transition:background .3s,box-shadow .3s}.badge-dot.active{background:#10b981;box-shadow:0 0 8px #10b981}.badge-title{font-weight:600;font-size:.9rem;letter-spacing:.02em;color:#f8fafc}.badge-sub{font-size:.75rem;color:#94a3b8;border-left:1px solid rgba(255,255,255,.15);padding-left:8px}.top-actions{pointer-events:auto;display:flex;gap:8px}.action-btn{display:inline-flex;align-items:center;gap:6px;background:#1e293bd9;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#f1f5f9;border:1px solid rgba(255,255,255,.12);padding:7px 14px;border-radius:8px;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .2s ease;-webkit-user-select:none;user-select:none}.action-btn:hover{background:#334155f2;border-color:#ffffff40;transform:translateY(-1px)}.action-btn.secondary{background:#0f172abf}.file-input-label{cursor:pointer}.hidden-file-input{display:none}.embedded-controls-panel{position:absolute;max-width:360px;width:calc(100% - 32px);z-index:15;max-height:calc(100% - 32px);overflow-y:auto}.embedded-controls-panel.pos-top-right{top:16px;right:16px}.embedded-controls-panel.pos-top-left{top:16px;left:16px}.embedded-controls-panel.pos-bottom-right{bottom:16px;right:16px}.embedded-controls-panel.pos-bottom-left{bottom:16px;left:16px}.loading-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172abf;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);z-index:20}.loader-card{display:flex;flex-direction:column;align-items:center;padding:32px 40px;background:#1e293be6;border:1px solid rgba(255,255,255,.1);border-radius:16px;box-shadow:0 20px 40px #00000080;text-align:center}.spinner{width:44px;height:44px;border:3px solid rgba(56,189,248,.2);border-top-color:#38bdf8;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:16px}@keyframes spin{to{transform:rotate(360deg)}}.loader-text{font-size:1rem;font-weight:600;color:#f8fafc;margin-bottom:8px}.progress-container{width:200px;height:6px;background:#ffffff1a;border-radius:9999px;overflow:hidden;margin-top:10px}.progress-bar{height:100%;background:linear-gradient(90deg,#38bdf8,#818cf8);transition:width .2s ease}.progress-pct{font-size:.75rem;color:#94a3b8;margin-top:4px}.loader-hint{font-size:.75rem;color:#64748b;margin-top:12px}.error-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#0f172ad9;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);z-index:20;padding:20px}.error-card{max-width:480px;width:100%;background:#1e293bf2;border:1px solid rgba(239,68,68,.3);border-radius:16px;padding:28px;box-shadow:0 20px 50px #0009;text-align:center}.error-icon{font-size:2.2rem;margin-bottom:12px}.error-title{font-size:1.15rem;font-weight:600;color:#f87171;margin:0 0 10px}.error-description{font-size:.85rem;color:#cbd5e1;line-height:1.5;margin:0 0 16px}.error-instruction{background:#0f172a99;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:14px;text-align:left}.inst-step{font-size:.82rem;color:#e2e8f0;margin-bottom:8px}.inst-step code{display:block;margin-top:4px;background:#090d16;color:#38bdf8;padding:6px 10px;border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:.8rem;border:1px solid rgba(56,189,248,.2)}.error-actions{display:flex;gap:10px;justify-content:center;margin-top:14px}.primary-btn{background:#3b82f6;color:#fff;border:none;padding:8px 18px;border-radius:8px;font-size:.82rem;font-weight:600;cursor:pointer;transition:background .2s}.primary-btn:hover{background:#2563eb}.file-picker-btn{background:#334155cc;color:#f1f5f9;border:1px solid rgba(255,255,255,.15);padding:8px 18px;border-radius:8px;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .2s}.file-picker-btn:hover{background:#475569}.inspection-hud{position:absolute;bottom:16px;right:16px;max-width:480px;background:#0f172ae0;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 18px;box-shadow:0 8px 32px #00000080;z-index:10;color:#f1f5f9}.hud-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.hud-title{font-size:.82rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8}.hud-status{font-size:.72rem;background:#10b98126;color:#34d399;border:1px solid rgba(16,185,129,.3);padding:2px 8px;border-radius:9999px;font-weight:600}.hud-metrics{display:flex;flex-wrap:wrap;gap:8px}.metric-chip{display:flex;flex-direction:column;background:#1e293bcc;border:1px solid rgba(255,255,255,.06);padding:6px 12px;border-radius:8px;min-width:68px}.chip-label{font-size:.68rem;color:#94a3b8;margin-bottom:2px}.chip-value{font-size:.92rem;font-weight:700;color:#f8fafc}.chip-value.highlight{color:#38bdf8}\n"] }]
        }], propDecorators: { modelUrl: [{
                type: Input
            }], backgroundColor: [{
                type: Input
            }], emotion: [{
                type: Input
            }], autoBlink: [{
                type: Input
            }], hoverMode: [{
                type: Input
            }], breathingPulse: [{
                type: Input
            }], glowPower: [{
                type: Input
            }], eyeScale: [{
                type: Input
            }], eyeSpacing: [{
                type: Input
            }], colorPreset: [{
                type: Input
            }], primaryColor: [{
                type: Input
            }], secondaryColor: [{
                type: Input
            }], customFaceImage: [{
                type: Input
            }], showControls: [{
                type: Input
            }], showHud: [{
                type: Input
            }], showTopBar: [{
                type: Input
            }], controlsPosition: [{
                type: Input
            }], emotionChange: [{
                type: Output
            }], modelLoaded: [{
                type: Output
            }], modelProgress: [{
                type: Output
            }], modelError: [{
                type: Output
            }], canvasContainerRef: [{
                type: ViewChild,
                args: ['canvasContainer', { static: true }]
            }] } });

/*
 * Public API Surface of clip-eva-robot
 */
// Components

/**
 * Generated bundle index. Do not edit.
 */

export { ChestLogoAnimator, ClipEvaControlsComponent, ClipEvaRobotComponent, EMOTION_PRESETS, EmotionManager, EmotionRenderer, FaceOverlay };
//# sourceMappingURL=clip-eva-robot.mjs.map
