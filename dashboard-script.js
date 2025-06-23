// Modern Dashboard File Management System

// Global variables
let selectedFiles = [];
let processedData = [];
let currentProcessingStatus = 'ready';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    setupDragAndDrop();
});

// Initialize dashboard components
function initializeDashboard() {
    updateStatistics();
    updateStatus('Ready to process files', 'ready');
    showNotification('Dashboard initialized successfully!', 'success');
    updateFileCount();
}

// Setup event listeners
function setupEventListeners() {
    const fileInput = document.getElementById('fileInput');
    const acceptBtn = document.getElementById('acceptBtn');
    const menuToggle = document.getElementById('menuToggle');
    
    fileInput.addEventListener('change', handleFileSelection);
    acceptBtn.addEventListener('click', acceptFiles);
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const uploadZone = document.getElementById('uploadZone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight(e) {
        uploadZone.classList.add('dragover');
    }
    
    function unhighlight(e) {
        uploadZone.classList.remove('dragover');
    }
    
    uploadZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileSelection({ target: { files: files } });
    }
}

// Handle file selection
function handleFileSelection(event) {
    const files = Array.from(event.target.files);
    selectedFiles = files;
    displayFileList();
    updateStatistics();
    updateFileCount();
    showNotification(`${files.length} file(s) selected`, 'success');
}

// Display selected files in the list
function displayFileList() {
    const fileList = document.getElementById('fileList');
    
    if (selectedFiles.length === 0) {
        fileList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No files selected</p>
                <span>Select files to get started</span>
            </div>
        `;
        return;
    }
    
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = createFileItem(file, index);
        fileList.appendChild(fileItem);
    });
    
    updatePreviewSelect();
}

// Create file item element
function createFileItem(file, index) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileIcon = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    const fileType = getFileType(file.name);
    
    fileItem.innerHTML = `
        <div class="file-info">
            <div class="file-icon">
                <i class="${fileIcon}"></i>
            </div>
            <div class="file-details">
                <h4>${file.name}</h4>
                <p>${fileSize} • ${fileType} • Modified: ${new Date(file.lastModified).toLocaleDateString()}</p>
            </div>
        </div>
        <div class="file-actions-mini">
            <button class="file-action-btn" onclick="previewFile(${index})" title="Preview">
                <i class="fas fa-eye"></i>
            </button>
            <button class="file-action-btn" onclick="removeFile(${index})" title="Remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return fileItem;
}

// Get file icon based on file type
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'txt': return 'fas fa-file-alt';
        case 'json': return 'fas fa-file-code';
        case 'csv': return 'fas fa-file-csv';
        case 'js': return 'fab fa-js-square';
        case 'html': return 'fab fa-html5';
        case 'css': return 'fab fa-css3-alt';
        case 'pdf': return 'fas fa-file-pdf';
        case 'doc': case 'docx': return 'fas fa-file-word';
        case 'xls': case 'xlsx': return 'fas fa-file-excel';
        case 'png': case 'jpg': case 'jpeg': case 'gif': return 'fas fa-file-image';
        default: return 'fas fa-file';
    }
}

// Get file type
function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return extension.toUpperCase();
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Update file count
function updateFileCount() {
    const fileCount = document.getElementById('fileCount');
    if (fileCount) {
        fileCount.textContent = `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`;
    }
}

// Accept and save files
function acceptFiles() {
    if (selectedFiles.length === 0) {
        showNotification('No files selected to accept', 'warning');
        return;
    }
    
    showLoadingOverlay();
    updateStatus('Processing files...', 'processing');
    updateProgress(0);
    
    // Simulate file processing
    let processedCount = 0;
    const totalFiles = selectedFiles.length;
    
    selectedFiles.forEach((file, index) => {
        setTimeout(() => {
            processFile(file, index);
            processedCount++;
            updateProgress((processedCount / totalFiles) * 100);
            
            if (processedCount === totalFiles) {
                hideLoadingOverlay();
                updateStatus('Files processed successfully!', 'ready');
                showNotification(`${totalFiles} file(s) accepted and saved successfully!`, 'success');
                updateStatistics();
            }
        }, index * 500);
    });
}

// Process individual file
function processFile(file, index) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            content: content,
            processedAt: new Date().toISOString(),
            index: index
        };
        
        processedData.push(fileData);
        
        // Update results display
        updateResultsDisplay();
    };
    
    reader.readAsText(file);
}

