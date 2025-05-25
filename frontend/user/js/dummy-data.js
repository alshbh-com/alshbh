// بيانات وهمية للفنادق
const dummyHotels = [
  {
    id: "hotel1",
    name: "فندق القصر الملكي",
    nameEn: "Royal Palace Hotel",
    city: "صنعاء",
    cityEn: "Sanaa",
    address: "شارع الزبيري، صنعاء، اليمن",
    addressEn: "Al-Zubairi Street, Sanaa, Yemen",
    description: "فندق فاخر في قلب العاصمة صنعاء، يوفر إطلالات رائعة على المدينة القديمة ويقدم خدمات استثنائية للضيوف. يتميز بموقعه المركزي القريب من المعالم السياحية الرئيسية.",
    descriptionEn: "A luxury hotel in the heart of Sanaa, offering stunning views of the old city and exceptional services for guests. It features a central location close to major tourist attractions.",
    stars: 5,
    rating: 4.8,
    reviewCount: 124,
    priceRange: "200-500",
    currency: "SAR",
    mainImage: "images/hotels/royal-palace.jpg",
    images: [
      "images/hotels/royal-palace-1.jpg",
      "images/hotels/royal-palace-2.jpg",
      "images/hotels/royal-palace-3.jpg",
      "images/hotels/royal-palace-4.jpg"
    ],
    amenities: [
      "wifi", "parking", "pool", "spa", "restaurant", "room_service", 
      "fitness", "air_conditioning", "elevator", "reception"
    ],
    location: {
      lat: 15.3694,
      lng: 44.1910,
      landmarks: [
        { name: "المدينة القديمة", distance: "1.2 كم" },
        { name: "باب اليمن", distance: "0.8 كم" },
        { name: "جامع الصالح", distance: "1.5 كم" }
      ]
    },
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "مجاني حتى 24 ساعة قبل موعد الوصول",
      children: "الأطفال مرحب بهم",
      pets: "غير مسموح بالحيوانات الأليفة"
    },
    rooms: [
      {
        id: "room1",
        name: "غرفة ديلوكس",
        nameEn: "Deluxe Room",
        description: "غرفة فسيحة مع سرير كبير وإطلالة على المدينة",
        descriptionEn: "Spacious room with a large bed and city view",
        price: 200,
        capacity: 2,
        bedType: "سرير كينج",
        bedTypeEn: "King Bed",
        size: "30 متر مربع",
        sizeEn: "30 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe"],
        images: [
          "images/rooms/deluxe-1.jpg",
          "images/rooms/deluxe-2.jpg"
        ],
        available: true
      },
      {
        id: "room2",
        name: "جناح جونيور",
        nameEn: "Junior Suite",
        description: "جناح أنيق مع غرفة نوم منفصلة وصالة جلوس",
        descriptionEn: "Elegant suite with a separate bedroom and living area",
        price: 350,
        capacity: 2,
        bedType: "سرير كينج",
        bedTypeEn: "King Bed",
        size: "45 متر مربع",
        sizeEn: "45 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe", "bathtub"],
        images: [
          "images/rooms/junior-suite-1.jpg",
          "images/rooms/junior-suite-2.jpg"
        ],
        available: true
      },
      {
        id: "room3",
        name: "الجناح الملكي",
        nameEn: "Royal Suite",
        description: "جناح فاخر مع غرفتي نوم وصالة جلوس وإطلالة بانورامية",
        descriptionEn: "Luxurious suite with two bedrooms, living area, and panoramic view",
        price: 500,
        capacity: 4,
        bedType: "سريران كينج",
        bedTypeEn: "Two King Beds",
        size: "80 متر مربع",
        sizeEn: "80 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe", "bathtub", "kitchen"],
        images: [
          "images/rooms/royal-suite-1.jpg",
          "images/rooms/royal-suite-2.jpg"
        ],
        available: true
      }
    ]
  },
  {
    id: "hotel2",
    name: "فندق الخليج",
    nameEn: "Gulf Hotel",
    city: "عدن",
    cityEn: "Aden",
    address: "شارع الساحل، عدن، اليمن",
    addressEn: "Coastal Road, Aden, Yemen",
    description: "فندق عصري يقع على ساحل عدن، يوفر إطلالات خلابة على البحر ويضم مسبحًا خارجيًا ومطاعم متنوعة. يتميز بموقعه المثالي للسياحة والأعمال.",
    descriptionEn: "A modern hotel located on the coast of Aden, offering breathtaking views of the sea and featuring an outdoor pool and various restaurants. It is ideally located for tourism and business.",
    stars: 4,
    rating: 4.5,
    reviewCount: 98,
    priceRange: "150-400",
    currency: "SAR",
    mainImage: "images/hotels/gulf-hotel.jpg",
    images: [
      "images/hotels/gulf-hotel-1.jpg",
      "images/hotels/gulf-hotel-2.jpg",
      "images/hotels/gulf-hotel-3.jpg"
    ],
    amenities: [
      "wifi", "parking", "pool", "restaurant", "room_service", 
      "air_conditioning", "elevator", "reception"
    ],
    location: {
      lat: 12.7742,
      lng: 45.0097,
      landmarks: [
        { name: "شاطئ عدن", distance: "0.2 كم" },
        { name: "خليج عدن", distance: "0.5 كم" },
        { name: "مطار عدن الدولي", distance: "8 كم" }
      ]
    },
    policies: {
      checkIn: "15:00",
      checkOut: "11:00",
      cancellation: "مجاني حتى 48 ساعة قبل موعد الوصول",
      children: "الأطفال مرحب بهم",
      pets: "غير مسموح بالحيوانات الأليفة"
    },
    rooms: [
      {
        id: "room4",
        name: "غرفة قياسية",
        nameEn: "Standard Room",
        description: "غرفة مريحة مع سرير مزدوج وإطلالة على المدينة",
        descriptionEn: "Comfortable room with a double bed and city view",
        price: 150,
        capacity: 2,
        bedType: "سرير كوين",
        bedTypeEn: "Queen Bed",
        size: "25 متر مربع",
        sizeEn: "25 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "safe"],
        images: [
          "images/rooms/standard-1.jpg",
          "images/rooms/standard-2.jpg"
        ],
        available: true
      },
      {
        id: "room5",
        name: "غرفة بريميوم",
        nameEn: "Premium Room",
        description: "غرفة فاخرة مع سرير كبير وإطلالة على البحر",
        descriptionEn: "Luxurious room with a large bed and sea view",
        price: 250,
        capacity: 2,
        bedType: "سرير كينج",
        bedTypeEn: "King Bed",
        size: "35 متر مربع",
        sizeEn: "35 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe", "bathtub"],
        images: [
          "images/rooms/premium-1.jpg",
          "images/rooms/premium-2.jpg"
        ],
        available: true
      },
      {
        id: "room6",
        name: "جناح عائلي",
        nameEn: "Family Suite",
        description: "جناح واسع مع غرفتي نوم وصالة جلوس وإطلالة على البحر",
        descriptionEn: "Spacious suite with two bedrooms, living area, and sea view",
        price: 400,
        capacity: 4,
        bedType: "سرير كينج وسريران مفردان",
        bedTypeEn: "King Bed and Two Single Beds",
        size: "70 متر مربع",
        sizeEn: "70 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe", "bathtub", "kitchen"],
        images: [
          "images/rooms/family-suite-1.jpg",
          "images/rooms/family-suite-2.jpg"
        ],
        available: true
      }
    ]
  },
  {
    id: "hotel3",
    name: "فندق الواحة",
    nameEn: "Oasis Hotel",
    city: "تعز",
    cityEn: "Taiz",
    address: "شارع جمال، تعز، اليمن",
    addressEn: "Jamal Street, Taiz, Yemen",
    description: "فندق مريح في مدينة تعز التاريخية، يوفر إقامة هادئة وخدمات متميزة. يقع بالقرب من المعالم السياحية الرئيسية ويتميز بتصميم يجمع بين الأصالة والحداثة.",
    descriptionEn: "A comfortable hotel in the historic city of Taiz, offering a quiet stay and excellent services. It is located near major tourist attractions and features a design that combines authenticity and modernity.",
    stars: 3,
    rating: 4.2,
    reviewCount: 76,
    priceRange: "100-250",
    currency: "SAR",
    mainImage: "images/hotels/oasis-hotel.jpg",
    images: [
      "images/hotels/oasis-hotel-1.jpg",
      "images/hotels/oasis-hotel-2.jpg",
      "images/hotels/oasis-hotel-3.jpg"
    ],
    amenities: [
      "wifi", "parking", "restaurant", "air_conditioning", "elevator", "reception"
    ],
    location: {
      lat: 13.5789,
      lng: 44.0178,
      landmarks: [
        { name: "قلعة القاهرة", distance: "2 كم" },
        { name: "المتحف الوطني", distance: "1.5 كم" },
        { name: "سوق تعز القديم", distance: "1 كم" }
      ]
    },
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "مجاني حتى 24 ساعة قبل موعد الوصول",
      children: "الأطفال مرحب بهم",
      pets: "غير مسموح بالحيوانات الأليفة"
    },
    rooms: [
      {
        id: "room7",
        name: "غرفة اقتصادية",
        nameEn: "Economy Room",
        description: "غرفة بسيطة ومريحة مع سرير مزدوج",
        descriptionEn: "Simple and comfortable room with a double bed",
        price: 100,
        capacity: 2,
        bedType: "سرير مزدوج",
        bedTypeEn: "Double Bed",
        size: "20 متر مربع",
        sizeEn: "20 square meters",
        amenities: ["wifi", "tv", "air_conditioning"],
        images: [
          "images/rooms/economy-1.jpg",
          "images/rooms/economy-2.jpg"
        ],
        available: true
      },
      {
        id: "room8",
        name: "غرفة ديلوكس",
        nameEn: "Deluxe Room",
        description: "غرفة واسعة مع سرير كبير وإطلالة على المدينة",
        descriptionEn: "Spacious room with a large bed and city view",
        price: 180,
        capacity: 2,
        bedType: "سرير كينج",
        bedTypeEn: "King Bed",
        size: "30 متر مربع",
        sizeEn: "30 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe"],
        images: [
          "images/rooms/deluxe-taiz-1.jpg",
          "images/rooms/deluxe-taiz-2.jpg"
        ],
        available: true
      },
      {
        id: "room9",
        name: "جناح عائلي",
        nameEn: "Family Suite",
        description: "جناح مريح مع غرفتي نوم وصالة جلوس",
        descriptionEn: "Comfortable suite with two bedrooms and a living area",
        price: 250,
        capacity: 4,
        bedType: "سرير كينج وسريران مفردان",
        bedTypeEn: "King Bed and Two Single Beds",
        size: "60 متر مربع",
        sizeEn: "60 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe"],
        images: [
          "images/rooms/family-taiz-1.jpg",
          "images/rooms/family-taiz-2.jpg"
        ],
        available: true
      }
    ]
  },
  {
    id: "hotel4",
    name: "فندق الشاطئ",
    nameEn: "Beach Hotel",
    city: "الحديدة",
    cityEn: "Hodeidah",
    address: "شارع الكورنيش، الحديدة، اليمن",
    addressEn: "Corniche Street, Hodeidah, Yemen",
    description: "فندق ساحلي جميل في مدينة الحديدة، يوفر إطلالات رائعة على البحر الأحمر ويضم شاطئًا خاصًا ومطعمًا للمأكولات البحرية. مكان مثالي للاسترخاء والاستمتاع بالطبيعة.",
    descriptionEn: "A beautiful coastal hotel in Hodeidah, offering stunning views of the Red Sea and featuring a private beach and a seafood restaurant. An ideal place to relax and enjoy nature.",
    stars: 4,
    rating: 4.3,
    reviewCount: 65,
    priceRange: "120-300",
    currency: "SAR",
    mainImage: "images/hotels/beach-hotel.jpg",
    images: [
      "images/hotels/beach-hotel-1.jpg",
      "images/hotels/beach-hotel-2.jpg",
      "images/hotels/beach-hotel-3.jpg"
    ],
    amenities: [
      "wifi", "parking", "pool", "restaurant", "air_conditioning", "reception"
    ],
    location: {
      lat: 14.7970,
      lng: 42.9532,
      landmarks: [
        { name: "شاطئ الحديدة", distance: "0 كم" },
        { name: "ميناء الحديدة", distance: "3 كم" },
        { name: "سوق السمك", distance: "2 كم" }
      ]
    },
    policies: {
      checkIn: "15:00",
      checkOut: "11:00",
      cancellation: "مجاني حتى 48 ساعة قبل موعد الوصول",
      children: "الأطفال مرحب بهم",
      pets: "غير مسموح بالحيوانات الأليفة"
    },
    rooms: [
      {
        id: "room10",
        name: "غرفة قياسية",
        nameEn: "Standard Room",
        description: "غرفة مريحة مع سرير مزدوج وإطلالة على الحديقة",
        descriptionEn: "Comfortable room with a double bed and garden view",
        price: 120,
        capacity: 2,
        bedType: "سرير مزدوج",
        bedTypeEn: "Double Bed",
        size: "25 متر مربع",
        sizeEn: "25 square meters",
        amenities: ["wifi", "tv", "air_conditioning"],
        images: [
          "images/rooms/standard-hodeidah-1.jpg",
          "images/rooms/standard-hodeidah-2.jpg"
        ],
        available: true
      },
      {
        id: "room11",
        name: "غرفة بإطلالة على البحر",
        nameEn: "Sea View Room",
        description: "غرفة أنيقة مع سرير كبير وإطلالة مباشرة على البحر",
        descriptionEn: "Elegant room with a large bed and direct sea view",
        price: 200,
        capacity: 2,
        bedType: "سرير كينج",
        bedTypeEn: "King Bed",
        size: "30 متر مربع",
        sizeEn: "30 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe", "balcony"],
        images: [
          "images/rooms/sea-view-1.jpg",
          "images/rooms/sea-view-2.jpg"
        ],
        available: true
      },
      {
        id: "room12",
        name: "جناح شاطئي",
        nameEn: "Beach Suite",
        description: "جناح فاخر مع غرفة نوم وصالة جلوس وشرفة تطل على البحر",
        descriptionEn: "Luxurious suite with a bedroom, living area, and a terrace overlooking the sea",
        price: 300,
        capacity: 2,
        bedType: "سرير كينج",
        bedTypeEn: "King Bed",
        size: "50 متر مربع",
        sizeEn: "50 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe", "bathtub", "balcony"],
        images: [
          "images/rooms/beach-suite-1.jpg",
          "images/rooms/beach-suite-2.jpg"
        ],
        available: true
      }
    ]
  },
  {
    id: "hotel5",
    name: "فندق الساحل",
    nameEn: "Coastal Hotel",
    city: "المكلا",
    cityEn: "Mukalla",
    address: "شارع الميناء، المكلا، اليمن",
    addressEn: "Port Street, Mukalla, Yemen",
    description: "فندق مطل على خليج عدن في مدينة المكلا الساحلية، يوفر إقامة مريحة وخدمات متميزة. يتميز بموقعه القريب من الميناء والأسواق التقليدية.",
    descriptionEn: "A hotel overlooking the Gulf of Aden in the coastal city of Mukalla, offering comfortable accommodation and excellent services. It is distinguished by its location close to the port and traditional markets.",
    stars: 3,
    rating: 4.0,
    reviewCount: 52,
    priceRange: "100-220",
    currency: "SAR",
    mainImage: "images/hotels/coastal-hotel.jpg",
    images: [
      "images/hotels/coastal-hotel-1.jpg",
      "images/hotels/coastal-hotel-2.jpg",
      "images/hotels/coastal-hotel-3.jpg"
    ],
    amenities: [
      "wifi", "parking", "restaurant", "air_conditioning", "reception"
    ],
    location: {
      lat: 14.5412,
      lng: 49.1259,
      landmarks: [
        { name: "ميناء المكلا", distance: "1 كم" },
        { name: "سوق المكلا", distance: "0.8 كم" },
        { name: "شاطئ المكلا", distance: "1.5 كم" }
      ]
    },
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "مجاني حتى 24 ساعة قبل موعد الوصول",
      children: "الأطفال مرحب بهم",
      pets: "غير مسموح بالحيوانات الأليفة"
    },
    rooms: [
      {
        id: "room13",
        name: "غرفة اقتصادية",
        nameEn: "Economy Room",
        description: "غرفة بسيطة ومريحة مع سرير مزدوج",
        descriptionEn: "Simple and comfortable room with a double bed",
        price: 100,
        capacity: 2,
        bedType: "سرير مزدوج",
        bedTypeEn: "Double Bed",
        size: "20 متر مربع",
        sizeEn: "20 square meters",
        amenities: ["wifi", "tv", "air_conditioning"],
        images: [
          "images/rooms/economy-mukalla-1.jpg",
          "images/rooms/economy-mukalla-2.jpg"
        ],
        available: true
      },
      {
        id: "room14",
        name: "غرفة ديلوكس",
        nameEn: "Deluxe Room",
        description: "غرفة واسعة مع سرير كبير وإطلالة على البحر",
        descriptionEn: "Spacious room with a large bed and sea view",
        price: 160,
        capacity: 2,
        bedType: "سرير كينج",
        bedTypeEn: "King Bed",
        size: "30 متر مربع",
        sizeEn: "30 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe"],
        images: [
          "images/rooms/deluxe-mukalla-1.jpg",
          "images/rooms/deluxe-mukalla-2.jpg"
        ],
        available: true
      },
      {
        id: "room15",
        name: "جناح عائلي",
        nameEn: "Family Suite",
        description: "جناح مريح مع غرفتي نوم وصالة جلوس وإطلالة على البحر",
        descriptionEn: "Comfortable suite with two bedrooms, living area, and sea view",
        price: 220,
        capacity: 4,
        bedType: "سرير كينج وسريران مفردان",
        bedTypeEn: "King Bed and Two Single Beds",
        size: "55 متر مربع",
        sizeEn: "55 square meters",
        amenities: ["wifi", "tv", "air_conditioning", "minibar", "safe"],
        images: [
          "images/rooms/family-mukalla-1.jpg",
          "images/rooms/family-mukalla-2.jpg"
        ],
        available: true
      }
    ]
  }
];

