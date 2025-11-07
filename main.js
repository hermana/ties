//import backgroundMusic from './components/assets/chill_piano/Loops/mp3/echos.mp3';

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: '#070738', // Black background
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the game
const game = new Phaser.Game(config);

function preload() {
     this.load.audio('backgroundMusic', 'components/assets/chill_piano/Loops/mp3/echos.mp3');
}

function create() {
    const scene = this;

    this.backgroundMusic = this.sound.add('backgroundMusic');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
    
    // Store stars and ties in arrays for dynamic management
    scene.stars = [];
    scene.ties = [];
    
    // Track "Add Tie" mode state
    scene.addTieMode = false;
    scene.selectedStarForTie = null;
    
    // Define scene methods
    scene.enterAddTieMode = function() {
        scene.addTieMode = true;
        scene.selectedStarForTie = null;
        const addTieBtn = document.getElementById('add-tie-btn');
        if (addTieBtn) {
            addTieBtn.classList.add('active');
            addTieBtn.textContent = 'Cancel Add Tie';
        }
    };
    
    scene.exitAddTieMode = function() {
        // Reset selected star color if one was selected
        if (scene.selectedStarForTie) {
            scene.selectedStarForTie.circle.setFillStyle(0xffffff); // Reset to white
        }
        
        scene.addTieMode = false;
        scene.selectedStarForTie = null;
        const addTieBtn = document.getElementById('add-tie-btn');
        if (addTieBtn) {
            addTieBtn.classList.remove('active');
            addTieBtn.textContent = 'Add Tie';
        }
    };
    
    scene.handleStarClickForTie = function(star) {
        if (!scene.selectedStarForTie) {
            // First star selected
            scene.selectedStarForTie = star;
            // Visual feedback - highlight the star
            star.circle.setFillStyle(0xffff00); // Yellow highlight
        } else if (scene.selectedStarForTie === star) {
            // Clicked the same star - deselect
            scene.selectedStarForTie.circle.setFillStyle(0xffffff); // Reset to white
            scene.selectedStarForTie = null;
        } else {
            // Second star selected - create Tie
            const newTie = new Tie(scene, scene.selectedStarForTie, star);
            scene.ties.push(newTie);
            
            // Reset first star color
            scene.selectedStarForTie.circle.setFillStyle(0xffffff);
            
            // Exit Add Tie mode
            scene.exitAddTieMode();
        }
    };
    
    scene.setupStarClickHandler = function(star) {
        // Override dragend handler to check for Add Tie mode
        star.removeAllListeners('dragend');
        star.on('dragend', () => {
            if (!star.hasMoved) {
                // Check if we're in Add Tie mode
                if (scene.addTieMode) {
                    scene.handleStarClickForTie(star);
                } else {
                    // Normal behavior - start typing
                    star.startTyping();
                }
            }
            star.isDragging = false;
            star.hasMoved = false;
        });
        
        // Override pointerup handler
        star.removeAllListeners('pointerup');
        star.on('pointerup', (pointer) => {
            setTimeout(() => {
                if (!star.isDragging && !star.hasMoved) {
                    if (scene.addTieMode) {
                        scene.handleStarClickForTie(star);
                    } else {
                        star.startTyping();
                    }
                }
            }, 10);
        });
    };
    
    // Create initial Star instances at different positions
    scene.star1 = new Star(scene, 400, 300, 60);  // Center star
    scene.star2 = new Star(scene, 200, 150, 50);  // Top-left star
    scene.star3 = new Star(scene, 600, 450, 45);  // Bottom-right star
    
    // Add initial stars to array
    scene.stars.push(scene.star1, scene.star2, scene.star3);

    // Create Tie instances to connect the stars
    scene.tie1 = new Tie(scene, scene.star1, scene.star2);  // Connect center to top-left
    scene.tie2 = new Tie(scene, scene.star1, scene.star3);  // Connect center to bottom-right
    
    // Add initial ties to array
    scene.ties.push(scene.tie1, scene.tie2);
    
    // Set up click handlers for initial stars
    scene.stars.forEach(star => {
        scene.setupStarClickHandler(star);
    });
    
    // Set up "Add Star" button functionality
    const addStarBtn = document.getElementById('add-star-btn');
    if (addStarBtn) {
        addStarBtn.addEventListener('click', () => {
            // Exit Add Tie mode if active
            if (scene.addTieMode) {
                scene.exitAddTieMode();
            }
            
            // Generate random position within game bounds
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            const radius = Phaser.Math.Between(40, 60);
            
            // Create new star
            const newStar = new Star(scene, x, y, radius);
            scene.stars.push(newStar);
            
            // Set up click handler for the new star
            scene.setupStarClickHandler(newStar);
        });
    }
    
    // Set up "Add Tie" button functionality
    const addTieBtn = document.getElementById('add-tie-btn');
    if (addTieBtn) {
        addTieBtn.addEventListener('click', () => {
            if (scene.addTieMode) {
                // Exit Add Tie mode
                scene.exitAddTieMode();
            } else {
                // Enter Add Tie mode
                scene.enterAddTieMode();
            }
        });
    }
}

function update() {
    // No updates needed for a static black screen
}
