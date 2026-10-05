// Bloom & Bristle — 3D store-name wallpaper background
// Renders a slowly-rotating 3D wordmark + soft particle field behind all pages.
// Fails silently (falls back to the CSS gradient in styles.css) if three.js can't load.
(function () {
  function init() {
    try {
      var canvas = document.getElementById('bg3d');
      if (!canvas || typeof THREE === 'undefined') return;

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 62;

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      var dir1 = new THREE.DirectionalLight(0xC08A63, 1.3);
      dir1.position.set(6, 10, 12);
      scene.add(dir1);
      var dir2 = new THREE.DirectionalLight(0x2f6a61, 0.6);
      dir2.position.set(-8, -4, 6);
      scene.add(dir2);

      var textGroup = new THREE.Group();
      scene.add(textGroup);

      if (THREE.FontLoader && THREE.TextGeometry) {
        var loader = new THREE.FontLoader();
        loader.load(
          'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
          function (font) {
            var geo = new THREE.TextGeometry('BLOOM & BRISTLE', {
              font: font, size: 6.2, height: 1.3, curveSegments: 8,
              bevelEnabled: true, bevelThickness: 0.28, bevelSize: 0.14, bevelSegments: 2
            });
            geo.center();
            var mat = new THREE.MeshStandardMaterial({
              color: 0xC08A63, metalness: 0.35, roughness: 0.45,
              transparent: true, opacity: 0.5
            });
            var mesh = new THREE.Mesh(geo, mat);
            textGroup.add(mesh);
          }
        );
      }

      // Floating particle field
      var count = 240;
      var positions = new Float32Array(count * 3);
      for (var i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 170;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
      }
      var pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var pMat = new THREE.PointsMaterial({ color: 0xE7A9A0, size: 0.55, transparent: true, opacity: 0.4 });
      var particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      var clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        var t = clock.getElapsedTime();
        textGroup.rotation.y = t * 0.12;
        textGroup.rotation.x = Math.sin(t * 0.2) * 0.08;
        particles.rotation.y += 0.0007;
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch (e) {
      console.error('3D background failed, falling back to gradient:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
