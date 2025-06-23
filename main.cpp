#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
using namespace std;

// Forward declarations
void demonstrateDataStructures();
void demonstrateAlgorithms();
void showMenu();

// Water Distribution Optimization using DSA
class WaterDistributionOptimizer {
private:
    struct Location {
        int id;
        string name;
        int demand;
        int priority;
        int distance;
        int allocated;
        
        Location(int i, string n, int d, int p, int dist) 
            : id(i), name(n), demand(d), priority(p), distance(dist), allocated(0) {}
    };
    
    vector<Location> locations;
    int totalWater;
    
public:
    WaterDistributionOptimizer() : totalWater(0) {}
    
    void addLocation(string name, int demand, int priority, int distance) {
        int id = locations.size() + 1;
        locations.emplace_back(id, name, demand, priority, distance);
    }
    
    void setTotalWater(int water) {
        totalWater = water;
    }
    
    // Priority-based allocation using priority queue
    void optimizeByPriority() {
        cout << "\n=== PRIORITY-BASED OPTIMIZATION ===" << endl;
        
        // Create priority queue based on priority
        vector<pair<int, int>> priorityQueue; // {priority, location_index}
        for (int i = 0; i < locations.size(); i++) {
            priorityQueue.push_back({locations[i].priority, i});
        }
        
        // Sort by priority (highest first)
        sort(priorityQueue.rbegin(), priorityQueue.rend());
        
        int remainingWater = totalWater;
        
        for (auto& [priority, index] : priorityQueue) {
            if (remainingWater <= 0) break;
            
            int allocation = min(locations[index].demand, remainingWater);
            locations[index].allocated = allocation;
            remainingWater -= allocation;
            
            cout << locations[index].name << " (Priority " << priority 
                 << "): " << allocation << "L allocated" << endl;
        }
        
        displayResults();
    }
    
    // Distance-based allocation using sorting
    void optimizeByDistance() {
        cout << "\n=== DISTANCE-BASED OPTIMIZATION ===" << endl;
        
        // Create distance-based queue (closer locations first)
        vector<pair<int, int>> distanceQueue; // {distance, location_index}
        for (int i = 0; i < locations.size(); i++) {
            distanceQueue.push_back({locations[i].distance, i});
        }
        
        // Sort by distance (closest first)
        sort(distanceQueue.begin(), distanceQueue.end());
        
        int remainingWater = totalWater;
        
        for (auto& [distance, index] : distanceQueue) {
            if (remainingWater <= 0) break;
            
            int allocation = min(locations[index].demand, remainingWater);
            locations[index].allocated = allocation;
            remainingWater -= allocation;
            
            cout << locations[index].name << " (Distance " << distance 
                 << "km): " << allocation << "L allocated" << endl;
        }
        
        displayResults();
    }
    
    // Proportional allocation using mathematical calculation
    void optimizeProportionally() {
        cout << "\n=== PROPORTIONAL OPTIMIZATION ===" << endl;
        
        int totalDemand = 0;
        for (const auto& loc : locations) {
            totalDemand += loc.demand;
        }
        
        double ratio = (double)totalWater / totalDemand;
        
        for (auto& loc : locations) {
            int allocation = min(loc.demand, (int)(loc.demand * ratio));
            loc.allocated = allocation;
            
            cout << loc.name << " (Demand " << loc.demand 
                 << "L): " << allocation << "L allocated (" 
                 << (int)((double)allocation / loc.demand * 100) << "%)" << endl;
        }
        
        displayResults();
    }
    
    void displayResults() {
        cout << "\n=== OPTIMIZATION RESULTS ===" << endl;
        cout << "Total Water Available: " << totalWater << "L" << endl;
        
        int totalAllocated = 0;
        int totalDemand = 0;
        
        for (const auto& loc : locations) {
            totalAllocated += loc.allocated;
            totalDemand += loc.demand;
            
            double satisfaction = (double)loc.allocated / loc.demand * 100;
            string status = loc.allocated >= loc.demand ? "✅ Fully Satisfied" : 
                           loc.allocated > 0 ? "⚠️ Partially Satisfied" : "❌ Not Satisfied";
            
            cout << loc.name << ": " << loc.allocated << "/" << loc.demand 
                 << "L (" << (int)satisfaction << "%) - " << status << endl;
        }
        
        cout << "\nTotal Allocated: " << totalAllocated << "L" << endl;
        cout << "Total Demand: " << totalDemand << "L" << endl;
        cout << "Overall Satisfaction: " << (int)((double)totalAllocated / totalDemand * 100) << "%" << endl;
        cout << "Water Utilization: " << (int)((double)totalAllocated / totalWater * 100) << "%" << endl;
    }
    