// بيانات وهمية للمستخدمين
const dummyUsers = [
  {
    id: "user1",
    email: "admin@mahjooz.com",
    password: "admin123",
    firstName: "مدير",
    lastName: "النظام",
    phone: "+967 123 456 789",
    role: "admin",
    createdAt: new Date("2023-01-01")
  },
  {
    id: "user2",
    email: "user@example.com",
    password: "user123",
    firstName: "محمد",
    lastName: "أحمد",
    phone: "+967 987 654 321",
    role: "user",
    createdAt: new Date("2023-02-15")
  },
  {
    id: "user3",
    email: "sara@example.com",
    password: "sara123",
    firstName: "سارة",
    lastName: "علي",
    phone: "+967 555 123 456",
    role: "user",
    createdAt: new Date("2023-03-10")
  }
];

// بيانات وهمية للحجوزات
const dummyBookings = [
  {
    id: "booking1",
    userId: "user2",
    hotelId: "hotel1",
    roomId: "room1",
    checkIn: new Date("2023-06-15"),
    checkOut: new Date("2023-06-18"),
    guests: {
      adults: 2,
      children: 0
    },
    totalPrice: 600,
    currency: "SAR",
    status: "completed",
    paymentMethod: "credit_card",
    specialRequests: "غرفة في طابق مرتفع",
    createdAt: new Date("2023-05-20")
  },
  {
    id: "booking2",
    userId: "user2",
    hotelId: "hotel3",
    roomId: "room8",
    checkIn: new Date("2023-07-10"),
    checkOut: new Date("2023-07-15"),
    guests: {
      adults: 2,
      children: 1
    },
    totalPrice: 900,
    currency: "SAR",
    status: "confirmed",
    paymentMethod: "pay_at_hotel",
    specialRequests: "",
    createdAt: new Date("2023-06-25")
  },
  {
    id: "booking3",
    userId: "user3",
    hotelId: "hotel2",
    roomId: "room5",
    checkIn: new Date("2023-08-05"),
    checkOut: new Date("2023-08-10"),
    guests: {
      adults: 2,
      children: 0
    },
    totalPrice: 1250,
    currency: "SAR",
    status: "confirmed",
    paymentMethod: "credit_card",
    specialRequests: "غرفة هادئة بعيدة عن المصعد",
    createdAt: new Date("2023-07-15")
  }
];

