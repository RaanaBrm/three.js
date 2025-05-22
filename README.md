# WebXR VR Interactive Environment

A virtual reality application built with Three.js and WebXR, featuring interactive controllers and a dynamic 3D environment.

## Features

- Immersive VR environment with WebXR support
- Custom controller visualization with:
  - Color-coded controllers (red for right, blue for left)
  - Visual movement trails
  - Direction indicators
  - Interactive ray casting
- Real-time controller position tracking
- Support for both VR headsets and WebXR emulator
- Responsive design and smooth performance

## Prerequisites

- A WebXR-compatible browser (Chrome, Firefox, or Edge)
- For development: WebXR emulator extension
- Local development server

## Quick Start

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Start a local server (using Python):
```bash
python -m http.server 8000
```

3. Open in your browser:
```
http://localhost:8000/vr-canvas.html
```

## Using the Application

### With VR Headset
1. Connect your VR headset to your computer
2. Open the application in a WebXR-compatible browser
3. Click "Enter VR" to start
4. Use your physical controllers to interact with the environment

### With WebXR Emulator
1. Install the WebXR emulator extension
2. Open browser developer tools (F12)
3. Select the "WebXR" tab
4. Choose "Quest 3" or another device from the dropdown
5. Use the position sliders to move controllers:
   - X, Y, Z for position
   - Rotation sliders for orientation
   - Buttons for trigger and grip actions

## Project Structure

```
├── vr-canvas.html      # Main entry point and HTML structure
├── vr-scene.js         # Core VR scene and WebXR setup
├── controller-cubes.js # Controller visualization
└── controller-rays.js  # Ray casting and interaction
```

## Controls

- Left Controller (Blue):
  - Trigger: Activate interaction ray
  - Movement: Use emulator sliders or physical controller

- Right Controller (Red):
  - Trigger: Secondary interactions
  - Movement: Use emulator sliders or physical controller

## Development

### Local Development
1. Make changes to the JavaScript files
2. Refresh the browser to see updates
3. Use the WebXR emulator for testing

### Debugging
- Check browser console for messages
- Use WebXR emulator's position display
- Monitor controller state in the WebXR tab

## Browser Support

- Chrome 79+
- Firefox 73+
- Edge 79+
- Oculus Browser 7+

## Technical Details

- Built with Three.js
- Uses WebXR Device API
- ES6 Modules for code organization
- Real-time 3D rendering
- Custom shader materials for visual effects

## Troubleshooting

1. If controllers aren't visible:
   - Check if WebXR emulator is active
   - Verify browser compatibility
   - Ensure JavaScript is enabled

2. If movement isn't working:
   - Check controller position sliders in emulator
   - Verify VR session is active
   - Check browser console for errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project for your own learning and development.

## Acknowledgments

- Three.js team for the WebXR implementation
- WebXR Device API contributors
- The VR development community 