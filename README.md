# 🐔 El Pollo Loco - JavaScript Canvas Game

🌵 **Embark on an epic Mexican adventure!** 🌵

Step into the boots of Pepe, a brave Mexican warrior on a quest to save his village from the evil chicken army! This isn't just another platformer – it's a masterfully crafted, pixel-perfect adventure that combines classic 2D gameplay with modern web technology. Built entirely with vanilla JavaScript and HTML5 Canvas, El Pollo Loco delivers console-quality gaming directly in your browser.

🔥 **What makes El Pollo Loco special?**
- **Zero Downloads Required** - Jump straight into action from any device
- **Authentic Mexican Atmosphere** - Immerse yourself in vibrant desert landscapes with traditional guitar melodies
- **Silky-Smooth 60FPS Gameplay** - Professional-grade animation system with hand-crafted sprite work
- **Cross-Platform Perfection** - Seamlessly optimized for desktop keyboards and mobile touch controls
- **Epic Boss Battles** - Face off against the legendary El Pollo Diablo in intense final showdowns
- **Progressive Difficulty** - From casual fun to hardcore platforming challenges
- **Retro-Modern Fusion** - Classic platformer mechanics enhanced with contemporary web standards

🎮 **The Ultimate Platforming Experience:** Master Pepe's acrobatic abilities as you run, jump, and battle through sun-baked Mexican landscapes. Collect shimmering coins, dodge cunning chickens, and unleash devastating salsa bottle attacks in this action-packed adventure that pays homage to the golden age of 2D platformers while pushing the boundaries of what's possible in a web browser.

## 🎮 Game Features

### 🕹️ Gameplay Mechanics
- **Character Movement**: Smooth left/right movement with realistic physics
- **Jumping System**: Variable jump height based on key press duration
- **Combat Mechanics**: Throw bottles at enemies to defeat them
- **Enemy AI**: Multiple enemy types with different behaviors
- **Boss Battles**: Epic final boss with multiple attack patterns
- **Collision Detection**: Precise collision system for all game objects
- **Health System**: Visual health bars for player and boss
- **Scoring System**: Collect coins and defeat enemies for points

### 🎵 Audio System
- **Background Music**: Atmospheric Mexican guitar soundtrack
- **Sound Effects**: Individual sounds for:
  - Character actions (jump, hurt, running)
  - Enemy interactions (chicken sounds, boss attacks)
  - Item collection (coin pickup)
  - Environmental sounds (bottle breaking, impacts)
- **Audio Management**: Complete mute/unmute functionality with localStorage persistence
- **Dynamic Volume**: Context-sensitive audio levels

### 📱 Cross-Platform Support
- **Desktop Controls**: Full keyboard support
- **Mobile Interface**: Touch-optimized controls for mobile devices
- **Responsive Design**: Adapts to different screen sizes
- **iOS Safari Optimization**: Custom fullscreen implementation for iPhone
- **Touch Detection**: Automatic device detection and UI adjustment

### 🎨 Visual Features
- **Sprite Animation**: Smooth character and enemy animations
- **Parallax Backgrounds**: Multi-layer scrolling backgrounds
- **Visual Effects**: Dynamic particle effects and animations
- **UI Elements**: Professional game interface with status bars
- **Loading Screen**: Polished loading experience

## 🎯 Controls

### 🖥️ Desktop Controls
- **◀️ Left Arrow**: Move character left
- **▶️ Right Arrow**: Move character right  
- **⬆️ Up Arrow**: Jump (hold for higher jumps)
- **⬇️ Down Arrow**: Duck/crouch
- **Spacebar**: Throw bottles at enemies
- **Any Key**: Start game from welcome screen

### 📱 Mobile Controls
- **Touch Buttons**: On-screen directional and action buttons
- **Tap to Start**: Touch anywhere on mobile welcome screen
- **Fullscreen Support**: Automatic fullscreen mode on supported devices
- **Gesture Recognition**: Optimized touch response

### 🔧 System Controls
- **🔇/🔊 Mute Button**: Toggle all game audio
- **⛶ Fullscreen Button**: Enter/exit fullscreen mode
- **❓ Help Button**: Display control instructions
- **🏠 Home Button**: Return to main menu

## 🚀 Getting Started

### 📋 Prerequisites
- Modern web browser with HTML5 Canvas support
- JavaScript enabled
- Audio support (optional but recommended)
- Minimum screen resolution: 800x600

### 🛠️ Installation Options