// Update results display
function updateResultsDisplay() {
    const resultsContent = document.getElementById('resultsContent');
    
    if (processedData.length === 0) {
        resultsContent.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <p>No results to display</p>
                <span>Process data to see results</span>
            </div>
        `;
        return;
    }
    
    let resultsHTML = '<h3>📋 Processed Files Summary:</h3>\n\n';
    
    processedData.forEach((fileData, index) => {
        const fileSize = formatFileSize(fileData.size);
        const contentPreview = fileData.content.substring(0, 100) + (fileData.content.length > 100 ? '...' : '');
        
        resultsHTML += `File ${index + 1}: ${fileData.name}\n`;
        resultsHTML += `Size: ${fileSize}\n`;
        resultsHTML += `Type: ${fileData.type}\n`;
        resultsHTML += `Processed: ${new Date(fileData.processedAt).toLocaleString()}\n`;
        resultsHTML += `Content Preview: ${contentPreview}\n`;
        resultsHTML += `─`.repeat(50) + '\n\n';
    });
    
    resultsContent.innerHTML = `<pre>${resultsHTML}</pre>`;
}

// Update preview select dropdown
function updatePreviewSelect() {
    const previewSelect = document.getElementById('previewSelect');
    previewSelect.innerHTML = '<option value="">Select a file</option>';
    
    selectedFiles.forEach((file, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = file.name;
        previewSelect.appendChild(option);
    });
}

// Preview file content
function previewFile(index) {
    const file = selectedFiles[index];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('filePreview').textContent = content;
        document.getElementById('previewSelect').value = index;
    };
    
    reader.readAsText(file);
}

// Update preview when select changes
function updatePreview() {
    const select = document.getElementById('previewSelect');
    const index = parseInt(select.value);
    
    if (isNaN(index)) {
        document.getElementById('filePreview').textContent = 'No file selected for preview';
        return;
    }
    
    previewFile(index);
}

// Copy preview content
function copyPreview() {
    const preview = document.getElementById('filePreview');
    const text = preview.textContent;
    
    if (text && text !== 'No file selected for preview') {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Content copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy content', 'error');
        });
    } else {
        showNotification('No content to copy', 'warning');
    }
}

// Download preview content
function downloadPreview() {
    const preview = document.getElementById('filePreview');
    const text = preview.textContent;
    
    if (text && text !== 'No file selected for preview') {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'preview.txt';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('File downloaded!', 'success');
    } else {
        showNotification('No content to download', 'warning');
    }
}

// Remove file from selection
function removeFile(index) {
    selectedFiles.splice(index, 1);
    displayFileList();
    updateStatistics();
    updateFileCount();
    showNotification('File removed from selection', 'warning');
}

// Update statistics
function updateStatistics() {
    const totalFiles = selectedFiles.length;
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const fileTypes = new Set(selectedFiles.map(file => file.name.split('.').pop().toLowerCase())).size;
    
    document.getElementById('totalFiles').textContent = totalFiles;
    document.getElementById('totalSize').textContent = formatFileSize(totalSize);
    document.getElementById('fileTypes').textContent = fileTypes;
    
    if (selectedFiles.length > 0) {
        const lastModified = new Date(Math.max(...selectedFiles.map(file => file.lastModified)));
        document.getElementById('lastModified').textContent = lastModified.toLocaleDateString();
    } else {
        document.getElementById('lastModified').textContent = '-';
    }
}

// Update processing status
function updateStatus(message, status) {
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');
    
    statusText.textContent = message;
    statusDot.className = `status-dot ${status}`;
    currentProcessingStatus = status;
}

// Update progress bar
function updateProgress(percentage) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}%`;
}

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('hidden');
}

// Process data
function processData() {
    if (processedData.length === 0) {
        showNotification('No data to process. Please accept files first.', 'warning');
        return;
    }
    
    updateStatus('Processing data...', 'processing');
    updateProgress(0);
    
    setTimeout(() => {
        // Simulate data processing
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                updateStatus('Data processed successfully!', 'ready');
                showNotification('Data processing completed!', 'success');
            }
        }, 200);
    }, 500);
}

// Analyze data
function analyzeData() {
    if (processedData.length === 0) {
        showNotification('No data to analyze. Please process files first.', 'warning');
        return;
    }
    
    updateStatus('Analyzing data...', 'processing');
    
    setTimeout(() => {
        const analysis = performDataAnalysis();
        displayAnalysisResults(analysis);
        updateStatus('Analysis completed!', 'ready');
        showNotification('Data analysis completed!', 'success');
    }, 2000);
}

// Perform data analysis
function performDataAnalysis() {
    const analysis = {
        totalFiles: processedData.length,
        totalSize: processedData.reduce((sum, file) => sum + file.size, 0),
        fileTypes: {},
        averageFileSize: 0,
        largestFile: null,
        smallestFile: null
    };
    
    // Analyze file types
    processedData.forEach(file => {
        const type = file.name.split('.').pop().toLowerCase();
        analysis.fileTypes[type] = (analysis.fileTypes[type] || 0) + 1;
    });
    
    // Calculate averages and find extremes
    const sizes = processedData.map(file => file.size);
    analysis.averageFileSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    analysis.largestFile = processedData[sizes.indexOf(Math.max(...sizes))];
    analysis.smallestFile = processedData[sizes.indexOf(Math.min(...sizes))];
    
    return analysis;
}

