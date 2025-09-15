// Global variables
let currentUser = null;
let students = [];
let attendanceRecords = [];
let qrScanner = null;
let currentStudentId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

function initializeApp() {
    // Load data from localStorage
    loadData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize default data if empty
    if (students.length === 0) {
        initializeDefaultData();
    }
    
    // Update displays
    updateStudentsDisplay();
    updateAttendanceStats();
    updateRecentScans();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Scanner controls
    document.getElementById('start-scanner').addEventListener('click', startQRScanner);
    document.getElementById('stop-scanner').addEventListener('click', stopQRScanner);
    
    // Attendance actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => markAttendance(e.target.dataset.status));
    });
    
    // Student management
    document.getElementById('add-student-btn').addEventListener('click', () => openStudentModal());
    document.getElementById('import-students-btn').addEventListener('click', importStudents);
    document.getElementById('import-help-btn').addEventListener('click', () => openHelpModal('import-help-modal'));
    document.getElementById('export-students-btn').addEventListener('click', exportStudents);
    document.getElementById('download-template').addEventListener('click', downloadTemplate);
    
    // Search and filters
    document.getElementById('student-search').addEventListener('input', filterStudents);
    document.getElementById('class-filter').addEventListener('change', filterStudents);
    document.getElementById('status-filter').addEventListener('change', filterStudents);
    
    // Modal controls
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    document.getElementById('cancel-student').addEventListener('click', closeModal);
    document.getElementById('student-form').addEventListener('submit', saveStudent);
    
    // Login
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Reports
    document.getElementById('generate-report').addEventListener('click', generateReport);
    document.getElementById('export-report-btn').addEventListener('click', exportReport);
    
    // Admin functions
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('backup-data').addEventListener('click', backupData);
    document.getElementById('clear-old-data').addEventListener('click', clearOldData);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        currentUser = { username: 'admin', role: 'admin' };
        document.getElementById('login-modal').classList.remove('active');
        showNotification('Log masuk berjaya!', 'success');
    } else if (username === 'guru' && password === 'guru123') {
        currentUser = { username: 'guru', role: 'teacher' };
        document.getElementById('login-modal').classList.remove('active');
        showNotification('Log masuk berjaya!', 'success');
    } else {
        showNotification('Nama pengguna atau kata laluan salah!', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    document.getElementById('login-modal').classList.add('active');
    showNotification('Log keluar berjaya!', 'info');
}

// Time display
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// Tab switching
function switchTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update displays based on active tab
    if (tabName === 'students') {
        updateStudentsDisplay();
    } else if (tabName === 'reports') {
        updateAttendanceStats();
        generateCharts();
    }
}

// QR Scanner functionality
async function startQRScanner() {
    try {
        const video = document.getElementById('qr-video');
        const canvas = document.getElementById('qr-canvas');
        const context = canvas.getContext('2d');
        
        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        video.srcObject = stream;
        
        document.getElementById('start-scanner').style.display = 'none';
        document.getElementById('stop-scanner').style.display = 'inline-flex';
        
        // Start scanning
        scanQRCode(video, canvas, context);
        
    } catch (error) {
        console.error('Error starting scanner:', error);
        showNotification('Akses kamera ditolak atau tidak tersedia', 'error');
    }
}

function stopQRScanner() {
    const video = document.getElementById('qr-video');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    
    document.getElementById('start-scanner').style.display = 'inline-flex';
    document.getElementById('stop-scanner').style.display = 'none';
    
    // Clear scan result
    document.getElementById('scan-result').innerHTML = `
        <div class="no-scan">
            <i class="fas fa-qrcode"></i>
            <p>Scan a QR code to see student information</p>
        </div>
    `;
}

function scanQRCode(video, canvas, context) {
    function scan() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                handleQRCodeScanned(code.data);
                return;
            }
        }
        
        if (document.getElementById('stop-scanner').style.display !== 'none') {
            requestAnimationFrame(scan);
        }
    }
    
    scan();
}