#### Option 1: Direct Browser Launch
1. **Download**: Clone or download the repository
   ```bash
   git clone https://github.com/MortezaChinahkash/El-Pollo-Loco.git
   ```
2. **Navigate**: Open the project folder
3. **Launch**: Double-click `index.html` or drag it into your browser

#### Option 2: Local Server (Recommended)
1. **Python Server**:
   ```bash
   cd El-Pollo-Loco
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

2. **Node.js Server**:
   ```bash
   npx http-server
   ```
   
3. **Live Server Extension** (VS Code):
   - Install Live Server extension
   - Right-click `index.html` → "Open with Live Server"

### 🌐 Browser Compatibility
- ✅ **Chrome** 80+ (Recommended)
- ✅ **Firefox** 75+
- ✅ **Safari** 13+ (iOS optimized)
- ✅ **Edge** 80+
- ⚠️ **Internet Explorer**: Not supported

## 📁 Detailed Project Structure

### 📂 Root Directory
```
El-Pollo-Loco/
├── index.html              # Main entry point with HTML structure
├── impressum.html           # Legal/imprint page
├── README.md               # This documentation file
└── FINAL_COMPLETION_REPORT.md  # Development completion report
```

### 📂 JavaScript Architecture (`/js/`)
```
js/
├── game.js                 # Core game initialization and main loop
├── gameHelpers.js          # UI utilities and helper functions
├── levelUtils.js           # Level creation and world management
├── soundDefinitions.js     # Audio system and sound definitions
├── uiUtils.js             # User interface utilities
└── performance.config.js   # Performance optimization settings
```

### 📂 Object-Oriented Classes (`/classes.js/`)
```
classes.js/
├── character.class.js      # Main player character
├── character-animation.class.js    # Animation system
├── character-audio.class.js        # Character sound effects
├── character-images.class.js       # Sprite management
├── character-input.class.js        # Input handling
├── movableObject.class.js          # Base movement physics
├── drawableObject.class.js         # Rendering foundation
├── world.class.js                  # Game world management
├── level.class.js                  # Level structure
├── chicken.class.js                # Enemy chickens
├── endboss.class.js               # Final boss enemy
├── throwableObject.class.js       # Projectile physics
├── collectableItem.class.js       # Coins and pickups
├── statusbars.class.js            # Health/status UI
├── backgroundobjects.class.js     # Environmental objects
├── cloud.classes.js               # Background clouds
├── keyboard.class.js              # Input state management
└── soundManager.class.js          # Comprehensive audio system
```

### 📂 Stylesheets (`/css/`)
```
css/
├── base.css               # Core styling and CSS reset
├── game.css              # Game canvas and layout
├── ui.css                # User interface elements
├── welcome.css           # Welcome screen styling
├── mobile.css            # Mobile-responsive design
└── impressum.css         # Legal page styling
```

### 📂 Assets (`/img/` & `/audio/`)
```
img/
├── img_pollo_locco/      # Main game sprites
│   ├── 1_editables/      # Source files (AI format)
│   ├── 2_character_pepe/ # Player character sprites
│   ├── 3_enemies_chicken/# Enemy sprites
│   ├── 4_enemie_boss_chicken/  # Boss sprites
│   ├── 5_background/     # Background images
│   ├── 6_salsa_bottle/   # Projectile sprites
│   ├── 7_statusbars/     # UI elements
│   ├── 8_coin/          # Collectible sprites
│   └── 9_intro_outro_screens/  # Menu screens
└── [various UI icons]

