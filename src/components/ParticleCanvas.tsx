import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MeshData {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  noiseSeed: number;
}

export default function ParticleCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Get initial dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene, Camera, and Renderer Setup
    const scene = new THREE.Scene();

    // Perspective camera for natural 3D depth
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Industrial Lighting setup for rich metallic highlights
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Warm golden furnace glow from bottom-left
    const goldLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    goldLight.position.set(-15, -10, 10);
    scene.add(goldLight);

    // Cool electric arc-welding blue light from top-right
    const blueLight = new THREE.DirectionalLight(0x4c8cf5, 3.0);
    blueLight.position.set(15, 15, 12);
    scene.add(blueLight);

    // Dynamic mouse-following point light for interactive specular reflections
    const mouseLight = new THREE.PointLight(0xe5c158, 4.5, 20);
    mouseLight.position.set(0, 0, 5);
    scene.add(mouseLight);

    // 3. Create Metallic Geometries & Materials
    // We create realistic looking scrap metal shapes
    const geometries: THREE.BufferGeometry[] = [
      // Hex Nut / Washer (Torus with low segments)
      new THREE.TorusGeometry(0.7, 0.22, 6, 6),
      // Steel Rod / Rebar Piece
      new THREE.CylinderGeometry(0.06, 0.06, 3.0, 5),
      // Thin metal sheets / plates
      new THREE.BoxGeometry(1.4, 1.4, 0.04),
      // Angled scrap iron chunks
      new THREE.DodecahedronGeometry(0.7),
      new THREE.IcosahedronGeometry(0.65),
      // Steel Pipes
      new THREE.CylinderGeometry(0.3, 0.3, 2.2, 8, 1, true),
    ];

    const materials: THREE.MeshStandardMaterial[] = [
      // Polished Premium Gold / Brass scrap
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.95,
        roughness: 0.18,
      }),
      // Heavy Steel Gray
      new THREE.MeshStandardMaterial({
        color: 0x8a8d9b,
        metalness: 0.98,
        roughness: 0.22,
      }),
      // Raw Dark Carbon Iron
      new THREE.MeshStandardMaterial({
        color: 0x22242a,
        metalness: 0.95,
        roughness: 0.3,
      }),
      // Oxidized Copper / Industrial Rust accent
      new THREE.MeshStandardMaterial({
        color: 0xa85d38,
        metalness: 0.85,
        roughness: 0.45,
      }),
    ];

    // Keep track of mesh instances for cleanup and updates
    const meshesData: MeshData[] = [];
    const itemCount = 38;

    // Spawn 3D particles in a bounding volume
    for (let i = 0; i < itemCount; i++) {
      const geomIdx = Math.floor(Math.random() * geometries.length);
      const matIdx = Math.floor(Math.random() * materials.length);

      const mesh = new THREE.Mesh(geometries[geomIdx], materials[matIdx]);

      // Random initial distribution in a 3D volume
      mesh.position.set(
        (Math.random() - 0.5) * 32, // x
        (Math.random() - 0.5) * 22, // y
        (Math.random() - 0.5) * 16 - 2 // z
      );

      // Random orientations
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      scene.add(mesh);

      meshesData.push({
        mesh,
        // Drifting velocities
        vx: (Math.random() - 0.5) * 0.015,
        vy: 0.006 + Math.random() * 0.012, // slow upward drift
        vz: (Math.random() - 0.5) * 0.008,
        // Rotational velocities
        rx: (Math.random() - 0.5) * 0.01,
        ry: (Math.random() - 0.5) * 0.01,
        rz: (Math.random() - 0.5) * 0.01,
        noiseSeed: Math.random() * 100,
      });
    }

    // 4. Background Sparks / Floating Steel Dust (glowing gold points)
    const sparkCount = 180;
    const sparksGeometry = new THREE.BufferGeometry();
    const sparksPositions = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      sparksPositions[i * 3] = (Math.random() - 0.5) * 36;
      sparksPositions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      sparksPositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
    }

    sparksGeometry.setAttribute('position', new THREE.BufferAttribute(sparksPositions, 3));

    const sparksMaterial = new THREE.PointsMaterial({
      color: 0xe5c158, // warm bright golden ember
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sparks = new THREE.Points(sparksGeometry, sparksMaterial);
    scene.add(sparks);

    // 5. Interaction variables
    const mouse = new THREE.Vector2(0, 0);
    const targetCameraPos = new THREE.Vector3(0, 0, 22);
    let isMouseActive = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Normalize coordinate: -1 to +1
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      isMouseActive = true;
    };

    const onMouseLeave = () => {
      isMouseActive = false;
      mouse.set(0, 0);
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // 6. Resize Observer to perfectly adapt to layout
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      width = entry.contentRect.width;
      height = entry.contentRect.height;

      // Update camera and renderer
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // 7. Core Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smoothly tilt camera based on mouse for premium parallax effect
      if (isMouseActive) {
        targetCameraPos.x = mouse.x * 3.5;
        targetCameraPos.y = mouse.y * 2.5;
      } else {
        // Slow automatic orbit sway when idle
        targetCameraPos.x = Math.sin(elapsed * 0.3) * 1.5;
        targetCameraPos.y = Math.cos(elapsed * 0.2) * 1.0;
      }
      camera.position.x += (targetCameraPos.x - camera.position.x) * 0.05;
      camera.position.y += (targetCameraPos.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -2);

      // Track mouse light position relative to cursor
      if (isMouseActive) {
        // Map normalized coordinates to screen-space boundaries at z=5
        const targetLightX = mouse.x * 16;
        const targetLightY = mouse.y * 11;
        mouseLight.position.x += (targetLightX - mouseLight.position.x) * 0.1;
        mouseLight.position.y += (targetLightY - mouseLight.position.y) * 0.1;
        mouseLight.intensity = 5.0 + Math.sin(elapsed * 5.0) * 0.5; // subtle flickering weld glow
      } else {
        // Circle around center when mouse is inactive
        mouseLight.position.x = Math.sin(elapsed * 0.8) * 6;
        mouseLight.position.y = Math.cos(elapsed * 0.6) * 4;
        mouseLight.intensity = 2.5;
      }

      // Update 3D scrap metal meshes
      meshesData.forEach((data) => {
        const { mesh, vx, vy, vz, rx, ry, rz, noiseSeed } = data;

        // Apply velocities
        mesh.position.x += vx;
        mesh.position.y += vy;
        mesh.position.z += vz;

        // Apply rotations
        mesh.rotation.x += rx;
        mesh.rotation.y += ry;
        mesh.rotation.z += rz;

        // Wave motion to simulate natural floating draft
        mesh.position.x += Math.sin(elapsed * 0.4 + noiseSeed) * 0.003;

        // Mouse reaction: subtle repulsion force
        if (isMouseActive) {
          const dx = mesh.position.x - mouseLight.position.x;
          const dy = mesh.position.y - mouseLight.position.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 49) { // within 7 units radius
            const dist = Math.sqrt(distSq);
            const force = (7 - dist) * 0.004;
            mesh.position.x += (dx / (dist || 1)) * force;
            mesh.position.y += (dy / (dist || 1)) * force;
          }
        }

        // Bounding volume wrapping logic (with margins to prevent sudden popping)
        if (mesh.position.y > 15) {
          mesh.position.y = -15;
          mesh.position.x = (Math.random() - 0.5) * 32;
          mesh.position.z = (Math.random() - 0.5) * 16 - 2;
        }
        if (mesh.position.x > 20) mesh.position.x = -20;
        if (mesh.position.x < -20) mesh.position.x = 20;
        if (mesh.position.z > 8) mesh.position.z = -10;
        if (mesh.position.z < -18) mesh.position.z = 5;
      });

      // Update Floating Sparks position array
      const positions = sparksGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        const idx = i * 3;
        // Float upward and sway sideways
        positions[idx + 1] += 0.022 + Math.sin(elapsed + i) * 0.005;
        positions[idx] += Math.sin(elapsed * 0.3 + i) * 0.004;

        // Wrap sparks when they drift off screen
        if (positions[idx + 1] > 14) {
          positions[idx + 1] = -14;
          positions[idx] = (Math.random() - 0.5) * 36;
          positions[idx + 2] = (Math.random() - 0.5) * 20 - 4;
        }
      }
      sparksGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Robust Memory Disposal and Event Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container) {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseleave', onMouseLeave);
      }
      scene.clear();
      renderer.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      sparksGeometry.dispose();
      sparksMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="three-particle-container"
      className="absolute inset-0 w-full h-full pointer-events-auto select-none opacity-85"
    >
      <canvas
        ref={canvasRef}
        id="three-particle-canvas"
        className="w-full h-full block"
      />
    </div>
  );
}