function handleQRCodeScanned(data) {
    try {
        // Parse QR code data (assuming JSON format)
        const studentData = JSON.parse(data);
        const student = students.find(s => s.id === studentData.id);
        
        if (student) {
            currentStudentId = student.id;
            displayStudentInfo(student);
            showNotification(`Student ${student.name} scanned successfully!`, 'success');
        } else {
            showNotification('Pelajar tidak dijumpai dalam pangkalan data!', 'error');
        }
    } catch (error) {
        // If not JSON, treat as student ID
        const student = students.find(s => s.id === data);
        if (student) {
            currentStudentId = student.id;
            displayStudentInfo(student);
            showNotification(`Student ${student.name} scanned successfully!`, 'success');
        } else {
            showNotification('Kod QR tidak sah atau pelajar tidak dijumpai!', 'error');
        }
    }
}

function displayStudentInfo(student) {
    const scanResult = document.getElementById('scan-result');
    scanResult.innerHTML = `
        <div class="student-info">
            <img src="${student.photo || 'https://via.placeholder.com/60'}" alt="${student.name}" class="student-avatar">
            <div class="student-details">
                <h4>${student.name}</h4>
                <p><strong>ID:</strong> ${student.id}</p>
                <p><strong>Dorm:</strong> ${student.class}</p>
                <p><strong>Telefon:</strong> ${student.phone || 'Tiada'}</p>
            </div>
        </div>
    `;
}

// Attendance marking
function markAttendance(status) {
    if (!currentStudentId) {
        showNotification('Sila imbas kod QR pelajar terlebih dahulu!', 'warning');
        return;
    }
    
    const student = students.find(s => s.id === currentStudentId);
    const now = new Date();
    
    const attendanceRecord = {
        id: generateId(),
        studentId: currentStudentId,
        studentName: student.name,
        class: student.class,
        status: status,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString(),
        timestamp: now.toISOString()
    };
    
    // Remove any existing record for today
    attendanceRecords = attendanceRecords.filter(record => 
        !(record.studentId === currentStudentId && record.date === attendanceRecord.date)
    );
    
    attendanceRecords.push(attendanceRecord);
    saveData();
    
    updateRecentScans();
    updateAttendanceStats();
    
    showNotification(`Kehadiran ditandakan sebagai ${status.toUpperCase()} untuk ${student.name}`, 'success');
    
    // Clear current selection
    currentStudentId = null;
    document.getElementById('scan-result').innerHTML = `
        <div class="no-scan">
            <i class="fas fa-qrcode"></i>
            <p>Scan a QR code to see student information</p>
        </div>
    `;
}

// Student management
function openStudentModal(student = null) {
    const modal = document.getElementById('student-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('student-form');
    
    if (student) {
        title.textContent = 'Edit Pelajar';
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-class').value = student.class;
        document.getElementById('student-phone').value = student.phone || '';
        document.getElementById('student-email').value = student.email || '';
    } else {
        title.textContent = 'Tambah Pelajar Baru';
        form.reset();
        document.getElementById('student-id').value = generateStudentId();
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        if (!modal.id.includes('login')) {
            modal.classList.remove('active');
        }
    });
}

function openHelpModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function saveStudent(e) {
    e.preventDefault();
    
    const studentData = {
        id: document.getElementById('student-id').value,
        name: document.getElementById('student-name').value,
        class: document.getElementById('student-class').value,
        phone: document.getElementById('student-phone').value,
        email: document.getElementById('student-email').value,
        photo: null, // Will be handled separately for file upload
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    // Handle photo upload
    const photoFile = document.getElementById('student-photo').files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            studentData.photo = e.target.result;
            saveStudentData(studentData);
        };
        reader.readAsDataURL(photoFile);
    } else {
        saveStudentData(studentData);
    }
}

