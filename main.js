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
        
        // Make the star interactive
        this.circle.setInteractive();
        this.circle.on('pointerdown', () => {
            this.startTyping();
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

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: '#000000', // Black background
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the game
const game = new Phaser.Game(config);

function preload() {
    // No assets to preload for a simple black screen
}

function create() {
    // Create a simple black screen
    // The background color is already set to black in the config
    console.log('Black screen created!');
    
    // Create a Star instance in the center of the screen
    this.star = new Star(this, 400, 300, 60);
}

function update() {
    // No updates needed for a static black screen
}
