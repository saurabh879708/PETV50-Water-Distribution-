// Water Distribution Optimization Application

// Authentication check
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeApplication();
    cleanDemoDashboard();
});

// Check if user is authenticated
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    // Display user information
    const userEmail = localStorage.getItem('userEmail');
    const userInfoElement = document.getElementById('userEmail');
    if (userInfoElement && userEmail) {
        userInfoElement.textContent = `Welcome, ${userEmail}`;
    }
}

// Initialize application
function initializeApplication() {
    // Initialize any app-specific functionality
    generateLocationInputs();
    initializeChart();
    initializeDashboard();
}

// Initialize dashboard with default values
function initializeDashboard() {
    // Set default values for dashboard cards
    const dashboardLocations = document.getElementById('dashboardLocations');
    const dashboardDemand = document.getElementById('dashboardDemand');
    const dashboardWater = document.getElementById('dashboardWater');
    const dashboardAllocated = document.getElementById('dashboardAllocated');
    const dashboardEfficiency = document.getElementById('dashboardEfficiency');
    const dashboardUnmet = document.getElementById('dashboardUnmet');
    const dashboardStrategy = document.getElementById('dashboardStrategy');
    
    if (dashboardLocations) dashboardLocations.textContent = '0';
    if (dashboardDemand) dashboardDemand.textContent = '0';
    if (dashboardWater) dashboardWater.textContent = '0';
    if (dashboardAllocated) dashboardAllocated.textContent = '0';
    if (dashboardEfficiency) dashboardEfficiency.textContent = '0%';
    if (dashboardUnmet) dashboardUnmet.textContent = '0';
    if (dashboardStrategy) dashboardStrategy.textContent = 'No optimization run yet';
    
    // Initialize dashboard chart with empty data
    initializeDashboardChart();
}

// Initialize dashboard chart with empty data
function initializeDashboardChart() {
    const dashboardChartCanvas = document.getElementById('dashboardChart');
    if (!dashboardChartCanvas) return;
    
    const ctx = dashboardChartCanvas.getContext('2d');
    
    window.dashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['No Data'],
            datasets: [
                {
                    label: 'Demand (L)',
                    data: [0],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Allocated (L)',
                    data: [0],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Water (Liters)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Locations'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Water Distribution Overview'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Logout function
function logout() {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('loginProvider');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Global variables
let chart = null;

// Tab Navigation
function showTab(event, tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab and activate button
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'demo' && latestOptimizationResults) {
        updateDemoDashboard(latestOptimizationResults);
    }
    if (tabName === 'water') {
        // Ensure Chart.js is loaded
        if (typeof Chart === 'undefined') {
            loadChartJS();
        } else {
            // Re-initialize the chart if needed
            initializeChart();
            // If there are latest optimization results, update the chart
            if (latestOptimizationResults) {
                updateChart(latestOptimizationResults);
            }
        }
    }
    if (tabName === 'dsa') {
        renderWaterOptimization3DPlot();
        // Attach Accept button handler
        const acceptBtn = document.getElementById('acceptBtn');
        if (acceptBtn) {
            acceptBtn.onclick = function() {
                alert('Accepted!');
            };
        }
    }
    if (tabName === 'networkmap') {
        renderWaterNetworkMap();
    }
    if (tabName === 'demo') {
        let results = window.latestOptimizationResults;
        if ((!results || !results.locations || !results.length) && localStorage.getItem('latestOptimizationResults')) {
            results = JSON.parse(localStorage.getItem('latestOptimizationResults'));
        }
        if (results) updateActiveDemoInfo(results);
    }
}

// === INTERACTIVE DEMO DASHBOARD CONNECTION ===

// Store the latest optimization results globally
let latestOptimizationResults = null;

// Hook into displayResults to always store the latest results
const originalDisplayResults = displayResults;
displayResults = function(results) {
    latestOptimizationResults = results;
    localStorage.setItem('latestOptimizationResults', JSON.stringify(results));
    originalDisplayResults(results);
    updateDemoDashboard(results);
    updateActiveDemoInfo(results);
};

// Update the Interactive Demo dashboard cards and chart
function updateDemoDashboard(results) {
    // Info cards
    const demoTotal = document.getElementById('demoTotal');
    const demoLastRun = document.getElementById('demoLastRun');
    const demoSuccess = document.getElementById('demoSuccess');
    const demoErrors = document.getElementById('demoErrors');
    // Chart
    const demoChartCanvas = document.getElementById('demoChart');

    if (!results || !results.locations) return;

    if (demoTotal) demoTotal.textContent = results.locations.length;
    if (demoLastRun) demoLastRun.textContent = new Date().toLocaleString();
    if (demoSuccess) demoSuccess.textContent = results.efficiency.toFixed(1) + '%';
    if (demoErrors) demoErrors.textContent = results.unmetDemand > 0 ? results.unmetDemand.toFixed(0) + 'L unmet' : '0L';

    // Chart
    if (demoChartCanvas) {
        if (window.demoChart) window.demoChart.destroy();
        const ctx = demoChartCanvas.getContext('2d');
        window.demoChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: results.locations.map(loc => loc.name),
                datasets: [
                    {
                        label: 'Demand (L)',
                        data: results.locations.map(loc => loc.demand),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Allocated (L)',
                        data: results.locations.map(loc => loc.allocated),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Water Distribution Overview'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Water (Liters)' }
                    },
                    x: {
                        title: { display: true, text: 'Locations' }
                    }
                }
            }
        });
    }
}

// Remove unnecessary details from the demo dashboard after DOMContentLoaded
function cleanDemoDashboard() {
    // Remove demo features card and output card
    const featuresCard = document.querySelector('.demo-features-card');
    if (featuresCard) featuresCard.style.display = 'none';
    const outputCard = document.querySelector('.demo-output-card');
    if (outputCard) outputCard.style.display = 'none';
    // Remove controls card if not needed
    const controlsCard = document.querySelector('.demo-controls-card');
    if (controlsCard) controlsCard.style.display = 'none';
}

// ==================== DATA STRUCTURES IMPLEMENTATIONS ====================

// Linked List Implementation
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    insert(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }
    
    delete(data) {
        if (!this.head) return false;
        
        if (this.head.data === data) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        while (current.next) {
            if (current.next.data === data) {
                current.next = current.next.next;
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }
    
    search(data) {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.data === data) return index;
            current = current.next;
            index++;
        }
        return -1;
    }
    
    display() {
        let current = this.head;
        let result = [];
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}

// Stack Implementation
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        if (this.isEmpty()) return "Underflow";
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) return "Stack is empty";
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    display() {
        return [...this.items];
    }
}

// Queue Implementation
class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(element) {
        this.items.push(element);
    }
    
    dequeue() {
        if (this.isEmpty()) return "Underflow";
        return this.items.shift();
    }
    
    front() {
        if (this.isEmpty()) return "Queue is empty";
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
    
    display() {
        return [...this.items];
    }
}

// Binary Tree Implementation
class TreeNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
    }
    
    insert(data) {
        const newNode = new TreeNode(data);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        
        const queue = [this.root];
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current.left) {
                current.left = newNode;
                return;
            }
            if (!current.right) {
                current.right = newNode;
                return;
            }
            queue.push(current.left);
            queue.push(current.right);
        }
    }
    
    inorderTraversal(node = this.root, result = []) {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.data);
            this.inorderTraversal(node.right, result);
        }
        return result;
    }
    
    preorderTraversal(node = this.root, result = []) {
        if (node) {
            result.push(node.data);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
        return result;
    }
    
    postorderTraversal(node = this.root, result = []) {
        if (node) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node.data);
        }
        return result;
    }
    
    search(data, node = this.root) {
        if (!node) return false;
        if (node.data === data) return true;
        return this.search(data, node.left) || this.search(data, node.right);
    }
}