audio/
├── background/           # Background music
├── character/           # Player sound effects
├── enemies/            # Enemy sound effects
└── environment/        # Environmental sounds
```

## ⚙️ Technical Implementation

### 🎯 Core Technologies
- **HTML5 Canvas API**: 2D rendering engine
- **Vanilla JavaScript ES6+**: No external dependencies
- **CSS3**: Responsive design and animations
- **Web Audio API**: Advanced sound management
- **Local Storage API**: Settings persistence

### 🏗️ Architecture Patterns
- **Object-Oriented Programming**: Modular class-based design
- **Inheritance**: Shared functionality through base classes
- **Composition**: Complex objects built from simpler components
- **Observer Pattern**: Event-driven audio and input systems
- **Module Pattern**: Separated concerns across multiple files

### 🔄 Game Loop Architecture
```javascript
// Simplified game loop structure
function gameLoop() {
    clearCanvas();           // Clear previous frame
    updateGameObjects();     // Update positions and states
    checkCollisions();       // Handle object interactions
    updateAnimations();      // Advance sprite animations
    renderGameObjects();     // Draw all objects to canvas
    updateUI();             // Update status bars and overlays
    requestAnimationFrame(gameLoop);  // Schedule next frame
}
```

### � Performance Optimizations
- **Object Pooling**: Reuse objects to reduce garbage collection
- **Efficient Collision Detection**: Spatial partitioning for performance
- **Sprite Batching**: Optimized rendering calls
- **Asset Preloading**: Smooth gameplay without loading delays
- **Memory Management**: Careful cleanup of unused resources

## 🎵 Audio System Details

### 🔊 Sound Categories
1. **Background Music**: Looping atmospheric tracks
2. **Player Actions**: Movement and interaction sounds
3. **Enemy Audio**: Creature-specific sound effects
4. **Environmental**: Ambient and impact sounds
5. **UI Feedback**: Button clicks and menu sounds

### 🎛️ Audio Features
- **Volume Control**: Individual volume levels per sound type
- **Spatial Audio**: Positional sound effects (planned feature)
- **Audio Compression**: Optimized file sizes for web delivery
- **Fallback Support**: Graceful degradation when audio unavailable

## 📱 Mobile Optimization

### 🎮 Touch Interface
- **Virtual D-Pad**: Intuitive directional controls
- **Action Buttons**: Large, accessible touch targets
- **Gesture Recognition**: Swipe and tap interactions
- **Haptic Feedback**: Vibration support where available

### 📐 Responsive Design
- **Viewport Adaptation**: Automatic scaling for different screens
- **Orientation Support**: Both portrait and landscape modes
- **Safe Area Handling**: iPhone notch and gesture area awareness
- **Performance Scaling**: Adjusted frame rates for mobile devices

## � Troubleshooting

### ❌ Common Issues

#### Audio Not Playing
- **Check Mute Status**: Ensure game isn't muted
- **Browser Autoplay Policy**: Interact with page before audio starts
- **File Paths**: Verify audio files are correctly loaded
- **Browser Support**: Update to latest browser version

#### Performance Issues
- **Hardware Acceleration**: Enable in browser settings
- **Close Background Tabs**: Free up system resources
- **Graphics Drivers**: Update to latest versions
- **Browser Cache**: Clear cache and hard reload

#### Mobile Controls Not Responsive
- **Touch Calibration**: Ensure touch events are properly registered
- **iOS Safari**: Check fullscreen mode activation
- **Screen Size**: Verify minimum viewport requirements
- **JavaScript Errors**: Check browser console for errors

### 🔧 Development Mode
Enable debug features by adding to localStorage:
```javascript
localStorage.setItem('debugMode', 'true');
localStorage.setItem('showCollisionBoxes', 'true');
localStorage.setItem('showFPS', 'true');
```

## 🚀 Future Enhancements

### 🎯 Planned Features
- **Multiple Levels**: Additional worlds and challenges
- **Power-ups**: Temporary ability enhancements
- **Multiplayer Mode**: Local or online cooperative play
- **Save System**: Progress persistence across sessions
- **Achievements**: Unlockable goals and rewards
- **Customization**: Character skins and equipment

### �️ Technical Improvements
- **WebGL Renderer**: Hardware-accelerated graphics
- **Progressive Web App**: Offline play capability
- **Advanced Physics**: More realistic movement and collisions
- **Particle Systems**: Enhanced visual effects
- **Dynamic Loading**: Streaming assets for faster startup

## 👥 Contributing

### 🤝 How to Contribute
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Commit** changes: `git commit -am 'Add feature'`
4. **Push** to branch: `git push origin feature-name`
5. **Create** a Pull Request

### 📝 Contribution Guidelines
- Follow existing code style and patterns
- Add JSDoc comments for new functions
- Test thoroughly on multiple browsers
- Update documentation for new features
- Keep commits focused and atomic

## 📜 License & Credits

### 📄 License
This project is released under the MIT License. Feel free to use, modify, and distribute according to the license terms.

### 🙏 Credits
- **Game Development**: Original concept and implementation
- **Art Assets**: Custom sprite work and animations
- **Audio**: Licensed background music and sound effects
- **Inspiration**: Classic 2D platformer games

### 🎨 Asset Attribution
- Background music: [Source attribution]
- Sound effects: [Source attribution]
- Sprite artwork: Original creations

## 📞 Support

### 💬 Get Help
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Check this README for detailed information
- **Community**: Join discussions in project forums

### 📧 Contact
For questions, suggestions, or collaboration opportunities, please reach out through the repository's communication channels.

---

**🎮 Ready to play? Open `index.html` and start your El Pollo Loco adventure!**
