# WebXR VR Canvas Panel

An interactive VR application built with Three.js that demonstrates WebXR capabilities with a floating interactive canvas panel and custom controller implementations.

## Features

- Interactive 320x180 canvas panel positioned in front of the user
- Custom controller models with visual feedback
- Raycasting-based interaction system
- Fallback controller models for WebXR emulator compatibility
- Real-time visual feedback for controller interactions
- Status messages for VR session management
- Support for both VR headsets and WebXR emulator

## Prerequisites

- A WebXR-capable browser (Chrome, Firefox, or Edge with WebXR support)
- For development: WebXR emulator extension
- Local development server (e.g., Python's `http.server`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start a local server:
```bash
python3 -m http.server 8000
```

3. Open in your browser:
```
http://localhost:8000/vr-canvas.html
```

## Usage

1. Open the application in a WebXR-capable browser
2. Click the "Enter VR" button to start the VR session
3. Use your VR controllers to interact with the canvas panel:
   - Red pointer ray indicates right controller
   - Blue pointer ray indicates left controller
   - Controller position shown by glowing spheres
   - Trigger buttons for interaction

## Implementation Details

### Files
- `vr-canvas.html`: Main entry point with WebXR setup and styling
- `vr-scene.js`: Core VR implementation with Three.js

### Key Components

#### Canvas Panel
- 320x180 interactive surface
- Positioned at eye level for optimal visibility
- Supports raycaster interactions

#### Controller Implementation
```javascript
// Custom controller model with:
- Body (colored box)
- Trigger button
- Position indicator
- Directional ray
```

#### VR Session Management
- Proper session initialization/cleanup
- Status message system
- Error handling for WebXR support

## Development

### WebXR Emulator Setup
1. Install the WebXR emulator extension
2. Open browser developer tools
3. Select WebXR tab
4. Choose a device to emulate

### Debugging Tips
- Check browser console for status messages
- Monitor controller model loading
- Use the WebXR emulator for testing without VR hardware

## Browser Support

- Chrome 79+
- Firefox 73+
- Edge 79+
- Oculus Browser 7+

## Dependencies

- Three.js (version 0.160.0)
- ES Module Shims for import map support

## License

[Your chosen license]

## Contributing

[Your contribution guidelines] 
