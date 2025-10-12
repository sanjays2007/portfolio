// particle-background.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { createNoise3D, createNoise4D } from 'https://cdn.skypack.dev/simplex-noise@4.0.1';

class ParticleBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        this.composer = null;
        this.bloomPass = null;
        this.noise3D = null;
        this.noise4D = null;
        this.isInitialized = false;
        
        this.config = {
            particleCount: 5000,
            bloomStrength: 1.0,
            bloomRadius: 0.5,
            bloomThreshold: 0.1,
            starCount: 6000
        };
    }

    async init() {
        this.clock = new THREE.Clock();
        this.noise3D = createNoise3D(() => Math.random());
        this.noise4D = createNoise4D(() => Math.random());
        
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000308, 0.01);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 50);

        const canvas = document.getElementById('webglCanvas');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        this.setupPostProcessing();
        this.createStarfield();
        this.createFloatingParticles();

        window.addEventListener('resize', () => this.onResize());
        
        this.isInitialized = true;
        this.animate();
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), 
            this.config.bloomStrength, 
            this.config.bloomRadius, 
            this.config.bloomThreshold
        );
        this.composer.addPass(this.bloomPass);
    }

    createStarfield() {
        const starVertices = [];
        const starSizes = [];
        const starColors = [];
        const starGeometry = new THREE.BufferGeometry();
        
        for (let i = 0; i < this.config.starCount; i++) {
            const x = THREE.MathUtils.randFloatSpread(1000);
            const y = THREE.MathUtils.randFloatSpread(1000);
            const z = THREE.MathUtils.randFloatSpread(500);
            
            starVertices.push(x, y, z);
            starSizes.push(Math.random() * 0.4 + 0.1);
            
            const color = new THREE.Color();
            if (Math.random() < 0.1) {
                color.setHSL(0.5 + Math.random() * 0.1, 0.6, 0.5);
            } else {
                color.setHSL(0.6, Math.random() * 0.1, 0.8 + Math.random() * 0.2);
            }
            starColors.push(color.r, color.g, color.b);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
        
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.createStarTexture() }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    float alpha = texture2D(pointTexture, gl_PointCoord).a;
                    if (alpha < 0.1) discard;
                    gl_FragColor = vec4(vColor, alpha * 0.4);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });
        
        this.scene.add(new THREE.Points(starGeometry, starMaterial));
    }

    createFloatingParticles() {
        const particleVertices = [];
        const particleSizes = [];
        const particleColors = [];
        const particleGeometry = new THREE.BufferGeometry();
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const x = THREE.MathUtils.randFloatSpread(800);
            const y = THREE.MathUtils.randFloatSpread(800);
            const z = THREE.MathUtils.randFloatSpread(400);
            
            particleVertices.push(x, y, z);
            particleSizes.push(Math.random() * 0.8 + 0.2);
            
            const color = new THREE.Color();
            if (Math.random() < 0.2) {
                color.setHSL(0.5, 0.6, 0.4);
            } else {
                color.setHSL(0.6, 0.1, 0.7);
            }
            particleColors.push(color.r, color.g, color.b);
        }
        
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
        particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
        particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
        
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.createStarTexture() },
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                uniform float time;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    pos.x += sin(time * 0.2 + position.y * 0.005) * 1.0;
                    pos.y += cos(time * 0.15 + position.x * 0.005) * 0.8;
                    pos.z += sin(time * 0.1 + position.x * 0.003) * 0.5;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (120.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    float alpha = texture2D(pointTexture, gl_PointCoord).a;
                    if (alpha < 0.1) discard;
                    gl_FragColor = vec4(vColor, alpha * 0.3);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        });
        
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particleSystem);
        
        this.floatingParticles = { geometry: particleGeometry, material: particleMaterial };
    }

    createStarTexture() {
        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');
        
        const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);
        
        return new THREE.CanvasTexture(canvas);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (!this.isInitialized) return;
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update floating particles
        if (this.floatingParticles) {
            this.floatingParticles.material.uniforms.time.value = elapsedTime;
        }
        
        // Very subtle camera movement
        this.camera.position.x = Math.sin(elapsedTime * 0.03) * 1.5;
        this.camera.position.y = Math.cos(elapsedTime * 0.05) * 1.0;
        this.camera.lookAt(this.scene.position);
        
        this.composer.render();
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Export for use
window.ParticleBackground = ParticleBackground;
