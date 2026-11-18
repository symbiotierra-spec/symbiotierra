/**
 * ═══════════════════════════════════════════════════════════════════
 * SYMBIOTIERRA – 3D INTERACTIVE DRONE VIEWER (ECO-ENJAMBRE V3)
 * Three.js Procedural PBR Model featuring Official SymbioTierra Branding
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
    const container = document.getElementById('drone3dContainer');
    if (!container) return;

    // Check WebGL availability
    if (!window.WebGLRenderingContext) {
        container.innerHTML = '<div style="color:#fff;text-align:center;padding:4rem;">Tu navegador no soporta WebGL.</div>';
        return;
    }

    // ─── SCENE, CAMERA & RENDERER SETUP ────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e14, 0.025);

    const camera = new THREE.PerspectiveCamera(
        42,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(22, 14, 26);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 7;
    controls.maxDistance = 55;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // ─── LIGHTING ──────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Main Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(20, 30, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 80;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Green EcoTech Rim Light (#2FA84F)
    const greenRim = new THREE.DirectionalLight(0x2FA84F, 2.4);
    greenRim.position.set(-25, 10, -25);
    scene.add(greenRim);

    // Blue Tech Fill Light (#1E6FEB)
    const blueFill = new THREE.DirectionalLight(0x1E6FEB, 1.8);
    blueFill.position.set(20, -10, -15);
    scene.add(blueFill);

    // Ground Soft Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(60, 60);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -6.2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Ground Tech Grid Plane
    const gridHelper = new THREE.GridHelper(50, 40, 0x2FA84F, 0x1E2430);
    gridHelper.position.y = -6.19;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // ─── PROCEDURAL TEXTURE GENERATORS (SYMBIOTIERRA BRANDING) ─────
    
    /**
     * Generates a high-res circular badge texture featuring the official
     * SymbioTierra leaf icon, white center vein, blue droplet and typography.
     */
    function createSymbioTierraLogoTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Dark carbon disc background
        ctx.fillStyle = '#0f141c';
        ctx.beginPath();
        ctx.arc(512, 512, 500, 0, Math.PI * 2);
        ctx.fill();

        // Carbon weave pattern simulation
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 1024; i += 16) {
            ctx.beginPath();
            ctx.moveTo(i, 0); ctx.lineTo(i, 1024);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i); ctx.lineTo(1024, i);
            ctx.stroke();
        }

        // Green corporate outer border ring
        ctx.lineWidth = 32;
        ctx.strokeStyle = '#2FA84F';
        ctx.stroke();

        // Blue inner tech accent ring
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#1E6FEB';
        ctx.beginPath();
        ctx.arc(512, 512, 455, 0, Math.PI * 2);
        ctx.stroke();

        // Official SymbioTierra Leaf Icon
        ctx.save();
        ctx.translate(325, 240);
        ctx.scale(3.4, 3.4);

        // Leaf Body (Verde Clorofila #2FA84F)
        ctx.fillStyle = '#2FA84F';
        ctx.beginPath();
        ctx.moveTo(22, 105);
        ctx.bezierCurveTo(8, 72, 16, 32, 60, 16);
        ctx.bezierCurveTo(96, 2, 116, 14, 118, 16);
        ctx.bezierCurveTo(114, 45, 92, 96, 46, 109);
        ctx.bezierCurveTo(36, 112, 25, 111, 22, 105);
        ctx.closePath();
        ctx.fill();

        // White Center Vein
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(32, 94);
        ctx.quadraticCurveTo(64, 64, 94, 36);
        ctx.stroke();

        // Blue Apex Droplet (#1E6FEB)
        ctx.fillStyle = '#1E6FEB';
        ctx.beginPath();
        ctx.arc(120, 16, 11.5, 0, Math.PI * 2);
        ctx.fill();

        // Specular reflection highlight on droplet
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(117.5, 13.5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Wordmark: "Symbio" (white) + "Tierra" (chlorophyl green)
        ctx.font = 'bold 94px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Symbio', 415, 760);
        ctx.fillStyle = '#2FA84F';
        ctx.fillText('Tierra', 655, 760);

        // Subtitle badge: ECO-ENJAMBRE V3
        ctx.font = '700 38px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('ECO-ENJAMBRE V3 · AUTONOMOUS', 512, 850);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 8;
        return texture;
    }

    /**
     * Generates lateral decal textures for the left and right flanks
     */
    function createLateralDecalTexture(side) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Dark plate background with green border
        ctx.fillStyle = '#11161d';
        ctx.fillRect(0, 0, 1024, 256);

        ctx.strokeStyle = '#2FA84F';
        ctx.lineWidth = 8;
        ctx.strokeRect(8, 8, 1008, 240);

        // Icon at left
        ctx.save();
        ctx.translate(40, 25);
        ctx.scale(1.7, 1.7);
        ctx.fillStyle = '#2FA84F';
        ctx.beginPath();
        ctx.moveTo(22, 105);
        ctx.bezierCurveTo(8, 72, 16, 32, 60, 16);
        ctx.bezierCurveTo(96, 2, 116, 14, 118, 16);
        ctx.bezierCurveTo(114, 45, 92, 96, 46, 109);
        ctx.bezierCurveTo(36, 112, 25, 111, 22, 105);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(32, 94);
        ctx.quadraticCurveTo(64, 64, 94, 36);
        ctx.stroke();

        ctx.fillStyle = '#1E6FEB';
        ctx.beginPath();
        ctx.arc(120, 16, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Text branding
        ctx.font = 'bold 84px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Symbio', 300, 130);
        ctx.fillStyle = '#2FA84F';
        ctx.fillText('Tierra', 590, 130);

        ctx.font = '700 40px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('ECO-ENJAMBRE V3', 300, 195);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 4;
        return texture;
    }

    // ─── MATERIALS PALETTE ─────────────────────────────────────────
    const matGraphiteCarbon = new THREE.MeshStandardMaterial({
        color: 0x1a1e24,
        metalness: 0.85,
        roughness: 0.25
    });

    const matChlorophylGreen = new THREE.MeshStandardMaterial({
        color: 0x2FA84F,
        metalness: 0.5,
        roughness: 0.35
    });

    const matDarkArmor = new THREE.MeshStandardMaterial({
        color: 0x11151a,
        metalness: 0.9,
        roughness: 0.2
    });

    const matCarbonTube = new THREE.MeshStandardMaterial({
        color: 0x0d1014,
        metalness: 0.9,
        roughness: 0.3
    });

    const matGreenGlow = new THREE.MeshStandardMaterial({
        color: 0x4ade80,
        emissive: 0x2FA84F,
        emissiveIntensity: 1.8,
        metalness: 0.2,
        roughness: 0.3
    });

    const matBlueGlow = new THREE.MeshStandardMaterial({
        color: 0x60a5fa,
        emissive: 0x1E6FEB,
        emissiveIntensity: 1.8,
        metalness: 0.2,
        roughness: 0.2
    });

    const matCanopyGlass = new THREE.MeshPhysicalMaterial({
        color: 0x15202b,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.75,
        transparent: true,
        opacity: 0.85
    });

    const matCapsuleGlass = new THREE.MeshPhysicalMaterial({
        color: 0x2FA84F,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.8,
        transparent: true,
        opacity: 0.7
    });

    // ─── DRONE ASSEMBLY GROUP ──────────────────────────────────────
    const droneGroup = new THREE.Group();
    scene.add(droneGroup);

    // 1. MAIN FUSELAGE / BODY
    const fuselageGroup = new THREE.Group();

    // Central Hexagonal Body Hull
    const bodyGeo = new THREE.CylinderGeometry(3.6, 4.2, 2.2, 6);
    bodyGeo.rotateY(Math.PI / 6);
    const bodyMesh = new THREE.Mesh(bodyGeo, matGraphiteCarbon);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    fuselageGroup.add(bodyMesh);

    // Top Upper Canopy (Elongated aerodynamic cover)
    const canopyGeo = new THREE.ConeGeometry(3.5, 1.4, 6);
    canopyGeo.rotateY(Math.PI / 6);
    const canopyMesh = new THREE.Mesh(canopyGeo, matDarkArmor);
    canopyMesh.position.y = 1.7;
    canopyMesh.castShadow = true;
    fuselageGroup.add(canopyMesh);

    // Green Accent Side Fairings
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const plateGeo = new THREE.BoxGeometry(0.3, 1.6, 2.8);
        const plateMesh = new THREE.Mesh(plateGeo, matChlorophylGreen);
        plateMesh.position.set(Math.cos(angle) * 3.8, 0, Math.sin(angle) * 3.8);
        plateMesh.rotation.y = -angle;
        plateMesh.castShadow = true;
        fuselageGroup.add(plateMesh);
    }

    // Front Nose / Canopy Glass Sensor Window
    const noseGeo = new THREE.BoxGeometry(2.4, 1.2, 2.6);
    const noseMesh = new THREE.Mesh(noseGeo, matCanopyGlass);
    noseMesh.position.set(0, 0.4, 3.2);
    fuselageGroup.add(noseMesh);

    // ─── OFFICIAL SYMBIOTIERRA LOGO EMBLEM ON TOP DECK ───────────────
    // 1. Textured Circular Canopy Emblem Plate
    const logoTexture = createSymbioTierraLogoTexture();
    const logoMat = new THREE.MeshStandardMaterial({
        map: logoTexture,
        roughness: 0.25,
        metalness: 0.4
    });
    const logoPlateGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.12, 32);
    const logoPlate = new THREE.Mesh(logoPlateGeo, logoMat);
    logoPlate.position.set(0, 2.45, 0);
    // Orient texture facing forward
    logoPlate.rotation.y = -Math.PI / 2;
    fuselageGroup.add(logoPlate);

    // 2. Physical 3D Embossed SymbioTierra Icon (Leaf & Blue Droplet)
    const icon3DGroup = new THREE.Group();
    icon3DGroup.position.set(0, 2.54, 0);
    icon3DGroup.rotation.x = -Math.PI / 2;
    icon3DGroup.rotation.z = Math.PI / 4;

    // 3D Leaf Extrusion
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, -0.6);
    leafShape.bezierCurveTo(-0.7, 0.2, -0.8, 1.2, 0, 1.8);
    leafShape.bezierCurveTo(0.8, 1.5, 1.1, 0.6, 0, -0.6);

    const extrudeSettings = {
        depth: 0.14,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.04,
        bevelThickness: 0.04
    };
    const leaf3DGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
    const leaf3DMesh = new THREE.Mesh(leaf3DGeo, matChlorophylGreen);
    leaf3DMesh.scale.set(0.65, 0.65, 0.65);
    icon3DGroup.add(leaf3DMesh);

    // White Center Vein on 3D Leaf
    const veinGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8);
    const veinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 });
    const veinMesh = new THREE.Mesh(veinGeo, veinMat);
    veinMesh.position.set(0.04, 0.35, 0.16);
    veinMesh.rotation.z = 0.08;
    icon3DGroup.add(veinMesh);

    // Blue Technological Droplet (#1E6FEB) Sphere at Apex
    const apexDropletGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const apexDropletMesh = new THREE.Mesh(apexDropletGeo, matBlueGlow);
    apexDropletMesh.position.set(0.02, 1.25, 0.14);
    icon3DGroup.add(apexDropletMesh);

    fuselageGroup.add(icon3DGroup);

    // 3. Lateral Fuselage Branding Decals (Left & Right Flanks)
    const lateralTexL = createLateralDecalTexture('left');
    const lateralMatL = new THREE.MeshStandardMaterial({ map: lateralTexL, roughness: 0.3, metalness: 0.5 });
    const decalGeoL = new THREE.PlaneGeometry(3.6, 0.9);
    const decalMeshL = new THREE.Mesh(decalGeoL, lateralMatL);
    decalMeshL.position.set(-3.85, 0.2, 0);
    decalMeshL.rotation.y = -Math.PI / 2;
    fuselageGroup.add(decalMeshL);

    const lateralTexR = createLateralDecalTexture('right');
    const lateralMatR = new THREE.MeshStandardMaterial({ map: lateralTexR, roughness: 0.3, metalness: 0.5 });
    const decalMeshR = new THREE.Mesh(decalGeoL, lateralMatR);
    decalMeshR.position.set(3.85, 0.2, 0);
    decalMeshR.rotation.y = Math.PI / 2;
    fuselageGroup.add(decalMeshR);

    droneGroup.add(fuselageGroup);

    // 2. SIX HEXACOPTER ARMS & MOTORS
    const armPropellers = [];
    const armCount = 6;
    const armLength = 9.5;

    for (let i = 0; i < armCount; i++) {
        const angle = (i * 2 * Math.PI) / armCount;
        const armGroup = new THREE.Group();

        // Carbon Fiber Tubular Boom
        const boomGeo = new THREE.CylinderGeometry(0.32, 0.32, armLength, 12);
        boomGeo.rotateZ(Math.PI / 2);
        const boomMesh = new THREE.Mesh(boomGeo, matCarbonTube);
        boomMesh.position.x = armLength / 2;
        boomMesh.castShadow = true;
        armGroup.add(boomMesh);

        // Arm Root Reinforcement Collar (Green anodized)
        const collarGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 12);
        collarGeo.rotateZ(Math.PI / 2);
        const collarMesh = new THREE.Mesh(collarGeo, matChlorophylGreen);
        collarMesh.position.x = 2.4;
        collarMesh.castShadow = true;
        armGroup.add(collarMesh);

        // Motor Nacelle Bell (At the tip of the arm)
        const nacelleGeo = new THREE.CylinderGeometry(1.0, 0.9, 1.2, 16);
        const nacelleMesh = new THREE.Mesh(nacelleGeo, matDarkArmor);
        nacelleMesh.position.set(armLength, 0.4, 0);
        nacelleMesh.castShadow = true;
        armGroup.add(nacelleMesh);

        // Motor Green LED Ring (#4ade80 emissive)
        const ringGeo = new THREE.TorusGeometry(0.95, 0.08, 8, 24);
        ringGeo.rotateX(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeo, matGreenGlow);
        ringMesh.position.set(armLength, -0.1, 0);
        armGroup.add(ringMesh);

        // Propeller Hub
        const hubGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 12);
        const hubMesh = new THREE.Mesh(hubGeo, matChlorophylGreen);
        hubMesh.position.set(armLength, 1.1, 0);

        // Propeller Rotor Blades (Dual Carbon Blade)
        const propGroup = new THREE.Group();
        propGroup.position.set(armLength, 1.2, 0);

        const bladeGeo = new THREE.BoxGeometry(7.2, 0.06, 0.55);
        const bladeMesh = new THREE.Mesh(bladeGeo, matCarbonTube);
        bladeMesh.castShadow = true;
        propGroup.add(bladeMesh);

        // Green blade tip accents
        const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.56), matChlorophylGreen);
        tipL.position.x = 3.2;
        propGroup.add(tipL);

        const tipR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.56), matChlorophylGreen);
        tipR.position.x = -3.2;
        propGroup.add(tipR);

        armGroup.add(propGroup);
        armPropellers.push({ group: propGroup, speed: (i % 2 === 0 ? 1 : -1) });

        armGroup.rotation.y = angle;
        droneGroup.add(armGroup);
    }

    // 3. FRONT GIMBAL & HYPERSPECTRAL CAMERA PAYLOAD
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(0, -1.6, 2.6);

    // Gimbal Yoke U-bracket
    const bracketGeo = new THREE.TorusGeometry(1.2, 0.18, 8, 16, Math.PI);
    bracketGeo.rotateX(Math.PI / 2);
    const bracketMesh = new THREE.Mesh(bracketGeo, matDarkArmor);
    gimbalGroup.add(bracketMesh);

    // Camera Sphere / Cylinder Housing
    const camGeo = new THREE.BoxGeometry(1.6, 1.6, 2.0);
    const camMesh = new THREE.Mesh(camGeo, matGraphiteCarbon);
    camMesh.position.y = -0.8;
    camMesh.castShadow = true;
    gimbalGroup.add(camMesh);

    // Multi-spectral Lenses (Main + 3 auxiliary lenses)
    const mainLens = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 16), matBlueGlow);
    mainLens.rotateX(Math.PI / 2);
    mainLens.position.set(0.35, -0.8, 1.05);
    gimbalGroup.add(mainLens);

    const auxLens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16), matGreenGlow);
    auxLens1.rotateX(Math.PI / 2);
    auxLens1.position.set(-0.4, -0.6, 1.05);
    gimbalGroup.add(auxLens1);

    const auxLens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16), matDarkArmor);
    auxLens2.rotateX(Math.PI / 2);
    auxLens2.position.set(-0.4, -1.05, 1.05);
    gimbalGroup.add(auxLens2);

    droneGroup.add(gimbalGroup);

    // 4. BELLY BIO-CAPSULE DISPENSER BAY & CARTRIDGES
    const dispenserBay = new THREE.Group();
    dispenserBay.position.set(0, -1.6, -1.0);

    // Outer Bay Container Frame
    const bayFrameGeo = new THREE.BoxGeometry(3.2, 1.5, 3.6);
    const bayFrame = new THREE.Mesh(bayFrameGeo, matDarkArmor);
    dispenserBay.add(bayFrame);

    // Transparent inspection window on both flanks
    const windowGeo = new THREE.PlaneGeometry(3.4, 1.1);
    const windowL = new THREE.Mesh(windowGeo, matCanopyGlass);
    windowL.rotateY(Math.PI / 2);
    windowL.position.x = 1.62;
    dispenserBay.add(windowL);

    const windowR = new THREE.Mesh(windowGeo, matCanopyGlass);
    windowR.rotateY(-Math.PI / 2);
    windowR.position.x = -1.62;
    dispenserBay.add(windowR);

    // Internal Glowing Bio-Capsule Canisters (4 visible cartridges)
    for (let c = 0; c < 4; c++) {
        const canGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.6, 12);
        canGeo.rotateX(Math.PI / 2);
        const canMesh = new THREE.Mesh(canGeo, matCapsuleGlass);
        canMesh.position.set(-1.0 + c * 0.68, 0, 0);

        // Core glowing seed mass
        const seedCore = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), matGreenGlow);
        seedCore.position.set(-1.0 + c * 0.68, 0, 0);

        dispenserBay.add(canMesh);
        dispenserBay.add(seedCore);
    }

    // Ballistic Drop Chute Funnel
    const chuteGeo = new THREE.ConeGeometry(0.8, 0.9, 12);
    chuteGeo.rotateX(Math.PI);
    const chuteMesh = new THREE.Mesh(chuteGeo, matChlorophylGreen);
    chuteMesh.position.set(0, -1.1, 0);
    dispenserBay.add(chuteMesh);

    droneGroup.add(dispenserBay);

    // 5. LANDING GEAR / SKIDS
    const landingGroup = new THREE.Group();

    // Left and Right A-frame legs
    [-2.6, 2.6].forEach(xPos => {
        // Front angled leg
        const legFrontGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.0, 8);
        const legFront = new THREE.Mesh(legFrontGeo, matCarbonTube);
        legFront.position.set(xPos, -3.4, 1.8);
        legFront.rotation.z = xPos > 0 ? 0.28 : -0.28;
        legFront.rotation.x = -0.25;
        legFront.castShadow = true;
        landingGroup.add(legFront);

        // Rear angled leg
        const legRearGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.0, 8);
        const legRear = new THREE.Mesh(legRearGeo, matCarbonTube);
        legRear.position.set(xPos, -3.4, -2.2);
        legRear.rotation.z = xPos > 0 ? 0.28 : -0.28;
        legRear.rotation.x = 0.25;
        legRear.castShadow = true;
        landingGroup.add(legRear);

        // Bottom horizontal skid rail
        const skidGeo = new THREE.CylinderGeometry(0.22, 0.22, 8.5, 12);
        skidGeo.rotateX(Math.PI / 2);
        const skid = new THREE.Mesh(skidGeo, matCarbonTube);
        skid.position.set(xPos * 1.35, -5.8, -0.2);
        skid.castShadow = true;
        landingGroup.add(skid);

        // Skid front curved toe
        const toeGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const toe = new THREE.Mesh(toeGeo, matChlorophylGreen);
        toe.position.set(xPos * 1.35, -5.7, 4.1);
        landingGroup.add(toe);

        // Skid rear toe
        const toeRear = new THREE.Mesh(toeGeo, matChlorophylGreen);
        toeRear.position.set(xPos * 1.35, -5.7, -4.4);
        landingGroup.add(toeRear);
    });

    droneGroup.add(landingGroup);

    // Initial position of drone
    droneGroup.position.y = 0.5;

    // ─── ANIMATION LOOP ────────────────────────────────────────────
    let rotorsSpinning = true;
    let autoRotate = true;
    let isWireframe = false;
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Rotate propellers if active
        if (rotorsSpinning) {
            armPropellers.forEach(prop => {
                prop.group.rotation.y += prop.speed * 28 * delta;
            });
        }

        // Gentle hover floating bobbing
        droneGroup.position.y = 0.5 + Math.sin(time * 1.8) * 0.25;
        droneGroup.rotation.z = Math.sin(time * 1.2) * 0.02;

        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // ─── WINDOW RESIZE HANDLER ─────────────────────────────────────
    function onWindowResize() {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    window.addEventListener('resize', onWindowResize);

    // ─── INTERACTIVE CONTROLS HUD ──────────────────────────────────
    const btnRotate = document.getElementById('droneBtnRotate');
    const btnRotors = document.getElementById('droneBtnRotors');
    const btnWireframe = document.getElementById('droneBtnWireframe');
    const btnResetView = document.getElementById('droneBtnResetView');
    const viewButtons = document.querySelectorAll('[data-drone-view]');

    if (btnRotate) {
        btnRotate.addEventListener('click', () => {
            autoRotate = !autoRotate;
            controls.autoRotate = autoRotate;
            btnRotate.classList.toggle('active', autoRotate);
            btnRotate.innerHTML = autoRotate ? '<span>⏸ Pausar Giro</span>' : '<span>▶ Girar</span>';
        });
    }

    if (btnRotors) {
        btnRotors.addEventListener('click', () => {
            rotorsSpinning = !rotorsSpinning;
            btnRotors.classList.toggle('active', rotorsSpinning);
            btnRotors.innerHTML = rotorsSpinning ? '<span>🟢 Rotores Activos</span>' : '<span>⚪ Rotores Detenidos</span>';
        });
    }

    if (btnWireframe) {
        btnWireframe.addEventListener('click', () => {
            isWireframe = !isWireframe;
            btnWireframe.classList.toggle('active', isWireframe);
            scene.traverse(child => {
                if (child.isMesh && child !== shadowPlane) {
                    child.material.wireframe = isWireframe;
                }
            });
        });
    }

    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            smoothMoveCamera(22, 14, 26, 0, 0, 0);
        });
    }

    // Camera Preset Views
    if (viewButtons.length) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const view = btn.getAttribute('data-drone-view');
                switch (view) {
                    case 'top':
                        // View from directly above to inspect the official SymbioTierra emblem
                        smoothMoveCamera(0, 32, 0.1, 0, 0, 0);
                        break;
                    case 'front':
                        smoothMoveCamera(0, 1.5, 26, 0, -0.5, 0);
                        break;
                    case 'side':
                        smoothMoveCamera(26, 1.5, 0, 0, -0.5, 0);
                        break;
                    case 'payload':
                        smoothMoveCamera(8, -6, 12, 0, -2, 0);
                        break;
                    default:
                        smoothMoveCamera(22, 14, 26, 0, 0, 0);
                }
            });
        });
    }

    function smoothMoveCamera(targetX, targetY, targetZ, lookX, lookY, lookZ) {
        const startPos = camera.position.clone();
        const endPos = new THREE.Vector3(targetX, targetY, targetZ);
        const startTime = performance.now();
        const duration = 1000;

        function animateCam(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            camera.position.lerpVectors(startPos, endPos, ease);
            controls.target.set(lookX, lookY, lookZ);

            if (progress < 1) {
                requestAnimationFrame(animateCam);
            }
        }
        requestAnimationFrame(animateCam);
    }

    // ─── HOTSPOT ANNOTATION INTERACTION ────────────────────────────
    const hotspotButtons = document.querySelectorAll('[data-hotspot]');
    const hotspotInfoCard = document.getElementById('droneHotspotInfo');

    const hotspotDetails = {
        sensors: {
            title: 'Sensores Hiperespectrales & Térmicos',
            desc: 'Cámara estabilizada en gimbal de 3 ejes. Escanea índices NDVI, calidad hídrica y niveles de turbidez en tiempo real.',
            camPos: [4, -1, 10],
            target: [0, -1.6, 2.6]
        },
        capsules: {
            title: 'Tolva Balística de Bio-Cápsulas',
            desc: 'Compartimiento presurizado con 4 cartuchos de Bio-Cápsulas fúngicas y biopolímeros filtrantes. Capacidad de 500 unidades/hora.',
            camPos: [10, -3, -4],
            target: [0, -1.6, -1.0]
        },
        motors: {
            title: 'Enjambre Hexacóptero & Motores Brushless',
            desc: '6 motores sin escobillas con palas de carbono y anillos LED verdes de señalización. Autonomía de vuelo colectivo coordinado por IA.',
            camPos: [16, 12, 16],
            target: [9.5, 1, 0]
        },
        avionics: {
            title: 'Aviónica Neural & Emblema SymbioTierra',
            desc: 'Cúpula dorsal reforzada con el logotipo e icono oficial de SymbioTierra, procesador de vuelo neuronal y antena de enlace LoRaWAN.',
            camPos: [0, 10, 5],
            target: [0, 2.5, 0]
        }
    };

    if (hotspotButtons.length && hotspotInfoCard) {
        hotspotButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                hotspotButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const spotKey = btn.getAttribute('data-hotspot');
                const info = hotspotDetails[spotKey];
                if (info) {
                    hotspotInfoCard.innerHTML = `
                        <h4 style="color: var(--green-light); font-family: var(--font-heading); margin-bottom: 0.3rem;">${info.title}</h4>
                        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${info.desc}</p>
                    `;
                    smoothMoveCamera(info.camPos[0], info.camPos[1], info.camPos[2], info.target[0], info.target[1], info.target[2]);
                }
            });
        });
    }

    console.log('%c SymbioTierra 3D Drone Engine: Emblems & Textures Loaded ', 'background: #2FA84F; color: #fff; font-weight: bold;');
})();
