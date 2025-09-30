import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TileData, CONFIG, getEnhancedColorForCFU } from './bacteria-data';

export class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private raycaster: THREE.Raycaster;
  private tileGroup!: THREE.Group;
  private highlighted: THREE.Mesh | null = null;
  private hovered: THREE.Mesh | null = null;
  private currentViewMode: string = CONFIG.VIEW_MODES.ISO;
  private animationId: number = 0;
  private disposed: boolean = false;

  constructor(container: HTMLElement, private dataset: Record<string, TileData>) {
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(0x0a0e27, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0a0e27, 10, 100);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);

    // Initialize controls first
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set((CONFIG.ROOM_W - 1) / 2, 0, (CONFIG.ROOM_H - 1) / 2);
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 80;

    // Now set view mode after controls are initialized
    this.setViewMode(CONFIG.VIEW_MODES.ISO);

    // Initialize raycaster
    this.raycaster = new THREE.Raycaster();

    // Create scene elements
    this.setupLighting();
    this.createEnvironment();

    // Start animation loop
    this.animate();
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(20, 30, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    this.scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 0.3);
    fillLight.position.set(-10, 20, -10);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x10b981, 0.2);
    rimLight.position.set(0, 10, -20);
    this.scene.add(rimLight);
  }

  private createEnvironment(): void {
    // Enhanced floor
    const floorGeometry = new THREE.PlaneGeometry(CONFIG.ROOM_W + 2, CONFIG.ROOM_H + 2);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x0f172a,
      transparent: true,
      opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((CONFIG.ROOM_W - 1) / 2, -0.01, (CONFIG.ROOM_H - 1) / 2);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Create enhanced tile group
    this.tileGroup = new THREE.Group();
    this.scene.add(this.tileGroup);

    // Create tiles with enhanced materials
    const tileGeometry = new THREE.PlaneGeometry(CONFIG.TILE_SIZE * 0.95, CONFIG.TILE_SIZE * 0.95);
    
    for (let x = 0; x < CONFIG.ROOM_W; x++) {
      for (let y = 0; y < CONFIG.ROOM_H; y++) {
        const id = `${x}_${y}`;
        const tileData = this.dataset[id];
        const colorHex = getEnhancedColorForCFU(tileData.totalCFU);
        
        const tileMaterial = new THREE.MeshLambertMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.8,
          emissive: new THREE.Color(colorHex).multiplyScalar(0.1)
        });
        
        const mesh = new THREE.Mesh(tileGeometry, tileMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x, 0.01, y);
        mesh.userData = { id, tileData, baseColor: colorHex };
        mesh.castShadow = true;
        this.tileGroup.add(mesh);
      }
    }

    // Enhanced walls
    this.createWalls();

    // Add grid helper
    const gridHelper = new THREE.GridHelper(
      Math.max(CONFIG.ROOM_W, CONFIG.ROOM_H), 
      Math.max(CONFIG.ROOM_W, CONFIG.ROOM_H), 
      0x1e293b, 
      0x334155
    );
    gridHelper.position.set((CONFIG.ROOM_W - 1) / 2, 0.005, (CONFIG.ROOM_H - 1) / 2);
    this.scene.add(gridHelper);
  }

  private createWalls(): void {
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x1e293b,
      transparent: true,
      opacity: 0.8
    });
    const wallHeight = 4;
    const wallThickness = 0.2;

    // Wall creation helper
    const createWall = (width: number, height: number, x: number, y: number, z: number, rotationY = 0) => {
      const geometry = new THREE.BoxGeometry(width, height, wallThickness);
      const mesh = new THREE.Mesh(geometry, wallMaterial);
      mesh.position.set(x, height / 2, z);
      mesh.rotation.y = rotationY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    };

    // Create walls
    createWall(CONFIG.ROOM_W + wallThickness, wallHeight, (CONFIG.ROOM_W - 1) / 2, 0, -wallThickness / 2);
    createWall(CONFIG.ROOM_W + wallThickness, wallHeight, (CONFIG.ROOM_W - 1) / 2, 0, CONFIG.ROOM_H - 1 + wallThickness / 2);
    createWall(CONFIG.ROOM_H, wallHeight, -wallThickness / 2, 0, (CONFIG.ROOM_H - 1) / 2, Math.PI / 2);
    createWall(CONFIG.ROOM_H, wallHeight, CONFIG.ROOM_W - 1 + wallThickness / 2, 0, (CONFIG.ROOM_H - 1) / 2, Math.PI / 2);
  }

  private animate = (): void => {
    if (this.disposed) return;
    
    this.animationId = requestAnimationFrame(this.animate);
    
    this.controls.update();
    
    // Animate selection rings
    if (this.highlighted) {
      const rings = this.highlighted.children.filter((child: any) => child.userData.isSelectionRing);
      rings.forEach((ring: any) => {
        ring.rotation.z += 0.02;
        ring.material.opacity = 0.6 + Math.sin(Date.now() * 0.005) * 0.2;
      });
    }
    
    this.renderer.render(this.scene, this.camera);
  };

  public setViewMode(mode: string): void {
    this.currentViewMode = mode;
    
    switch (mode) {
      case CONFIG.VIEW_MODES.TOP:
        this.camera.position.set((CONFIG.ROOM_W - 1) / 2, 25, (CONFIG.ROOM_H - 1) / 2);
        this.controls.maxPolarAngle = Math.PI / 2;
        break;
      case CONFIG.VIEW_MODES.ISO:
        this.camera.position.set(CONFIG.ROOM_W * 0.8, Math.max(CONFIG.ROOM_W, CONFIG.ROOM_H) * 0.8, CONFIG.ROOM_H * 1.2);
        this.controls.maxPolarAngle = Math.PI / 2.2;
        break;
      case CONFIG.VIEW_MODES.WALK:
        this.camera.position.set(2, 2, 2);
        this.controls.maxPolarAngle = Math.PI / 2.5;
        break;
    }
    
    this.controls.target.set((CONFIG.ROOM_W - 1) / 2, 0, (CONFIG.ROOM_H - 1) / 2);
    this.controls.update();
  }

  public handleMouseMove(event: MouseEvent, onHover: (data: TileData, event: MouseEvent) => void, onClearHover: () => void): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.tileGroup.children);
    
    if (intersects.length > 0) {
      const tile = intersects[0].object as THREE.Mesh;
      this.handleTileHover(tile, event, onHover);
    } else {
      onClearHover();
      this.clearHover();
    }
  }

  public handleMouseClick(event: MouseEvent, onSelect: (data: TileData) => void): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.tileGroup.children);
    
    if (intersects.length > 0) {
      const tile = intersects[0].object as THREE.Mesh;
      this.selectTile(tile, onSelect);
    }
  }

  private handleTileHover(tile: THREE.Mesh, event: MouseEvent, onHover: (data: TileData, event: MouseEvent) => void): void {
    if (this.hovered !== tile) {
      this.clearHover();
      this.hovered = tile;
      
      // Enhanced hover effect
      (tile.material as THREE.MeshLambertMaterial).emissive.setHex(0x444444);
      tile.position.y = 0.05;
      
      // Show tooltip
      onHover(tile.userData.tileData, event);
    }
  }

  private clearHover(): void {
    if (this.hovered && this.hovered !== this.highlighted) {
      (this.hovered.material as THREE.MeshLambertMaterial).emissive.setHex(0x000000);
      this.hovered.position.y = 0.01;
    }
    this.hovered = null;
  }

  private selectTile(tile: THREE.Mesh, onSelect: (data: TileData) => void): void {
    // Clear previous selection
    if (this.highlighted) {
      (this.highlighted.material as THREE.MeshLambertMaterial).emissive.setHex(0x000000);
      this.highlighted.position.y = 0.01;
      // Remove any existing selection rings
      const existingRings = this.highlighted.children.filter((child: any) => child.userData.isSelectionRing);
      existingRings.forEach(ring => this.highlighted!.remove(ring));
    }
    
    this.highlighted = tile;
    const data = tile.userData.tileData;
    
    // Enhanced selection effect
    (tile.material as THREE.MeshLambertMaterial).emissive.setHex(0x06b6d4);
    tile.position.y = 0.08;
    
    // Add selection ring animation
    const ringGeometry = new THREE.RingGeometry(0.6, 0.7, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x06b6d4, 
      transparent: true, 
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.02, 0);
    ring.userData.isSelectionRing = true;
    tile.add(ring);
    
    // Animate camera to focus on selected tile
    this.controls.target.set(tile.position.x, 0, tile.position.z);
    this.controls.update();
    
    onSelect(data);
  }

  public reset(): void {
    this.setViewMode(CONFIG.VIEW_MODES.ISO);
    if (this.highlighted) {
      (this.highlighted.material as THREE.MeshLambertMaterial).emissive.setHex(0x000000);
      this.highlighted.position.y = 0.01;
      const existingRings = this.highlighted.children.filter((child: any) => child.userData.isSelectionRing);
      existingRings.forEach(ring => this.highlighted!.remove(ring));
      this.highlighted = null;
    }
  }

  public exportImage(): void {
    const link = document.createElement('a');
    link.download = `bacteria-heatmap-${new Date().toISOString().split('T')[0]}.png`;
    link.href = this.renderer.domElement.toDataURL();
    link.click();
  }

  public resize(): void {
    const container = this.renderer.domElement.parentElement!;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  public dispose(): void {
    this.disposed = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
    this.controls.dispose();
  }
}
