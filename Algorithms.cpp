#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <climits>
#include <cmath>
using namespace std;

// ==================== SORTING ALGORITHMS ====================

// Bubble Sort - O(n²)
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

// Selection Sort - O(n²)
void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        swap(arr[i], arr[minIndex]);
    }
}

// Insertion Sort - O(n²)
void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Merge Sort - O(n log n)
void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    vector<int> L(n1), R(n2);
    
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

// Quick Sort - O(n log n) average, O(n²) worst case
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Heap Sort - O(n log n)
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

// ==================== SEARCHING ALGORITHMS ====================

// Linear Search - O(n)
int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// Binary Search - O(log n)
int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        }
        
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// ==================== DYNAMIC PROGRAMMING ====================

// Fibonacci with DP - O(n)
int fibonacciDP(int n) {
    if (n <= 1) return n;
    
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// Longest Common Subsequence - O(m*n)
int longestCommonSubsequence(const string& text1, const string& text2) {
    int m = text1.length();
    int n = text2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

// 0/1 Knapsack Problem - O(n*W)
int knapsack01(const vector<int>& weights, const vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][W];
}

// ==================== GRAPH ALGORITHMS ====================

// Dijkstra's Shortest Path - O(V²)
vector<int> dijkstra(const vector<vector<pair<int, int>>>& graph, int start) {
    int V = graph.size();
    vector<int> distance(V, INT_MAX);
    vector<bool> visited(V, false);
    
    distance[start] = 0;
    
    for (int count = 0; count < V - 1; count++) {
        int minDistance = INT_MAX;
        int minIndex = -1;
        
        for (int v = 0; v < V; v++) {
            if (!visited[v] && distance[v] < minDistance) {
                minDistance = distance[v];
                minIndex = v;
            }
        }
        
        if (minIndex == -1) break;
        
        visited[minIndex] = true;
        
        for (const auto& neighbor : graph[minIndex]) {
            int v = neighbor.first;
            int weight = neighbor.second;
            
            if (!visited[v] && distance[minIndex] != INT_MAX && 
                distance[minIndex] + weight < distance[v]) {
                distance[v] = distance[minIndex] + weight;
            }
        }
    }
    
    return distance;
}

// Floyd-Warshall All Pairs Shortest Path - O(V³)
vector<vector<int>> floydWarshall(const vector<vector<int>>& graph) {
    int V = graph.size();
    vector<vector<int>> dist = graph;
    
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    
    return dist;
}

// Topological Sort using DFS - O(V + E)
bool topologicalSortDFS(int v, const vector<vector<int>>& graph, 
                       vector<bool>& visited, vector<bool>& recStack, 
                       vector<int>& result) {
    visited[v] = true;
    recStack[v] = true;
    
    for (int neighbor : graph[v]) {
        if (!visited[neighbor]) {
            if (topologicalSortDFS(neighbor, graph, visited, recStack, result)) {
                return true;
            }
        } else if (recStack[neighbor]) {
            return true; // Cycle detected
        }
    }
    
    recStack[v] = false;
    result.push_back(v);
    return false;
}

vector<int> topologicalSort(const vector<vector<int>>& graph) {
    int V = graph.size();
    vector<bool> visited(V, false);
    vector<bool> recStack(V, false);
    vector<int> result;
    
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            if (topologicalSortDFS(i, graph, visited, recStack, result)) {
                return {}; // Cycle detected, no topological sort possible
            }
        }
    }
    
    reverse(result.begin(), result.end());
    return result;
}

// ==================== STRING ALGORITHMS ====================

