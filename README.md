# ⚡ LeetCode Focus

> Stay focused. Solve problems. Build consistency.

A Chrome extension that blocks distracting websites until you complete your daily LeetCode Practice. Build a consistent problem-solving habit with enforced discipline!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## 🎯 Features

### 🔒 **Smart Website Blocking**
- Automatically redirects all websites to LeetCode until you meet your daily goal
- Loop-safe blocking mechanism prevents circumvention
- Keeps you focused on what matters

### 📊 **Two Powerful Modes**

#### **Any Problem Mode**
- Solve any LeetCode problem to unlock the web
- Set custom daily targets (1-100 problems)
- Perfect for consistent practice and skill building

#### **Daily Challenge Mode** 🆕
- **Must solve LeetCode's official daily challenge**
- Fixed target of 1 problem per day
- Other problems won't count - only the daily challenge unlocks the web
- Build a streak on the most challenging problems

### 🚨 **Emergency Break**
- Need to access the web urgently?
- Temporarily pause blocking (1-240 minutes)
- Countdown timer shows remaining break time
- Easy to resume blocking

### 📈 **Progress Tracking**
- Real-time progress display
- Daily quota visualization
- Automatic reset at midnight
- Prevents duplicate counting

### 🎨 **Beautiful UI**
- Modern gradient design
- Smooth animations
- Clean, intuitive interface
- Responsive layout

## 📦 Installation

### Method 1: Load Unpacked Extension (Recommended)

1. **Download the Extension**
   - Download `LeetCode-Focus.zip` from the releases
   - Extract the ZIP file to a folder on your computer

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → Extensions → Manage Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the extracted `LeetCode-Focus` folder
   - The extension will now appear in your extensions list

5. **Pin the Extension** (Optional)
   - Click the puzzle icon in the Chrome toolbar
   - Find "LeetCode Focus" and click the pin icon
   - The extension icon will now appear in your toolbar

### Method 2: Install from Chrome Web Store
*Coming soon!*

## 🚀 How to Use

### First-Time Setup

1. **Click the Extension Icon**
   - Click the LeetCode Focus icon in your toolbar
   - The popup will open showing your settings

2. **Choose Your Mode**
   - **Any Problem**: Solve any problem to unlock (default)
   - **Daily Problem**: Only the daily challenge counts

3. **Set Your Target** (Any Problem mode only)
   - Choose how many problems you want to solve daily (1-100)
   - Daily Problem mode is always fixed at 1

4. **Save Settings**
   - Click "💾 Save Settings"
   - The extension is now active!

### Daily Usage

#### **Solving Problems**

1. Navigate to a LeetCode problem
2. Write your solution
3. Click "Submit"
4. Get "Accepted" status
5. The extension automatically detects and counts it!

#### **Checking Progress**

- Click the extension icon to see your progress
- Badge shows current count (e.g., "0/1", "1/3")
- Badge color:
  - 🔴 Red: Quota not met
  - 🟢 Green: Quota completed!
  - ⏸️ Gray: On break

#### **Taking a Break**

1. Click the extension icon
2. Scroll to "Emergency Break" section
3. Set duration (1-240 minutes)
4. Click "⏸️ Start" button
5. Websites are now accessible
6. Click "▶️ End" to resume blocking early

### Advanced Settings

Click "Options" or right-click the extension icon → Options for:
- Detailed mode explanations
- Larger, more comfortable interface
- Same functionality as popup

## 🔧 Technical Details

### How It Works

#### **Website Blocking**
- Uses Chrome's `declarativeNetRequest` API
- Two-rule system prevents redirect loops:
  1. **Allow Rule** (Priority 2): Allows LeetCode domains
  2. **Redirect Rule** (Priority 1): Redirects everything else to LeetCode

#### **Problem Detection**
- Content script injected into LeetCode problem pages
- Detects "Submit" button clicks
- Arms a 10-minute detection window
- Watches for "Accepted" status in the DOM
- Prevents duplicate counting per problem

#### **Daily Challenge Detection**
- Checks URL patterns for daily challenge indicators
- Scans DOM for calendar icons and daily badges
- Only counts daily challenge in "Daily Problem" mode