// بيانات وهمية للمراجعات
const dummyReviews = [
  {
    id: "review1",
    userId: "user2",
    hotelId: "hotel1",
    bookingId: "booking1",
    rating: 5,
    title: "إقامة رائعة",
    comment: "كانت إقامتنا في فندق القصر الملكي رائعة. الغرفة كانت نظيفة ومريحة، والموظفون كانوا ودودين ومتعاونين. سأعود بالتأكيد مرة أخرى.",
    serviceRatings: {
      cleanliness: 5,
      comfort: 5,
      location: 4,
      service: 5
    },
    status: "approved",
    createdAt: new Date("2023-06-20")
  },
  {
    id: "review2",
    userId: "user3",
    hotelId: "hotel2",
    bookingId: "booking3",
    rating: 4,
    title: "إقامة جيدة",
    comment: "فندق الخليج مكان جيد للإقامة. الموقع ممتاز والإطلالة على البحر رائعة. الغرفة كانت نظيفة ولكن الخدمة كانت بطيئة بعض الشيء.",
    serviceRatings: {
      cleanliness: 4,
      comfort: 4,
      location: 5,
      service: 3
    },
    status: "approved",
    createdAt: new Date("2023-08-12")
  }
];

// بيانات وهمية لإعدادات التطبيق
const dummySettings = {
  appName: "محجوز",
  appNameEn: "Mahjooz",
  logo: "images/logo.png",
  primaryColor: "#1976D2",
  secondaryColor: "#FFC107",
  contactEmail: "info@mahjooz.com",
  contactPhone: "+967 123 456 789",
  socialMedia: {
    facebook: "https://facebook.com/mahjooz",
    twitter: "https://twitter.com/mahjooz",
    instagram: "https://instagram.com/mahjooz"
  },
  currencies: [
    {
      code: "SAR",
      name: "ريال سعودي",
      nameEn: "Saudi Riyal",
      symbol: "ر.س",
      symbolEn: "SAR",
      default: true
    },
    {
      code: "YER",
      name: "ريال يمني",
      nameEn: "Yemeni Rial",
      symbol: "ر.ي",
      symbolEn: "YER",
      default: false
    },
    {
      code: "USD",
      name: "دولار أمريكي",
      nameEn: "US Dollar",
      symbol: "$",
      symbolEn: "$",
      default: false
    }
  ],
  languages: [
    {
      code: "ar",
      name: "العربية",
      nameEn: "Arabic",
      default: true
    },
    {
      code: "en",
      name: "الإنجليزية",
      nameEn: "English",
      default: false
    }
  ]
};

