import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xfff3c8, 1.8);
    dir.position.set(3, 4, 5);
    scene.add(dir);
    const cyan = new THREE.PointLight(0x00f0ff, 1.4);
    cyan.position.set(-4, -2, -2);
    scene.add(cyan);
    const gold = new THREE.PointLight(0xe5c158, 1.0);
    gold.position.set(4, -3, 2);
    scene.add(gold);

    // Main group (for interactive parallax)
    const group = new THREE.Group();
    scene.add(group);

    // Gold crystal
    const crystalGeo = new THREE.IcosahedronGeometry(1, 1);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x1a1308,
      metalness: 1,
      roughness: 0.18,
      emissive: 0x3a2308,
      emissiveIntensity: 0.25,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.scale.setScalar(1.55);
    group.add(crystal);

    // Wireframe
    const wireGeo = new THREE.IcosahedronGeometry(1, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe5c158,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.scale.setScalar(2.0);
    group.add(wire);

    // Rings
    const ringGeo = new THREE.TorusGeometry(1, 0.008, 16, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xe5c158,
      metalness: 1,
      roughness: 0.3,
      emissive: 0x3a2a08,
      emissiveIntensity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.scale.setScalar(2.4);
    group.add(ring1);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.scale.setScalar(2.9);
    ring2.rotation.z = Math.PI / 3;
    group.add(ring2);

    // Particles
    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.022,
      color: 0xe5c158,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Pointer parallax
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      crystal.rotation.x = t * 0.18;
      crystal.rotation.y = t * 0.22;
      crystal.position.y = Math.sin(t * 0.6) * 0.15;

      wire.rotation.x = -t * 0.13;
      wire.rotation.y = -t * 0.08;

      ring1.rotation.z = t * 0.25;
      ring1.rotation.x = Math.sin(t * 0.3) * 0.6;
      ring2.rotation.z = -t * 0.2 + Math.PI / 3;
      ring2.rotation.x = Math.sin(t * 0.3 + Math.PI / 3) * 0.6;

      particles.rotation.y = t * 0.05;

      // Parallax damping
      group.rotation.y += (pointer.x * 0.4 - group.rotation.y) * 0.04;
      group.rotation.x += (-pointer.y * 0.2 - group.rotation.x) * 0.04;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      data-testid="hero-3d-scene"
    />
  );
}
