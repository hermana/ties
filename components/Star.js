// Star class definition
class Star extends Phaser.GameObjects.Container {
    constructor(scene, x, y, radius = 50) {
        super(scene, x, y);
        
        this.radius = radius;
        this.label = '';
        this.isTyping = false;
        
        // Create white circle
        this.circle = scene.add.circle(0, 0, radius, 0xffffff);
        this.add(this.circle);
        
        // Create text object for the label
        this.text = scene.add.text(0, 0, '', {
            fontSize: '16px',
            fill: '#000000',
            align: 'center',
            wordWrap: { width: radius * 1.8, useAdvancedWrap: true }
        });
        this.text.setOrigin(0.5);
        this.add(this.text);
        
        // Make the star interactive and draggable
        // Set up a circular hit area with proper callback function
        const hitArea = new Phaser.Geom.Circle(0, 0, radius);
        const hitAreaCallback = Phaser.Geom.Circle.Contains;
        
        this.setInteractive(hitArea, hitAreaCallback);
        
        // Enable dragging
        this.scene.input.setDraggable(this);
        
        // Track drag state and initial position
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.hasMoved = false;
        
        // Handle drag start
        this.on('dragstart', (pointer) => {
            this.isDragging = true;
            this.hasMoved = false;
            this.dragStartX = this.x;
            this.dragStartY = this.y;
        });
        
        // Handle dragging
        this.on('drag', (pointer, dragX, dragY) => {
            this.x = dragX;
            this.y = dragY;
            // Check if we've moved significantly
            if (Math.abs(this.x - this.dragStartX) > 3 || Math.abs(this.y - this.dragStartY) > 3) {
                this.hasMoved = true;
            }
        });
        
        // Handle drag end
        this.on('dragend', () => {
            // Only start typing if it was a click (no significant movement)
            if (!this.hasMoved) {
                this.startTyping();
            }
            this.isDragging = false;
            this.hasMoved = false;
        });
        
        // Handle pointer up for clicks (fallback if drag events don't fire)
        this.on('pointerup', (pointer) => {
            // Small delay to let dragend fire first if it's going to
            setTimeout(() => {
                if (!this.isDragging && !this.hasMoved) {
                    this.startTyping();
                }
            }, 10);
        });
        
        // Add to scene
        scene.add.existing(this);
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
        this.text.setStyle({ fill: '#000000' }); // Black text when not typing
        
        if (this.currentInput) {
            this.currentInput.removeEventListener('input', this.inputHandlers.handleInput);
            this.currentInput.removeEventListener('keydown', this.inputHandlers.handleKeyDown);
            this.currentInput.removeEventListener('blur', this.inputHandlers.handleBlur);
            document.body.removeChild(this.currentInput);
            this.currentInput = null;
            this.inputHandlers = null;
        }
    }
}