function saveStudentData(studentData) {
    const existingIndex = students.findIndex(s => s.id === studentData.id);
    
    if (existingIndex >= 0) {
        students[existingIndex] = { ...students[existingIndex], ...studentData };
        showNotification('Pelajar berjaya dikemaskini!', 'success');
    } else {
        students.push(studentData);
        showNotification('Pelajar berjaya ditambah!', 'success');
    }
    
    saveData();
    updateStudentsDisplay();
    updateClassFilter();
    closeModal();
}

function deleteStudent(studentId) {
    if (confirm('Adakah anda pasti mahu memadam pelajar ini?')) {
        students = students.filter(s => s.id !== studentId);
        attendanceRecords = attendanceRecords.filter(r => r.studentId !== studentId);
        saveData();
        updateStudentsDisplay();
        showNotification('Pelajar berjaya dipadam!', 'success');
    }
}

function updateStudentsDisplay() {
    const grid = document.getElementById('students-grid');
    const filteredStudents = getFilteredStudents();
    
    grid.innerHTML = filteredStudents.map(student => `
        <div class="student-card">
            <div class="student-card-header">
                <img src="${student.photo || 'https://via.placeholder.com/50'}" alt="${student.name}" class="student-card-avatar">
                <div class="student-card-info">
                    <h4>${student.name}</h4>
                    <p>ID: ${student.id} | Dorm: ${student.class}</p>
                </div>
            </div>
            <div class="student-card-actions">
                <button class="icon-btn edit" onclick="openStudentModal(${JSON.stringify(student).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn qr" onclick="generateStudentQR('${student.id}')">
                    <i class="fas fa-qrcode"></i>
                </button>
                <button class="icon-btn delete" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getFilteredStudents() {
    const search = document.getElementById('student-search').value.toLowerCase();
    const classFilter = document.getElementById('class-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    return students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(search) || 
                            student.id.toLowerCase().includes(search);
        const matchesClass = !classFilter || student.class === classFilter;
        const matchesStatus = !statusFilter || student.status === statusFilter;
        
        return matchesSearch && matchesClass && matchesStatus;
    });
}

function filterStudents() {
    updateStudentsDisplay();
}

function updateClassFilter() {
    const classFilter = document.getElementById('class-filter');
    const classes = [...new Set(students.map(s => s.class))].sort();
    
    const currentValue = classFilter.value;
    classFilter.innerHTML = '<option value="">All Classes</option>' +
        classes.map(cls => `<option value="${cls}">${cls}</option>`).join('');
    classFilter.value = currentValue;
}

// QR Code generation
function generateStudentQR(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Create QR code data
    const qrData = JSON.stringify({
        id: student.id,
        name: student.name,
        class: student.class
    });
    
    // In a real application, you would use a QR code library like qrcode.js
    // For now, we'll show a placeholder
    showNotification(`Kod QR dijana untuk ${student.name}. Dalam aplikasi sebenar, ini akan memaparkan kod QR.`, 'info');
}

// Reports and analytics
function updateAttendanceStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(r => r.date === today);
    
    document.getElementById('present-count').textContent = 
        todayRecords.filter(r => r.status === 'present').length;
    document.getElementById('late-count').textContent = 
        todayRecords.filter(r => r.status === 'late').length;
    document.getElementById('absent-count').textContent = 
        todayRecords.filter(r => r.status === 'absent').length;
    document.getElementById('total-students').textContent = students.length;
}

function updateRecentScans() {
    const recentList = document.getElementById('recent-scans-list');
    const recentScans = attendanceRecords
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    
    recentList.innerHTML = recentScans.map(record => `
        <div class="scan-item">
            <div class="scan-info">
                <strong>${record.studentName}</strong>
                <span class="scan-time">${record.time}</span>
            </div>
            <span class="status-badge ${record.status}">${record.status}</span>
        </div>
    `).join('');
}

function generateReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        showNotification('Sila pilih tarikh mula dan tamat', 'warning');
        return;
    }
    
    const filteredRecords = attendanceRecords.filter(record => {
        return record.date >= startDate && record.date <= endDate;
    });
    
    updateAttendanceTable(filteredRecords);
    generateCharts();
    showNotification(`Laporan dijana untuk ${filteredRecords.length} rekod`, 'success');
}

function updateAttendanceTable(records) {
    const tbody = document.getElementById('attendance-tbody');
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.studentId}</td>
            <td>${record.studentName}</td>
            <td>${record.class}</td>
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td><span class="status-badge ${record.status}">${record.status}</span></td>
            <td>
                <button class="icon-btn edit" onclick="editAttendance('${record.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function generateCharts() {
    // This would use Chart.js to create actual charts
    // For now, we'll just show placeholders
    console.log('Charts would be generated here with Chart.js');
}

// Data management
function importStudents() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet);
                    
                    data.forEach(row => {
                        if (row.Name && row.ID) {
                            const student = {
                                id: row.ID.toString(),
                                name: row.Name,
                                class: row.Class || '',
                                phone: row.Phone || '',
                                email: row.Email || '',
                                photo: row.PhotoURL || null,
                                status: 'active',
                                createdAt: new Date().toISOString()
                            };
                            
                            const existingIndex = students.findIndex(s => s.id === student.id);
                            if (existingIndex >= 0) {
                                students[existingIndex] = { ...students[existingIndex], ...student };
                            } else {
                                students.push(student);
                            }
                        }
                    });
                    
                    saveData();
                    updateStudentsDisplay();
                    updateClassFilter();
                    showNotification(`${data.length} pelajar berjaya diimport!`, 'success');
                        closeModal();
                } catch (error) {
                    showNotification('Ralat mengimport fail. Sila semak format.', 'error');
                }
            };
            reader.readAsBinaryString(file);
        }
    };
    input.click();
}

function exportStudents() {
    const data = students.map(student => ({
        ID: student.id,
        Name: student.name,
        Class: student.class,
        Phone: student.phone,
        Email: student.email,
        Status: student.status
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    
    const fileName = `students_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    showNotification('Data pelajar berjaya dieksport!', 'success');
}

function downloadTemplate() {
    const templateData = [
        {
            Name: 'Ahmad bin Rahman',
            ID: '20240001',
            Class: 'Dorm A',
            Phone: '012-3456789',
            Email: 'ahmad@sekolah.edu.my'
        },
        {
            Name: 'Siti Nurhaliza binti Abdullah',
            ID: '20240002', 
            Class: 'Dorm B',
            Phone: '012-9876543',
            Email: 'siti@sekolah.edu.my'
        }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Pelajar');
    
    const fileName = 'template_import_pelajar.xlsx';
    XLSX.writeFile(workbook, fileName);
    
    showNotification('Template Excel berjaya dimuat turun!', 'success');
}

function exportReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        showNotification('Sila pilih tarikh mula dan tamat terlebih dahulu', 'warning');
        return;
    }
    
    const filteredRecords = attendanceRecords.filter(record => {
        return record.date >= startDate && record.date <= endDate;
    });
    
    if (filteredRecords.length === 0) {
        showNotification('Tiada rekod kehadiran untuk tempoh yang dipilih', 'warning');
        return;
    }
    
    // Prepare data for export
    const exportData = filteredRecords.map(record => ({
        'ID Pelajar': record.studentId,
        'Nama': record.studentName,
        'Dorm': record.class,
        'Tarikh': record.date,
        'Masa': record.time,
        'Status': record.status,
        'Timestamp': record.timestamp
    }));
    
    // Create summary sheet
    const summaryData = [
        { 'Keterangan': 'Tempoh Laporan', 'Nilai': `${startDate} hingga ${endDate}` },
        { 'Keterangan': 'Jumlah Rekod', 'Nilai': filteredRecords.length },
        { 'Keterangan': 'Hadir Asrama', 'Nilai': filteredRecords.filter(r => r.status === 'hadir').length },
        { 'Keterangan': 'Prep', 'Nilai': filteredRecords.filter(r => r.status === 'prep').length },
        { 'Keterangan': 'Keluar', 'Nilai': filteredRecords.filter(r => r.status === 'keluar').length },
        { 'Keterangan': 'Lewat', 'Nilai': filteredRecords.filter(r => r.status === 'lewat').length },
        { 'Keterangan': 'Pulang Bermalam', 'Nilai': filteredRecords.filter(r => r.status === 'bermalam').length }
    ];
    
    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');
    
    // Detailed records sheet
    const detailSheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(workbook, detailSheet, 'Rekod Terperinci');
    
    // Group by dorm
    const dormGroups = {};
    filteredRecords.forEach(record => {
        if (!dormGroups[record.class]) {
            dormGroups[record.class] = [];
        }
        dormGroups[record.class].push({
            'ID Pelajar': record.studentId,
            'Nama': record.studentName,
            'Tarikh': record.date,
            'Masa': record.time,
            'Status': record.status
        });
    });
    
    // Add sheets for each dorm
    Object.keys(dormGroups).forEach(dorm => {
        if (dorm && dorm !== 'undefined') {
            const dormSheet = XLSX.utils.json_to_sheet(dormGroups[dorm]);
            XLSX.utils.book_append_sheet(workbook, dormSheet, dorm);
        }
    });
    
    const fileName = `laporan_kehadiran_${startDate}_${endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    showNotification(`Laporan Excel berjaya dieksport! (${filteredRecords.length} rekod)`, 'success');
}

// Admin functions
function saveSettings() {
    const settings = {
        schoolName: document.getElementById('school-name').value,
        academicYear: document.getElementById('academic-year').value,
        lateThreshold: document.getElementById('late-threshold').value
    };
    
    localStorage.setItem('schoolSettings', JSON.stringify(settings));
    showNotification('Tetapan berjaya disimpan!', 'success');
}

function backupData() {
    const backup = {
        students: students,
        attendanceRecords: attendanceRecords,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `attendance_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Sandaran data berjaya dibuat!', 'success');
}

