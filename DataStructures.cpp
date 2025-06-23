#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
using namespace std;

// ==================== LINKED LIST ====================
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class LinkedList {
private:
    ListNode* head;
    int size;

public:
    LinkedList() : head(nullptr), size(0) {}
    
    void insertAtBeginning(int val) {
        ListNode* newNode = new ListNode(val);
        newNode->next = head;
        head = newNode;
        size++;
    }
    
    void insertAtEnd(int val) {
        ListNode* newNode = new ListNode(val);
        if (!head) {
            head = newNode;
        } else {
            ListNode* current = head;
            while (current->next) {
                current = current->next;
            }
            current->next = newNode;
        }
        size++;
    }
    
    void deleteNode(int val) {
        if (!head) return;
        
        if (head->val == val) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
            size--;
            return;
        }
        
        ListNode* current = head;
        while (current->next && current->next->val != val) {
            current = current->next;
        }
        
        if (current->next) {
            ListNode* temp = current->next;
            current->next = temp->next;
            delete temp;
            size--;
        }
    }
    
    void display() {
        ListNode* current = head;
        while (current) {
            cout << current->val << " -> ";
            current = current->next;
        }
        cout << "NULL" << endl;
    }
    
    int getSize() { return size; }
    
    bool isEmpty() { return head == nullptr; }
};

// ==================== STACK ====================
class Stack {
private:
    vector<int> data;

public:
    void push(int val) {
        data.push_back(val);
    }
    
    int pop() {
        if (isEmpty()) {
            cout << "Stack is empty!" << endl;
            return -1;
        }
        int val = data.back();
        data.pop_back();
        return val;
    }
    
    int peek() {
        if (isEmpty()) {
            cout << "Stack is empty!" << endl;
            return -1;
        }
        return data.back();
    }
    
    bool isEmpty() {
        return data.empty();
    }
    
    int size() {
        return data.size();
    }
    
    void display() {
        cout << "Stack (top to bottom): ";
        for (int i = data.size() - 1; i >= 0; i--) {
            cout << data[i] << " ";
        }
        cout << endl;
    }
};

// ==================== QUEUE ====================
class Queue {
private:
    vector<int> data;

public:
    void enqueue(int val) {
        data.push_back(val);
    }
    
    int dequeue() {
        if (isEmpty()) {
            cout << "Queue is empty!" << endl;
            return -1;
        }
        int val = data.front();
        data.erase(data.begin());
        return val;
    }
    
    int front() {
        if (isEmpty()) {
            cout << "Queue is empty!" << endl;
            return -1;
        }
        return data.front();
    }
    
    bool isEmpty() {
        return data.empty();
    }
    
    int size() {
        return data.size();
    }
    
    void display() {
        cout << "Queue (front to rear): ";
        for (int val : data) {
            cout << val << " ";
        }
        cout << endl;
    }
};

// ==================== BINARY TREE ====================
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BinaryTree {
private:
    TreeNode* root;

public:
    BinaryTree() : root(nullptr) {}
    
    void insert(int val) {
        root = insertRecursive(root, val);
    }
    
    TreeNode* insertRecursive(TreeNode* node, int val) {
        if (!node) {
            return new TreeNode(val);
        }
        
        if (val < node->val) {
            node->left = insertRecursive(node->left, val);
        } else {
            node->right = insertRecursive(node->right, val);
        }
        
        return node;
    }
    
    void inorderTraversal() {
        cout << "Inorder Traversal: ";
        inorderRecursive(root);
        cout << endl;
    }
    
    void inorderRecursive(TreeNode* node) {
        if (node) {
            inorderRecursive(node->left);
            cout << node->val << " ";
            inorderRecursive(node->right);
        }
    }
    
    void preorderTraversal() {
        cout << "Preorder Traversal: ";
        preorderRecursive(root);
        cout << endl;
    }
    
    void preorderRecursive(TreeNode* node) {
        if (node) {
            cout << node->val << " ";
            preorderRecursive(node->left);
            preorderRecursive(node->right);
        }
    }
    
    void postorderTraversal() {
        cout << "Postorder Traversal: ";
        postorderRecursive(root);
        cout << endl;
    }
    
    void postorderRecursive(TreeNode* node) {
        if (node) {
            postorderRecursive(node->left);
            postorderRecursive(node->right);
            cout << node->val << " ";
        }
    }
    
    int height() {
        return heightRecursive(root);
    }
    
    int heightRecursive(TreeNode* node) {
        if (!node) return 0;
        return 1 + max(heightRecursive(node->left), heightRecursive(node->right));
    }
    
    bool search(int val) {
        return searchRecursive(root, val);
    }
    
    bool searchRecursive(TreeNode* node, int val) {
        if (!node) return false;
        if (node->val == val) return true;
        if (val < node->val) return searchRecursive(node->left, val);
        return searchRecursive(node->right, val);
    }
};