// Display analysis results
function displayAnalysisResults(analysis) {
    const resultsContent = document.getElementById('resultsContent');
    
    let resultsHTML = '<h3>📊 Data Analysis Results:</h3>\n\n';
    resultsHTML += `Total Files Analyzed: ${analysis.totalFiles}\n`;
    resultsHTML += `Total Data Size: ${formatFileSize(analysis.totalSize)}\n`;
    resultsHTML += `Average File Size: ${formatFileSize(analysis.averageFileSize)}\n\n`;
    
    resultsHTML += 'File Type Distribution:\n';
    Object.entries(analysis.fileTypes).forEach(([type, count]) => {
        resultsHTML += `  ${type.toUpperCase()}: ${count} file(s)\n`;
    });
    
    resultsHTML += '\nFile Size Extremes:\n';
    resultsHTML += `  Largest: ${analysis.largestFile.name} (${formatFileSize(analysis.largestFile.size)})\n`;
    resultsHTML += `  Smallest: ${analysis.smallestFile.name} (${formatFileSize(analysis.smallestFile.size)})\n`;
    
    resultsContent.innerHTML = `<pre>${resultsHTML}</pre>`;
}

// Generate report
function generateReport() {
    if (processedData.length === 0) {
        showNotification('No data to report. Please process files first.', 'warning');
        return;
    }
    
    updateStatus('Generating report...', 'processing');
    
    setTimeout(() => {
        const report = generateComprehensiveReport();
        displayReport(report);
        updateStatus('Report generated!', 'ready');
        showNotification('Report generated successfully!', 'success');
    }, 1500);
}

// Generate comprehensive report
function generateComprehensiveReport() {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalFiles: processedData.length,
            totalSize: processedData.reduce((sum, file) => sum + file.size, 0),
            processingTime: new Date().toLocaleString()
        },
        files: processedData.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            processedAt: file.processedAt
        })),
        statistics: performDataAnalysis()
    };
    
    return report;
}

// Display report
function displayReport(report) {
    const resultsContent = document.getElementById('resultsContent');
    
    let reportHTML = '<h3>📄 Comprehensive Report</h3>\n';
    reportHTML += `Generated: ${new Date(report.timestamp).toLocaleString()}\n\n`;
    
    reportHTML += '📋 Summary:\n';
    reportHTML += `  Total Files: ${report.summary.totalFiles}\n`;
    reportHTML += `  Total Size: ${formatFileSize(report.summary.totalSize)}\n`;
    reportHTML += `  Processing Time: ${report.summary.processingTime}\n\n`;
    
    reportHTML += '📁 Files Processed:\n';
    report.files.forEach((file, index) => {
        reportHTML += `  ${index + 1}. ${file.name} (${formatFileSize(file.size)})\n`;
    });
    
    reportHTML += '\n📊 Statistics:\n';
    reportHTML += `  Average File Size: ${formatFileSize(report.statistics.averageFileSize)}\n`;
    reportHTML += `  File Types: ${Object.keys(report.statistics.fileTypes).length}\n`;
    
    resultsContent.innerHTML = `<pre>${reportHTML}</pre>`;
}

// Export data
function exportData() {
    if (processedData.length === 0) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    const exportData = {
        timestamp: new Date().toISOString(),
        files: processedData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                processedData = importedData.files || [];
                updateResultsDisplay();
                showNotification('Data imported successfully!', 'success');
            } catch (error) {
                showNotification('Error importing data: Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear files
function clearFiles() {
    selectedFiles = [];
    processedData = [];
    displayFileList();
    updateStatistics();
    updateFileCount();
    updateResultsDisplay();
    document.getElementById('filePreview').textContent = 'No file selected for preview';
    document.getElementById('previewSelect').innerHTML = '<option value="">Select a file</option>';
    updateStatus('Ready to process files', 'ready');
    updateProgress(0);
    showNotification('All files cleared', 'warning');
}

// Clear results
function clearResults() {
    processedData = [];
    updateResultsDisplay();
    showNotification('Results cleared', 'warning');
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    e.target.closest('.nav-item').classList.add('active');
    
    // Update page title
    const pageTitle = document.querySelector('.page-title');
    const navText = e.target.closest('.nav-link').querySelector('span').textContent;
    pageTitle.textContent = navText;
    
    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        document.querySelector('.sidebar').classList.remove('open');
    }
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filter files based on search term
    const fileItems = document.querySelectorAll('.file-item');
    
    fileItems.forEach(item => {
        const fileName = item.querySelector('h4').textContent.toLowerCase();
        if (fileName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notificationArea = document.getElementById('notificationArea');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-exclamation-triangle';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    
    notificationArea.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Export functions for global access
window.acceptFiles = acceptFiles;
window.exportData = exportData;
window.importData = importData;
window.clearFiles = clearFiles;
window.processData = processData;
window.analyzeData = analyzeData;
window.generateReport = generateReport;
window.previewFile = previewFile;
window.updatePreview = updatePreview;
window.removeFile = removeFile;
window.copyPreview = copyPreview;
window.downloadPreview = downloadPreview;
window.clearResults = clearResults; 