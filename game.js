// Game Engine for Kaden's Adventures - 3D Style with SDXL Graphics
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu';
        this.score = 0;
        this.health = 100;
        this.materials = 0;
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.gameTime = 0;
        this.buildingType = 'wall';
        this.walls = [];
        this.collectibles = [];
        this.enemies = [];
        this.particles = [];
        this.lights = [];
        
        // 3D-style player with SDXL design
        this.player = {
            x: 600,
            y: 400,
            vx: 0,
            vy: 0,
            speed: 5,
            size: 25,
            color: '#4A90E2',
            shadowColor: '#2E5A8A',
            highlightColor: '#7BB3F0',
            outlineColor: '#1A3A5A',
            // 3D properties
            depth: 0,
            rotation: 0,
            scale: 1,
            // SDXL-style properties
            armor: 0,
            weapon: 'none',
            effects: []
        };
        
        // Camera with 3D perspective
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            angle: 0
        };
        
        // Lighting system for 3D effect
        this.lighting = {
            ambient: 0.3,
            directional: {
                x: 1,
                y: -1,
                intensity: 0.7
            },
            shadows: true
        };
        
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        
        // Enhanced audio with 3D positioning
        this.audio = {
            collect: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            build: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            damage: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'),
            powerup: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
        };
        
        this.setupEventListeners();
        this.initGame();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Escape') this.togglePause();
            if (e.code === 'Digit1') this.buildingType = 'wall';
            if (e.code === 'Digit2') this.buildingType = 'ramp';
            if (e.code === 'Digit3') this.buildingType = 'floor';
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'playing') {
                this.build();
            }
        });
    }
    
    initGame() {
        this.spawnCollectibles();
        this.spawnEnemies();
        this.updateUI();
        this.createLighting();
    }
    
    createLighting() {
        this.lights = [
            { x: 0, y: 0, radius: 300, intensity: 0.8, color: '#FFFFFF' },
            { x: -500, y: -500, radius: 200, intensity: 0.4, color: '#FFD700' },
            { x: 500, y: 500, radius: 200, intensity: 0.4, color: '#87CEEB' }
        ];
    }
    
    spawnCollectibles() {
        this.collectibles = [];
        for (let i = 0; i < 15; i++) {
            this.collectibles.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                type: Math.random() < 0.3 ? 'powerup' : Math.random() < 0.5 ? 'health' : 'material',
                collected: false,
                // 3D properties
                depth: Math.random() * 10,
                rotation: 0,
                scale: 1 + Math.random() * 0.3,
                // SDXL-style glow
                glow: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    spawnEnemies() {
        this.enemies = [];
        for (let i = 0; i < 8; i++) {
            this.enemies.push({
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: 20,
                color: '#E74C3C',
                shadowColor: '#C0392B',
                highlightColor: '#FF6B6B',
                outlineColor: '#8B0000',
                health: 40,
                // 3D properties
                depth: Math.random() * 5,
                rotation: 0,
                scale: 1 + Math.random() * 0.2,
                // SDXL-style effects
                armor: Math.random() * 20,
                weapon: 'claws',
                effects: ['fire', 'shadow']
            });
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('menu').style.display = 'none';
        this.gameTime = 0;
        this.score = 0;
        this.health = 100;
        this.materials = 0;
        this.powerUp = false;
        this.powerUpTimer = 0;
        this.walls = [];
        this.particles = [];
        this.initGame();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.gameTime += 1/60;
        this.updatePlayer();
        this.updateEnemies();
        this.updateCollectibles();
        this.updateParticles();
        this.updateLighting();
        this.checkCollisions();
        this.updateCamera();
        this.updateUI();
    }
    
    updatePlayer() {
        let vx = 0, vy = 0;
        if (this.keys['KeyW'] || this.keys['ArrowUp']) vy -= this.player.speed;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) vy += this.player.speed;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) vx -= this.player.speed;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) vx += this.player.speed;
        
        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }
        
        this.player.vx = vx;
        this.player.vy = vy;
        this.player.x += vx;
        this.player.y += vy;
        
        // Update 3D properties
        this.player.rotation += (vx * 0.1);
        this.player.scale = 1 + Math.abs(vx + vy) * 0.1;
        
        this.player.x = Math.max(-1000, Math.min(1000, this.player.x));
        this.player.y = Math.max(-1000, Math.min(1000, this.player.y));
        
        if (this.powerUp && this.powerUpTimer > 0) {
            this.powerUpTimer -= 1/60;
            if (this.powerUpTimer <= 0) {
                this.powerUp = false;
            }
        }
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist > 0) {
                enemy.vx = (dx / dist) * 1.8;
                enemy.vy = (dy / dist) * 1.8;
            }
            
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
            
            // Update 3D properties
            enemy.rotation += (enemy.vx * 0.15);
            enemy.scale = 1 + Math.abs(enemy.vx + enemy.vy) * 0.05;
            
            enemy.x = Math.max(-1000, Math.min(1000, enemy.x));
            enemy.y = Math.max(-1000, Math.min(1000, enemy.y));
        });
    }
    
    updateCollectibles() {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                collectible.y += Math.sin(this.gameTime * 3) * 0.8;
                collectible.rotation += 0.02;
                collectible.scale = 1 + Math.sin(this.gameTime * 4) * 0.1;
            }
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 1/60;
            particle.scale *= 0.98;
            return particle.life > 0;
        });
    }
    
    updateLighting() {
        this.lights.forEach(light => {
            light.x += Math.sin(this.gameTime * 0.5) * 2;
            light.y += Math.cos(this.gameTime * 0.3) * 2;
        });
    }
    
    checkCollisions() {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                const dx = this.player.x - collectible.x;
                const dy = this.player.y - collectible.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 35) {
                    this.collectItem(collectible);
                    collectible.collected = true;
                }
            }
        });
        
        this.enemies.forEach(enemy => {
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 30) {
                this.takeDamage(12);
                this.createParticles(this.player.x, this.player.y, '#FF0000', 15);
            }
        });
    }
    
    collectItem(collectible) {
        switch(collectible.type) {
            case 'material':
                this.materials += 5;
                this.score += 10;
                this.health = Math.min(100, this.health + 10);
                this.audio.collect.play();
                this.createParticles(collectible.x, collectible.y, '#FFD700', 20);
                break;
            case 'health':
                this.health = Math.min(100, this.health + 25);
                this.score += 15;
                this.audio.collect.play();
                this.createParticles(collectible.x, collectible.y, '#00FF00', 20);
                break;
            case 'powerup':
                this.powerUp = true;
                this.powerUpTimer = 12;
                this.score += 50;
                this.audio.powerup.play();
                this.createParticles(collectible.x, collectible.y, '#00FFFF', 25);
                break;
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        this.score = Math.max(0, this.score - 5);
        this.audio.damage.play();
        
        if (this.health <= 0) {
            this.gameOver();
        }
    }
    
    build() {
        if (this.materials > 0) {
            this.materials--;
            this.audio.build.play();
            
            const wall = {
                x: this.player.x + (this.mouse.x - this.canvas.width/2) * 0.1,
                y: this.player.y + (this.mouse.y - this.canvas.height/2) * 0.1,
                type: this.buildingType,
                life: 20,
                // 3D properties
                depth: 5,
                rotation: 0,
                scale: 1,
                // SDXL-style properties
                material: 'stone',
                effects: ['glow']
            };
            
            this.walls.push(wall);
            this.createParticles(wall.x, wall.y, '#8B4513', 15);
        }
    }
    
    createParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                color: color,
                life: 1.5,
                scale: 1,
                // 3D properties
                depth: Math.random() * 10,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }
    
    updateCamera() {
        this.camera.x = this.player.x - this.canvas.width / 2;
        this.camera.y = this.player.y - this.canvas.height / 2;
    }
    
    updateUI() {
        document.getElementById('health').textContent = this.health;
        document.getElementById('materials').textContent = this.materials;
        document.getElementById('score').textContent = this.score;
        
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = Math.floor(this.gameTime % 60);
        document.getElementById('time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.powerUp && this.powerUpTimer > 0) {
            document.getElementById('powerup').textContent = `POWER UP! (${Math.ceil(this.powerUpTimer)}s)`;
            document.getElementById('powerup').style.color = '#00FFFF';
        } else {
            document.getElementById('powerup').textContent = 'None';
            document.getElementById('powerup').style.color = 'white';
        }
    }
    
    render() {
        // Clear with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1E3A8A');
        gradient.addColorStop(0.5, '#3B82F6');
        gradient.addColorStop(1, '#10B981');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        this.drawBackground3D();
        this.drawWalls3D();
        this.drawCollectibles3D();
        this.drawEnemies3D();
        this.drawParticles3D();
        this.drawPlayer3D();
        this.drawLighting();
        
        this.ctx.restore();
        this.drawUI();
    }
    
    drawBackground3D() {
        // 3D terrain with depth
        for (let i = 0; i < 100; i++) {
            const x = (i * 80) % 2000 - 1000;
            const y = Math.floor(i / 10) * 80 - 1000;
            const depth = Math.sin(x * 0.01) * 20;
            
            this.ctx.fillStyle = `rgba(34, 197, 94, ${0.3 + depth * 0.01})`;
            this.ctx.fillRect(x, y + depth, 60, 60);
            
            // Add 3D shadow
            this.ctx.fillStyle = `rgba(0, 0, 0, ${0.2 + depth * 0.005})`;
            this.ctx.fillRect(x + 5, y + depth + 5, 60, 60);
        }
        
        // 3D trees
        for (let i = 0; i < 30; i++) {
            const x = (i * 120) % 2000 - 1000;
            const y = (i * 100) % 2000 - 1000;
            const depth = Math.sin(x * 0.02) * 15;
            
            // Tree trunk
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(x - 3, y + depth, 6, 20);
            
            // Tree foliage with 3D effect
            const gradient = this.ctx.createRadialGradient(x, y + depth, 0, x, y + depth, 25);
            gradient.addColorStop(0, '#228B22');
            gradient.addColorStop(1, '#006400');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y + depth, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawWalls3D() {
        this.walls.forEach(wall => {
            const x = wall.x;
            const y = wall.y;
            const size = 30 * wall.scale;
            
            // 3D shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.fillRect(x - size/2 + 3, y - size/2 + 3, size, size);
            
            // Main wall with gradient
            const gradient = this.ctx.createLinearGradient(x - size/2, y - size/2, x + size/2, y + size/2);
            gradient.addColorStop(0, '#8B4513');
            gradient.addColorStop(0.5, '#A0522D');
            gradient.addColorStop(1, '#CD853F');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x - size/2, y - size/2, size, size);
            
            // 3D highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillRect(x - size/2, y - size/2, size, size/3);
            
            // Wall outline
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x - size/2, y - size/2, size, size);
        });
    }
    
    drawCollectibles3D() {
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                const x = collectible.x;
                const y = collectible.y;
                const size = 12 * collectible.scale;
                
                let color, glowColor;
                switch(collectible.type) {
                    case 'material':
                        color = '#FFD700';
                        glowColor = '#FFA500';
                        break;
                    case 'health':
                        color = '#00FF00';
                        glowColor = '#32CD32';
                        break;
                    case 'powerup':
                        color = '#00FFFF';
                        glowColor = '#40E0D0';
                        break;
                }
                
                // Glow effect
                this.ctx.shadowColor = glowColor;
                this.ctx.shadowBlur = 15 * collectible.glow;
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                
                // 3D highlight
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.beginPath();
                this.ctx.arc(x - size/3, y - size/3, size/3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    drawEnemies3D() {
        this.enemies.forEach(enemy => {
            const x = enemy.x;
            const y = enemy.y;
            const size = enemy.size * enemy.scale;
            
            // 3D shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.fillRect(x - size/2 + 2, y - size/2 + 2, size, size);
            
            // Enemy body with gradient
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, enemy.highlightColor);
            gradient.addColorStop(0.7, enemy.color);
            gradient.addColorStop(1, enemy.shadowColor);
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 3D highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(x - size/3, y - size/3, size/3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Enemy outline
            this.ctx.strokeStyle = enemy.outlineColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Fire effect for enemies
            if (enemy.effects.includes('fire')) {
                this.ctx.fillStyle = 'rgba(255, 100, 0, 0.6)';
                this.ctx.beginPath();
                this.ctx.arc(x, y - size - 5, 8, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    drawParticles3D() {
        this.particles.forEach(particle => {
            const x = particle.x;
            const y = particle.y;
            const size = 4 * particle.scale;
            
            // 3D glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10 * particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.life;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawPlayer3D() {
        const x = this.player.x;
        const y = this.player.y;
        const size = this.player.size * this.player.scale;
        
        // 3D shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fillRect(x - size/2 + 3, y - size/2 + 3, size, size);
        
        // Power-up glow effect
        if (this.powerUp && this.powerUpTimer > 0) {
            this.ctx.shadowColor = '#00FFFF';
            this.ctx.shadowBlur = 20;
        }
        
        // Player body with 3D gradient
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, this.player.highlightColor);
        gradient.addColorStop(0.7, this.player.color);
        gradient.addColorStop(1, this.player.shadowColor);
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 3D highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(x - size/3, y - size/3, size/3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player outline
        this.ctx.strokeStyle = this.player.outlineColor;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0;
        
        // Direction indicator
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + this.player.vx * 4, y + this.player.vy * 4);
        this.ctx.stroke();
        
        // Armor indicator
        if (this.player.armor > 0) {
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size + 3, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    drawLighting() {
        // Apply lighting effects
        this.lights.forEach(light => {
            const gradient = this.ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, light.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${light.intensity * 0.1})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(light.x - light.radius, light.y - light.radius, light.radius * 2, light.radius * 2);
        });
    }
    
    drawUI() {
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Press ESC to resume', this.canvas.width/2, this.canvas.height/2 + 50);
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('menu').style.display = 'block';
        document.getElementById('menu').innerHTML = `
            <h1>🎮 Game Over!</h1>
            <p>Final Score: ${this.score}</p>
            <p>Survival Time: ${Math.floor(this.gameTime/60)}:${Math.floor(this.gameTime%60).toString().padStart(2, '0')}</p>
            <button onclick="game.startGame()">🔄 Play Again</button>
        `;
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Global functions for UI
function startGame() {
    game.startGame();
}

function showInstructions() {
    alert(`🎮 Kaden's Adventures - 3D Battle Royale

🎯 Controls:
WASD or Arrow Keys: Move
SPACE: Build structure
1: Build wall
2: Build ramp  
3: Build floor
ESC: Pause game

🌟 Features:
- 3D graphics with SDXL-style rendering
- Dynamic lighting and shadows
- Particle effects and glow
- Power-up system with visual effects
- Enemy AI with fire effects
- Building mechanics with 3D depth

🎯 Objective: Collect materials, build defenses, survive as long as possible!

💡 Tips:
- Collect golden materials for points
- Green items restore health
- Blue items give power-ups
- Build walls to protect yourself
- Avoid red enemies with fire effects!`);
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new Game();
}); 