// ==================== GRAPH ====================
class Graph {
private:
    int V; // number of vertices
    vector<vector<int>> adj; // adjacency list

public:
    Graph(int vertices) : V(vertices) {
        adj.resize(V);
    }
    
    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u); // undirected graph
    }
    
    void BFS(int start) {
        vector<bool> visited(V, false);
        queue<int> q;
        
        visited[start] = true;
        q.push(start);
        
        cout << "BFS starting from vertex " << start << ": ";
        
        while (!q.empty()) {
            int vertex = q.front();
            cout << vertex << " ";
            q.pop();
            
            for (int neighbor : adj[vertex]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        cout << endl;
    }
    
    void DFS(int start) {
        vector<bool> visited(V, false);
        cout << "DFS starting from vertex " << start << ": ";
        DFSRecursive(start, visited);
        cout << endl;
    }
    
    void DFSRecursive(int vertex, vector<bool>& visited) {
        visited[vertex] = true;
        cout << vertex << " ";
        
        for (int neighbor : adj[vertex]) {
            if (!visited[neighbor]) {
                DFSRecursive(neighbor, visited);
            }
        }
    }
    
    void displayAdjacencyList() {
        cout << "Adjacency List:" << endl;
        for (int i = 0; i < V; i++) {
            cout << i << " -> ";
            for (int neighbor : adj[i]) {
                cout << neighbor << " ";
            }
            cout << endl;
        }
    }
};

// ==================== HEAP ====================
class MinHeap {
private:
    vector<int> heap;

public:
    void insert(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }
    
    int extractMin() {
        if (heap.empty()) {
            cout << "Heap is empty!" << endl;
            return -1;
        }
        
        int minVal = heap[0];
        heap[0] = heap.back();
        heap.pop_back();
        
        if (!heap.empty()) {
            heapifyDown(0);
        }
        
        return minVal;
    }
    
    void heapifyUp(int index) {
        int parent = (index - 1) / 2;
        if (index > 0 && heap[index] < heap[parent]) {
            swap(heap[index], heap[parent]);
            heapifyUp(parent);
        }
    }
    
    void heapifyDown(int index) {
        int left = 2 * index + 1;
        int right = 2 * index + 2;
        int smallest = index;
        
        if (left < heap.size() && heap[left] < heap[smallest]) {
            smallest = left;
        }
        
        if (right < heap.size() && heap[right] < heap[smallest]) {
            smallest = right;
        }
        
        if (smallest != index) {
            swap(heap[index], heap[smallest]);
            heapifyDown(smallest);
        }
    }
    
    int getMin() {
        if (heap.empty()) {
            cout << "Heap is empty!" << endl;
            return -1;
        }
        return heap[0];
    }
    
    bool isEmpty() {
        return heap.empty();
    }
    
    int size() {
        return heap.size();
    }
    
    void display() {
        cout << "Min Heap: ";
        for (int val : heap) {
            cout << val << " ";
        }
        cout << endl;
    }
};

// ==================== HASH TABLE ====================
class HashTable {
private:
    static const int TABLE_SIZE = 100;
    vector<pair<string, int>> table[TABLE_SIZE];
    
    int hashFunction(const string& key) {
        int hash = 0;
        for (char c : key) {
            hash = (hash * 31 + c) % TABLE_SIZE;
        }
        return hash;
    }

public:
    void insert(const string& key, int value) {
        int index = hashFunction(key);
        
        // Check if key already exists
        for (auto& pair : table[index]) {
            if (pair.first == key) {
                pair.second = value;
                return;
            }
        }
        
        table[index].push_back({key, value});
    }
    
    int get(const string& key) {
        int index = hashFunction(key);
        
        for (const auto& pair : table[index]) {
            if (pair.first == key) {
                return pair.second;
            }
        }
        
        cout << "Key not found: " << key << endl;
        return -1;
    }
    
    void remove(const string& key) {
        int index = hashFunction(key);
        
        for (auto it = table[index].begin(); it != table[index].end(); ++it) {
            if (it->first == key) {
                table[index].erase(it);
                return;
            }
        }
        
        cout << "Key not found: " << key << endl;
    }
    
    bool contains(const string& key) {
        int index = hashFunction(key);
        
        for (const auto& pair : table[index]) {
            if (pair.first == key) {
                return true;
            }
        }
        
        return false;
    }
    
    void display() {
        cout << "Hash Table:" << endl;
        for (int i = 0; i < TABLE_SIZE; i++) {
            if (!table[i].empty()) {
                cout << "Index " << i << ": ";
                for (const auto& pair : table[i]) {
                    cout << "(" << pair.first << ", " << pair.second << ") ";
                }
                cout << endl;
            }
        }
    }
};

// ==================== DEMO FUNCTION ====================
void demonstrateDataStructures() {
    cout << "=== DATA STRUCTURES DEMONSTRATION ===" << endl << endl;
    
    // Linked List Demo
    cout << "1. LINKED LIST:" << endl;
    LinkedList list;
    list.insertAtEnd(10);
    list.insertAtEnd(20);
    list.insertAtEnd(30);
    list.insertAtBeginning(5);
    list.display();
    list.deleteNode(20);
    list.display();
    cout << "Size: " << list.getSize() << endl << endl;
    
    // Stack Demo
    cout << "2. STACK:" << endl;
    Stack stack;
    stack.push(10);
    stack.push(20);
    stack.push(30);
    stack.display();
    cout << "Popped: " << stack.pop() << endl;
    cout << "Peek: " << stack.peek() << endl;
    stack.display();
    cout << endl;
    
    // Queue Demo
    cout << "3. QUEUE:" << endl;
    Queue queue;
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);
    queue.display();
    cout << "Dequeued: " << queue.dequeue() << endl;
    cout << "Front: " << queue.front() << endl;
    queue.display();
    cout << endl;
    
    // Binary Tree Demo
    cout << "4. BINARY TREE:" << endl;
    BinaryTree tree;
    tree.insert(50);
    tree.insert(30);
    tree.insert(70);
    tree.insert(20);
    tree.insert(40);
    tree.insert(60);
    tree.insert(80);
    tree.inorderTraversal();
    tree.preorderTraversal();
    tree.postorderTraversal();
    cout << "Height: " << tree.height() << endl;
    cout << "Search 40: " << (tree.search(40) ? "Found" : "Not Found") << endl;
    cout << "Search 90: " << (tree.search(90) ? "Found" : "Not Found") << endl << endl;
    
    // Graph Demo
    cout << "5. GRAPH:" << endl;
    Graph graph(6);
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 3);
    graph.addEdge(2, 4);
    graph.addEdge(3, 4);
    graph.addEdge(3, 5);
    graph.displayAdjacencyList();
    graph.BFS(0);
    graph.DFS(0);
    cout << endl;
    
    // Min Heap Demo
    cout << "6. MIN HEAP:" << endl;
    MinHeap heap;
    heap.insert(10);
    heap.insert(4);
    heap.insert(15);
    heap.insert(20);
    heap.insert(30);
    heap.insert(40);
    heap.insert(50);
    heap.insert(12);
    heap.display();
    cout << "Extracted min: " << heap.extractMin() << endl;
    heap.display();
    cout << "Current min: " << heap.getMin() << endl << endl;
    
    // Hash Table Demo
    cout << "7. HASH TABLE:" << endl;
    HashTable hashTable;
    hashTable.insert("apple", 10);
    hashTable.insert("banana", 20);
    hashTable.insert("orange", 30);
    hashTable.insert("grape", 40);
    cout << "Value for 'apple': " << hashTable.get("apple") << endl;
    cout << "Value for 'banana': " << hashTable.get("banana") << endl;
    cout << "Contains 'orange': " << (hashTable.contains("orange") ? "Yes" : "No") << endl;
    hashTable.remove("banana");
    cout << "After removing 'banana', contains 'banana': " << (hashTable.contains("banana") ? "Yes" : "No") << endl;
    hashTable.display();
    cout << endl;
} 