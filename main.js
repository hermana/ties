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
    
    // Create Star instances at different positions
    this.star1 = new Star(this, 400, 300, 60);  // Center star
    this.star2 = new Star(this, 200, 150, 50);  // Top-left star
    this.star3 = new Star(this, 600, 450, 45);  // Bottom-right star
    
    // Create Tie instances to connect the stars
    this.tie1 = new Tie(this, this.star1, this.star2);  // Connect center to top-left
    this.tie2 = new Tie(this, this.star1, this.star3);  // Connect center to bottom-right
}

function update() {
    // No updates needed for a static black screen
}
