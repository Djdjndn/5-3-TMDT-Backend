import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class SeedDemoProducts {
    private static final String URL = "jdbc:mysql://localhost:3306/tmdt_db?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "Phu123";

    private record DemoProduct(
            String name,
            String description,
            double price,
            int stock,
            String imageUrl,
            long categoryId,
            double averageRating,
            int reviewCount,
            int soldCount,
            boolean featured,
            double discount
    ) {}

    private static final DemoProduct[] PRODUCTS = new DemoProduct[] {
            new DemoProduct("iPhone 15 128GB", "iPhone 15 128GB, màn hình Super Retina XDR 6.1 inch, camera 48MP, cổng USB-C.", 21990000, 36, "uploads/products/demo_iphone15_blue.jpg", 6, 4.8, 42, 95, true, 4),
            new DemoProduct("iPhone 15 Pro 256GB", "iPhone 15 Pro 256GB, khung titanium, chip A17 Pro, camera chuyên nghiệp.", 30990000, 22, "uploads/products/demo_iphone15pro_titan.jpg", 6, 4.9, 35, 66, true, 2),
            new DemoProduct("Samsung Galaxy S24 256GB", "Galaxy S24 256GB, Galaxy AI, màn hình Dynamic AMOLED 2X, camera sắc nét.", 22990000, 30, "uploads/products/demo_galaxy_s24.jpg", 7, 4.7, 38, 80, true, 5),
            new DemoProduct("Samsung Galaxy A55 5G", "Galaxy A55 5G, thiết kế kim loại, pin 5000mAh, màn hình Super AMOLED.", 9990000, 58, "uploads/products/demo_galaxy_a55.jpg", 7, 4.5, 51, 140, false, 8),
            new DemoProduct("Xiaomi Redmi Note 13 Pro", "Redmi Note 13 Pro, camera 200MP, sạc nhanh, màn hình AMOLED 120Hz.", 8490000, 72, "uploads/products/demo_redmi_note_13.jpg", 8, 4.4, 64, 188, false, 10),
            new DemoProduct("MacBook Air 13 M3", "MacBook Air 13 inch chip M3, 8GB RAM, 256GB SSD, mỏng nhẹ cho học tập và làm việc.", 28990000, 18, "uploads/products/demo_macbook_air_m3.jpg", 10, 4.9, 28, 44, true, 3),
            new DemoProduct("Dell XPS 13 Plus", "Dell XPS 13 Plus, Intel Core i7, 16GB RAM, 512GB SSD, màn hình viền mỏng.", 34990000, 14, "uploads/products/demo_dell_xps_13.jpg", 11, 4.7, 21, 32, false, 6),
            new DemoProduct("ASUS TUF Gaming A15", "ASUS TUF Gaming A15, Ryzen 7, RTX 4060, 16GB RAM, SSD 512GB.", 25990000, 20, "uploads/products/demo_asus_tuf_a15.jpg", 14, 4.6, 33, 71, true, 7),
            new DemoProduct("AirPods 4", "AirPods 4, âm thanh không gian, hộp sạc USB-C, kết nối nhanh với thiết bị Apple.", 3990000, 55, "uploads/products/demo_airpods_4.jpg", 15, 4.7, 73, 210, true, 5),
            new DemoProduct("Sony WH-1000XM5", "Tai nghe chống ồn Sony WH-1000XM5, pin lâu, âm thanh cao cấp.", 7990000, 25, "uploads/products/demo_sony_xm5.jpg", 15, 4.8, 46, 90, true, 8),
            new DemoProduct("Anker PowerCore 20000mAh", "Pin dự phòng Anker 20000mAh, sạc nhanh PowerIQ, phù hợp đi học và đi làm.", 1190000, 83, "uploads/products/demo_anker_20k.jpg", 18, 4.6, 88, 260, false, 12),
            new DemoProduct("Cáp USB-C 100W Baseus", "Cáp USB-C to USB-C Baseus 100W, sạc nhanh laptop và điện thoại.", 290000, 120, "uploads/products/demo_usb_c_100w.jpg", 16, 4.5, 132, 420, false, 15)
    };

    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            int inserted = 0;
            int skipped = 0;
            for (DemoProduct product : PRODUCTS) {
                if (exists(connection, product.name())) {
                    skipped++;
                    continue;
                }
                insert(connection, product);
                inserted++;
            }
            System.out.printf("Inserted %d demo products, skipped %d existing products.%n", inserted, skipped);
        }
    }

    private static boolean exists(Connection connection, String name) throws Exception {
        try (PreparedStatement statement = connection.prepareStatement("SELECT COUNT(*) FROM products WHERE name = ?")) {
            statement.setString(1, name);
            try (ResultSet resultSet = statement.executeQuery()) {
                resultSet.next();
                return resultSet.getInt(1) > 0;
            }
        }
    }

    private static void insert(Connection connection, DemoProduct product) throws Exception {
        String sql = """
                INSERT INTO products
                (name, description, price, stock, image_url, category_id, average_rating, review_count, sold_count, is_featured, discount_percentage, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                """;
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, product.name());
            statement.setString(2, product.description());
            statement.setDouble(3, product.price());
            statement.setInt(4, product.stock());
            statement.setString(5, product.imageUrl());
            statement.setLong(6, product.categoryId());
            statement.setDouble(7, product.averageRating());
            statement.setInt(8, product.reviewCount());
            statement.setInt(9, product.soldCount());
            statement.setBoolean(10, product.featured());
            statement.setDouble(11, product.discount());
            statement.executeUpdate();
        }
    }
}
