 // Theme toggle functionality
    function toggleTheme() {
      document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    }

    // Load saved theme preference
    window.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
      }
    });

    // Tetris background animation
    const canvas = document.getElementById('tetris-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Tetris pieces (tetrominos)
    const pieces = [
      // I-piece
      [[1,1,1,1]],
      // O-piece
      [[1,1],[1,1]],
      // T-piece
      [[0,1,0],[1,1,1]],
      // S-piece
      [[0,1,1],[1,1,0]],
      // Z-piece
      [[1,1,0],[0,1,1]],
      // J-piece
      [[1,0,0],[1,1,1]],
      // L-piece
      [[0,0,1],[1,1,1]]
    ];

    // Colors for pieces
    const darkColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce', '#85c88a', '#ff9a76'];
    const lightColors = ['#ff4757', '#00d2d3', '#0984e3', '#fdcb6e', '#a29bfe', '#00b894', '#fd79a8'];

    class TetrisPiece {
      constructor() {
        this.shape = pieces[Math.floor(Math.random() * pieces.length)];
        this.x = Math.random() * canvas.width;
        this.y = -100;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.fallSpeed = 1 + Math.random() * 2;
        this.size = 15 + Math.random() * 10;
        this.colorIndex = Math.floor(Math.random() * darkColors.length);
        this.opacity = 0.3 + Math.random() * 0.5;
      }

      update() {
        this.y += this.fallSpeed;
        this.rotation += this.rotationSpeed;
        
        // Reset piece when it falls off screen
        if (this.y > canvas.height + 100) {
          this.y = -100;
          this.x = Math.random() * canvas.width;
          this.rotation = Math.random() * 360;
          this.colorIndex = Math.floor(Math.random() * darkColors.length);
        }
      }

      draw() {
        ctx.save();
        
        // Get current theme colors
        const isLightTheme = document.body.classList.contains('light-theme');
        const colors = isLightTheme ? lightColors : darkColors;
        
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // Draw the piece
        ctx.fillStyle = colors[this.colorIndex];
        ctx.globalAlpha = this.opacity * (isLightTheme ? 0.7 : 1);
        
        for (let row = 0; row < this.shape.length; row++) {
          for (let col = 0; col < this.shape[row].length; col++) {
            if (this.shape[row][col]) {
              ctx.fillRect(
                col * this.size - (this.shape[row].length * this.size) / 2,
                row * this.size - (this.shape.length * this.size) / 2,
                this.size - 2,
                this.size - 2
              );
              
              // Add subtle border
              ctx.strokeStyle = isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
              ctx.lineWidth = 1;
              ctx.strokeRect(
                col * this.size - (this.shape[row].length * this.size) / 2,
                row * this.size - (this.shape.length * this.size) / 2,
                this.size - 2,
                this.size - 2
              );
            }
          }
        }
        
        ctx.restore();
      }
    }

    // Create falling pieces
    const fallingPieces = [];
    const numberOfPieces = 15;
    
    for (let i = 0; i < numberOfPieces; i++) {
      setTimeout(() => {
        fallingPieces.push(new TetrisPiece());
      }, i * 200);
    }

    // Animation loop
    function animate() {
      // Clear canvas with slight transparency for trail effect
      const isLightTheme = document.body.classList.contains('light-theme');
      ctx.fillStyle = isLightTheme ? 'rgba(245, 245, 245, 0.1)' : 'rgba(20, 20, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all pieces
      fallingPieces.forEach(piece => {
        piece.update();
        piece.draw();
      });
      
      requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Add subtle grid pattern
    function drawGrid() {
      const gridSize = 30;
      const isLightTheme = document.body.classList.contains('light-theme');
      
      ctx.strokeStyle = isLightTheme ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw grid once
    setTimeout(drawGrid, 100);