#### **Data Storage**
- Uses Chrome's `storage.local` API
- Stores settings, progress, and break status
- Daily progress tracked by date (YYYY-MM-DD)
- Automatically resets at midnight

### File Structure

```
LeetCode-Focus/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (blocking logic)
├── content.js            # Problem detection script
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── options.html          # Options page UI
├── options.js            # Options logic
├── icons/
│   ├── icon16.png       # Toolbar icon
│   └── icon48.png       # Extension page icon
└── README.md            # This file
```

## 🎨 Screenshots

### Popup Interface

![LeetCode Focus Popup](screenshots/popup.png)

**Features shown:**
- Today's progress with gradient card
- Mode selector with dynamic hints  
- Daily target input (Any Problem mode)
- Emergency break controls with live countdown
- Clean, modern design with smooth animations

### Options Page

![LeetCode Focus Options Page](screenshots/options.png)

**Features shown:**
- Full-screen settings interface
- Detailed mode explanations with info boxes
- Large, comfortable controls
- Beautiful gradient background
- Progress tracking with motivational badges

---

## ⚙️ Permissions Explained

The extension requires these permissions:

- **`storage`**: Save your settings and daily progress
- **`alarms`**: Schedule break timers
- **`declarativeNetRequest`**: Block/redirect websites
- **`scripting`**: Inject detection script on LeetCode pages
- **`tabs`**: Monitor tab changes for blocking updates
- **`<all_urls>`**: Access to redirect non-LeetCode sites
- **`https://leetcode.com/*`**: Detect solved problems

## 🛠️ Troubleshooting

### Extension not blocking websites?
- Check if you've met your daily quota
- Verify you're not on an emergency break
- Try refreshing the page
- Restart the extension

### Problem not being detected?
- Make sure you clicked "Submit" (not "Run Code")
- Wait for "Accepted" status to appear
- Check if you're in Daily mode but solving a non-daily problem

### Progress not showing correctly?
- Check the extension icon badge
- Open popup to verify count
- Settings may need to be re-saved

### Emergency break not working?
- Click "Start Break" again
- Try refreshing the extension
- Check remaining time in the popup

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue with details
2. **Suggest Features**: Share your ideas
3. **Submit PRs**: Fork, code, and submit pull requests
4. **Improve Docs**: Help make the README better

## 📜 License

MIT License - feel free to use, modify, and distribute!

## 🙏 Acknowledgments

- Inspired by productivity tools like Cold Turkey and Freedom
- Built for the LeetCode community
- Special thanks to all problem solvers building consistency!

## 📧 Support

Having issues or questions?
- Open an issue on GitHub
- Check the Troubleshooting section
- Review the FAQ below

## ❓ FAQ

**Q: Can I whitelist certain websites?**  
A: Currently, no. The extension blocks all non-LeetCode sites to maintain focus. This is intentional for maximum productivity.

**Q: Does it work on LeetCode CN?**  
A: Yes! The extension supports both leetcode.com and leetcode.cn.

**Q: What happens at midnight?**  
A: Your progress resets automatically. You'll need to solve problems again the next day.

**Q: Can I use this on other browsers?**  
A: Currently only Chrome and Chromium-based browsers (Edge, Brave, etc.) are supported.

**Q: Will my progress sync across devices?**  
A: Not yet. Progress is stored locally on each device.

**Q: What if I solve a problem without clicking Submit?**  
A: The extension only counts problems when you click Submit and get Accepted. Run Code doesn't count.

**Q: Can I set different targets for weekdays/weekends?**  
A: Not currently. The target is the same every day. This may be added in a future version.

## 🚀 Roadmap

### Planned Features
- [ ] Weekly/monthly statistics
- [ ] Difficulty-based quotas (Easy=1, Medium=2, Hard=3)
- [ ] Export/import progress data
- [ ] Sync across devices
- [ ] Customizable redirect destinations
- [ ] Whitelist for educational sites
- [ ] Notifications when quota is met
- [ ] Streak tracking
- [ ] Dark mode
- [ ] Language localization

### Coming Soon
- Chrome Web Store release
- Firefox support
- Mobile companion app

---

**Made with 💜 for productive developers**

*Happy Coding! Keep solving, keep improving!* 🚀
