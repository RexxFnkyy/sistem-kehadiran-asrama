# 🌐 Setup Network Server - Akses Semua Pengguna

## 🚀 Server Yang Boleh Diakses Semua Orang

### Method 1: Python Server (Mudah & Pantas)

#### Step 1: Start Network Server
```powershell
# Navigate to project folder
cd "d:\PBL SUCCESS\SAD"

# Start server accessible to all network users
python -m http.server 8000 --bind 0.0.0.0
```

#### Step 2: Find Your IP Address
```powershell
# Check your computer's IP address
ipconfig
```
Look for "IPv4 Address" under your active network adapter (WiFi/Ethernet)

#### Step 3: Access from Any Device
- **Your Computer:** `http://localhost:8000`
- **Other Devices:** `http://YOUR_IP_ADDRESS:8000`
- **Example:** `http://192.168.1.100:8000`

### Method 2: Node.js Live Server (With Hot Reload)

#### Setup (One-time)
```powershell
# Install live-server globally
npm install -g live-server
```

#### Start Network Server
```powershell
cd "d:\PBL SUCCESS\SAD"

# Start server accessible to all network users
live-server --host=0.0.0.0 --port=3000
```

Access: `http://YOUR_IP_ADDRESS:3000`

### Method 3: XAMPP (Professional Setup)

#### Setup XAMPP
1. Download & install XAMPP
2. Copy project folder to `C:\xampp\htdocs\SAD\`
3. Start Apache from XAMPP Control Panel
4. Edit `C:\xampp\apache\conf\httpd.conf`:
   ```
   # Find this line and change:
   Listen 80
   # To allow network access:
   Listen 0.0.0.0:80
   ```
5. Restart Apache

#### Access
- **Local:** `http://localhost/SAD/`
- **Network:** `http://YOUR_IP_ADDRESS/SAD/`

## 🔧 Windows Firewall Setup

### Allow Python/Node.js Through Firewall
1. Open **Windows Defender Firewall**
2. Click **"Allow an app or feature through Windows Defender Firewall"**
3. Click **"Change Settings"** → **"Allow another app"**
4. Browse and add:
   - `python.exe` (usually in `C:\Python\`)
   - `node.exe` (if using Node.js)
5. Check both **Private** and **Public** networks
6. Click **OK**

### Alternative: Create Firewall Rule
```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Python Server" dir=in action=allow protocol=TCP localport=8000
netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=3000
```

## 📱 Access from Mobile Devices

### Find Your Computer's IP
1. **Windows:** `ipconfig` in Command Prompt
2. **Look for:** "IPv4 Address" (e.g., 192.168.1.100)

### Connect Mobile/Tablet
1. Connect to **same WiFi network**
2. Open browser on mobile
3. Go to: `http://YOUR_IP_ADDRESS:8000`
4. **Example:** `http://192.168.1.100:8000`

## 🏫 School Network Setup

### For School WiFi/LAN
1. **Check Network Policy** - Some schools block server hosting
2. **Use School Computer** as server host
3. **Share IP Address** with teachers/staff
4. **Alternative:** Use school's web server if available

### Multiple Access Points
```
Teacher's Laptop:    http://192.168.1.100:8000
Admin Computer:      http://192.168.1.101:8000
Staff Room PC:       http://192.168.1.102:8000
```

## 🔒 Security Considerations

### Basic Security
- **Change default passwords** in script.js:
  ```javascript
  const users = {
      admin: { password: 'YOUR_STRONG_PASSWORD', role: 'admin' },
      guru: { password: 'YOUR_TEACHER_PASSWORD', role: 'teacher' }
  };
  ```

### Network Security
- Server only accessible on **local network**
- **No internet exposure** (safe for school use)
- Data stored locally on server computer

## 📊 Multi-User Data Sharing

### Current Limitation
- Data stored in **browser localStorage**
- Each device has **separate data**

### Solution for Shared Data
Create simple backend with Node.js + JSON file:

```javascript
// server.js (Advanced setup)
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('.'));
app.use(express.json());

// Save data endpoint
app.post('/api/save', (req, res) => {
    fs.writeFileSync('data.json', JSON.stringify(req.body));
    res.json({ success: true });
});

// Load data endpoint
app.get('/api/load', (req, res) => {
    try {
        const data = fs.readFileSync('data.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.json({});
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:3000');
});
```

## 🚀 Quick Start Commands

### Python Server (Recommended)
```powershell
cd "d:\PBL SUCCESS\SAD"
python -m http.server 8000 --bind 0.0.0.0
```

### Node.js Server
```powershell
cd "d:\PBL SUCCESS\SAD"
npx live-server --host=0.0.0.0 --port=3000
```

### Check Your IP
```powershell
ipconfig | findstr "IPv4"
```

## 📱 Mobile Access Instructions

### For Teachers/Staff:
1. **Connect to school WiFi**
2. **Open browser** (Chrome/Safari/Firefox)
3. **Type:** `http://[SERVER_IP]:8000`
4. **Login** with provided credentials
5. **Use QR scanner** for attendance

### QR Scanner on Mobile:
- **Camera access** works on mobile browsers
- **Better performance** than desktop for scanning
- **Portrait mode** recommended for scanning

## ⚠️ Troubleshooting

### Can't Access from Other Devices:
1. **Check firewall** settings
2. **Verify IP address** is correct
3. **Ensure same network** (WiFi/LAN)
4. **Try different port** (8080, 3000, 8888)

### Camera Not Working:
- **HTTPS required** for camera on some browsers
- **Use localhost** on server computer
- **Mobile browsers** usually work better

### Performance Issues:
- **Close unused tabs** on server computer
- **Use wired connection** for server
- **Limit concurrent users** (5-10 recommended)

Your network server is now ready for multi-user access! 🎉
