export const initialReviews = [
    { id: "1", customer: "أحمد علي", rating: 5, comment: "منتج ممتاز وسريع التوصيل!" },
    { id: "2", customer: "سارة محمد", rating: 4, comment: "جيد لكن يحتاج تحسين التغليف." },
    { id: "3", customer: "خالد يوسف", rating: 3, comment: "المواصفات غير دقيقة." },
    { id: "4", customer: "ليلى حسن", rating: 5, comment: "أنصح الجميع بهذا المنتج!" },
  ];
  
  export const menuItems = [
    { label: "الصفحة الرئيسية", icon: "home-outline", route: "/dashboard/dashboard" },
    { label: "إضافة منتج جديد", icon: "add-circle-outline", route: "/Vendor/Product/addProduct" },
    { label: "إدارة الطلبات", icon: "receipt-outline", route: "/Vendor/ordersManagement" },
    { label: "إدارة المراجعات", icon: "chatbubbles-outline", route: "/Vendor/others/reviews" },
    { label: "إدارة المخزون", icon: "cube-outline", route: "/Vendor/others/inventory" },
    { label: "إدارة التوصيلات", icon: "bicycle-outline", route: "/Vendor/deliveries" },
    { label: "إعدادات المتجر", icon: "settings-outline", route: "/Vendor/store/storeSettings" },
  ];
  