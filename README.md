# 🚀 Comprehensive DSA Project in C++

A complete implementation of Data Structures and Algorithms in C++ with real-world applications, interactive demos, and comprehensive testing.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Data Structures](#-data-structures)
- [Algorithms](#-algorithms)
- [Real-World Application](#-real-world-application)
- [Compilation](#-compilation)
- [Testing](#-testing)
- [Contributing](#-contributing)

## 🌟 Features

### **Data Structures (7+)**
- ✅ **Linked List** - Singly linked list with full operations
- ✅ **Stack** - LIFO data structure with push/pop operations
- ✅ **Queue** - FIFO data structure with enqueue/dequeue
- ✅ **Binary Tree** - BST with traversal and search
- ✅ **Graph** - Adjacency list with BFS/DFS
- ✅ **Min Heap** - Priority queue implementation
- ✅ **Hash Table** - Separate chaining with string keys

### **Algorithms (15+)**
- ✅ **Sorting**: Bubble, Selection, Insertion, Merge, Quick, Heap Sort
- ✅ **Searching**: Linear, Binary Search
- ✅ **Dynamic Programming**: Fibonacci, LCS, 0/1 Knapsack
- ✅ **Graph Algorithms**: Dijkstra, Floyd-Warshall, Topological Sort
- ✅ **String Algorithms**: KMP Pattern Matching
- ✅ **Mathematical**: Sieve, GCD, LCM, Fast Power

### **Real-World Application**
- 💧 **Water Distribution Optimization** - Practical use of DSA concepts
- 🎯 **Multiple Optimization Strategies** - Priority, Distance, Proportional
- 📊 **Performance Analysis** - Efficiency metrics and comparisons

## 📁 Project Structure

```
dsa/
├── main.cpp              # Main program with interactive menu
├── DataStructures.cpp    # All data structure implementations
├── Algorithms.cpp        # All algorithm implementations
├── Makefile             # Build system with multiple targets
├── README.md            # This documentation
└── bin/                 # Compiled executables (created by make)
    └── dsa_project
```

## 🛠️ Installation

### Prerequisites
- **C++ Compiler**: GCC 7+ or Clang 6+
- **Make**: Build system
- **Operating System**: Linux, macOS, or Windows (with WSL)

### Quick Setup

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install build-essential g++ make
```

#### macOS:
```bash
brew install gcc make
```

#### Windows (WSL):
```bash
# Install WSL first, then follow Ubuntu instructions
```

## 🚀 Usage

### Quick Start
```bash
# Clone or download the project
cd dsa

# Build the project
make all

# Run the program
make run
```

### Interactive Menu
The program provides an interactive menu with options:

1. **Demonstrate Data Structures** - Test all data structures
2. **Demonstrate Algorithms** - Test all algorithms
3. **Water Distribution Optimization** - Real-world application
4. **Exit** - Quit the program

## 📊 Data Structures

### 1. Linked List
```cpp
LinkedList list;
list.insertAtEnd(10);
list.insertAtEnd(20);
list.insertAtBeginning(5);
list.display();  // 5 -> 10 -> 20 -> NULL
list.deleteNode(10);
```

### 2. Stack
```cpp
Stack stack;
stack.push(10);
stack.push(20);
stack.push(30);
int val = stack.pop();  // 30
int top = stack.peek(); // 20
```

### 3. Queue
```cpp
Queue queue;
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
int val = queue.dequeue(); // 10
int front = queue.front(); // 20
```

### 4. Binary Tree
```cpp
BinaryTree tree;
tree.insert(50);
tree.insert(30);
tree.insert(70);
tree.inorderTraversal();   // 30 50 70
tree.preorderTraversal();  // 50 30 70
tree.postorderTraversal(); // 30 70 50
```

### 5. Graph
```cpp
Graph graph(6);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.BFS(0);  // 0 1 2 3
graph.DFS(0);  // 0 1 3 2
```

### 6. Min Heap
```cpp
MinHeap heap;
heap.insert(10);
heap.insert(4);
heap.insert(15);
int min = heap.extractMin(); // 4
```

### 7. Hash Table
```cpp
HashTable table;
table.insert("apple", 10);
table.insert("banana", 20);
int value = table.get("apple"); // 10
bool exists = table.contains("banana"); // true
```

## 🔧 Algorithms

### Sorting Algorithms
```cpp
vector<int> arr = {64, 34, 25, 12, 22, 11, 90};

bubbleSort(arr);      // O(n²)
selectionSort(arr);   // O(n²)
insertionSort(arr);   // O(n²)
mergeSort(arr, 0, arr.size()-1); // O(n log n)
quickSort(arr, 0, arr.size()-1); // O(n log n) avg
heapSort(arr);        // O(n log n)
```

### Searching Algorithms
```cpp
vector<int> sorted = {2, 4, 6, 8, 10, 12, 14, 16, 18, 20};

int linearResult = linearSearch(sorted, 12);  // O(n)
int binaryResult = binarySearch(sorted, 12);  // O(log n)
```

### Dynamic Programming
```cpp
int fib = fibonacciDP(10);  // O(n)

string str1 = "ABCDGH";
string str2 = "AEDFHR";
int lcs = longestCommonSubsequence(str1, str2);  // O(m*n)

vector<int> weights = {2, 1, 3, 2};
vector<int> values = {12, 10, 20, 15};
int maxValue = knapsack01(weights, values, 5);  // O(n*W)
```

### Graph Algorithms
```cpp
// Dijkstra's Shortest Path
vector<vector<pair<int, int>>> graph(V);
vector<int> distances = dijkstra(graph, 0);

// Floyd-Warshall All Pairs Shortest Path
vector<vector<int>> dist = floydWarshall(graph);

// Topological Sort
vector<int> order = topologicalSort(graph);
```

### String Algorithms
```cpp
string text = "AABAACAADAABAABA";
string pattern = "AABA";
vector<int> matches = kmpSearch(text, pattern);
```

### Mathematical Algorithms
```cpp
vector<bool> primes = sieveOfEratosthenes(30);  // O(n log log n)
int gcd_val = gcd(48, 18);  // O(log min(a, b))
int lcm_val = lcm(12, 18);  // O(log min(a, b))
long long power = fastPower(2, 10, 1000);  // O(log n)
```

## 💧 Real-World Application: Water Distribution Optimization

The project includes a practical application demonstrating how DSA concepts solve real-world problems:

### Features:
- **Multiple Optimization Strategies**:
  - Priority-based allocation (using priority queues)
  - Distance-based allocation (using sorting)
  - Proportional allocation (using mathematical calculations)

- **Performance Metrics**:
  - Overall satisfaction rate
  - Water utilization efficiency
  - Individual location satisfaction

### Example Usage:
```cpp
WaterDistributionOptimizer optimizer;

// Add locations
optimizer.addLocation("Hospital", 200, 10, 5);      // High priority, close
optimizer.addLocation("School", 150, 8, 8);         // Medium priority
optimizer.addLocation("Residential", 300, 6, 12);   // Lower priority, far
optimizer.addLocation("Industrial", 250, 4, 15);    // Low priority, far
optimizer.addLocation("Park", 100, 3, 20);          // Lowest priority, farthest

optimizer.setTotalWater(800);

// Test different strategies
optimizer.optimizeByPriority();      // Prioritizes hospitals and schools
optimizer.optimizeByDistance();      // Serves closer locations first
optimizer.optimizeProportionally();  // Distributes proportionally
```

## 🔨 Compilation

### Using Makefile (Recommended)
```bash
# Build the project
make all

# Build with debug flags
make debug

# Build with optimization
make release

# Build and run
make run

# Clean build files
make clean

# Show all available targets
make help
```

### Manual Compilation
```bash
# Basic compilation
g++ -std=c++17 -Wall -Wextra -O2 *.cpp -o dsa_project

# Debug compilation
g++ -std=c++17 -Wall -Wextra -O0 -g -DDEBUG *.cpp -o dsa_project_debug

# Release compilation
g++ -std=c++17 -Wall -Wextra -O3 -DNDEBUG *.cpp -o dsa_project_release
```

### C++ Standards Support
```bash
# Test different C++ standards
make test-all-standards

# Or manually:
g++ -std=c++11 *.cpp -o test_cpp11
g++ -std=c++14 *.cpp -o test_cpp14
g++ -std=c++17 *.cpp -o test_cpp17
g++ -std=c++20 *.cpp -o test_cpp20
```

## 🧪 Testing

### Automated Testing
```bash
# Create test script
make test-script

# Run test script
./test.sh
```

### Memory Testing
```bash
# Memory leak detection (requires valgrind)
make memcheck
```

### Performance Profiling
```bash
# Performance analysis (requires gprof)
make profile
```

### Code Quality
```bash
# Code style checking (requires clang-format)
make style-check

# Code formatting
make format
```

## 📈 Performance Characteristics

| Data Structure | Insert | Delete | Search | Space |
|----------------|--------|--------|--------|-------|
| Linked List    | O(1)   | O(n)   | O(n)   | O(n)  |
| Stack          | O(1)   | O(1)   | O(n)   | O(n)  |
| Queue          | O(1)   | O(1)   | O(n)   | O(n)  |
| Binary Tree    | O(log n)| O(log n)| O(log n)| O(n) |
| Graph (Adj List)| O(1)  | O(V+E) | O(V+E) | O(V+E)|
| Min Heap       | O(log n)| O(log n)| O(1)  | O(n)  |
| Hash Table     | O(1)   | O(1)   | O(1)   | O(n)  |

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Bubble Sort | O(n²) | O(1) |
| Selection Sort | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n) |
| Quick Sort | O(n log n) avg | O(log n) |
| Heap Sort | O(n log n) | O(1) |
| Linear Search | O(n) | O(1) |
| Binary Search | O(log n) | O(1) |
| Dijkstra | O(V²) | O(V) |
| Floyd-Warshall | O(V³) | O(V²) |

## 🤝 Contributing

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style Guidelines
- Use meaningful variable and function names
- Add comments for complex algorithms
- Follow C++17 standards
- Include proper error handling
- Add unit tests for new features

### Suggested Improvements
- [ ] Add more graph algorithms (Kruskal, Prim, etc.)
- [ ] Implement advanced tree structures (AVL, Red-Black)
- [ ] Add more dynamic programming problems
- [ ] Include parallel algorithms
- [ ] Add visualization features
- [ ] Create web interface
- [ ] Add benchmarking suite

## 📚 Learning Resources

### Books
- "Introduction to Algorithms" by CLRS
- "Data Structures and Algorithms" by Aho, Hopcroft, Ullman
- "The Art of Computer Programming" by Knuth

### Online Resources
- [GeeksforGeeks](https://www.geeksforgeeks.org/)
- [LeetCode](https://leetcode.com/)
- [HackerRank](https://www.hackerrank.com/)
- [CP-Algorithms](https://cp-algorithms.com/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **C++ Community** for excellent documentation
- **Open Source Contributors** for inspiration
- **Algorithm Researchers** for theoretical foundations
- **Students and Educators** for feedback and suggestions

---

**Happy Coding! 🎉**

*Built with ❤️ using C++17* 