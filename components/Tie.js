// Tie class definition
class Tie extends Phaser.GameObjects.Container {
    constructor(scene, star1, star2, lineWidth = 8, color = 0x808080) {
        super(scene, 0, 0);
        
        this.star1 = star1;
        this.star2 = star2;
        this.lineWidth = lineWidth;
        this.color = color;
        this.label = '';
        this.isTyping = false;
        
        // Create the graphics object for the line
        this.graphics = scene.add.graphics();
        this.add(this.graphics);
        
        // Create text object for the label
        this.text = scene.add.text(0, 0, '', {
            fontSize: '14px',
            fill: '#ffffff',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 4, y: 2 }
        });
        this.text.setOrigin(0.5);
        this.add(this.text);
        
        // Draw the line between the two stars
        this.drawLine();
        
        // Make the tie interactive
        this.setSize(800, 600); // Make it cover the whole screen for click detection
        this.setInteractive();
        this.on('pointerdown', () => {
            this.startTyping();
        });
        
        // Add to scene
        scene.add.existing(this);
        
        // Update the line when stars move (if they become draggable later)
        this.updateTimer = scene.time.addEvent({
            delay: 16, // ~60 FPS
            callback: this.updateLine,
            callbackScope: this,
            loop: true
        });
    }
    
    drawLine() {
        // Clear previous drawing
        this.graphics.clear();
        
        // Set line style again (needed after clear)
        this.graphics.lineStyle(this.lineWidth, this.color);
        
        // Get the world positions of both stars
        const star1WorldPos = this.star1.getWorldTransformMatrix();
        const star2WorldPos = this.star2.getWorldTransformMatrix();
        
        // Calculate the center point of the line for text positioning
        const centerX = (star1WorldPos.tx + star2WorldPos.tx) / 2;
        const centerY = (star1WorldPos.ty + star2WorldPos.ty) / 2;
        
        // Position the text at the center of the line
        this.text.setPosition(centerX, centerY);
        
        // Draw line from star1 to star2
        this.graphics.beginPath();
        this.graphics.moveTo(star1WorldPos.tx, star1WorldPos.ty);
        this.graphics.lineTo(star2WorldPos.tx, star2WorldPos.ty);
        this.graphics.strokePath();
    }
    
    updateLine() {
        // Only redraw if the stars have moved
        if (this.star1 && this.star2) {
            this.drawLine();
        }
    }
    
    startTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.text.setStyle({ fill: '#ff0000' }); // Red text while typing
        
        // Create input element for typing
        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        input.style.opacity = '0';
        document.body.appendChild(input);
        
        input.focus();
        
        const handleInput = (event) => {
            this.label = event.target.value;
            this.text.setText(this.label);
        };
        
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                this.stopTyping();
            }
        };
        
        const handleBlur = () => {
            this.stopTyping();
        };
        
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('blur', handleBlur);
        
        this.currentInput = input;
        this.inputHandlers = { handleInput, handleKeyDown, handleBlur };
    }
    
    stopTyping() {
        if (!this.isTyping) return;
        
        this.isTyping = false;
        this.text.setStyle({ fill: '#ffffff' }); // White text when not typing
        
        if (this.currentInput) {
            this.currentInput.removeEventListener('input', this.inputHandlers.handleInput);
            this.currentInput.removeEventListener('keydown', this.inputHandlers.handleKeyDown);
            this.currentInput.removeEventListener('blur', this.inputHandlers.handleBlur);
            document.body.removeChild(this.currentInput);
            this.currentInput = null;
            this.inputHandlers = null;
        }
    }
    
    destroy() {
        // Clean up the timer
        if (this.updateTimer) {
            this.updateTimer.destroy();
        }
        
        // Stop typing if currently typing
        if (this.isTyping) {
            this.stopTyping();
        }
        
        // Call parent destroy
        super.destroy();
    }
    
    // Method to change the color of the tie
    setColor(color) {
        this.color = color;
        this.drawLine();
    }
    
    // Method to change the line width
    setLineWidth(width) {
        this.lineWidth = width;
        this.drawLine();
    }
}