// KMP Pattern Matching - O(n + m)
vector<int> computeLPS(const string& pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    
    int len = 0;
    int i = 1;
    
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

vector<int> kmpSearch(const string& text, const string& pattern) {
    vector<int> matches;
    int n = text.length();
    int m = pattern.length();
    
    if (m == 0) return matches;
    
    vector<int> lps = computeLPS(pattern);
    
    int i = 0, j = 0;
    while (i < n) {
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }
        
        if (j == m) {
            matches.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return matches;
}

// ==================== MATHEMATICAL ALGORITHMS ====================

// Sieve of Eratosthenes - O(n log log n)
vector<bool> sieveOfEratosthenes(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    
    return isPrime;
}

// GCD using Euclidean Algorithm - O(log min(a, b))
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// LCM - O(log min(a, b))
int lcm(int a, int b) {
    return (a / gcd(a, b)) * b;
}

// Fast Power (Binary Exponentiation) - O(log n)
long long fastPower(long long base, long long exponent, long long mod = LLONG_MAX) {
    long long result = 1;
    base %= mod;
    
    while (exponent > 0) {
        if (exponent & 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exponent >>= 1;
    }
    
    return result;
}

// ==================== DEMO FUNCTION ====================
void demonstrateAlgorithms() {
    cout << "=== ALGORITHMS DEMONSTRATION ===" << endl << endl;
    
    // Sorting Algorithms Demo
    cout << "1. SORTING ALGORITHMS:" << endl;
    vector<int> arr1 = {64, 34, 25, 12, 22, 11, 90};
    vector<int> arr2 = arr1;
    vector<int> arr3 = arr1;
    vector<int> arr4 = arr1;
    vector<int> arr5 = arr1;
    
    cout << "Original array: ";
    for (int val : arr1) cout << val << " ";
    cout << endl;
    
    bubbleSort(arr1);
    cout << "Bubble Sort: ";
    for (int val : arr1) cout << val << " ";
    cout << endl;
    
    selectionSort(arr2);
    cout << "Selection Sort: ";
    for (int val : arr2) cout << val << " ";
    cout << endl;
    
    insertionSort(arr3);
    cout << "Insertion Sort: ";
    for (int val : arr3) cout << val << " ";
    cout << endl;
    
    mergeSort(arr4, 0, arr4.size() - 1);
    cout << "Merge Sort: ";
    for (int val : arr4) cout << val << " ";
    cout << endl;
    
    quickSort(arr5, 0, arr5.size() - 1);
    cout << "Quick Sort: ";
    for (int val : arr5) cout << val << " ";
    cout << endl << endl;
    
    // Searching Algorithms Demo
    cout << "2. SEARCHING ALGORITHMS:" << endl;
    vector<int> sortedArr = {2, 4, 6, 8, 10, 12, 14, 16, 18, 20};
    int target = 12;
    
    cout << "Array: ";
    for (int val : sortedArr) cout << val << " ";
    cout << endl;
    cout << "Searching for: " << target << endl;
    
    int linearResult = linearSearch(sortedArr, target);
    cout << "Linear Search result: " << linearResult << endl;
    
    int binaryResult = binarySearch(sortedArr, target);
    cout << "Binary Search result: " << binaryResult << endl << endl;
    
    // Dynamic Programming Demo
    cout << "3. DYNAMIC PROGRAMMING:" << endl;
    cout << "Fibonacci(10): " << fibonacciDP(10) << endl;
    
    string str1 = "ABCDGH";
    string str2 = "AEDFHR";
    cout << "LCS of '" << str1 << "' and '" << str2 << "': " 
         << longestCommonSubsequence(str1, str2) << endl;
    
    vector<int> weights = {2, 1, 3, 2};
    vector<int> values = {12, 10, 20, 15};
    int capacity = 5;
    cout << "0/1 Knapsack (W=" << capacity << "): " 
         << knapsack01(weights, values, capacity) << endl << endl;
    
    // Graph Algorithms Demo
    cout << "4. GRAPH ALGORITHMS:" << endl;
    int V = 5;
    vector<vector<pair<int, int>>> graph(V);
    graph[0] = {{1, 4}, {2, 1}};
    graph[1] = {{2, 2}, {3, 5}};
    graph[2] = {{1, 2}, {3, 8}, {4, 10}};
    graph[3] = {{4, 2}};
    graph[4] = {{3, 2}};
    
    vector<int> distances = dijkstra(graph, 0);
    cout << "Dijkstra shortest distances from vertex 0: ";
    for (int i = 0; i < V; i++) {
        cout << distances[i] << " ";
    }
    cout << endl << endl;
    
    // String Algorithms Demo
    cout << "5. STRING ALGORITHMS:" << endl;
    string text = "AABAACAADAABAABA";
    string pattern = "AABA";
    vector<int> matches = kmpSearch(text, pattern);
    cout << "KMP Search for pattern '" << pattern << "' in text '" << text << "': ";
    for (int pos : matches) cout << pos << " ";
    cout << endl << endl;
    
    // Mathematical Algorithms Demo
    cout << "6. MATHEMATICAL ALGORITHMS:" << endl;
    int n = 30;
    vector<bool> primes = sieveOfEratosthenes(n);
    cout << "Primes up to " << n << ": ";
    for (int i = 2; i <= n; i++) {
        if (primes[i]) cout << i << " ";
    }
    cout << endl;
    
    cout << "GCD(48, 18): " << gcd(48, 18) << endl;
    cout << "LCM(12, 18): " << lcm(12, 18) << endl;
    cout << "2^10 (mod 1000): " << fastPower(2, 10, 1000) << endl << endl;
} 