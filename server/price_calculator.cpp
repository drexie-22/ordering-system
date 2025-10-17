#include <iostream>
#include <vector>
#include <iomanip>

struct CartItem {
    double price;
    int quantity;
};

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <price1,qty1> <price2,qty2> ..." << std::endl;
        return 1;
    }

    std::vector<CartItem> items;
    double subtotal = 0.0;

    // Parse command line arguments
    for (int i = 1; i < argc; i++) {
        std::string arg = argv[i];
        size_t commaPos = arg.find(',');
        
        if (commaPos == std::string::npos) {
            std::cerr << "Invalid format. Use: price,quantity" << std::endl;
            return 1;
        }

        double price = std::stod(arg.substr(0, commaPos));
        int quantity = std::stoi(arg.substr(commaPos + 1));

        items.push_back({price, quantity});
        subtotal += price * quantity;
    }

    // Apply 10% discount if subtotal > 1000
    double discount = 0.0;
    if (subtotal > 1000.0) {
        discount = subtotal * 0.1;
    }

    double total = subtotal - discount;

    // Output the result (just the total)
    std::cout << std::fixed << std::setprecision(2) << total << std::endl;

    return 0;
}
