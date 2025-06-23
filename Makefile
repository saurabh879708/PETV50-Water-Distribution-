# Makefile for DSA Project
# Author: DSA Project Team
# Description: Comprehensive Data Structures and Algorithms implementation

# Compiler settings
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2 -g
CXXFLAGS_DEBUG = -std=c++17 -Wall -Wextra -O0 -g -DDEBUG
CXXFLAGS_RELEASE = -std=c++17 -Wall -Wextra -O3 -DNDEBUG

# Directories
SRC_DIR = .
OBJ_DIR = obj
BIN_DIR = bin

# Source files
SOURCES = main.cpp DataStructures.cpp Algorithms.cpp
OBJECTS = $(SOURCES:%.cpp=$(OBJ_DIR)/%.o)

# Target executable
TARGET = $(BIN_DIR)/dsa_project

# Default target
all: $(TARGET)

# Create directories
$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

$(BIN_DIR):
	mkdir -p $(BIN_DIR)

# Compile object files
$(OBJ_DIR)/%.o: %.cpp | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Link executable
$(TARGET): $(OBJECTS) | $(BIN_DIR)
	$(CXX) $(OBJECTS) -o $@

# Debug build
debug: CXXFLAGS = $(CXXFLAGS_DEBUG)
debug: $(TARGET)

# Release build
release: CXXFLAGS = $(CXXFLAGS_RELEASE)
release: $(TARGET)

# Run the program
run: $(TARGET)
	./$(TARGET)

# Run debug version
run-debug: debug
	./$(TARGET)

# Run release version
run-release: release
	./$(TARGET)

# Clean build files
clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)

# Clean and rebuild
rebuild: clean all

# Install dependencies (for Ubuntu/Debian)
install-deps:
	sudo apt-get update
	sudo apt-get install -y build-essential g++ make

# Install dependencies (for macOS)
install-deps-mac:
	brew install gcc make

# Check code style
style-check:
	@echo "Checking code style..."
	@if command -v clang-format >/dev/null 2>&1; then \
		clang-format --dry-run --Werror *.cpp *.h; \
	else \
		echo "clang-format not found. Install it for code style checking."; \
	fi

# Format code
format:
	@if command -v clang-format >/dev/null 2>&1; then \
		clang-format -i *.cpp *.h; \
		echo "Code formatted successfully."; \
	else \
		echo "clang-format not found. Install it for code formatting."; \
	fi

# Create documentation
docs:
	@echo "Creating documentation..."
	@mkdir -p docs
	@echo "# DSA Project Documentation" > docs/README.md
	@echo "" >> docs/README.md
	@echo "## Compilation" >> docs/README.md
	@echo "\`\`\`bash" >> docs/README.md
	@echo "make all        # Build the project" >> docs/README.md
	@echo "make debug      # Build with debug flags" >> docs/README.md
	@echo "make release    # Build with optimization" >> docs/README.md
	@echo "make run        # Build and run" >> docs/README.md
	@echo "make clean      # Clean build files" >> docs/README.md
	@echo "\`\`\`" >> docs/README.md
	@echo "Documentation created in docs/README.md"

# Test compilation with different standards
test-cpp11:
	$(CXX) -std=c++11 -Wall -Wextra -O2 -g *.cpp -o test_cpp11
	@echo "C++11 compilation successful"
	@rm -f test_cpp11

test-cpp14:
	$(CXX) -std=c++14 -Wall -Wextra -O2 -g *.cpp -o test_cpp14
	@echo "C++14 compilation successful"
	@rm -f test_cpp14

test-cpp17:
	$(CXX) -std=c++17 -Wall -Wextra -O2 -g *.cpp -o test_cpp17
	@echo "C++17 compilation successful"
	@rm -f test_cpp17

test-cpp20:
	$(CXX) -std=c++20 -Wall -Wextra -O2 -g *.cpp -o test_cpp20
	@echo "C++20 compilation successful"
	@rm -f test_cpp20

# Test all C++ standards
test-all-standards: test-cpp11 test-cpp14 test-cpp17 test-cpp20

# Memory check with valgrind
memcheck: debug
	@if command -v valgrind >/dev/null 2>&1; then \
		valgrind --leak-check=full --show-leak-kinds=all ./$(TARGET); \
	else \
		echo "valgrind not found. Install it for memory checking."; \
	fi

# Performance profiling
profile: release
	@if command -v gprof >/dev/null 2>&1; then \
		$(CXX) $(CXXFLAGS_RELEASE) -pg *.cpp -o $(TARGET)_profile; \
		./$(TARGET)_profile; \
		gprof $(TARGET)_profile gmon.out > profile_report.txt; \
		echo "Profile report saved to profile_report.txt"; \
		rm -f $(TARGET)_profile gmon.out; \
	else \
		echo "gprof not found. Install it for profiling."; \
	fi

# Create a simple test script
test-script:
	@echo "#!/bin/bash" > test.sh
	@echo "echo 'Testing DSA Project...'" >> test.sh
	@echo "make clean" >> test.sh
	@echo "make all" >> test.sh
	@echo "echo 'Build successful!'" >> test.sh
	@echo "echo 'Running program...'" >> test.sh
	@echo "timeout 30s ./$(TARGET) || echo 'Program completed or timed out'" >> test.sh
	@chmod +x test.sh
	@echo "Test script created: test.sh"

# Show help
help:
	@echo "DSA Project Makefile Help:"
	@echo ""
	@echo "Build targets:"
	@echo "  all          - Build the project (default)"
	@echo "  debug        - Build with debug flags"
	@echo "  release      - Build with optimization"
	@echo "  clean        - Remove build files"
	@echo "  rebuild      - Clean and rebuild"
	@echo ""
	@echo "Run targets:"
	@echo "  run          - Build and run the program"
	@echo "  run-debug    - Run debug version"
	@echo "  run-release  - Run release version"
	@echo ""
	@echo "Development targets:"
	@echo "  style-check  - Check code style"
	@echo "  format       - Format code"
	@echo "  docs         - Create documentation"
	@echo "  memcheck     - Run memory check"
	@echo "  profile      - Performance profiling"
	@echo ""
	@echo "Test targets:"
	@echo "  test-all-standards - Test compilation with different C++ standards"
	@echo "  test-script  - Create test script"
	@echo ""
	@echo "Installation:"
	@echo "  install-deps - Install dependencies (Ubuntu/Debian)"
	@echo "  install-deps-mac - Install dependencies (macOS)"

# Phony targets
.PHONY: all debug release run run-debug run-release clean rebuild \
        install-deps install-deps-mac style-check format docs \
        test-cpp11 test-cpp14 test-cpp17 test-cpp20 test-all-standards \
        memcheck profile test-script help 