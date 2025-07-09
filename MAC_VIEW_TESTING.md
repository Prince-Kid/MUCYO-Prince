# Testing Mac View and Profile Image

## How to Test the Mac View

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** to the development server URL (usually http://localhost:5173)

3. **Switch to Mac view** by typing the following command in the terminal:
   ```
   mac
   ```

4. **Switch back to terminal view** by typing:
   ```
   terminal
   ```

## Profile Image Setup

The profile image should be located at `public/profile.jpg`. The current implementation:

- ✅ Has fallback UI with User icon if image fails to load
- ✅ Uses black & white filter with hover color effect
- ✅ Has modern glassmorphism design
- ✅ Includes online status indicator and floating animations

## Troubleshooting

If you can't see the Mac view or profile image:

1. **Check browser console** for any JavaScript errors
2. **Verify image path** - make sure `public/profile.jpg` exists
3. **Try the test commands**:
   - Type `help` to see all available commands
   - Type `mac` to switch to Mac desktop view
   - Type `terminal` to return to terminal view

## Features in Mac View

- 🍎 Mac-style menu bar with system indicators
- 👤 Profile card with black & white photo effect
- 📊 Quick stats (projects, experience, satisfaction)
- 🎨 Modern glassmorphism design
- 📖 Floating Bible verse widget
- 🎯 Action buttons (Terminal, Contact, GitHub)
- 🔵 Mac-style dock at bottom
- ✨ Floating particle animations

## Key Commands to Test

- `mac` - Switch to Mac desktop view
- `terminal` - Return to terminal view  
- `help` - Show all available commands
- `about` - Personal information
- `projects` - Featured projects
- `contact` - Contact information

The Mac view should be fully functional with the profile image displaying (with fallback if image doesn't load).