// وظيفة لإضافة البيانات الوهمية إلى قاعدة البيانات
function addDummyDataToFirestore() {
  // إضافة الفنادق
  dummyHotels.forEach(hotel => {
    firebase.firestore().collection('hotels').doc(hotel.id).set(hotel)
      .then(() => {
        console.log(`تمت إضافة الفندق: ${hotel.name}`);
      })
      .catch(error => {
        console.error(`خطأ في إضافة الفندق ${hotel.name}:`, error);
      });
  });

  // إضافة المستخدمين
  dummyUsers.forEach(user => {
    firebase.firestore().collection('users').doc(user.id).set({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: firebase.firestore.Timestamp.fromDate(user.createdAt)
    })
      .then(() => {
        console.log(`تمت إضافة المستخدم: ${user.email}`);
      })
      .catch(error => {
        console.error(`خطأ في إضافة المستخدم ${user.email}:`, error);
      });
  });

  // إضافة الحجوزات
  dummyBookings.forEach(booking => {
    firebase.firestore().collection('bookings').doc(booking.id).set({
      userId: booking.userId,
      hotelId: booking.hotelId,
      roomId: booking.roomId,
      checkIn: firebase.firestore.Timestamp.fromDate(booking.checkIn),
      checkOut: firebase.firestore.Timestamp.fromDate(booking.checkOut),
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      specialRequests: booking.specialRequests,
      createdAt: firebase.firestore.Timestamp.fromDate(booking.createdAt)
    })
      .then(() => {
        console.log(`تمت إضافة الحجز: ${booking.id}`);
      })
      .catch(error => {
        console.error(`خطأ في إضافة الحجز ${booking.id}:`, error);
      });
  });

  // إضافة المراجعات
  dummyReviews.forEach(review => {
    firebase.firestore().collection('reviews').doc(review.id).set({
      userId: review.userId,
      hotelId: review.hotelId,
      bookingId: review.bookingId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      serviceRatings: review.serviceRatings,
      status: review.status,
      createdAt: firebase.firestore.Timestamp.fromDate(review.createdAt)
    })
      .then(() => {
        console.log(`تمت إضافة المراجعة: ${review.id}`);
      })
      .catch(error => {
        console.error(`خطأ في إضافة المراجعة ${review.id}:`, error);
      });
  });

  // إضافة إعدادات التطبيق
  firebase.firestore().collection('settings').doc('app').set(dummySettings)
    .then(() => {
      console.log('تمت إضافة إعدادات التطبيق');
    })
    .catch(error => {
      console.error('خطأ في إضافة إعدادات التطبيق:', error);
    });
}

// تصدير الوظائف والبيانات
window.dummyData = {
  hotels: dummyHotels,
  users: dummyUsers,
  bookings: dummyBookings,
  reviews: dummyReviews,
  settings: dummySettings,
  addToFirestore: addDummyDataToFirestore
};