    void resetAllocations() {
        for (auto& loc : locations) {
            loc.allocated = 0;
        }
    }
    
    void displayLocations() {
        cout << "\n=== CURRENT LOCATIONS ===" << endl;
        if (locations.empty()) {
            cout << "No locations added yet." << endl;
            return;
        }
        
        for (const auto& loc : locations) {
            cout << "ID: " << loc.id << " | Name: " << loc.name 
                 << " | Demand: " << loc.demand << "L | Priority: " << loc.priority 
                 << " | Distance: " << loc.distance << "km" << endl;
        }
    }
};

void waterDistributionDemo() {
    cout << "\n=== WATER DISTRIBUTION OPTIMIZATION USING DSA ===" << endl;
    
    WaterDistributionOptimizer optimizer;
    
    // Add sample locations
    optimizer.addLocation("Hospital", 200, 10, 5);
    optimizer.addLocation("School", 150, 8, 8);
    optimizer.addLocation("Residential Area", 300, 6, 12);
    optimizer.addLocation("Industrial Zone", 250, 4, 15);
    optimizer.addLocation("Park", 100, 3, 20);
    
    optimizer.setTotalWater(800);
    
    optimizer.displayLocations();
    
    // Test different optimization strategies
    optimizer.optimizeByPriority();
    optimizer.resetAllocations();
    
    optimizer.optimizeByDistance();
    optimizer.resetAllocations();
    
    optimizer.optimizeProportionally();
}

void showMenu() {
    cout << "\n" << string(50, '=') << endl;
    cout << "           DSA PROJECT MENU" << endl;
    cout << string(50, '=') << endl;
    cout << "1. Demonstrate Data Structures" << endl;
    cout << "2. Demonstrate Algorithms" << endl;
    cout << "3. Water Distribution Optimization (DSA Application)" << endl;
    cout << "4. Exit" << endl;
    cout << string(50, '=') << endl;
    cout << "Enter your choice (1-4): ";
}

int main() {
    srand(time(0)); // Seed for random number generation
    
    cout << "🚀 Welcome to the Comprehensive DSA Project!" << endl;
    cout << "This project includes:" << endl;
    cout << "• Complete Data Structures Implementation" << endl;
    cout << "• Advanced Algorithms Collection" << endl;
    cout << "• Real-world Application: Water Distribution Optimization" << endl;
    cout << "• Interactive Demo System" << endl;
    
    int choice;
    do {
        showMenu();
        cin >> choice;
        
        switch (choice) {
            case 1:
                cout << "\n" << string(60, '=') << endl;
                demonstrateDataStructures();
                cout << string(60, '=') << endl;
                break;
                
            case 2:
                cout << "\n" << string(60, '=') << endl;
                demonstrateAlgorithms();
                cout << string(60, '=') << endl;
                break;
                
            case 3:
                cout << "\n" << string(60, '=') << endl;
                waterDistributionDemo();
                cout << string(60, '=') << endl;
                break;
                
            case 4:
                cout << "\n🎉 Thank you for using the DSA Project!" << endl;
                cout << "This project demonstrates:" << endl;
                cout << "• 7+ Data Structures (Linked List, Stack, Queue, Tree, Graph, Heap, Hash Table)" << endl;
                cout << "• 15+ Algorithms (Sorting, Searching, DP, Graph, String, Math)" << endl;
                cout << "• Real-world application with optimization strategies" << endl;
                cout << "• Clean, well-documented C++ code" << endl;
                cout << "\nHappy coding! 👨‍💻" << endl;
                break;
                
            default:
                cout << "❌ Invalid choice! Please enter 1-4." << endl;
        }
        
        if (choice != 4) {
            cout << "\nPress Enter to continue...";
            cin.ignore();
            cin.get();
        }
        
    } while (choice != 4);
    
    return 0;
} 