function clearOldData() {
    if (confirm('Adakah anda pasti mahu memadamkan rekod kehadiran yang lebih dari 30 hari?')) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const oldCount = attendanceRecords.length;
        attendanceRecords = attendanceRecords.filter(record => 
            new Date(record.timestamp) > thirtyDaysAgo
        );
        
        saveData();
        const deletedCount = oldCount - attendanceRecords.length;
        showNotification(`${deletedCount} rekod lama telah dipadam`, 'success');
    }
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateStudentId() {
    const year = new Date().getFullYear();
    const count = students.length + 1;
    return `${year}${count.toString().padStart(4, '0')}`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#10b981' : 
                    type === 'error' ? '#ef4444' : 
                    type === 'warning' ? '#f59e0b' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Data persistence
function saveData() {
    localStorage.setItem('attendanceStudents', JSON.stringify(students));
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
}

function loadData() {
    const savedStudents = localStorage.getItem('attendanceStudents');
    const savedRecords = localStorage.getItem('attendanceRecords');
    
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    
    if (savedRecords) {
        attendanceRecords = JSON.parse(savedRecords);
    }
}

function initializeDefaultData() {
    // Add some sample students for demonstration
    const sampleStudents = [
        {
            id: '20240001',
            name: 'Ahmad Rahman',
            class: 'Dorm A',
            phone: '012-3456789',
            email: 'ahmad@school.edu',
            photo: null,
            status: 'active',
            createdAt: new Date().toISOString()
        },
        {
            id: '20240002',
            name: 'Siti Nurhaliza',
            class: 'Dorm A',
            phone: '012-9876543',
            email: 'siti@school.edu',
            photo: null,
            status: 'active',
            createdAt: new Date().toISOString()
        },
        {
            id: '20240003',
            name: 'Muhammad Ali',
            class: 'Dorm B',
            phone: '012-5555555',
            email: 'ali@school.edu',
            photo: null,
            status: 'active',
            createdAt: new Date().toISOString()
        }
    ];
    
    students = sampleStudents;
    saveData();
    updateClassFilter();
}

// Initialize date inputs with today's date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').value = today;
    document.getElementById('end-date').value = today;
});
