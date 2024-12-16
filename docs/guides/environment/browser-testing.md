# Browser Testing Environment Setup

## Overview
This guide covers the setup and configuration of the browser testing environment for the YOGI ecosystem. Browser testing is essential for verifying UI components, ensuring cross-browser compatibility, and maintaining a high-quality user experience.

## System Requirements

### Required System Libraries:
- libglib-2.0.so.0
- Chromium dependencies:
  * libX11-xcb
  * libXcomposite
  * libXcursor
  * libXdamage
  * libXext
  * libXi
  * libXrender
  * libXtst
  * libgbm
  * libxcb
  * libxshmfence

## Nix Configuration

Add to `.idx/dev.nix`:

```nix
{ pkgs, ... }:

{
  packages = with pkgs; [
    # System libraries
    glib

    # Chromium dependencies
    xorg.libX11
    xorg.libXcomposite
    xorg.libXcursor
    xorg.libXdamage
    xorg.libXext
    xorg.libXi
    xorg.libXrender
    xorg.libXtst
    mesa.drivers
    xorg.libxcb
    xorg.libxshmfence

    # Browser
    chromium
  ];

  # Environment variables
  env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "true";
  env.PUPPETEER_EXECUTABLE_PATH = "${pkgs.chromium}/bin/chromium";
}
```

## Testing Setup

### Jest Configuration:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};
```

## Running Tests

### Component Tests:
```bash
npm test
```

### Browser Tests:
```bash
npm run test:browser
```

## Troubleshooting

### Common Issues:

1. **Missing Libraries**
   - Error: \`error while loading shared libraries: libglib-2.0.so.0: cannot open shared object file\`
   - Solution: Ensure all required system libraries are included in your Nix configuration.

2. **Browser Launch Failures**
   - Error: \`Failed to launch browser\`
   - Solution: Verify Chromium is properly installed and PUPPETEER_EXECUTABLE_PATH is correctly set.

## Verification Steps

1. Verify Nix configuration:
   ```bash
   nix develop
   ```

2. Verify Chromium:
   ```bash
   which chromium
   ```

3. Run tests:
   ```bash
   npm run test:browser
   ```

## Next Steps

1. Set up continuous integration
2. Add more component tests
3. Configure cross-browser testing
4. Implement visual regression testing
