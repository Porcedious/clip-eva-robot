import * as _angular_core from '@angular/core';
import { OnInit, OnDestroy, OnChanges, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import * as THREE from 'three';
import * as clip_eva_robot from 'clip-eva-robot';

type RobotEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'sleepy' | 'excited' | 'confused' | 'love';
type EyeShape = 'pill' | 'chevron-up' | 'chevron-down' | 'concentric-rings' | 'wide-eye' | 'crescent-c' | 'heart' | 'closed-arc' | 'narrow' | 'custom-image';
interface EmotionStyleConfig {
    primaryColor: string;
    secondaryColor: string;
    glowIntensity: number;
    leftEyeShape: EyeShape;
    rightEyeShape: EyeShape;
    eyebrowAngle: number;
    eyebrowHeight: number;
    eyeScaleX: number;
    eyeScaleY: number;
    pupilScale: number;
    customImageUrl?: string;
}
interface EmotionPreset {
    id: RobotEmotion;
    label: string;
    icon: string;
    description: string;
    config: EmotionStyleConfig;
}
interface VisorOverlayTransform {
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
    scale: {
        x: number;
        y: number;
        z: number;
    };
    curvature: number;
}
interface ColorThemePreset {
    name: string;
    primary: string;
    secondary: string;
    previewClass?: string;
}

declare class EmotionRenderer {
    private readonly canvas;
    private readonly ctx;
    readonly texture: THREE.CanvasTexture;
    private readonly width;
    private readonly height;
    private currentConfig;
    private targetConfig;
    private currentEmotion;
    private targetEmotion;
    private transitionProgress;
    private transitionDuration;
    private eyeSpacing;
    private eyeCenterY;
    private globalScale;
    private customGlowIntensity;
    private eyelidOpenness;
    private isBlinking;
    private blinkTimer;
    private blinkDuration;
    private idleTime;
    private idlePulseEnabled;
    private customImage;
    constructor(initialEmotion?: RobotEmotion);
    /**
     * Sets target emotion with smooth transition interpolation.
     */
    setEmotion(emotion: RobotEmotion, transitionSec?: number): void;
    getEmotion(): RobotEmotion;
    /**
     * Triggers a natural eyelid blink animation.
     */
    triggerBlink(): void;
    /**
     * Sets custom glow intensity multiplier.
     */
    setGlowIntensity(intensity: number): void;
    /**
     * Sets eye scale factor.
     */
    setEyeScale(scale: number): void;
    /**
     * Sets eye horizontal spacing from center.
     */
    setEyeSpacing(spacing: number): void;
    /**
     * Sets custom primary & secondary glow colors.
     */
    setCustomColors(primary: string, secondary: string): void;
    /**
     * Loads a custom image texture directly onto the face screen.
     */
    setCustomImage(imageUrl: string): void;
    setIdlePulseEnabled(enabled: boolean): void;
    /**
     * Main update tick called per frame.
     */
    update(deltaTime: number): void;
    /**
     * Interpolates numeric parameters between current and target configs.
     */
    private interpolateConfig;
    private lerp;
    /**
     * Main rendering pass onto the 2D canvas.
     */
    private render;
    /**
     * Clips the canvas to an inset dome/arch shape matching the visor cavity's
     * silhouette (narrow rounded top, wider flatter bottom). Keeps opaque
     * pixels safely inside the physical cutout at every edge so the overlay
     * blends into the cavity instead of showing a hard rectangular seam.
     */
    private clipToVisorDome;
    /**
     * Draws procedural eye graphics with neon glow & gradients.
     */
    private drawEyeShape;
    /**
     * Upward inverted-V Chevron (^^)
     */
    private drawChevronUp;
    /**
     * Concentric circular glowing rings (◎◎)
     */
    private drawConcentricRings;
    /**
     * Wide-open round startled eye: soft outer glow disc, dark iris and a
     * bright off-center highlight — a natural "O O" surprised look rather
     * than a hypnotic target/ring pattern.
     */
    private drawWideEye;
    /**
     * Horizontal C / Arch shape from reference image input_file_0.png
     */
    private drawCrescentC;
    /**
     * Rounded vertical capsule / pill eye
     */
    private drawPill;
    /**
     * Downward soft droop arc for Sad
     */
    private drawChevronDown;
    /**
     * Narrowed aggressive angled eye for Angry
     */
    private drawNarrowAngry;
    /**
     * Sleepy relaxed horizontal closed eye
     */
    private drawClosedArc;
    /**
     * Neon Glowing Heart for Love
     */
    private drawHeart;
    /**
     * Draws subtle emotive eyebrows above eyes
     */
    private drawEyebrows;
    dispose(): void;
}

interface FaceOverlayConfig {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    curvature: number;
}
declare class FaceOverlay {
    readonly group: THREE.Group;
    private mesh;
    private geometry;
    private material;
    private config;
    constructor(texture: THREE.Texture);
    private createCurvedMesh;
    /**
     * Adjusts overlay transform in real-time.
     */
    updateTransform(pos?: {
        x: number;
        y: number;
        z: number;
    }, rot?: {
        x: number;
        y: number;
        z: number;
    }, scale?: {
        x: number;
        y: number;
    }): void;
    getTransform(): {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        scale: {
            x: number;
            y: number;
            z: number;
        };
    };
    setVisible(visible: boolean): void;
    dispose(): void;
}

declare class EmotionManager {
    readonly renderer: EmotionRenderer;
    readonly overlay: FaceOverlay;
    private autoBlinkEnabled;
    private nextBlinkTime;
    private autoBlinkTimer;
    private hoverEnabled;
    private hoverTime;
    private initialModelY;
    private attachedModelGroup;
    constructor(initialEmotion?: RobotEmotion);
    /**
     * Attaches the face overlay to the robot model group and initializes hover baseline.
     */
    attachToModel(modelGroup: THREE.Group): void;
    /**
     * Updates emotion expression with smooth crossfade.
     */
    setEmotion(emotion: RobotEmotion, transitionSec?: number): void;
    getEmotion(): RobotEmotion;
    triggerBlink(): void;
    setAutoBlink(enabled: boolean): void;
    setIdlePulse(enabled: boolean): void;
    setHoverEnabled(enabled: boolean): void;
    setGlowIntensity(intensity: number): void;
    setEyeScale(scale: number): void;
    setEyeSpacing(spacing: number): void;
    setCustomColors(primary: string, secondary: string): void;
    setCustomImage(imageUrl: string): void;
    /**
     * Per-frame animation update.
     */
    update(deltaTime: number): void;
    dispose(): void;
}

interface ModelInspectionData {
    totalObjects: number;
    meshCount: number;
    materialCount: number;
    animationCount: number;
    objectNames: string[];
    boundingBoxSize?: {
        x: number;
        y: number;
        z: number;
    };
}
interface VisorTransform {
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
    scale: {
        x: number;
        y: number;
    };
}
interface RobotColorTheme {
    primary: string;
    secondary: string;
}

declare class ClipEvaRobotComponent implements OnInit, OnDestroy, OnChanges {
    private readonly platformId;
    modelUrl: string;
    backgroundColor: string;
    emotion: RobotEmotion;
    autoBlink: boolean;
    hoverMode: boolean;
    breathingPulse: boolean;
    glowPower: number;
    eyeScale: number;
    eyeSpacing: number;
    colorPreset?: string;
    primaryColor?: string;
    secondaryColor?: string;
    customFaceImage?: string;
    showControls: boolean;
    showHud: boolean;
    showTopBar: boolean;
    controlsPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    emotionChange: EventEmitter<RobotEmotion>;
    modelLoaded: EventEmitter<ModelInspectionData>;
    modelProgress: EventEmitter<number>;
    modelError: EventEmitter<string>;
    canvasContainerRef: ElementRef<HTMLDivElement>;
    readonly isLoading: _angular_core.WritableSignal<boolean>;
    readonly loadingProgress: _angular_core.WritableSignal<number>;
    readonly errorMessage: _angular_core.WritableSignal<string | null>;
    readonly inspectionData: _angular_core.WritableSignal<ModelInspectionData | null>;
    readonly isLoaded: _angular_core.WritableSignal<boolean>;
    readonly internalEmotion: _angular_core.WritableSignal<RobotEmotion>;
    private scene;
    private camera;
    private renderer;
    private controls;
    private clock;
    private animationFrameId;
    private resizeObserver;
    private currentModel;
    emotionManager: EmotionManager | null;
    private chestLogoAnimator;
    private readonly presetColorMap;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Initializes the Three.js Scene, Camera, Renderer, Controls, and Lights.
     */
    private initThreeScene;
    private applyInitialSettings;
    /**
     * Sets up 3-point studio lighting + hemisphere lighting.
     */
    private setupLighting;
    /**
     * Adds ground shadow receiver floor and subtle grid.
     */
    private setupGroundStage;
    /**
     * Loads the GLB model using GLTFLoader.
     */
    loadModel(url: string): void;
    private fitCameraToModel;
    private inspectAndLogGLTF;
    setEmotion(emotion: RobotEmotion, transitionSec?: number): void;
    triggerBlink(): void;
    blink(): void;
    setAutoBlink(enabled: boolean): void;
    setHoverEnabled(enabled: boolean): void;
    setIdlePulse(enabled: boolean): void;
    setGlowIntensity(intensity: number): void;
    setEyeScale(scale: number): void;
    setEyeSpacing(spacing: number): void;
    setCustomColors(primary: string, secondary: string): void;
    setCustomImage(imageUrl: string): void;
    updateVisorTransform(pos?: {
        x: number;
        y: number;
        z: number;
    }, rot?: {
        x: number;
        y: number;
        z: number;
    }, scale?: {
        x: number;
        y: number;
    }): void;
    onFileSelected(event: Event): void;
    resetCamera(): void;
    private setupResizeObserver;
    private onResize;
    private animate;
    private cleanupThreeResources;
    private disposeObject;
    private disposeMaterial;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ClipEvaRobotComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<ClipEvaRobotComponent, "clip-eva-robot", never, { "modelUrl": { "alias": "modelUrl"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "emotion": { "alias": "emotion"; "required": false; }; "autoBlink": { "alias": "autoBlink"; "required": false; }; "hoverMode": { "alias": "hoverMode"; "required": false; }; "breathingPulse": { "alias": "breathingPulse"; "required": false; }; "glowPower": { "alias": "glowPower"; "required": false; }; "eyeScale": { "alias": "eyeScale"; "required": false; }; "eyeSpacing": { "alias": "eyeSpacing"; "required": false; }; "colorPreset": { "alias": "colorPreset"; "required": false; }; "primaryColor": { "alias": "primaryColor"; "required": false; }; "secondaryColor": { "alias": "secondaryColor"; "required": false; }; "customFaceImage": { "alias": "customFaceImage"; "required": false; }; "showControls": { "alias": "showControls"; "required": false; }; "showHud": { "alias": "showHud"; "required": false; }; "showTopBar": { "alias": "showTopBar"; "required": false; }; "controlsPosition": { "alias": "controlsPosition"; "required": false; }; }, { "emotionChange": "emotionChange"; "modelLoaded": "modelLoaded"; "modelProgress": "modelProgress"; "modelError": "modelError"; }, never, never, true, never>;
}

declare class ClipEvaControlsComponent {
    activeEmotion: RobotEmotion;
    emotionChange: EventEmitter<RobotEmotion>;
    blinkTrigger: EventEmitter<void>;
    autoBlinkToggle: EventEmitter<boolean>;
    hoverToggle: EventEmitter<boolean>;
    pulseToggle: EventEmitter<boolean>;
    glowIntensityChange: EventEmitter<number>;
    eyeScaleChange: EventEmitter<number>;
    eyeSpacingChange: EventEmitter<number>;
    colorThemeChange: EventEmitter<{
        primary: string;
        secondary: string;
    }>;
    customImageSelect: EventEmitter<string>;
    visorTransformChange: EventEmitter<{
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        scale: {
            x: number;
            y: number;
        };
    }>;
    readonly emotionList: clip_eva_robot.EmotionPreset[];
    readonly autoBlink: _angular_core.WritableSignal<boolean>;
    readonly hoverEnabled: _angular_core.WritableSignal<boolean>;
    readonly pulseEnabled: _angular_core.WritableSignal<boolean>;
    readonly glowIntensity: _angular_core.WritableSignal<number>;
    readonly eyeScale: _angular_core.WritableSignal<number>;
    readonly eyeSpacing: _angular_core.WritableSignal<number>;
    readonly isTuningOpen: _angular_core.WritableSignal<boolean>;
    readonly visorPosX: _angular_core.WritableSignal<number>;
    readonly visorPosY: _angular_core.WritableSignal<number>;
    readonly visorPosZ: _angular_core.WritableSignal<number>;
    readonly visorRotX: _angular_core.WritableSignal<number>;
    readonly visorScaleX: _angular_core.WritableSignal<number>;
    readonly visorScaleY: _angular_core.WritableSignal<number>;
    readonly colorThemes: ColorThemePreset[];
    selectEmotion(emotion: RobotEmotion): void;
    onTriggerBlink(): void;
    onAutoBlinkToggle(): void;
    onHoverToggle(): void;
    onPulseToggle(): void;
    onGlowChange(value: number): void;
    onScaleChange(value: number): void;
    onSpacingChange(value: number): void;
    onThemeSelect(theme: ColorThemePreset): void;
    onCustomFileSelected(event: Event): void;
    toggleTuning(): void;
    emitVisorTransform(): void;
    onVisorPosXChange(val: number): void;
    onVisorPosYChange(val: number): void;
    onVisorPosZChange(val: number): void;
    onVisorRotXChange(val: number): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ClipEvaControlsComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<ClipEvaControlsComponent, "clip-eva-controls", never, { "activeEmotion": { "alias": "activeEmotion"; "required": true; }; }, { "emotionChange": "emotionChange"; "blinkTrigger": "blinkTrigger"; "autoBlinkToggle": "autoBlinkToggle"; "hoverToggle": "hoverToggle"; "pulseToggle": "pulseToggle"; "glowIntensityChange": "glowIntensityChange"; "eyeScaleChange": "eyeScaleChange"; "eyeSpacingChange": "eyeSpacingChange"; "colorThemeChange": "colorThemeChange"; "customImageSelect": "customImageSelect"; "visorTransformChange": "visorTransformChange"; }, never, never, true, never>;
}

declare const EMOTION_PRESETS: Record<RobotEmotion, EmotionPreset>;

declare class ChestLogoAnimator {
    readonly mesh: THREE.Mesh;
    private readonly canvas;
    private readonly ctx;
    private readonly texture;
    private elapsed;
    private readonly drawScale;
    private readonly drawX;
    private readonly drawY;
    constructor();
    update(deltaTime: number): void;
    private drawPatchBackground;
    private render;
    /** Layered glow + rim + dark-fill treatment matching the CLIP letters in the source SVG. */
    private strokeGlowRimFill;
    dispose(): void;
}

export { ChestLogoAnimator, ClipEvaControlsComponent, ClipEvaRobotComponent, EMOTION_PRESETS, EmotionManager, EmotionRenderer, FaceOverlay };
export type { ColorThemePreset, EmotionPreset, EmotionStyleConfig, EyeShape, FaceOverlayConfig, ModelInspectionData, RobotColorTheme, RobotEmotion, VisorOverlayTransform, VisorTransform };