// Min Heap Implementation
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    parent(index) {
        return Math.floor((index - 1) / 2);
    }
    
    leftChild(index) {
        return 2 * index + 1;
    }
    
    rightChild(index) {
        return 2 * index + 2;
    }
    
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
    
    insert(value) {
        this.heap.push(value);
        this.heapifyUp();
    }
    
    heapifyUp() {
        let currentIndex = this.heap.length - 1;
        while (currentIndex > 0 && this.heap[currentIndex] < this.heap[this.parent(currentIndex)]) {
            this.swap(currentIndex, this.parent(currentIndex));
            currentIndex = this.parent(currentIndex);
        }
    }
    
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }
    
    heapifyDown() {
        let currentIndex = 0;
        while (this.leftChild(currentIndex) < this.heap.length) {
            let smallestChildIndex = this.leftChild(currentIndex);
            if (this.rightChild(currentIndex) < this.heap.length && 
                this.heap[this.rightChild(currentIndex)] < this.heap[smallestChildIndex]) {
                smallestChildIndex = this.rightChild(currentIndex);
            }
            
            if (this.heap[currentIndex] <= this.heap[smallestChildIndex]) break;
            
            this.swap(currentIndex, smallestChildIndex);
            currentIndex = smallestChildIndex;
        }
    }
    
    display() {
        return [...this.heap];
    }
}

// Hash Table Implementation
class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.table = new Array(size).fill(null).map(() => []);
    }
    
    hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + key.charCodeAt(i)) % this.size;
        }
        return hash;
    }
    
    set(key, value) {
        const index = this.hash(key);
        const bucket = this.table[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value;
                return;
            }
        }
        
        bucket.push([key, value]);
    }
    
    get(key) {
        const index = this.hash(key);
        const bucket = this.table[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                return bucket[i][1];
            }
        }
        
        return undefined;
    }
    
    delete(key) {
        const index = this.hash(key);
        const bucket = this.table[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket.splice(i, 1);
                return true;
            }
        }
        
        return false;
    }
    
    display() {
        const result = {};
        for (let i = 0; i < this.size; i++) {
            if (this.table[i].length > 0) {
                this.table[i].forEach(([key, value]) => {
                    result[key] = value;
                });
            }
        }
        return result;
    }
}

// ==================== ALGORITHMS IMPLEMENTATIONS ====================

// Sorting Algorithms
function bubbleSort(arr) {
    const result = [...arr];
    const n = result.length;
    let swaps = 0;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (result[j] > result[j + 1]) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swaps++;
            }
        }
    }
    
    return { sorted: result, swaps };
}

function quickSort(arr) {
    if (arr.length <= 1) return { sorted: arr, comparisons: 0 };
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];
    let comparisons = 0;
    
    for (let element of arr) {
        comparisons++;
        if (element < pivot) left.push(element);
        else if (element > pivot) right.push(element);
        else equal.push(element);
    }
    
    const leftResult = quickSort(left);
    const rightResult = quickSort(right);
    
    return {
        sorted: [...leftResult.sorted, ...equal, ...rightResult.sorted],
        comparisons: comparisons + leftResult.comparisons + rightResult.comparisons
    };
}

function mergeSort(arr) {
    if (arr.length <= 1) return { sorted: arr, comparisons: 0 };
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    const leftResult = mergeSort(left);
    const rightResult = mergeSort(right);
    
    const merged = merge(leftResult.sorted, rightResult.sorted);
    
    return {
        sorted: merged.sorted,
        comparisons: leftResult.comparisons + rightResult.comparisons + merged.comparisons
    };
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    let comparisons = 0;
    
    while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }
    
    return { sorted: result, comparisons };
}

// Searching Algorithms
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) return { index: i, comparisons: i + 1 };
    }
    return { index: -1, comparisons: arr.length };
}

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let comparisons = 0;
    
    while (left <= right) {
        comparisons++;
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return { index: mid, comparisons };
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return { index: -1, comparisons };
}

