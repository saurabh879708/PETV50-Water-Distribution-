// Sidebar button handlers
document.addEventListener('DOMContentLoaded', function() {
    // Dashboard
    document.getElementById('sidebar-dashboard').onclick = function() {
        window.location.href = 'index.html';
    };
    // Water Management
    document.getElementById('sidebar-water').onclick = function() {
        showModal('modalWater', 'Water Management', 'Leak Loss in Zone 3 causing 10% water wastage. Immediate action required.');
    };
    // Analytics
    document.getElementById('sidebar-analytics').onclick = function() {
        showModal('modalAnalytics', 'Analytics', 'System efficiency dropped by 5% due to pipeline issues.');
    };
    // Settings
    document.getElementById('sidebar-settings').onclick = function() {
        showModal('modalSettings', 'Settings', 'Change thresholds, notification preferences, and more.');
    };
    // Users
    document.getElementById('sidebar-users').onclick = function() {
        showModal('modalUsers', 'Users', 'User management coming soon.');
    };
    // Notifications
    document.getElementById('sidebar-notifications').onclick = function() {
        showModal('modalNotifications', 'Notifications', '2 active alerts: Leak Loss, Unmet Demand.');
    };
    // Logout
    document.getElementById('sidebar-logout').onclick = function() {
        window.location.href = 'login.html';
    };

    // Show real-life problem alert
    const alertBox = document.getElementById('realLifeAlert');
    alertBox.innerText = 'Leak Loss in Zone 3 causing 10% water wastage. Immediate action required.';
    alertBox.style.display = 'block';

    // Fill actionable info cards (sample data)
    document.getElementById('cardWaterUsage').innerText = '35,000 L';
    document.getElementById('cardEfficiency').innerText = '89%';
    document.getElementById('cardLeakLoss').innerText = '3,500 L (10%)';
    document.getElementById('cardUnmetDemand').innerText = '2,000 L';
    document.getElementById('cardActiveAlerts').innerText = '2';
    document.getElementById('cardStrategy').innerText = 'Priority to Domestic, Reduce Leak Loss';

    // Fill module summaries (sample data)
    document.getElementById('summaryWater').innerText = 'Leak detected in Zone 3. Optimization needed.';
    document.getElementById('summaryDSA').innerText = 'Graph structure shows bottleneck at Node 5.';
    document.getElementById('summaryAlgo').innerText = 'Algorithm switched to Max-Flow for efficiency.';
    document.getElementById('summaryDemo').innerText = 'Demo run: 2 unmet demands, 1 resolved.';
    document.getElementById('summaryNetwork').innerText = 'Network map: 1 critical node, 2 warnings.';
    document.getElementById('summaryDashboard').innerText = 'Overall system stable, but leak loss rising.';
});

// Modal display function
function showModal(id, title, content) {
    const modal = document.getElementById(id);
    modal.innerHTML = `<div style='background:#fff;padding:24px 32px;border-radius:12px;max-width:400px;margin:60px auto;box-shadow:0 4px 24px rgba(0,0,0,0.15);position:relative;'>
        <h2 style='margin-bottom:12px;'>${title}</h2>
        <p>${content}</p>
        <button onclick="this.parentElement.parentElement.style.display='none'" style='margin-top:18px;padding:8px 18px;background:#2196F3;color:#fff;border:none;border-radius:6px;cursor:pointer;'>Close</button>
    </div>`;
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.25)';
    modal.style.zIndex = '1000';
} 