// Dynamic Programming
function fibonacci(n) {
    if (n <= 1) return n;
    
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

function fibonacciRecursive(n) {
    if (n <= 1) return n;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// Mathematical Algorithms
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

// String Algorithms - KMP Pattern Matching
function computeLPSArray(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;
    
    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

function kmpSearch(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const lps = computeLPSArray(pattern);
    const matches = [];
    let i = 0, j = 0;
    let comparisons = 0;
    
    while (i < n) {
        comparisons++;
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        
        if (j === m) {
            matches.push(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return { matches, comparisons };
}

// ==================== DSA DEMO FUNCTIONS (Water Distribution Context) ====================

// Linked List Demo (Water Locations)
function linkedListDemo() {
    const output = document.getElementById('llOutput');
    
    // Get water optimization data
    const locations = collectLocationData();
    const isSampleData = !document.getElementById('locations')?.value;
    
    const list = new LinkedList();
    
    // Insert all locations with their water demand
    locations.forEach(loc => {
        list.insert(`${loc.name} (${loc.demand}L demand, Priority ${loc.priority})`);
    });
    
    // Remove the first location as a demo
    const firstLocation = locations[0];
    const removed = list.delete(`${firstLocation.name} (${firstLocation.demand}L demand, Priority ${firstLocation.priority})`);
    
    // Search for a specific location
    const searchLocation = locations[Math.floor(locations.length / 2)];
    const searchResult = list.search(`${searchLocation.name} (${searchLocation.demand}L demand, Priority ${searchLocation.priority})`);
    
    const sampleDataNotice = isSampleData ? '<p>💡 <em>Using sample water optimization data for demonstration</em></p>' : '';
    
    output.innerHTML = `
        <div class="demo-result">
            <h4>🔗 Linked List - Water Location Management</h4>
            ${sampleDataNotice}
            <p>📥 <strong>Inserted Locations:</strong></p>
            <ul>
                ${locations.map(loc => `<li>${loc.name}: ${loc.demand}L demand, Priority ${loc.priority}</li>`).join('')}
            </ul>
            <p>🗑️ <strong>Removed Location:</strong> ${firstLocation.name} (${removed ? 'Successfully removed' : 'Not found'})</p>
            <p>🔍 <strong>Search Result:</strong> ${searchLocation.name} found at index ${searchResult >= 0 ? searchResult : 'Not found'}</p>
            <p>📋 <strong>Current List:</strong></p>
            <div class="location-detail">
                ${list.display().join(' → ')}
            </div>
            <p>📊 <strong>List Size:</strong> ${list.size} locations</p>
            <p>💧 <strong>Application:</strong> Managing water distribution sequence and location order</p>
        </div>
    `;
}

// Stack Demo (Undo Water Allocations)
function stackDemo() {
    const output = document.getElementById('stackOutput');
    
    // Get water optimization data
    const locations = collectLocationData();
    const isSampleData = !document.getElementById('locations')?.value;
    
    const stack = new Stack();
    
    // Push water allocation operations
    locations.forEach(loc => {
        const allocated = Math.floor(loc.demand * 0.8); // Simulate allocation
        stack.push(`Allocate ${allocated}L to ${loc.name} (${loc.demand}L demand)`);
    });
    
    // Peek at top operation
    const topOperation = stack.peek();
    
    // Pop (undo) the last allocation
    const lastOperation = stack.pop();
    
    // Pop another operation
    const secondLastOperation = stack.pop();
    
    const sampleDataNotice = isSampleData ? '<p>💡 <em>Using sample water optimization data for demonstration</em></p>' : '';
    
    output.innerHTML = `
        <div class="demo-result">
            <h4>📚 Stack - Water Allocation Undo System</h4>
            ${sampleDataNotice}
            <p>📥 <strong>Pushed Allocation Operations:</strong></p>
            <ul>
                ${locations.map(loc => {
                    const allocated = Math.floor(loc.demand * 0.8);
                    return `<li>Allocate ${allocated}L to ${loc.name} (${loc.demand}L demand)</li>`;
                }).join('')}
            </ul>
            <p>👁️ <strong>Top Operation:</strong> ${topOperation}</p>
            <p>📤 <strong>Undo Last:</strong> ${lastOperation}</p>
            <p>📤 <strong>Undo Second Last:</strong> ${secondLastOperation}</p>
            <p>📋 <strong>Remaining Operations:</strong></p>
            <div class="location-detail">
                ${stack.display().join('<br>')}
            </div>
            <p>📊 <strong>Stack Size:</strong> ${stack.size()} operations</p>
            <p>💧 <strong>Application:</strong> Undo water allocation changes and maintain operation history</p>
        </div>
    `;
}

// Queue Demo (Water Distribution Order)
function queueDemo() {
    const output = document.getElementById('queueOutput');
    
    // Get water optimization data
    const locations = collectLocationData();
    const isSampleData = !document.getElementById('locations')?.value;
    
    const queue = new Queue();
    
    // Enqueue locations by priority (higher priority first)
    const sortedLocations = [...locations].sort((a, b) => b.priority - a.priority);
    
    sortedLocations.forEach(loc => {
        queue.enqueue(`${loc.name} (Priority ${loc.priority}, ${loc.demand}L demand)`);
    });
    
    // Dequeue first location (highest priority)
    const firstServed = queue.dequeue();
    
    // Check front of queue
    const nextInLine = queue.front();
    
    const sampleDataNotice = isSampleData ? '<p>💡 <em>Using sample water optimization data for demonstration</em></p>' : '';
    
    output.innerHTML = `
        <div class="demo-result">
            <h4>📋 Queue - Priority-Based Water Distribution</h4>
            ${sampleDataNotice}
            <p>📥 <strong>Enqueued by Priority:</strong></p>
            <ul>
                ${sortedLocations.map(loc => `<li>${loc.name}: Priority ${loc.priority}, ${loc.demand}L demand</li>`).join('')}
            </ul>
            <p>📤 <strong>First Served (Highest Priority):</strong> ${firstServed}</p>
            <p>👁️ <strong>Next in Line:</strong> ${nextInLine}</p>
            <p>📋 <strong>Remaining Queue:</strong></p>
            <div class="location-detail">
                ${queue.display().join(' → ')}
            </div>
            <p>📊 <strong>Queue Size:</strong> ${queue.size()} locations</p>
            <p>💧 <strong>Application:</strong> First-come-first-served water distribution based on priority</p>
        </div>
    `;
}

// Binary Tree Demo (Location Hierarchy by Priority)
function treeDemo() {
    const output = document.getElementById('treeOutput');
    
    // Get water optimization data
    const locations = collectLocationData();
    const isSampleData = !document.getElementById('locations')?.value;
    
    const tree = new BinaryTree();
    
    // Insert locations by priority (higher priority first)
    const sortedLocations = [...locations].sort((a, b) => b.priority - a.priority);
    
    sortedLocations.forEach(loc => {
        tree.insert(`${loc.name} (P${loc.priority}, ${loc.demand}L)`);
    });
    
    // Perform different traversals
    const inorder = tree.inorderTraversal();
    const preorder = tree.preorderTraversal();
    const postorder = tree.postorderTraversal();
    
    // Search for a specific location
    const searchLocation = sortedLocations[Math.floor(sortedLocations.length / 2)];
    const searchResult = tree.search(`${searchLocation.name} (P${searchLocation.priority}, ${searchLocation.demand}L)`);
    
    const sampleDataNotice = isSampleData ? '<p>💡 <em>Using sample water optimization data for demonstration</em></p>' : '';
    
    output.innerHTML = `
        <div class="demo-result">
            <h4>🌳 Binary Tree - Location Priority Hierarchy</h4>
            ${sampleDataNotice}
            <p>📥 <strong>Inserted by Priority:</strong></p>
            <ul>
                ${sortedLocations.map(loc => `<li>${loc.name}: Priority ${loc.priority}, ${loc.demand}L demand</li>`).join('')}
            </ul>
            <p>📋 <strong>Inorder Traversal (Left-Root-Right):</strong></p>
            <div class="location-detail">${inorder.join(' → ')}</div>
            <p>📋 <strong>Preorder Traversal (Root-Left-Right):</strong></p>
            <div class="location-detail">${preorder.join(' → ')}</div>
            <p>📋 <strong>Postorder Traversal (Left-Right-Root):</strong></p>
            <div class="location-detail">${postorder.join(' → ')}</div>
            <p>🔍 <strong>Search Result:</strong> ${searchLocation.name} ${searchResult ? 'found' : 'not found'} in tree</p>
            <p>💧 <strong>Application:</strong> Organizing locations by priority for hierarchical water distribution</p>
        </div>
    `;
}

// Min Heap Demo (Min Demand First)
function heapDemo() {
    const output = document.getElementById('heapOutput');
    
    // Get water optimization data
    const locations = collectLocationData();
    const isSampleData = !document.getElementById('locations')?.value;
    
    const heap = new MinHeap();
    
    // Insert all demands
    locations.forEach(loc => {
        heap.insert(loc.demand);
    });
    
    // Extract minimum demand
    const minDemand = heap.extractMin();
    
    // Extract second minimum
    const secondMinDemand = heap.extractMin();
    
    // Find location with minimum demand
    const minLocation = locations.find(loc => loc.demand === minDemand);
    const secondMinLocation = locations.find(loc => loc.demand === secondMinDemand);
    
    const sampleDataNotice = isSampleData ? '<p>💡 <em>Using sample water optimization data for demonstration</em></p>' : '';
    
    output.innerHTML = `
        <div class="demo-result">
            <h4>📈 Min Heap - Minimum Demand Priority</h4>
            ${sampleDataNotice}
            <p>📥 <strong>Inserted Demands:</strong></p>
            <ul>
                ${locations.map(loc => `<li>${loc.name}: ${loc.demand}L demand</li>`).join('')}
            </ul>
            <p>📤 <strong>Extracted Minimum Demand:</strong> ${minDemand}L (${minLocation ? minLocation.name : 'Unknown location'})</p>
            <p>📤 <strong>Extracted Second Minimum:</strong> ${secondMinDemand}L (${secondMinLocation ? secondMinLocation.name : 'Unknown location'})</p>
            <p>📋 <strong>Remaining Heap:</strong></p>
            <div class="location-detail">[${heap.display().join(', ')}]</div>
            <p>📊 <strong>Heap Size:</strong> ${heap.display().length} demands</p>
            <p>💧 <strong>Application:</strong> Prioritizing locations with minimum water demand for efficient distribution</p>
        </div>
    `;
}

// Hash Table Demo (Location Lookup)
function hashTableDemo() {
    const output = document.getElementById('hashOutput');
    
    // Get water optimization data
    const locations = collectLocationData();
    const isSampleData = !document.getElementById('locations')?.value;
    
    const hashTable = new HashTable();
    
    // Store location data
    locations.forEach(loc => {
        hashTable.set(loc.name, {
            demand: loc.demand,
            priority: loc.priority,
            distance: loc.distance,
            allocated: loc.allocated || 0
        });
    });
    
    // Lookup specific locations
    const firstLocation = locations[0];
    const middleLocation = locations[Math.floor(locations.length / 2)];
    const lastLocation = locations[locations.length - 1];
    
    const firstData = hashTable.get(firstLocation.name);
    const middleData = hashTable.get(middleLocation.name);
    const lastData = hashTable.get(lastLocation.name);
    
    // Delete a location
    const deletedLocation = locations[1];
    const deleteResult = hashTable.delete(deletedLocation.name);
    
    const sampleDataNotice = isSampleData ? '<p>💡 <em>Using sample water optimization data for demonstration</em></p>' : '';
    
    output.innerHTML = `
        <div class="demo-result">
            <h4>🗂️ Hash Table - Fast Location Data Access</h4>
            ${sampleDataNotice}
            <p>📥 <strong>Stored Location Data:</strong></p>
            <ul>
                ${locations.map(loc => `<li>${loc.name}: ${loc.demand}L demand, Priority ${loc.priority}, ${loc.distance}km</li>`).join('')}
            </ul>
            <p>🔍 <strong>Lookup Results:</strong></p>
            <ul>
                <li>${firstLocation.name}: ${firstData ? `${firstData.demand}L demand, Priority ${firstData.priority}` : 'Not found'}</li>
                <li>${middleLocation.name}: ${middleData ? `${middleData.demand}L demand, Priority ${middleData.priority}` : 'Not found'}</li>
                <li>${lastLocation.name}: ${lastData ? `${lastData.demand}L demand, Priority ${lastData.priority}` : 'Not found'}</li>
            </ul>
            <p>🗑️ <strong>Deleted Location:</strong> ${deletedLocation.name} (${deleteResult ? 'Successfully deleted' : 'Not found'})</p>
            <p>📋 <strong>Hash Table Contents:</strong></p>
            <div class="location-detail">
                ${Object.entries(hashTable.display()).map(([key, value]) => 
                    `${key}: ${value.demand}L demand, Priority ${value.priority}`
                ).join('<br>')}
            </div>
            <p>💧 <strong>Application:</strong> Fast lookup of location data for real-time water distribution decisions</p>
        </div>
    `;
}

// Sorting Demo (Sort Locations by Demand)
function sortingDemo() {
    const locations = collectLocationData();
    const output = document.getElementById('sortOutput');
    const arr = locations.map(loc => loc.demand);
    const bubbleResult = bubbleSort([...arr]);
    const quickResult = quickSort([...arr]);
    const mergeResult = mergeSort([...arr]);
    output.innerHTML = `
        <div class="demo-result">
            <h4>Sorting Water Demands:</h4>
            <p>📊 Original Demands: [${arr.join(', ')}] L</p>
            <p>🔄 Bubble Sort: [${bubbleResult.join(', ')}] L</p>
            <p>⚡ Quick Sort: [${quickResult.join(', ')}] L</p>
            <p>🔄 Merge Sort: [${mergeResult.join(', ')}] L</p>
            <p>📈 Sorted Locations: ${locations.sort((a, b) => a.demand - b.demand).map(loc => loc.name).join(' → ')}</p>
        </div>
    `;
}

// Searching Demo (Find Location by Demand)
function searchingDemo() {
    const locations = collectLocationData();
    const output = document.getElementById('searchOutput');
    const arr = locations.map(loc => loc.demand).sort((a, b) => a - b);
    const target = parseInt(document.getElementById('searchTarget').value) || arr[Math.floor(arr.length/2)];
    const linearResult = linearSearch(arr, target);
    const binaryResult = binarySearch(arr, target);
    output.innerHTML = `
        <div class="demo-result">
            <h4>Searching Water Demands:</h4>
            <p>📊 Sorted Demands: [${arr.join(', ')}] L</p>
            <p>🎯 Target: ${target}L</p>
            <p>🔍 Linear Search: Found at index ${linearResult}</p>
            <p>🔍 Binary Search: Found at index ${binaryResult}</p>
            <p>📍 Location with ${target}L: ${locations.find(loc => loc.demand === target)?.name || 'Not found'}</p>
        </div>
    `;
}

// Dynamic Programming Demo (Water Distribution Patterns)
function dpDemo() {
    const n = parseInt(document.getElementById('fibN').value) || 10;
    const output = document.getElementById('dpOutput');
    const fibIterative = fibonacci(n);
    const fibRecursive = fibonacciRecursive(n);
    output.innerHTML = `
        <div class="demo-result">
            <h4>Dynamic Programming (Water Flow Patterns):</h4>
            <p>📊 Fibonacci Sequence (Water Flow Pattern):</p>
            <p>🔄 Iterative (${n}): ${fibIterative}</p>
            <p>🔄 Recursive (${n}): ${fibRecursive}</p>
            <p>💧 Water Flow Pattern: ${Array.from({length: Math.min(n, 8)}, (_, i) => fibonacci(i)).join(' → ')}</p>
            <p>📈 Pattern represents water distribution efficiency over time</p>
        </div>
    `;
}

// Mathematical Algorithms Demo (Water Calculations)
function mathDemo() {
    const a = parseInt(document.getElementById('mathA').value) || 48;
    const b = parseInt(document.getElementById('mathB').value) || 18;
    const output = document.getElementById('mathOutput');
    const gcdResult = gcd(a, b);
    const lcmResult = lcm(a, b);
    const aPrime = isPrime(a);
    const bPrime = isPrime(b);
    output.innerHTML = `
        <div class="demo-result">
            <h4>Mathematical Water Calculations:</h4>
            <p>📊 Numbers: A=${a}L, B=${b}L</p>
            <p>🔢 GCD (Common Factor): ${gcdResult}L</p>
            <p>🔢 LCM (Least Common Multiple): ${lcmResult}L</p>
            <p>🔢 ${a}L is ${aPrime ? 'Prime' : 'Not Prime'}</p>
            <p>🔢 ${b}L is ${bPrime ? 'Prime' : 'Not Prime'}</p>
            <p>💧 Optimal Water Distribution Factor: ${gcdResult}L</p>
        </div>
    `;
}

// String Algorithms Demo (Water Quality Patterns)
function stringDemo() {
    const text = document.getElementById('stringText').value || 'AABAACAADAABAABA';
    const pattern = document.getElementById('stringPattern').value || 'AABA';
    const output = document.getElementById('stringOutput');
    const result = kmpSearch(text, pattern);
    output.innerHTML = `
        <div class="demo-result">
            <h4>String Pattern Matching (Water Quality):</h4>
            <p>📝 Water Quality Pattern: "${pattern}"</p>
            <p>📊 Quality Data: "${text}"</p>
            <p>🔍 Pattern Found at: [${result.matches.join(', ')}]</p>
            <p>📊 Comparisons: ${result.comparisons}</p>
            <p>💧 Quality Matches: ${result.matches.length} occurrences</p>
            <p>📈 Pattern represents water quality standards</p>
        </div>
    `;
}

// Performance Analysis Demo (Water Distribution Performance)
function performanceDemo() {
    const size = parseInt(document.getElementById('perfSize').value) || 1000;
    const output = document.getElementById('perfOutput');
    
    // Generate test data
    const testArray = Array.from({length: size}, () => Math.floor(Math.random() * 1000));
    const target = testArray[Math.floor(Math.random() * size)];
    
    // Performance tests
    const startTime = performance.now();
    bubbleSort([...testArray]);
    const bubbleTime = performance.now() - startTime;
    
    const startTime2 = performance.now();
    quickSort([...testArray]);
    const quickTime = performance.now() - startTime2;
    
    const startTime3 = performance.now();
    mergeSort([...testArray]);
    const mergeTime = performance.now() - startTime3;
    
    output.innerHTML = `
        <div class="demo-result">
            <h4>Performance Analysis (Water Distribution):</h4>
            <p>📊 Array Size: ${size} locations</p>
            <p>🔄 Bubble Sort: ${bubbleTime.toFixed(2)}ms</p>
            <p>⚡ Quick Sort: ${quickTime.toFixed(2)}ms</p>
            <p>🔄 Merge Sort: ${mergeTime.toFixed(2)}ms</p>
            <p>📈 Fastest: ${Math.min(bubbleTime, quickTime, mergeTime).toFixed(2)}ms</p>
            <p>💧 Performance affects real-time water distribution decisions</p>
        </div>
    `;
}

// Run all demos with water optimization focus
function runAllDemos() {
    const output = document.getElementById('demoOutput');
    
    // Check if we have water optimization data
    const locations = collectLocationData();
    const totalWater = parseFloat(document.getElementById('totalWater').value) || 1000;
    
    if (locations.length === 0) {
        output.innerHTML = `
            <div class="demo-result">
                <h4>🚰 Water Optimization Demo</h4>
                <p>⚠️ Please go to Water Optimization tab and generate location data first!</p>
                <p>📋 Steps:</p>
                <ol>
                    <li>Go to "💧 Water Optimization" tab</li>
                    <li>Set number of locations</li>
                    <li>Click "Generate"</li>
                    <li>Fill in location details</li>
                    <li>Come back and run this demo</li>
                </ol>
            </div>
        `;
        return;
    }
    
    // Run all data structure demos
    linkedListDemo();
    stackDemo();
    queueDemo();
    treeDemo();
    heapDemo();
    hashTableDemo();
    
    // Run all algorithm demos
    sortingDemo();
    searchingDemo();
    dpDemo();
    mathDemo();
    stringDemo();
    performanceDemo();
    
    // Comprehensive water optimization demo
    const comprehensiveDemo = `
        <div class="demo-result">
            <h4>🚰 Comprehensive Water Distribution Analysis</h4>
            <div class="water-analysis">
                <h5>📊 Location Overview:</h5>
                <p>📍 Total Locations: ${locations.length}</p>
                <p>💧 Total Water Available: ${totalWater}L</p>
                <p>📈 Total Demand: ${locations.reduce((sum, loc) => sum + loc.demand, 0)}L</p>
                <p>🎯 Average Demand: ${(locations.reduce((sum, loc) => sum + loc.demand, 0) / locations.length).toFixed(1)}L</p>
                
                <h5>🔍 Location Details:</h5>
                ${locations.map(loc => `
                    <div class="location-detail">
                        <strong>${loc.name}</strong>: ${loc.demand}L demand, Priority ${loc.priority}, ${loc.distance}km away
                    </div>
                `).join('')}
                
                <h5>📈 Data Structure Applications:</h5>
                <ul>
                    <li>🔗 <strong>Linked List</strong>: Manage location sequence</li>
                    <li>📚 <strong>Stack</strong>: Undo water allocation changes</li>
                    <li>📋 <strong>Queue</strong>: Process locations in order</li>
                    <li>🌳 <strong>Binary Tree</strong>: Organize by priority</li>
                    <li>📈 <strong>Min Heap</strong>: Find minimum demand locations</li>
                    <li>🗂️ <strong>Hash Table</strong>: Quick location lookup</li>
                </ul>
                
                <h5>🔧 Algorithm Applications:</h5>
                <ul>
                    <li>🔄 <strong>Sorting</strong>: Order locations by demand/priority</li>
                    <li>🔍 <strong>Searching</strong>: Find specific demand levels</li>
                    <li>🧮 <strong>Dynamic Programming</strong>: Optimize distribution patterns</li>
                    <li>🔢 <strong>Mathematical</strong>: Calculate optimal factors</li>
                    <li>📝 <strong>String Matching</strong>: Pattern recognition in data</li>
                    <li>⚡ <strong>Performance</strong>: Real-time optimization</li>
                </ul>
                
                <h5>💡 Optimization Insights:</h5>
                <p>🎯 <strong>Priority-based</strong>: Serve high-priority locations first</p>
                <p>⚖️ <strong>Proportional</strong>: Distribute based on demand ratio</p>
                <p>📏 <strong>Distance-weighted</strong>: Consider proximity to source</p>
                <p>📊 <strong>Efficiency</strong>: Maximize demand satisfaction</p>
            </div>
        </div>
    `;
    
    output.innerHTML = comprehensiveDemo;
    
    showNotification('All water optimization demos completed!', 'success');
}

// Clear All Outputs
function clearAllOutputs() {
    const outputs = [
        'llOutput', 'stackOutput', 'queueOutput', 'treeOutput', 
        'heapOutput', 'hashOutput', 'sortOutput', 'searchOutput',
        'dpOutput', 'mathOutput', 'stringOutput', 'perfOutput', 'demoOutput'
    ];
    
    outputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = '';
    });
}

// Generate location input fields based on user selection
function generateLocationInputs() {
    const numLocations = parseInt(document.getElementById('locations').value);
    const container = document.getElementById('locationInputs');
    
    if (numLocations < 2 || numLocations > 10) {
        alert('Please enter a number between 2 and 10');
        return;
    }
    
    container.innerHTML = '';
    
    for (let i = 1; i <= numLocations; i++) {
        const locationDiv = document.createElement('div');
        locationDiv.className = 'location-item';
        locationDiv.innerHTML = `
            <h3>Location ${i}</h3>
            <div class="location-grid">
                <div class="form-group">
                    <label for="name${i}">Name:</label>
                    <input type="text" id="name${i}" value="Location ${i}" placeholder="Enter location name">
                </div>
                <div class="form-group">
                    <label for="demand${i}">Water Demand (L):</label>
                    <input type="number" id="demand${i}" value="${Math.floor(Math.random() * 200) + 100}" min="50" placeholder="Enter water demand">
                </div>
                <div class="form-group">
                    <label for="priority${i}">Priority (1-10):</label>
                    <input type="number" id="priority${i}" value="${Math.floor(Math.random() * 5) + 1}" min="1" max="10" placeholder="Enter priority">
                </div>
                <div class="form-group">
                    <label for="distance${i}">Distance (km):</label>
                    <input type="number" id="distance${i}" value="${Math.floor(Math.random() * 50) + 5}" min="1" placeholder="Enter distance">
                </div>
            </div>
        `;
        container.appendChild(locationDiv);
    }
}

// Generate sample water optimization data for demos
function generateSampleWaterData() {
    const sampleLocations = [
        { id: 1, name: "Residential Area A", demand: 150, priority: 8, distance: 5, allocated: 0 },
        { id: 2, name: "Industrial Zone B", demand: 300, priority: 6, distance: 12, allocated: 0 },
        { id: 3, name: "Hospital Complex", demand: 200, priority: 10, distance: 8, allocated: 0 },
        { id: 4, name: "School District", demand: 100, priority: 7, distance: 15, allocated: 0 },
        { id: 5, name: "Shopping Center", demand: 250, priority: 5, distance: 20, allocated: 0 }
    ];
    
    // Store sample data in localStorage for demo purposes
    localStorage.setItem('sampleWaterData', JSON.stringify(sampleLocations));
    localStorage.setItem('sampleTotalWater', '1000');
    
    return sampleLocations;
}

// Enhanced collectLocationData function that can use sample data
function collectLocationData() {
    // First try to get real data from the form
    const numLocations = parseInt(document.getElementById('locations')?.value);
    
    if (numLocations && numLocations > 0) {
        const locations = [];
        
        for (let i = 1; i <= numLocations; i++) {
            const nameElement = document.getElementById(`name${i}`);
            const demandElement = document.getElementById(`demand${i}`);
            const priorityElement = document.getElementById(`priority${i}`);
            const distanceElement = document.getElementById(`distance${i}`);
            
            if (nameElement && demandElement && priorityElement && distanceElement) {
                const name = nameElement.value || `Location ${i}`;
                const demand = parseFloat(demandElement.value) || 0;
                const priority = parseInt(priorityElement.value) || 1;
                const distance = parseFloat(distanceElement.value) || 0;
                
                locations.push({
                    id: i,
                    name: name,
                    demand: demand,
                    priority: priority,
                    distance: distance,
                    allocated: 0
                });
            }
        }
        
        if (locations.length > 0) {
            return locations;
        }
    }
    
    // If no real data, try to get sample data
    const sampleData = localStorage.getItem('sampleWaterData');
    if (sampleData) {
        return JSON.parse(sampleData);
    }
    
    // If no sample data exists, generate it
    return generateSampleWaterData();
}

// Optimize water distribution using multiple algorithms
function optimizeDistribution() {
    optimizationStopped = false;
    const totalWater = parseFloat(document.getElementById('totalWater').value);
    const locations = collectLocationData();
    if (totalWater <= 0) {
        alert('Please enter a valid total water amount');
        return;
    }
    if (locations.length === 0) {
        alert('Please generate location inputs first');
        return;
    }
    const optimizeBtn = document.querySelector('.optimize-btn');
    const originalText = optimizeBtn.innerHTML;
    optimizeBtn.innerHTML = '<span class="loading"></span> Optimizing...';
    optimizeBtn.disabled = true;
    setTimeout(() => {
        if (optimizationStopped) {
            // Do not proceed if stopped
            return;
        }
        const results = performOptimization(locations, totalWater);
        displayResults(results);
        updateChart(results);
        optimizeBtn.innerHTML = originalText;
        optimizeBtn.disabled = false;
    }, 1000);
}

// Perform optimization using multiple strategies
function performOptimization(locations, totalWater) {
    const results = {
        locations: [],
        totalAllocated: 0,
        efficiency: 0,
        strategy: '',
        unmetDemand: 0
    };
    
    // Calculate total demand and priority weights
    const totalDemand = locations.reduce((sum, loc) => sum + loc.demand, 0);
    const maxPriority = Math.max(...locations.map(loc => loc.priority));
    
    // Strategy 1: Priority-based allocation
    const priorityResults = allocateByPriority([...locations], totalWater, maxPriority);
    
    // Strategy 2: Proportional allocation
    const proportionalResults = allocateProportionally([...locations], totalWater, totalDemand);
    
    // Strategy 3: Distance-weighted allocation
    const distanceResults = allocateByDistance([...locations], totalWater);
    
    // Choose the best strategy based on efficiency
    const strategies = [
        { name: 'Priority-based', data: priorityResults },
        { name: 'Proportional', data: proportionalResults },
        { name: 'Distance-weighted', data: distanceResults }
    ];
    
    let bestStrategy = strategies[0];
    let bestEfficiency = calculateEfficiency(priorityResults, totalWater);
    
    strategies.forEach(strategy => {
        const efficiency = calculateEfficiency(strategy.data, totalWater);
        if (efficiency > bestEfficiency) {
            bestEfficiency = efficiency;
            bestStrategy = strategy;
        }
    });
    
    results.locations = bestStrategy.data;
    results.totalAllocated = bestStrategy.data.reduce((sum, loc) => sum + loc.allocated, 0);
    results.efficiency = bestEfficiency;
    results.strategy = bestStrategy.name;
    results.unmetDemand = totalDemand - results.totalAllocated;
    
    return results;
}

// Priority-based allocation
function allocateByPriority(locations, totalWater, maxPriority) {
    const sortedLocations = locations.sort((a, b) => b.priority - a.priority);
    let remainingWater = totalWater;
    
    for (let location of sortedLocations) {
        const priorityWeight = location.priority / maxPriority;
        const maxAllocation = Math.min(location.demand, remainingWater * priorityWeight);
        location.allocated = Math.min(maxAllocation, remainingWater);
        remainingWater -= location.allocated;
        
        if (remainingWater <= 0) break;
    }
    
    return sortedLocations;
}

// Proportional allocation
function allocateProportionally(locations, totalWater, totalDemand) {
    const demandRatio = totalWater / totalDemand;
    
    for (let location of locations) {
        location.allocated = Math.min(location.demand * demandRatio, location.demand);
    }
    
    return locations;
}

// Distance-weighted allocation (closer locations get more water)
function allocateByDistance(locations, totalWater) {
    const maxDistance = Math.max(...locations.map(loc => loc.distance));
    const totalWeight = locations.reduce((sum, loc) => sum + (maxDistance - loc.distance + 1), 0);
    
    for (let location of locations) {
        const weight = (maxDistance - location.distance + 1) / totalWeight;
        location.allocated = Math.min(location.demand, totalWater * weight);
    }
    
    return locations;
}

// Calculate efficiency score
function calculateEfficiency(locations, totalWater) {
    const totalAllocated = locations.reduce((sum, loc) => sum + loc.allocated, 0);
    const totalDemand = locations.reduce((sum, loc) => sum + loc.demand, 0);
    
    // Efficiency based on demand satisfaction and water utilization
    const demandSatisfaction = totalAllocated / totalDemand;
    const waterUtilization = totalAllocated / totalWater;
    
    return (demandSatisfaction * 0.7 + waterUtilization * 0.3) * 100;
}

// Display optimization results
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    
    let html = `
        <div class="optimization-stats">
            <h3>Optimization Summary</h3>
            <div class="stat-item">
                <span>Strategy Used:</span>
                <span>${results.strategy}</span>
            </div>
            <div class="stat-item">
                <span>Total Allocated:</span>
                <span>${results.totalAllocated.toFixed(2)} L</span>
            </div>
            <div class="stat-item">
                <span>Efficiency Score:</span>
                <span>${results.efficiency.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span>Unmet Demand:</span>
                <span>${results.unmetDemand.toFixed(2)} L</span>
            </div>
        </div>
        
        <div class="location-results">
            <h3>Location-wise Allocation</h3>
    `;
    
    results.locations.forEach(location => {
        const satisfactionRate = ((location.allocated / location.demand) * 100).toFixed(1);
        const status = location.allocated >= location.demand ? '✅ Fully Satisfied' : 
                      location.allocated > 0 ? '⚠️ Partially Satisfied' : '❌ Not Satisfied';
        
        html += `
            <div class="result-item">
                <h3>${location.name}</h3>
                <div class="result-value">
                    <div>Demand: ${location.demand} L</div>
                    <div>Allocated: ${location.allocated.toFixed(2)} L</div>
                    <div>Satisfaction: ${satisfactionRate}%</div>
                    <div>Status: ${status}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
    
    // Update dashboard with results
    updateDashboard(results);
}

// Update dashboard with optimization results
function updateDashboard(results) {
    // Update dashboard cards
    const dashboardLocations = document.getElementById('dashboardLocations');
    const dashboardDemand = document.getElementById('dashboardDemand');
    const dashboardWater = document.getElementById('dashboardWater');
    const dashboardAllocated = document.getElementById('dashboardAllocated');
    const dashboardEfficiency = document.getElementById('dashboardEfficiency');
    const dashboardUnmet = document.getElementById('dashboardUnmet');
    const dashboardStrategy = document.getElementById('dashboardStrategy');
    
    if (dashboardLocations) {
        dashboardLocations.textContent = results.locations.length;
    }
    
    if (dashboardDemand) {
        const totalDemand = results.locations.reduce((sum, loc) => sum + loc.demand, 0);
        dashboardDemand.textContent = totalDemand.toFixed(0);
    }
    
    if (dashboardWater) {
        const totalWater = parseFloat(document.getElementById('totalWater').value) || 0;
        dashboardWater.textContent = totalWater.toFixed(0);
    }
    
    if (dashboardAllocated) {
        dashboardAllocated.textContent = results.totalAllocated.toFixed(0);
    }
    
    if (dashboardEfficiency) {
        dashboardEfficiency.textContent = results.efficiency.toFixed(1) + '%';
    }
    
    if (dashboardUnmet) {
        dashboardUnmet.textContent = results.unmetDemand.toFixed(0);
    }
    
    if (dashboardStrategy) {
        dashboardStrategy.textContent = results.strategy;
    }
    
    // Update dashboard chart if it exists
    updateDashboardChart(results);
}

// Update dashboard chart
function updateDashboardChart(results) {
    const dashboardChartCanvas = document.getElementById('dashboardChart');
    if (!dashboardChartCanvas) return;
    
    // Destroy existing chart if it exists
    if (window.dashboardChart) {
        window.dashboardChart.destroy();
    }
    
    const ctx = dashboardChartCanvas.getContext('2d');
    
    // Prepare data for chart
    const labels = results.locations.map(loc => loc.name);
    const demandData = results.locations.map(loc => loc.demand);
    const allocatedData = results.locations.map(loc => loc.allocated);
    
    window.dashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Demand (L)',
                    data: demandData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Allocated (L)',
                    data: allocatedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Water (Liters)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Locations'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Water Distribution Overview'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Initialize chart
function initializeChart() {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Water Demand (L)',
                data: [],
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }, {
                label: 'Water Allocated (L)',
                data: [],
                backgroundColor: 'rgba(46, 204, 113, 0.7)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Water Volume (Liters)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Locations'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Water Distribution Comparison',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Update chart with new data
function updateChart(results) {
    // If chart is not initialized, forcibly re-initialize it
    if (!chart) {
        initializeChart();
    }
    if (!chart) return;
    const labels = results.locations.map(loc => loc.name);
    const demandData = results.locations.map(loc => loc.demand);
    const allocatedData = results.locations.map(loc => loc.allocated);
    chart.data.labels = labels;
    chart.data.datasets[0].data = demandData;
    chart.data.datasets[1].data = allocatedData;
    chart.update();
}

// Add Chart.js library dynamically
function loadChartJS() {
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function() {
            initializeChart();
        };
        document.head.appendChild(script);
    } else {
        initializeChart();
    }
}

// Export results to JSON
function exportResults() {
    const results = collectLocationData();
    const totalWater = parseFloat(document.getElementById('totalWater').value);
    
    const exportData = {
        timestamp: new Date().toISOString(),
        totalWater: totalWater,
        locations: results,
        optimization: performOptimization(results, totalWater)
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'water_distribution_results.json';
    link.click();
}

// Import results from JSON
function importResults() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.totalWater) {
                    document.getElementById('totalWater').value = data.totalWater;
                }
                
                if (data.locations && data.locations.length > 0) {
                    document.getElementById('locations').value = data.locations.length;
                    generateLocationInputs();
                    
                    // Wait for DOM to update, then populate fields
                    setTimeout(() => {
                        data.locations.forEach((location, index) => {
                            const i = index + 1;
                            if (document.getElementById(`name${i}`)) {
                                document.getElementById(`name${i}`).value = location.name;
                                document.getElementById(`demand${i}`).value = location.demand;
                                document.getElementById(`priority${i}`).value = location.priority;
                                document.getElementById(`distance${i}`).value = location.distance;
                            }
                        });
                    }, 100);
                }
                
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    generateLocationInputs();
    loadChartJS();
    // Add export/import buttons to the page
    const inputSection = document.querySelector('.input-section');
    const exportImportDiv = document.createElement('div');
    exportImportDiv.style.marginTop = '20px';
    exportImportDiv.innerHTML = `
        <button onclick="exportResults()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad);">📤 Export Data</button>
        <button onclick="importResults()" style="background: linear-gradient(135deg, #f39c12, #e67e22);">📥 Import Data</button>
    `;
    inputSection.appendChild(exportImportDiv);
});

// Show notification message
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// === 3D Water Optimization Plot for Data Structures Tab ===
function renderWaterOptimization3DPlot() {
    const plotDiv = document.getElementById('dsa3dPlot');
    if (!plotDiv) return;
    // Remove any previous edit controls
    const prevEditDiv = document.getElementById('dsa3dEditControls');
    if (prevEditDiv) prevEditDiv.remove();
    // Get results from global or localStorage
    let results = window.latestOptimizationResults;
    if ((!results || !results.locations || !results.locations.length) && localStorage.getItem('latestOptimizationResults')) {
        results = JSON.parse(localStorage.getItem('latestOptimizationResults'));
    }
    if (results && results.locations && results.locations.length > 0) {
        const locations = results.locations;
        const x = locations.map(loc => loc.priority);
        const y = locations.map(loc => loc.distance);
        const z = locations.map(loc => loc.allocated);
        const names = locations.map(loc => loc.name);
        // 3D scatter plot with location names
        const data = [{
            type: 'scatter3d',
            mode: 'markers+text',
            x: x,
            y: y,
            z: z,
            text: names,
            textposition: 'top center',
            marker: { size: 10, color: z, colorscale: 'Viridis', colorbar: { title: 'Allocated (L)' } }
        }];
        const layout = {
            title: 'Water Allocation by Priority & Distance',
            autosize: true,
            scene: {
                xaxis: { title: 'Priority' },
                yaxis: { title: 'Distance (km)' },
                zaxis: { title: 'Allocated Water (L)' }
            }
        };
        Plotly.newPlot('dsa3dPlot', data, layout);
        // Render live edit controls for each location
        let editHtml = '<div id="dsa3dEditControls" style="margin-top:30px;text-align:center;">';
        locations.forEach((loc, idx) => {
            editHtml += `
                <div style="margin:10px 0;">
                    <b>${loc.name}</b>:
                    Demand: <input type="number" id="edit-demand-${idx}" value="${loc.demand}" style="width:60px;">
                    Priority: <input type="number" id="edit-priority-${idx}" value="${loc.priority}" style="width:40px;">
                    Distance: <input type="number" id="edit-distance-${idx}" value="${loc.distance}" style="width:50px;">
                    <button onclick="editLocationDSA(${idx})">Edit</button>
                </div>
            `;
        });
        editHtml += '</div>';
        plotDiv.insertAdjacentHTML('afterend', editHtml);
    } else {
        plotDiv.innerHTML = '<div style="text-align:center;padding:40px;">No water optimization results available.<br>Run an optimization in the Water Optimization tab first.</div>';
    }
}

// Live edit handler for DSA tab
window.editLocationDSA = function(idx) {
    // Get results from localStorage
    let results = window.latestOptimizationResults;
    if ((!results || !results.locations || !results.locations.length) && localStorage.getItem('latestOptimizationResults')) {
        results = JSON.parse(localStorage.getItem('latestOptimizationResults'));
    }
    if (!results || !results.locations || !results.locations[idx]) return;
    // Update values from inputs
    const loc = results.locations[idx];
    loc.demand = parseFloat(document.getElementById(`edit-demand-${idx}`).value);
    loc.priority = parseInt(document.getElementById(`edit-priority-${idx}`).value);
    loc.distance = parseFloat(document.getElementById(`edit-distance-${idx}`).value);
    // Re-run optimization with new values
    const totalWater = parseFloat(document.getElementById('totalWater').value) || 1000;
    const newResults = performOptimization(results.locations, totalWater);
    // Store and update everywhere
    window.latestOptimizationResults = newResults;
    localStorage.setItem('latestOptimizationResults', JSON.stringify(newResults));
    renderWaterOptimization3DPlot();
};

// === Water Network Map Integration ===
function renderWaterNetworkMap() {
    const container = document.getElementById('networkMap');
    if (!container) return;
    container.innerHTML = '';
    // Get results from localStorage
    let results = null;
    if (localStorage.getItem('latestOptimizationResults')) {
        results = JSON.parse(localStorage.getItem('latestOptimizationResults'));
    }
    // Populate info card
    const infoFields = [
        ['networkMapLocations', results?.locations?.length || '-'],
        ['networkMapDemand', results?.totalDemand !== undefined ? results.totalDemand : '-'],
        ['networkMapAllocated', results?.totalAllocated !== undefined ? results.totalAllocated : '-'],
        ['networkMapEfficiency', results?.efficiency !== undefined ? results.efficiency + '%' : '-'],
        ['networkMapUnmet', results?.unmetDemand !== undefined ? results.unmetDemand : '-'],
        ['networkMapStrategy', results?.strategy || '-']
    ];
    infoFields.forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });
    if (!results || !results.locations || !results.locations.length) {
        container.innerHTML = '<div style="text-align:center;padding:40px;">No water optimization results available.<br>Run an optimization in the Water Optimization tab first.</div>';
        const legendDiv = document.getElementById('networkLegend');
        if (legendDiv) legendDiv.innerHTML = '';
        return;
    }
    // Simulate a grid network for demo (or use your real network structure if available)
    const locations = results.locations;
    const nodes = [];
    const edges = [];
    const gridCols = Math.ceil(Math.sqrt(locations.length));
    // Color scale for allocation/pressure
    function getColor(val) {
        if (val < 0.25) return '#00b300'; // green
        if (val < 0.5) return '#e6e600'; // yellow
        if (val < 0.75) return '#ff9900'; // orange
        return '#e60000'; // red
    }
    // Find min/max for scaling
    const allocs = locations.map(l => l.allocated);
    const minAlloc = Math.min(...allocs);
    const maxAlloc = Math.max(...allocs);
    // Create nodes
    locations.forEach((loc, i) => {
        const norm = (loc.allocated - minAlloc) / (maxAlloc - minAlloc || 1);
        nodes.push({
            id: i,
            label: loc.name + '\n' + loc.allocated.toFixed(1) + 'L',
            color: { background: getColor(norm), border: '#333' },
            shape: 'dot',
            size: 20 + 20 * norm
        });
    });
    // Create edges (simple grid for demo)
    for (let i = 0; i < locations.length; i++) {
        if (i % gridCols !== gridCols - 1 && i + 1 < locations.length) {
            edges.push({ from: i, to: i + 1 });
        }
        if (i + gridCols < locations.length) {
            edges.push({ from: i, to: i + gridCols });
        }
    }
    // vis.js network
    const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
    const options = {
        nodes: { font: { size: 14, color: '#222' } },
        edges: { color: '#bbb', width: 2, smooth: false },
        physics: { enabled: false }
    };
    new vis.Network(container, data, options);
    // Legend
    const legendDiv = document.getElementById('networkLegend');
    if (legendDiv) legendDiv.innerHTML = `
        <b>Legend (Allocated Water):</b>
        <span style="color:#00b300;">●</span> Low
        <span style="color:#e6e600;">●</span> Medium
        <span style="color:#ff9900;">●</span> High
        <span style="color:#e60000;">●</span> Very High
    `;
}
function acceptMap() {
    alert('Map accepted!');
}

function updateActiveDemoInfo(results) {
    const infoFields = [
        ['activeDemoLocations', results?.locations?.length || '-'],
        ['activeDemoDemand', results?.totalDemand !== undefined ? results.totalDemand : '-'],
        ['activeDemoAllocated', results?.totalAllocated !== undefined ? results.totalAllocated : '-'],
        ['activeDemoEfficiency', results?.efficiency !== undefined ? results.efficiency + '%' : '-'],
        ['activeDemoUnmet', results?.unmetDemand !== undefined ? results.unmetDemand : '-'],
        ['activeDemoStrategy', results?.strategy || '-']
    ];
    infoFields.forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });
}

let optimizationStopped = false;

function stopOptimization() {
    optimizationStopped = true;
    const optimizeBtn = document.querySelector('.optimize-btn');
    if (optimizeBtn) {
        optimizeBtn.innerHTML = '💧 Optimize Distribution';
        optimizeBtn.disabled = false;
    }
    // Optionally, show a message or clear results
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '<p class="placeholder">Optimization stopped. Click "Optimize Distribution" to try again or generate new data.</p>';
    }
}

function print3DGraph() {
    const chartDiv = document.getElementById('chart');
    if (!chartDiv) return;
    // Remove any existing canvas/chart content
    chartDiv.innerHTML = '';
    // Create divs for Plotly 3D pie and donut charts (using 3D effect with scatter3d for demo)
    let pieDiv = document.createElement('div');
    pieDiv.id = 'distribution3dPieChart';
    pieDiv.style.width = '100%';
    pieDiv.style.height = '400px';
    chartDiv.appendChild(pieDiv);

    let donutDiv = document.createElement('div');
    donutDiv.id = 'distribution3dDonutChart';
    donutDiv.style.width = '100%';
    donutDiv.style.height = '400px';
    chartDiv.appendChild(donutDiv);

    // Info summary div
    let infoDiv = document.createElement('div');
    infoDiv.id = 'distributionInfo';
    infoDiv.style.marginTop = '30px';
    infoDiv.style.fontSize = '1.1rem';
    chartDiv.appendChild(infoDiv);

    // Get results from localStorage
    let results = window.latestOptimizationResults;
    if ((!results || !results.locations || !results.locations.length) && localStorage.getItem('latestOptimizationResults')) {
        results = JSON.parse(localStorage.getItem('latestOptimizationResults'));
    }
    if (results && results.locations && results.locations.length > 0) {
        const locations = results.locations;
        const labels = locations.map(loc => loc.name);
        const values = locations.map(loc => loc.allocated);
        // 3D Pie chart (simulated with 2D pie and 3D style)
        Plotly.newPlot('distribution3dPieChart', [{
            type: 'pie',
            labels: labels,
            values: values,
            textinfo: 'label+percent',
            insidetextorientation: 'radial',
            hole: 0,
            marker: { line: { color: '#fff', width: 2 } },
            pull: 0.05
        }], {
            title: 'Allocated Water by Location (3D Pie Chart)',
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2 },
            paper_bgcolor: 'rgba(240,240,255,1)',
            plot_bgcolor: 'rgba(240,240,255,1)',
        });
        // 3D Donut chart (simulated with 2D donut and 3D style)
        Plotly.newPlot('distribution3dDonutChart', [{
            type: 'pie',
            labels: labels,
            values: values,
            textinfo: 'label+percent',
            insidetextorientation: 'radial',
            hole: 0.5,
            marker: { line: { color: '#fff', width: 2 } },
            pull: 0.05
        }], {
            title: 'Allocated Water by Location (3D Donut Chart)',
            legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2 },
            paper_bgcolor: 'rgba(240,240,255,1)',
            plot_bgcolor: 'rgba(240,240,255,1)',
        });
        // Info summary: total allocated and top 3 locations
        let total = values.reduce((a, b) => a + b, 0);
        let sorted = locations.slice().sort((a, b) => b.allocated - a.allocated);
        let infoHtml = `<b>Water Allocation Summary:</b><br/>`;
        infoHtml += `<b>Total Allocated:</b> ${total.toFixed(2)} L<br/>`;
        infoHtml += `<b>Top 3 Locations:</b><br/>`;
        sorted.slice(0, 3).forEach(loc => {
            infoHtml += `${loc.name}: <b>${loc.allocated.toFixed(2)} L</b> (${((loc.allocated/total)*100).toFixed(1)}%)<br/>`;
        });
        infoDiv.innerHTML = infoHtml;
    } else {
        chartDiv.innerHTML = '<div style="text-align:center;padding:40px;">No water optimization results available.<br>Run an optimization in the Water Optimization tab first.</div>';
    }
}