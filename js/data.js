/* ============================================================
   LUXORA - Data Layer
   Central product/category/brand data + LocalStorage helpers.
   ============================================================ */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    products: 'luxora_products',
    categories: 'luxora_categories',
    brands: 'luxora_brands',
    cart: 'luxora_cart',
    wishlist: 'luxora_wishlist',
    orders: 'luxora_orders',
    customers: 'luxora_customers',
    coupons: 'luxora_coupons',
    reviews: 'luxora_reviews',
    settings: 'luxora_settings',
    currency: 'luxora_currency',
    theme: 'luxora_theme',
    session: 'luxora_admin_session'
  };

  // ---- Seed data ----
  const seedCategories = [
{
      "id": "electronics",
      "name": "Electronics",
      "image": "images/categories/electronics.jpg",
      "description": "Smart devices & cutting-edge tech for modern living."
    },
{
      "id": "fashion",
      "name": "Fashion",
      "image": "images/categories/fashion.jpg",
      "description": "Jackets, coats, dresses & tailored luxury style."
    },
{
      "id": "shoes",
      "name": "Shoes",
      "image": "images/categories/shoes.jpg",
      "description": "Sneakers, heels, boots & loafers crafted for elegance."
    },
{
      "id": "watches",
      "name": "Watches",
      "image": "images/categories/watches.jpg",
      "description": "Precision timepieces with timeless design."
    },
{
      "id": "perfumes",
      "name": "Perfumes",
      "image": "images/categories/perfumes.jpg",
      "description": "Signature scents that leave a mark."
    },
{
      "id": "furniture",
      "name": "Furniture",
      "image": "images/categories/furniture.jpg",
      "description": "Statement pieces for the refined interior."
    },
{
      "id": "accessories",
      "name": "Accessories",
      "image": "images/categories/accessories.jpg",
      "description": "Sunglasses, wallets, scarves & fine details."
    },
{
      "id": "gaming",
      "name": "Gaming",
      "image": "images/categories/gaming.jpg",
      "description": "Controllers, mice & gear for the enthusiast."
    },
{
      "id": "audio",
      "name": "Audio",
      "image": "images/categories/audio.jpg",
      "description": "Headphones, speakers & sound, perfected."
    },
{
      "id": "smarthome",
      "name": "Smart Home",
      "image": "images/categories/smarthome.jpg",
      "description": "Connected devices for effortless living."
    },
{
      "id": "laptops",
      "name": "Laptops",
      "image": "images/categories/laptops.jpg",
      "description": "Powerful machines for work & play."
    },
{
      "id": "smartphones",
      "name": "Smartphones",
      "image": "images/categories/smartphones.jpg",
      "description": "Flagship phones with pro-grade cameras."
    }
  ];

  const seedBrands = [
    { id: 'Aurelia', name: 'Aurelia', logo: 'images/brands/Aurelia.svg' },
    { id: 'Vanguard', name: 'Vanguard', logo: 'images/brands/Vanguard.svg' },
    { id: 'Noir', name: 'Noir', logo: 'images/brands/Noir.svg' },
    { id: 'Lumiere', name: 'Lumiere', logo: 'images/brands/Lumiere.svg' },
    { id: 'Celeste', name: 'Celeste', logo: 'images/brands/Celeste.svg' },
    { id: 'Onyx', name: 'Onyx', logo: 'images/brands/Onyx.svg' },
    { id: 'MaisonL', name: 'Maison L', logo: 'images/brands/MaisonL.svg' },
    { id: 'Zenith', name: 'Zenith', logo: 'images/brands/Zenith.svg' }
  ];

  const seedProducts = [
{
      "id": "p1",
      "name": "Aurelia Cloud Sneakers",
      "category": "shoes",
      "brand": "Aurelia",
      "price": 320,
      "salePrice": 256,
      "rating": 4.8,
      "reviews": 124,
      "stock": 40,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b",
        "#fff"
      ],
      "sizes": [
        "38",
        "39",
        "40",
        "41",
        "42",
        "43"
      ],
      "tags": [
        "shoes",
        "sneakers"
      ],
      "description": "Lightweight luxury sneakers with a hand-finished sole and premium leather upper.",
      "specs": {
        "Material": "Italian Leather",
        "Sole": "Vibram Rubber",
        "Weight": "320g",
        "Origin": "Italy"
      },
      "images": ["shoes-7.jpg"],
      "image": "shoes-7.jpg",
      "status": "active"
    },
{
      "id": "p2",
      "name": "Noir Gold Heels",
      "category": "shoes",
      "brand": "Noir",
      "price": 480,
      "salePrice": 0,
      "rating": 4.7,
      "reviews": 89,
      "stock": 25,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a1f3d",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "36",
        "37",
        "38",
        "39",
        "40"
      ],
      "tags": [
        "heels",
        "shoes"
      ],
      "description": "Sculpted stiletto heels with a gold-tone accent for evening elegance.",
      "specs": {
        "Material": "Satin & Gold",
        "Heel": "90mm",
        "Origin": "France"
      },
      "images": ["shoes-1.jpg"],
      "image": "shoes-1.jpg",
      "status": "active"
    },
{
      "id": "p3",
      "name": "Onyx Chelsea Boots",
      "category": "shoes",
      "brand": "Onyx",
      "price": 560,
      "salePrice": 450,
      "rating": 4.7,
      "reviews": 73,
      "stock": 33,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#2b2b33",
        "#111",
        "#7a4b2b"
      ],
      "sizes": [
        "39",
        "40",
        "41",
        "42",
        "43",
        "44"
      ],
      "tags": [
        "boots",
        "shoes"
      ],
      "description": "Classic Chelsea boots with elastic side panels and a leather sole.",
      "specs": {
        "Material": "Calf Leather",
        "Sole": "Leather",
        "Origin": "England"
      },
      "images": ["shoes-2.jpg"],
      "image": "shoes-2.jpg",
      "status": "active"
    },
{
      "id": "p4",
      "name": "Vanguard Runner Sneakers",
      "category": "shoes",
      "brand": "Vanguard",
      "price": 360,
      "salePrice": 290,
      "rating": 4.6,
      "reviews": 95,
      "stock": 42,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#1a1a22",
        "#c9a24b",
        "#fff"
      ],
      "sizes": [
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44"
      ],
      "tags": [
        "shoes",
        "sneakers"
      ],
      "description": "Performance-meets-luxury runners with a responsive foam midsole.",
      "specs": {
        "Material": "Knit & Leather",
        "Sole": "Foam",
        "Weight": "290g"
      },
      "images": ["shoes-8.jpg"],
      "image": "shoes-8.jpg",
      "status": "active"
    },
{
      "id": "p5",
      "name": "Celeste Court Sneakers",
      "category": "shoes",
      "brand": "Celeste",
      "price": 340,
      "salePrice": 275,
      "rating": 4.5,
      "reviews": 61,
      "stock": 38,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#bcd4e6",
        "#fff"
      ],
      "sizes": [
        "36",
        "37",
        "38",
        "39",
        "40",
        "41"
      ],
      "tags": [
        "shoes",
        "sneakers"
      ],
      "description": "Minimalist leather court sneakers with a cushioned insole.",
      "specs": {
        "Material": "Nappa Leather",
        "Sole": "Rubber",
        "Origin": "Italy"
      },
      "images": ["shoes-9.jpg"],
      "image": "shoes-9.jpg",
      "status": "active"
    },
{
      "id": "p6",
      "name": "Maison L Loafers",
      "category": "shoes",
      "brand": "Maison L",
      "price": 520,
      "salePrice": 0,
      "rating": 4.6,
      "reviews": 54,
      "stock": 30,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "40",
        "41",
        "42",
        "43",
        "44"
      ],
      "tags": [
        "shoes",
        "loafers"
      ],
      "description": "Penny loafers in polished calfskin with a stacked heel.",
      "specs": {
        "Material": "Calfskin",
        "Heel": "25mm",
        "Origin": "Italy"
      },
      "images": ["shoes-5.jpg"],
      "image": "shoes-5.jpg",
      "status": "active"
    },
{
      "id": "p7",
      "name": "Lumiere Strappy Sandals",
      "category": "shoes",
      "brand": "Lumiere",
      "price": 290,
      "salePrice": 232,
      "rating": 4.4,
      "reviews": 47,
      "stock": 44,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a1f3d",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "36",
        "37",
        "38",
        "39",
        "40"
      ],
      "tags": [
        "shoes",
        "sandals"
      ],
      "description": "Strappy leather sandals with an adjustable ankle tie.",
      "specs": {
        "Material": "Lambskin",
        "Heel": "70mm",
        "Origin": "Spain"
      },
      "images": ["shoes-6.jpg"],
      "image": "shoes-6.jpg",
      "status": "active"
    },
{
      "id": "p8",
      "name": "Zenith Trail Boots",
      "category": "shoes",
      "brand": "Zenith",
      "price": 610,
      "salePrice": 490,
      "rating": 4.6,
      "reviews": 58,
      "stock": 27,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#2b3a4b",
        "#111"
      ],
      "sizes": [
        "40",
        "41",
        "42",
        "43",
        "44",
        "45"
      ],
      "tags": [
        "shoes",
        "boots"
      ],
      "description": "All-weather trail boots with a waterproof membrane.",
      "specs": {
        "Material": "Suede & Gore-Tex",
        "Sole": "Vibram",
        "Origin": "Portugal"
      },
      "images": ["shoes-10.jpg"],
      "image": "shoes-10.jpg",
      "status": "active"
    },
{
      "id": "p9",
      "name": "Zenith Automatic Watch",
      "category": "watches",
      "brand": "Zenith",
      "price": 1250,
      "salePrice": 990,
      "rating": 4.9,
      "reviews": 210,
      "stock": 18,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch"
      ],
      "description": "Swiss automatic movement with sapphire crystal and a rose-gold case.",
      "specs": {
        "Movement": "Automatic",
        "Case": "42mm Rose Gold",
        "Glass": "Sapphire",
        "Water": "50m"
      },
      "images": ["watches-0.jpg"],
      "image": "watches-0.jpg",
      "status": "active"
    },
{
      "id": "p10",
      "name": "Zenith Chrono Watch",
      "category": "watches",
      "brand": "Zenith",
      "price": 1680,
      "salePrice": 0,
      "rating": 4.9,
      "reviews": 117,
      "stock": 14,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch"
      ],
      "description": "Chronograph with a ceramic bezel and exhibition case back.",
      "specs": {
        "Movement": "Automatic",
        "Case": "44mm Ceramic",
        "Glass": "Sapphire",
        "Water": "100m"
      },
      "images": ["watches-1.jpg"],
      "image": "watches-1.jpg",
      "status": "active"
    },
{
      "id": "p11",
      "name": "Aurelia Rose Watch",
      "category": "watches",
      "brand": "Aurelia",
      "price": 890,
      "salePrice": 720,
      "rating": 4.7,
      "reviews": 96,
      "stock": 22,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#c9a24b",
        "#e8c878"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch"
      ],
      "description": "Delicate rose-gold watch with a mother-of-pearl dial.",
      "specs": {
        "Movement": "Quartz",
        "Case": "36mm",
        "Glass": "Sapphire",
        "Water": "30m"
      },
      "images": ["watches-2.jpg"],
      "image": "watches-2.jpg",
      "status": "active"
    },
{
      "id": "p12",
      "name": "Noir Skeleton Watch",
      "category": "watches",
      "brand": "Noir",
      "price": 1450,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 88,
      "stock": 16,
      "featured": true,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch"
      ],
      "description": "Open-heart skeleton dial revealing the mechanical movement.",
      "specs": {
        "Movement": "Automatic",
        "Case": "40mm",
        "Glass": "Sapphire",
        "Water": "50m"
      },
      "images": ["watches-3.jpg"],
      "image": "watches-3.jpg",
      "status": "active"
    },
{
      "id": "p13",
      "name": "Celeste Minimal Watch",
      "category": "watches",
      "brand": "Celeste",
      "price": 640,
      "salePrice": 520,
      "rating": 4.6,
      "reviews": 72,
      "stock": 30,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#bcd4e6"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch"
      ],
      "description": "Clean minimalist watch with a mesh strap.",
      "specs": {
        "Movement": "Quartz",
        "Case": "38mm",
        "Glass": "Mineral",
        "Water": "30m"
      },
      "images": ["watches-4.jpg"],
      "image": "watches-4.jpg",
      "status": "active"
    },
{
      "id": "p14",
      "name": "Maison L Gold Watch",
      "category": "watches",
      "brand": "Maison L",
      "price": 1980,
      "salePrice": 0,
      "rating": 4.9,
      "reviews": 64,
      "stock": 12,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#c9a24b",
        "#e8c878"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch"
      ],
      "description": "18k gold dress watch with a slim profile.",
      "specs": {
        "Movement": "Automatic",
        "Case": "39mm",
        "Glass": "Sapphire",
        "Water": "30m"
      },
      "images": ["watches-5.jpg"],
      "image": "watches-5.jpg",
      "status": "active"
    },
{
      "id": "p15",
      "name": "Onyx Diver Watch",
      "category": "watches",
      "brand": "Onyx",
      "price": 1120,
      "salePrice": 900,
      "rating": 4.7,
      "reviews": 81,
      "stock": 20,
      "featured": true,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#2b3a4b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch"
      ],
      "description": "Professional diver with a unidirectional bezel.",
      "specs": {
        "Movement": "Automatic",
        "Case": "43mm",
        "Glass": "Sapphire",
        "Water": "200m"
      },
      "images": ["watches-6.jpg"],
      "image": "watches-6.jpg",
      "status": "active"
    },
{
      "id": "p16",
      "name": "Vanguard Smart Hybrid",
      "category": "watches",
      "brand": "Vanguard",
      "price": 780,
      "salePrice": 620,
      "rating": 4.5,
      "reviews": 69,
      "stock": 26,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "watch",
        "smart"
      ],
      "description": "Analog-smart hybrid with activity tracking.",
      "specs": {
        "Movement": "Hybrid",
        "Case": "41mm",
        "Glass": "Sapphire",
        "Water": "50m"
      },
      "images": ["watches-7.jpg"],
      "image": "watches-7.jpg",
      "status": "active"
    },
{
      "id": "p17",
      "name": "Lumiere Eau de Parfum",
      "category": "perfumes",
      "brand": "Lumiere",
      "price": 210,
      "salePrice": 168,
      "rating": 4.8,
      "reviews": 143,
      "stock": 80,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "A warm signature scent blending amber, bergamot and white musk.",
      "specs": {
        "Volume": "100ml",
        "Family": "Amber",
        "Longevity": "8h"
      },
      "images": ["perfumes-0.jpg"],
      "image": "perfumes-0.jpg",
      "status": "active"
    },
{
      "id": "p18",
      "name": "Lumiere Noir Perfume",
      "category": "perfumes",
      "brand": "Lumiere",
      "price": 240,
      "salePrice": 0,
      "rating": 4.7,
      "reviews": 88,
      "stock": 72,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "A deep, smoky fragrance with oud, vanilla and black pepper.",
      "specs": {
        "Volume": "100ml",
        "Family": "Woody",
        "Longevity": "10h"
      },
      "images": ["perfumes-1.jpg"],
      "image": "perfumes-1.jpg",
      "status": "active"
    },
{
      "id": "p19",
      "name": "Aurelia Bloom EDP",
      "category": "perfumes",
      "brand": "Aurelia",
      "price": 195,
      "salePrice": 156,
      "rating": 4.6,
      "reviews": 102,
      "stock": 68,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "Floral bouquet of jasmine, peony and warm cedar.",
      "specs": {
        "Volume": "100ml",
        "Family": "Floral",
        "Longevity": "7h"
      },
      "images": ["perfumes-2.jpg"],
      "image": "perfumes-2.jpg",
      "status": "active"
    },
{
      "id": "p20",
      "name": "Noir Midnight Oud",
      "category": "perfumes",
      "brand": "Noir",
      "price": 280,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 77,
      "stock": 55,
      "featured": false,
      "bestSeller": true,
      "newArrival": true,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "Intense oud with rose and saffron for evening wear.",
      "specs": {
        "Volume": "100ml",
        "Family": "Oriental",
        "Longevity": "12h"
      },
      "images": ["perfumes-3.jpg"],
      "image": "perfumes-3.jpg",
      "status": "active"
    },
{
      "id": "p21",
      "name": "Celeste Citrus Mist",
      "category": "perfumes",
      "brand": "Celeste",
      "price": 170,
      "salePrice": 136,
      "rating": 4.5,
      "reviews": 64,
      "stock": 74,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "Bright citrus and sea-breeze freshness for daytime.",
      "specs": {
        "Volume": "100ml",
        "Family": "Citrus",
        "Longevity": "6h"
      },
      "images": ["perfumes-4.jpg"],
      "image": "perfumes-4.jpg",
      "status": "active"
    },
{
      "id": "p22",
      "name": "Maison L Velvet",
      "category": "perfumes",
      "brand": "Maison L",
      "price": 260,
      "salePrice": 210,
      "rating": 4.7,
      "reviews": 59,
      "stock": 48,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "Velvety vanilla, iris and tonka bean signature.",
      "specs": {
        "Volume": "100ml",
        "Family": "Gourmand",
        "Longevity": "9h"
      },
      "images": ["perfumes-8.jpg"],
      "image": "perfumes-8.jpg",
      "status": "active"
    },
{
      "id": "p23",
      "name": "Onyx Cedar Wood",
      "category": "perfumes",
      "brand": "Onyx",
      "price": 190,
      "salePrice": 0,
      "rating": 4.6,
      "reviews": 71,
      "stock": 60,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "Earthy cedar, vetiver and smoky incense.",
      "specs": {
        "Volume": "100ml",
        "Family": "Woody",
        "Longevity": "8h"
      },
      "images": ["perfumes-5.jpg"],
      "image": "perfumes-5.jpg",
      "status": "active"
    },
{
      "id": "p24",
      "name": "Vanguard Sport EDT",
      "category": "perfumes",
      "brand": "Vanguard",
      "price": 150,
      "salePrice": 120,
      "rating": 4.4,
      "reviews": 53,
      "stock": 82,
      "featured": true,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#e8c878"
      ],
      "sizes": [
        "50ml",
        "100ml"
      ],
      "tags": [
        "perfume",
        "fragrance"
      ],
      "description": "Energetic mint, grapefruit and musk for active days.",
      "specs": {
        "Volume": "100ml",
        "Family": "Fresh",
        "Longevity": "5h"
      },
      "images": ["perfumes-6.jpg"],
      "image": "perfumes-6.jpg",
      "status": "active"
    },
{
      "id": "p25",
      "name": "Vanguard Leather Jacket",
      "category": "fashion",
      "brand": "Vanguard",
      "price": 980,
      "salePrice": 0,
      "rating": 4.7,
      "reviews": 98,
      "stock": 22,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#2b2b33",
        "#111",
        "#7a1f3d"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "jacket",
        "coat"
      ],
      "description": "Biker-inspired jacket in lambskin with a tailored, modern cut.",
      "specs": {
        "Material": "Lambskin",
        "Lining": "Silk Blend",
        "Origin": "Italy"
      },
      "images": ["fashion-9.jpg"],
      "image": "fashion-9.jpg",
      "status": "active"
    },
{
      "id": "p26",
      "name": "Aurelia Silk Dress",
      "category": "fashion",
      "brand": "Aurelia",
      "price": 720,
      "salePrice": 560,
      "rating": 4.6,
      "reviews": 71,
      "stock": 28,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a1f3d",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L"
      ],
      "tags": [
        "dress"
      ],
      "description": "Bias-cut silk dress that drapes effortlessly for evening occasions.",
      "specs": {
        "Material": "100% Silk",
        "Care": "Dry Clean",
        "Origin": "France"
      },
      "images": ["fashion-10.jpg"],
      "image": "fashion-10.jpg",
      "status": "active"
    },
{
      "id": "p27",
      "name": "Aurelia Wool Coat",
      "category": "fashion",
      "brand": "Aurelia",
      "price": 1150,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 81,
      "stock": 20,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#3a3a44",
        "#111",
        "#7a1f3d"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "coat",
        "jacket"
      ],
      "description": "Double-faced wool coat with a clean, architectural silhouette.",
      "specs": {
        "Material": "Double Wool",
        "Lining": "Cupro",
        "Origin": "Italy"
      },
      "images": ["fashion-2.jpg"],
      "image": "fashion-2.jpg",
      "status": "active"
    },
{
      "id": "p28",
      "name": "Noir Tailored Blazer",
      "category": "fashion",
      "brand": "Noir",
      "price": 690,
      "salePrice": 552,
      "rating": 4.6,
      "reviews": 66,
      "stock": 32,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#2b2b33"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "blazer",
        "jacket"
      ],
      "description": "Sharp single-breasted blazer with a sculpted shoulder.",
      "specs": {
        "Material": "Wool Blend",
        "Lining": "Cupro",
        "Origin": "Italy"
      },
      "images": ["fashion-3.jpg"],
      "image": "fashion-3.jpg",
      "status": "active"
    },
{
      "id": "p29",
      "name": "Celeste Knit Sweater",
      "category": "fashion",
      "brand": "Celeste",
      "price": 340,
      "salePrice": 272,
      "rating": 4.5,
      "reviews": 58,
      "stock": 46,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#bcd4e6",
        "#111",
        "#7a1f3d"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "sweater"
      ],
      "description": "Soft merino knit with a relaxed, oversized fit.",
      "specs": {
        "Material": "Merino Wool",
        "Care": "Hand Wash",
        "Origin": "Scotland"
      },
      "images": ["fashion-4.jpg"],
      "image": "fashion-4.jpg",
      "status": "active"
    },
{
      "id": "p30",
      "name": "Maison L Pleated Skirt",
      "category": "fashion",
      "brand": "Maison L",
      "price": 420,
      "salePrice": 0,
      "rating": 4.5,
      "reviews": 49,
      "stock": 38,
      "featured": true,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "XS",
        "S",
        "M",
        "L"
      ],
      "tags": [
        "skirt"
      ],
      "description": "Fluid pleated midi skirt with a satin finish.",
      "specs": {
        "Material": "Satin Blend",
        "Care": "Dry Clean",
        "Origin": "France"
      },
      "images": ["fashion-11.jpg"],
      "image": "fashion-11.jpg",
      "status": "active"
    },
{
      "id": "p31",
      "name": "Lumiere Linen Shirt",
      "category": "fashion",
      "brand": "Lumiere",
      "price": 220,
      "salePrice": 176,
      "rating": 4.4,
      "reviews": 52,
      "stock": 60,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#fff",
        "#bcd4e6",
        "#111"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "shirt"
      ],
      "description": "Breathable linen shirt with mother-of-pearl buttons.",
      "specs": {
        "Material": "100% Linen",
        "Care": "Machine Wash",
        "Origin": "Portugal"
      },
      "images": ["fashion-12.jpg"],
      "image": "fashion-12.jpg",
      "status": "active"
    },
{
      "id": "p32",
      "name": "Onyx Trench Coat",
      "category": "fashion",
      "brand": "Onyx",
      "price": 980,
      "salePrice": 780,
      "rating": 4.7,
      "reviews": 63,
      "stock": 24,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "coat"
      ],
      "description": "Timeless cotton trench with a removable wool liner.",
      "specs": {
        "Material": "Cotton Gabardine",
        "Lining": "Wool",
        "Origin": "England"
      },
      "images": ["fashion-7.jpg"],
      "image": "fashion-7.jpg",
      "status": "active"
    },
{
      "id": "p33",
      "name": "Vanguard Denim Jacket",
      "category": "fashion",
      "brand": "Vanguard",
      "price": 380,
      "salePrice": 304,
      "rating": 4.5,
      "reviews": 57,
      "stock": 40,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#2b3a4b",
        "#111"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "jacket",
        "denim"
      ],
      "description": "Rigid selvedge denim jacket with gold hardware.",
      "specs": {
        "Material": "Selvedge Denim",
        "Care": "Cold Wash",
        "Origin": "Japan"
      },
      "images": ["fashion-13.jpg"],
      "image": "fashion-13.jpg",
      "status": "active"
    },
{
      "id": "p34",
      "name": "Zenith Cashmere Coat",
      "category": "fashion",
      "brand": "Zenith",
      "price": 1320,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 44,
      "stock": 16,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#3a3a44",
        "#111"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "coat"
      ],
      "description": "Ultra-soft cashmere overcoat with a shawl collar.",
      "specs": {
        "Material": "100% Cashmere",
        "Care": "Dry Clean",
        "Origin": "Italy"
      },
      "images": ["fashion-14.jpg"],
      "image": "fashion-14.jpg",
      "status": "active"
    },
{
      "id": "p35",
      "name": "Maison L Tote Bag",
      "category": "bags",
      "brand": "Maison L",
      "price": 890,
      "salePrice": 0,
      "rating": 4.6,
      "reviews": 76,
      "stock": 30,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#7a4b2b",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bag",
        "tote"
      ],
      "description": "Spacious handcrafted tote in full-grain leather with gold hardware.",
      "specs": {
        "Material": "Full-Grain Leather",
        "Dimensions": "34x28x14cm",
        "Origin": "Italy"
      },
      "images": ["bags-7.jpg"],
      "image": "bags-7.jpg",
      "status": "active"
    },
{
      "id": "p36",
      "name": "Onyx Travel Backpack",
      "category": "bags",
      "brand": "Onyx",
      "price": 540,
      "salePrice": 430,
      "rating": 4.5,
      "reviews": 64,
      "stock": 50,
      "featured": true,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#2b3a4b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "backpack",
        "bag"
      ],
      "description": "Water-resistant backpack with a padded laptop sleeve and sleek silhouette.",
      "specs": {
        "Material": "Ballistic Nylon",
        "Capacity": "22L",
        "Laptop": "16\""
      },
      "images": ["bags-8.jpg"],
      "image": "bags-8.jpg",
      "status": "active"
    },
{
      "id": "p37",
      "name": "Maison L Crossbody",
      "category": "bags",
      "brand": "Maison L",
      "price": 640,
      "salePrice": 520,
      "rating": 4.5,
      "reviews": 60,
      "stock": 38,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bag",
        "crossbody"
      ],
      "description": "Compact crossbody with an adjustable chain strap and suede lining.",
      "specs": {
        "Material": "Calf Leather",
        "Strap": "Chain",
        "Origin": "France"
      },
      "images": ["bags-9.jpg"],
      "image": "bags-9.jpg",
      "status": "active"
    },
{
      "id": "p38",
      "name": "Aurelia Mini Bag",
      "category": "bags",
      "brand": "Aurelia",
      "price": 480,
      "salePrice": 384,
      "rating": 4.6,
      "reviews": 55,
      "stock": 42,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a1f3d",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bag",
        "clutch"
      ],
      "description": "Structured mini bag with a detachable chain.",
      "specs": {
        "Material": "Calf Leather",
        "Dimensions": "18x12x6cm",
        "Origin": "Italy"
      },
      "images": ["bags-10.jpg"],
      "image": "bags-10.jpg",
      "status": "active"
    },
{
      "id": "p39",
      "name": "Noir Bucket Bag",
      "category": "bags",
      "brand": "Noir",
      "price": 560,
      "salePrice": 0,
      "rating": 4.5,
      "reviews": 48,
      "stock": 34,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#7a4b2b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bag"
      ],
      "description": "Drawstring bucket bag in pebbled leather.",
      "specs": {
        "Material": "Pebbled Leather",
        "Strap": "Adjustable",
        "Origin": "Spain"
      },
      "images": ["bags-11.jpg"],
      "image": "bags-11.jpg",
      "status": "active"
    },
{
      "id": "p40",
      "name": "Celeste Clutch",
      "category": "bags",
      "brand": "Celeste",
      "price": 360,
      "salePrice": 288,
      "rating": 4.4,
      "reviews": 41,
      "stock": 46,
      "featured": false,
      "bestSeller": true,
      "newArrival": true,
      "colors": [
        "#c9a24b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bag",
        "clutch"
      ],
      "description": "Satin evening clutch with a crystal clasp.",
      "specs": {
        "Material": "Satin & Crystal",
        "Dimensions": "24x12cm",
        "Origin": "France"
      },
      "images": ["bags-12.jpg"],
      "image": "bags-12.jpg",
      "status": "active"
    },
{
      "id": "p41",
      "name": "Lumiere Hobo Bag",
      "category": "bags",
      "brand": "Lumiere",
      "price": 620,
      "salePrice": 496,
      "rating": 4.5,
      "reviews": 52,
      "stock": 36,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bag"
      ],
      "description": "Slouchy hobo bag in supple nappa.",
      "specs": {
        "Material": "Nappa Leather",
        "Strap": "Shoulder",
        "Origin": "Italy"
      },
      "images": ["bags-13.jpg"],
      "image": "bags-13.jpg",
      "status": "active"
    },
{
      "id": "p42",
      "name": "Vanguard Duffle",
      "category": "bags",
      "brand": "Vanguard",
      "price": 720,
      "salePrice": 576,
      "rating": 4.6,
      "reviews": 47,
      "stock": 28,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#2b2b33",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bag",
        "duffle"
      ],
      "description": "Weekender duffle in waxed canvas with leather trim.",
      "specs": {
        "Material": "Waxed Canvas",
        "Capacity": "40L",
        "Origin": "USA"
      },
      "images": ["bags-14.jpg"],
      "image": "bags-14.jpg",
      "status": "active"
    },
{
      "id": "p43",
      "name": "Celeste Aviator Shades",
      "category": "accessories",
      "brand": "Celeste",
      "price": 280,
      "salePrice": 0,
      "rating": 4.4,
      "reviews": 52,
      "stock": 60,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "sunglasses",
        "glasses"
      ],
      "description": "Polarized aviator sunglasses with a lightweight titanium frame.",
      "specs": {
        "Lens": "Polarized",
        "Frame": "Titanium",
        "UV": "100%"
      },
      "images": ["accessories-0.jpg"],
      "image": "accessories-0.jpg",
      "status": "active"
    },
{
      "id": "p44",
      "name": "Noir Leather Wallet",
      "category": "accessories",
      "brand": "Noir",
      "price": 180,
      "salePrice": 140,
      "rating": 4.5,
      "reviews": 67,
      "stock": 70,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "wallet"
      ],
      "description": "Slim bifold wallet in vegetable-tanned leather with card slots.",
      "specs": {
        "Material": "Vegetable Leather",
        "Cards": "8 slots",
        "Origin": "Spain"
      },
      "images": ["accessories-9.jpg"],
      "image": "accessories-9.jpg",
      "status": "active"
    },
{
      "id": "p45",
      "name": "Vanguard Leather Belt",
      "category": "accessories",
      "brand": "Vanguard",
      "price": 150,
      "salePrice": 0,
      "rating": 4.4,
      "reviews": 39,
      "stock": 65,
      "featured": true,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#5a3620",
        "#111"
      ],
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "tags": [
        "belt"
      ],
      "description": "Hand-stitched belt with a solid brass buckle and full-grain leather.",
      "specs": {
        "Material": "Full-Grain",
        "Buckle": "Brass",
        "Width": "35mm"
      },
      "images": ["accessories-10.jpg"],
      "image": "accessories-10.jpg",
      "status": "active"
    },
{
      "id": "p46",
      "name": "Lumiere Cashmere Scarf",
      "category": "accessories",
      "brand": "Lumiere",
      "price": 260,
      "salePrice": 208,
      "rating": 4.6,
      "reviews": 58,
      "stock": 55,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a1f3d",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "scarf"
      ],
      "description": "Feather-soft cashmere scarf with a hand-rolled hem.",
      "specs": {
        "Material": "100% Cashmere",
        "Size": "180x30cm",
        "Origin": "Scotland"
      },
      "images": ["accessories-3.jpg"],
      "image": "accessories-3.jpg",
      "status": "active"
    },
{
      "id": "p47",
      "name": "Noir Silk Tie",
      "category": "accessories",
      "brand": "Noir",
      "price": 120,
      "salePrice": 0,
      "rating": 4.3,
      "reviews": 31,
      "stock": 90,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a1f3d",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "tie"
      ],
      "description": "Hand-finished silk tie with a subtle geometric weave.",
      "specs": {
        "Material": "100% Silk",
        "Width": "8cm",
        "Origin": "Italy"
      },
      "images": ["accessories-4.jpg"],
      "image": "accessories-4.jpg",
      "status": "active"
    },
{
      "id": "p48",
      "name": "Celeste Leather Gloves",
      "category": "accessories",
      "brand": "Celeste",
      "price": 200,
      "salePrice": 160,
      "rating": 4.5,
      "reviews": 42,
      "stock": 48,
      "featured": true,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#2b2b33",
        "#111",
        "#7a4b2b"
      ],
      "sizes": [
        "S",
        "M",
        "L"
      ],
      "tags": [
        "gloves"
      ],
      "description": "Supple leather gloves lined with cashmere for cold-weather luxury.",
      "specs": {
        "Material": "Lambskin",
        "Lining": "Cashmere",
        "Origin": "Italy"
      },
      "images": ["accessories-5.jpg"],
      "image": "accessories-5.jpg",
      "status": "active"
    },
{
      "id": "p49",
      "name": "Aurelia Pearl Necklace",
      "category": "accessories",
      "brand": "Aurelia",
      "price": 340,
      "salePrice": 272,
      "rating": 4.6,
      "reviews": 45,
      "stock": 40,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878",
        "#fff"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "necklace",
        "jewelry"
      ],
      "description": "Freshwater pearl necklace with a gold clasp.",
      "specs": {
        "Material": "Freshwater Pearl",
        "Metal": "18k Gold",
        "Length": "45cm"
      },
      "images": ["accessories-11.jpg"],
      "image": "accessories-11.jpg",
      "status": "active"
    },
{
      "id": "p50",
      "name": "Onyx Card Holder",
      "category": "accessories",
      "brand": "Onyx",
      "price": 110,
      "salePrice": 88,
      "rating": 4.4,
      "reviews": 38,
      "stock": 72,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#7a4b2b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "wallet",
        "card"
      ],
      "description": "Compact card holder in smooth leather.",
      "specs": {
        "Material": "Calf Leather",
        "Cards": "6 slots",
        "Origin": "Spain"
      },
      "images": ["accessories-7.jpg"],
      "image": "accessories-7.jpg",
      "status": "active"
    },
{
      "id": "p51",
      "name": "Maison L Cufflinks",
      "category": "accessories",
      "brand": "Maison L",
      "price": 260,
      "salePrice": 0,
      "rating": 4.5,
      "reviews": 33,
      "stock": 44,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#c9a24b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "cufflinks"
      ],
      "description": "Enamel cufflinks with a gold-tone finish.",
      "specs": {
        "Material": "Enamel & Gold",
        "Origin": "Italy"
      },
      "images": ["accessories-8.jpg"],
      "image": "accessories-8.jpg",
      "status": "active"
    },
{
      "id": "p52",
      "name": "Zenith Phone Case",
      "category": "accessories",
      "brand": "Zenith",
      "price": 90,
      "salePrice": 72,
      "rating": 4.3,
      "reviews": 40,
      "stock": 80,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "case"
      ],
      "description": "Slim leather phone case with card pocket.",
      "specs": {
        "Material": "Leather",
        "Fit": "Universal",
        "Origin": "China"
      },
      "images": ["accessories-12.jpg"],
      "image": "accessories-12.jpg",
      "status": "active"
    },
{
      "id": "p53",
      "name": "Onyx Studio Headphones",
      "category": "electronics",
      "brand": "Onyx",
      "price": 390,
      "salePrice": 310,
      "rating": 4.9,
      "reviews": 188,
      "stock": 45,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#2b2b33",
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "headphones",
        "audio"
      ],
      "description": "Over-ear headphones with active noise cancellation and 40h battery.",
      "specs": {
        "Driver": "40mm",
        "ANC": "Yes",
        "Battery": "40h",
        "BT": "5.3"
      },
      "images": ["electronics-5.jpg"],
      "image": "electronics-5.jpg",
      "status": "active"
    },
{
      "id": "p54",
      "name": "Zenith 4K Monitor",
      "category": "electronics",
      "brand": "Zenith",
      "price": 640,
      "salePrice": 520,
      "rating": 4.7,
      "reviews": 84,
      "stock": 30,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "monitor",
        "electronics"
      ],
      "description": "27-inch 4K monitor with USB-C and HDR.",
      "specs": {
        "Size": "27\"",
        "Resolution": "4K",
        "Ports": "USB-C/HDMI"
      },
      "images": ["electronics-1.jpg"],
      "image": "electronics-1.jpg",
      "status": "active"
    },
{
      "id": "p55",
      "name": "Aurelia Smart Lamp",
      "category": "electronics",
      "brand": "Aurelia",
      "price": 160,
      "salePrice": 128,
      "rating": 4.5,
      "reviews": 52,
      "stock": 60,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#e8c878"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "lamp",
        "smarthome"
      ],
      "description": "App-controlled desk lamp with 16M colors.",
      "specs": {
        "Power": "12W",
        "Control": "App/WiFi",
        "Lifespan": "25k h"
      },
      "images": ["electronics-6.jpg"],
      "image": "electronics-6.jpg",
      "status": "active"
    },
{
      "id": "p56",
      "name": "Celeste Wireless Charger",
      "category": "electronics",
      "brand": "Celeste",
      "price": 80,
      "salePrice": 64,
      "rating": 4.4,
      "reviews": 61,
      "stock": 75,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#fff"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "charger",
        "electronics"
      ],
      "description": "Fast 15W wireless charging pad.",
      "specs": {
        "Power": "15W",
        "Standard": "Qi",
        "Input": "USB-C"
      },
      "images": ["electronics-7.jpg"],
      "image": "electronics-7.jpg",
      "status": "active"
    },
{
      "id": "p57",
      "name": "Noir Mechanical Keyboard",
      "category": "electronics",
      "brand": "Noir",
      "price": 220,
      "salePrice": 176,
      "rating": 4.6,
      "reviews": 57,
      "stock": 40,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "keyboard",
        "gaming"
      ],
      "description": "Hot-swappable mechanical keyboard with RGB.",
      "specs": {
        "Switch": "Hot-swap",
        "Layout": "75%",
        "BT": "5.1"
      },
      "images": ["electronics-8.jpg"],
      "image": "electronics-8.jpg",
      "status": "active"
    },
{
      "id": "p58",
      "name": "Vanguard Power Bank",
      "category": "electronics",
      "brand": "Vanguard",
      "price": 90,
      "salePrice": 72,
      "rating": 4.5,
      "reviews": 49,
      "stock": 70,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#2b3a4b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "powerbank",
        "electronics"
      ],
      "description": "20,000mAh power bank with fast charge.",
      "specs": {
        "Capacity": "20000mAh",
        "Output": "65W",
        "Ports": "2xUSB-C"
      },
      "images": ["electronics-9.jpg"],
      "image": "electronics-9.jpg",
      "status": "active"
    },
{
      "id": "p59",
      "name": "Zenith Pro Controller",
      "category": "gaming",
      "brand": "Zenith",
      "price": 120,
      "salePrice": 96,
      "rating": 4.7,
      "reviews": 92,
      "stock": 50,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "controller",
        "gaming"
      ],
      "description": "Wireless controller with hall-effect sticks.",
      "specs": {
        "Connection": "BT/2.4G",
        "Battery": "25h",
        "Compat": "PC/Console"
      },
      "images": ["gaming-0.jpg"],
      "image": "gaming-0.jpg",
      "status": "active"
    },
{
      "id": "p60",
      "name": "Onyx Gaming Mouse",
      "category": "gaming",
      "brand": "Onyx",
      "price": 90,
      "salePrice": 72,
      "rating": 4.6,
      "reviews": 78,
      "stock": 55,
      "featured": true,
      "bestSeller": true,
      "newArrival": true,
      "colors": [
        "#111",
        "#2b3a4b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "mouse",
        "gaming"
      ],
      "description": "Lightweight 55g gaming mouse with 26K DPI.",
      "specs": {
        "DPI": "26000",
        "Weight": "55g",
        "BT": "Yes"
      },
      "images": ["gaming-1.jpg"],
      "image": "gaming-1.jpg",
      "status": "active"
    },
{
      "id": "p61",
      "name": "Noir Arcade Stick",
      "category": "gaming",
      "brand": "Noir",
      "price": 180,
      "salePrice": 144,
      "rating": 4.5,
      "reviews": 41,
      "stock": 30,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "arcade",
        "gaming"
      ],
      "description": "Fight stick with Sanwa buttons.",
      "specs": {
        "Buttons": "Sanwa",
        "Connection": "USB-C",
        "Compat": "PC/Console"
      },
      "images": ["gaming-2.jpg"],
      "image": "gaming-2.jpg",
      "status": "active"
    },
{
      "id": "p62",
      "name": "Celeste VR Headset",
      "category": "gaming",
      "brand": "Celeste",
      "price": 420,
      "salePrice": 340,
      "rating": 4.6,
      "reviews": 63,
      "stock": 28,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#bcd4e6"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "vr",
        "gaming"
      ],
      "description": "Standalone VR headset with 4K per eye.",
      "specs": {
        "Display": "4K/eye",
        "Tracking": "Inside-out",
        "Battery": "3h"
      },
      "images": ["gaming-5.jpg"],
      "image": "gaming-5.jpg",
      "status": "active"
    },
{
      "id": "p63",
      "name": "Vanguard Racing Wheel",
      "category": "gaming",
      "brand": "Vanguard",
      "price": 360,
      "salePrice": 290,
      "rating": 4.5,
      "reviews": 37,
      "stock": 22,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#7a1f3d"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "wheel",
        "gaming"
      ],
      "description": "Force-feedback racing wheel with pedals.",
      "specs": {
        "Force": "6Nm",
        "Pedals": "3",
        "Compat": "PC/Console"
      },
      "images": ["gaming-4.jpg"],
      "image": "gaming-4.jpg",
      "status": "active"
    },
{
      "id": "p64",
      "name": "Aurelia Gamepad Mini",
      "category": "gaming",
      "brand": "Aurelia",
      "price": 60,
      "salePrice": 48,
      "rating": 4.4,
      "reviews": 44,
      "stock": 68,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "gamepad",
        "gaming"
      ],
      "description": "Compact mobile gamepad with telescopic grip.",
      "specs": {
        "Connection": "BT",
        "Battery": "15h",
        "Fit": "Phones"
      },
      "images": ["gaming-6.jpg"],
      "image": "gaming-6.jpg",
      "status": "active"
    },
{
      "id": "p65",
      "name": "Lumiere Bookshelf Speakers",
      "category": "audio",
      "brand": "Lumiere",
      "price": 480,
      "salePrice": 384,
      "rating": 4.7,
      "reviews": 71,
      "stock": 34,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "speakers",
        "audio"
      ],
      "description": "Powered bookshelf speakers with warm sound.",
      "specs": {
        "Power": "60W",
        "Driver": "5\"",
        "Input": "BT/RCA"
      },
      "images": ["audio-6.jpg"],
      "image": "audio-6.jpg",
      "status": "active"
    },
{
      "id": "p66",
      "name": "Maison L Turntable",
      "category": "audio",
      "brand": "Maison L",
      "price": 620,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 58,
      "stock": 26,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "turntable",
        "audio"
      ],
      "description": "Belt-drive turntable with built-in preamp.",
      "specs": {
        "Drive": "Belt",
        "Speed": "33/45",
        "Output": "RCA"
      },
      "images": ["audio-1.jpg"],
      "image": "audio-1.jpg",
      "status": "active"
    },
{
      "id": "p67",
      "name": "Celeste Earbuds",
      "category": "audio",
      "brand": "Celeste",
      "price": 150,
      "salePrice": 120,
      "rating": 4.5,
      "reviews": 84,
      "stock": 60,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#fff"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "earbuds",
        "audio"
      ],
      "description": "Compact earbuds with ANC and 30h case.",
      "specs": {
        "ANC": "Yes",
        "Battery": "8h+30h",
        "BT": "5.3"
      },
      "images": ["audio-7.jpg"],
      "image": "audio-7.jpg",
      "status": "active"
    },
{
      "id": "p68",
      "name": "Onyx Soundbar",
      "category": "audio",
      "brand": "Onyx",
      "price": 340,
      "salePrice": 272,
      "rating": 4.6,
      "reviews": 49,
      "stock": 38,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#2b3a4b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "soundbar",
        "audio"
      ],
      "description": "Dolby Atmos soundbar with wireless sub.",
      "specs": {
        "Power": "300W",
        "Audio": "Atmos",
        "BT": "5.0"
      },
      "images": ["audio-3.jpg"],
      "image": "audio-3.jpg",
      "status": "active"
    },
{
      "id": "p69",
      "name": "Noir Studio Mic",
      "category": "audio",
      "brand": "Noir",
      "price": 200,
      "salePrice": 160,
      "rating": 4.5,
      "reviews": 43,
      "stock": 42,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "mic",
        "audio"
      ],
      "description": "USB condenser microphone with mute.",
      "specs": {
        "Pattern": "Cardioid",
        "Sample": "24bit/96k",
        "Conn": "USB-C"
      },
      "images": ["audio-4.jpg"],
      "image": "audio-4.jpg",
      "status": "active"
    },
{
      "id": "p70",
      "name": "Aurelia Portable Speaker",
      "category": "audio",
      "brand": "Aurelia",
      "price": 130,
      "salePrice": 104,
      "rating": 4.4,
      "reviews": 55,
      "stock": 64,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#7a1f3d"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "speaker",
        "audio"
      ],
      "description": "Waterproof portable speaker with 24h play.",
      "specs": {
        "Power": "20W",
        "Water": "IP67",
        "Battery": "24h"
      },
      "images": ["audio-8.jpg"],
      "image": "audio-8.jpg",
      "status": "active"
    },
{
      "id": "p71",
      "name": "Vanguard Amp",
      "category": "audio",
      "brand": "Vanguard",
      "price": 540,
      "salePrice": 432,
      "rating": 4.6,
      "reviews": 38,
      "stock": 24,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "amp",
        "audio"
      ],
      "description": "Bluetooth stereo amplifier with phono input.",
      "specs": {
        "Power": "100W",
        "Inputs": "Phono/BT",
        "Class": "D"
      },
      "images": ["audio-10.jpg"],
      "image": "audio-10.jpg",
      "status": "active"
    },
{
      "id": "p72",
      "name": "Zenith Headphone Stand",
      "category": "audio",
      "brand": "Zenith",
      "price": 70,
      "salePrice": 56,
      "rating": 4.3,
      "reviews": 33,
      "stock": 70,
      "featured": true,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "stand",
        "audio"
      ],
      "description": "Aluminium headphone stand with cable hub.",
      "specs": {
        "Material": "Aluminium",
        "Hub": "USB-C",
        "Base": "Weighted"
      },
      "images": ["audio-9.jpg"],
      "image": "audio-9.jpg",
      "status": "active"
    },
{
      "id": "p73",
      "name": "Aurelia Smart Bulb",
      "category": "smarthome",
      "brand": "Aurelia",
      "price": 40,
      "salePrice": 32,
      "rating": 4.5,
      "reviews": 88,
      "stock": 90,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#e8c878",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bulb",
        "smarthome"
      ],
      "description": "Color smart bulb with voice control.",
      "specs": {
        "Power": "9W",
        "Control": "WiFi",
        "Colors": "16M"
      },
      "images": ["smarthome-0.jpg"],
      "image": "smarthome-0.jpg",
      "status": "active"
    },
{
      "id": "p74",
      "name": "Onyx Smart Lock",
      "category": "smarthome",
      "brand": "Onyx",
      "price": 260,
      "salePrice": 208,
      "rating": 4.6,
      "reviews": 61,
      "stock": 40,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#2b3a4b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "lock",
        "smarthome"
      ],
      "description": "Fingerprint smart lock with app access.",
      "specs": {
        "Unlock": "FP/App/Key",
        "Battery": "12mo",
        "Connect": "WiFi"
      },
      "images": ["smarthome-1.jpg"],
      "image": "smarthome-1.jpg",
      "status": "active"
    },
{
      "id": "p75",
      "name": "Celeste Robot Vacuum",
      "category": "smarthome",
      "brand": "Celeste",
      "price": 420,
      "salePrice": 340,
      "rating": 4.7,
      "reviews": 73,
      "stock": 32,
      "featured": true,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#fff",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "vacuum",
        "smarthome"
      ],
      "description": "LiDAR robot vacuum with mop.",
      "specs": {
        "Suction": "4000Pa",
        "Map": "LiDAR",
        "Battery": "150min"
      },
      "images": ["smarthome-2.jpg"],
      "image": "smarthome-2.jpg",
      "status": "active"
    },
{
      "id": "p76",
      "name": "Noir Video Doorbell",
      "category": "smarthome",
      "brand": "Noir",
      "price": 180,
      "salePrice": 144,
      "rating": 4.5,
      "reviews": 54,
      "stock": 46,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "doorbell",
        "smarthome"
      ],
      "description": "2K video doorbell with two-way audio.",
      "specs": {
        "Video": "2K",
        "Audio": "2-way",
        "Storage": "Cloud"
      },
      "images": ["smarthome-3.jpg"],
      "image": "smarthome-3.jpg",
      "status": "active"
    },
{
      "id": "p77",
      "name": "Maison L Smart Thermostat",
      "category": "smarthome",
      "brand": "Maison L",
      "price": 230,
      "salePrice": 0,
      "rating": 4.6,
      "reviews": 47,
      "stock": 38,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "thermostat",
        "smarthome"
      ],
      "description": "Learning thermostat with energy reports.",
      "specs": {
        "Control": "WiFi",
        "Sensors": "Temp/Hum",
        "Save": "23%"
      },
      "images": ["smarthome-4.jpg"],
      "image": "smarthome-4.jpg",
      "status": "active"
    },
{
      "id": "p78",
      "name": "Vanguard Smart Plug",
      "category": "smarthome",
      "brand": "Vanguard",
      "price": 30,
      "salePrice": 24,
      "rating": 4.4,
      "reviews": 66,
      "stock": 85,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#fff"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "plug",
        "smarthome"
      ],
      "description": "Energy-monitoring smart plug.",
      "specs": {
        "Control": "WiFi",
        "Monitor": "Yes",
        "Load": "16A"
      },
      "images": ["smarthome-5.jpg"],
      "image": "smarthome-5.jpg",
      "status": "active"
    },
{
      "id": "p79",
      "name": "Lumiere Smart Curtain",
      "category": "smarthome",
      "brand": "Lumiere",
      "price": 310,
      "salePrice": 248,
      "rating": 4.5,
      "reviews": 39,
      "stock": 30,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#bcd4e6"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "curtain",
        "smarthome"
      ],
      "description": "Motorized curtain track with scheduling.",
      "specs": {
        "Control": "WiFi",
        "Track": "Custom",
        "Noise": "Silent"
      },
      "images": ["smarthome-6.jpg"],
      "image": "smarthome-6.jpg",
      "status": "active"
    },
{
      "id": "p80",
      "name": "Zenith Air Monitor",
      "category": "smarthome",
      "brand": "Zenith",
      "price": 150,
      "salePrice": 120,
      "rating": 4.4,
      "reviews": 42,
      "stock": 52,
      "featured": false,
      "bestSeller": true,
      "newArrival": true,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "monitor",
        "smarthome"
      ],
      "description": "Air quality monitor with CO2/VOC.",
      "specs": {
        "Sensors": "CO2/VOC/PM",
        "Display": "E-ink",
        "Connect": "WiFi"
      },
      "images": ["smarthome-7.jpg"],
      "image": "smarthome-7.jpg",
      "status": "active"
    },
{
      "id": "p81",
      "name": "Zenith Pro Laptop",
      "category": "laptops",
      "brand": "Zenith",
      "price": 2100,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 132,
      "stock": 15,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "laptop",
        "computer"
      ],
      "description": "Ultra-slim laptop with a 4K display and all-day battery life.",
      "specs": {
        "CPU": "12-Core",
        "RAM": "32GB",
        "Storage": "1TB SSD",
        "Display": "14\" 4K"
      },
      "images": ["laptops-0.jpg"],
      "image": "laptops-0.jpg",
      "status": "active"
    },
{
      "id": "p82",
      "name": "Aurelia Book Laptop",
      "category": "laptops",
      "brand": "Aurelia",
      "price": 1600,
      "salePrice": 1280,
      "rating": 4.7,
      "reviews": 98,
      "stock": 20,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#bcd4e6"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "laptop",
        "computer"
      ],
      "description": "Featherweight 13-inch laptop for creators.",
      "specs": {
        "CPU": "10-Core",
        "RAM": "16GB",
        "Storage": "512GB",
        "Display": "13\" 2.8K"
      },
      "images": ["laptops-1.jpg"],
      "image": "laptops-1.jpg",
      "status": "active"
    },
{
      "id": "p83",
      "name": "Onyx Creator Laptop",
      "category": "laptops",
      "brand": "Onyx",
      "price": 2400,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 76,
      "stock": 12,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#2b2b33",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "laptop",
        "computer"
      ],
      "description": "Workstation laptop with discrete GPU.",
      "specs": {
        "CPU": "14-Core",
        "RAM": "64GB",
        "Storage": "2TB",
        "GPU": "RTX 4070"
      },
      "images": ["laptops-2.jpg"],
      "image": "laptops-2.jpg",
      "status": "active"
    },
{
      "id": "p84",
      "name": "Celeste Flip Laptop",
      "category": "laptops",
      "brand": "Celeste",
      "price": 1300,
      "salePrice": 1040,
      "rating": 4.6,
      "reviews": 84,
      "stock": 24,
      "featured": true,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "laptop",
        "2in1"
      ],
      "description": "Convertible 2-in-1 with touch display.",
      "specs": {
        "CPU": "8-Core",
        "RAM": "16GB",
        "Storage": "1TB",
        "Display": "14\" Touch"
      },
      "images": ["laptops-3.jpg"],
      "image": "laptops-3.jpg",
      "status": "active"
    },
{
      "id": "p85",
      "name": "Noir Gaming Laptop",
      "category": "laptops",
      "brand": "Noir",
      "price": 1900,
      "salePrice": 1520,
      "rating": 4.7,
      "reviews": 69,
      "stock": 18,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#7a1f3d"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "laptop",
        "gaming"
      ],
      "description": "RGB gaming laptop with high-refresh screen.",
      "specs": {
        "CPU": "12-Core",
        "RAM": "32GB",
        "Storage": "1TB",
        "Display": "16\" 165Hz"
      },
      "images": ["laptops-4.jpg"],
      "image": "laptops-4.jpg",
      "status": "active"
    },
{
      "id": "p86",
      "name": "Maison L Executive Laptop",
      "category": "laptops",
      "brand": "Maison L",
      "price": 2800,
      "salePrice": 0,
      "rating": 4.9,
      "reviews": 41,
      "stock": 10,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "laptop",
        "computer"
      ],
      "description": "Premium leather-clad business laptop.",
      "specs": {
        "CPU": "12-Core",
        "RAM": "32GB",
        "Storage": "2TB",
        "Display": "15\" 4K"
      },
      "images": ["laptops-5.jpg"],
      "image": "laptops-5.jpg",
      "status": "active"
    },
{
      "id": "p87",
      "name": "Celeste Edge Phone",
      "category": "smartphones",
      "brand": "Celeste",
      "price": 1090,
      "salePrice": 950,
      "rating": 4.7,
      "reviews": 156,
      "stock": 35,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b",
        "#bcd4e6"
      ],
      "sizes": [
        "128GB",
        "256GB",
        "512GB"
      ],
      "tags": [
        "phone",
        "mobile"
      ],
      "description": "Flagship phone with a ceramic finish and pro-grade camera system.",
      "specs": {
        "Display": "6.7\" OLED",
        "Camera": "50MP",
        "Battery": "5000mAh",
        "Storage": "256GB"
      },
      "images": ["smartphones-0.jpg"],
      "image": "smartphones-0.jpg",
      "status": "active"
    },
{
      "id": "p88",
      "name": "Aurelia Vision Phone",
      "category": "smartphones",
      "brand": "Aurelia",
      "price": 990,
      "salePrice": 820,
      "rating": 4.6,
      "reviews": 121,
      "stock": 40,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#7a1f3d",
        "#fff"
      ],
      "sizes": [
        "128GB",
        "256GB"
      ],
      "tags": [
        "phone",
        "mobile"
      ],
      "description": "Slim phone with a 200MP tele camera.",
      "specs": {
        "Display": "6.5\" AMOLED",
        "Camera": "200MP",
        "Battery": "4800mAh",
        "Storage": "256GB"
      },
      "images": ["smartphones-1.jpg"],
      "image": "smartphones-1.jpg",
      "status": "active"
    },
{
      "id": "p89",
      "name": "Onyx Titan Phone",
      "category": "smartphones",
      "brand": "Onyx",
      "price": 1290,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 98,
      "stock": 28,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#2b2b33",
        "#111"
      ],
      "sizes": [
        "256GB",
        "512GB"
      ],
      "tags": [
        "phone",
        "mobile"
      ],
      "description": "Titanium-framed phone with satellite SOS.",
      "specs": {
        "Display": "6.8\" LTPO",
        "Camera": "50MP",
        "Battery": "5500mAh",
        "Storage": "512GB"
      },
      "images": ["smartphones-2.jpg"],
      "image": "smartphones-2.jpg",
      "status": "active"
    },
{
      "id": "p90",
      "name": "Noir Fold Phone",
      "category": "smartphones",
      "brand": "Noir",
      "price": 1690,
      "salePrice": 0,
      "rating": 4.7,
      "reviews": 72,
      "stock": 16,
      "featured": true,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "256GB",
        "512GB"
      ],
      "tags": [
        "phone",
        "foldable"
      ],
      "description": "Foldable phone with a tablet-size inner screen.",
      "specs": {
        "Display": "7.6\" Fold",
        "Camera": "50MP",
        "Battery": "4600mAh",
        "Storage": "512GB"
      },
      "images": ["smartphones-3.jpg"],
      "image": "smartphones-3.jpg",
      "status": "active"
    },
{
      "id": "p91",
      "name": "Vanguard Lite Phone",
      "category": "smartphones",
      "brand": "Vanguard",
      "price": 590,
      "salePrice": 472,
      "rating": 4.5,
      "reviews": 88,
      "stock": 46,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#2b3a4b"
      ],
      "sizes": [
        "128GB",
        "256GB"
      ],
      "tags": [
        "phone",
        "mobile"
      ],
      "description": "Affordable phone with a 120Hz display.",
      "specs": {
        "Display": "6.4\" 120Hz",
        "Camera": "64MP",
        "Battery": "5000mAh",
        "Storage": "128GB"
      },
      "images": ["smartphones-4.jpg"],
      "image": "smartphones-4.jpg",
      "status": "active"
    },
{
      "id": "p92",
      "name": "Zenith Ultra Phone",
      "category": "smartphones",
      "brand": "Zenith",
      "price": 1490,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 84,
      "stock": 22,
      "featured": false,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "256GB",
        "512GB",
        "1TB"
      ],
      "tags": [
        "phone",
        "mobile"
      ],
      "description": "Photography flagship with periscope zoom.",
      "specs": {
        "Display": "6.7\" OLED",
        "Camera": "200MP",
        "Battery": "5200mAh",
        "Storage": "512GB"
      },
      "images": ["smartphones-5.jpg"],
      "image": "smartphones-5.jpg",
      "status": "active"
    },
{
      "id": "p93",
      "name": "Maison L Lounge Chair",
      "category": "furniture",
      "brand": "Maison L",
      "price": 980,
      "salePrice": 0,
      "rating": 4.7,
      "reviews": 62,
      "stock": 18,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "chair",
        "furniture"
      ],
      "description": "Scandinavian lounge chair in oak and wool.",
      "specs": {
        "Material": "Oak & Wool",
        "Seat": "H70cm",
        "Origin": "Denmark"
      },
      "images": ["furniture-7.jpg"],
      "image": "furniture-7.jpg",
      "status": "active"
    },
{
      "id": "p94",
      "name": "Aurelia Velvet Sofa",
      "category": "furniture",
      "brand": "Aurelia",
      "price": 2200,
      "salePrice": 1760,
      "rating": 4.8,
      "reviews": 54,
      "stock": 12,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a1f3d",
        "#111",
        "#3a3a44"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "sofa",
        "furniture"
      ],
      "description": "Three-seat velvet sofa with feather cushions.",
      "specs": {
        "Material": "Velvet",
        "Seats": "3",
        "Origin": "Italy"
      },
      "images": ["furniture-8.jpg"],
      "image": "furniture-8.jpg",
      "status": "active"
    },
{
      "id": "p95",
      "name": "Onyx Coffee Table",
      "category": "furniture",
      "brand": "Onyx",
      "price": 540,
      "salePrice": 432,
      "rating": 4.6,
      "reviews": 48,
      "stock": 26,
      "featured": false,
      "bestSeller": false,
      "newArrival": true,
      "colors": [
        "#111",
        "#7a4b2b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "table",
        "furniture"
      ],
      "description": "Marble-top coffee table with a black base.",
      "specs": {
        "Top": "Marble",
        "Base": "Steel",
        "Size": "110x60cm"
      },
      "images": ["furniture-2.jpg"],
      "image": "furniture-2.jpg",
      "status": "active"
    },
{
      "id": "p96",
      "name": "Celeste Floor Lamp",
      "category": "furniture",
      "brand": "Celeste",
      "price": 320,
      "salePrice": 256,
      "rating": 4.5,
      "reviews": 51,
      "stock": 40,
      "featured": true,
      "bestSeller": true,
      "newArrival": false,
      "colors": [
        "#111",
        "#e8c878"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "lamp",
        "furniture"
      ],
      "description": "Arc floor lamp with a marble base.",
      "specs": {
        "Material": "Metal/Marble",
        "Bulb": "E27",
        "Height": "180cm"
      },
      "images": ["furniture-9.jpg"],
      "image": "furniture-9.jpg",
      "status": "active"
    },
{
      "id": "p97",
      "name": "Noir Bookshelf",
      "category": "furniture",
      "brand": "Noir",
      "price": 680,
      "salePrice": 544,
      "rating": 4.6,
      "reviews": 44,
      "stock": 22,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#2b2b33"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "shelf",
        "furniture"
      ],
      "description": "Modular bookshelf with asymmetric shelves.",
      "specs": {
        "Material": "MDF/Oak",
        "Height": "180cm",
        "Shelves": "5"
      },
      "images": ["furniture-10.jpg"],
      "image": "furniture-10.jpg",
      "status": "active"
    },
{
      "id": "p98",
      "name": "Lumiere Dining Table",
      "category": "furniture",
      "brand": "Lumiere",
      "price": 1240,
      "salePrice": 0,
      "rating": 4.7,
      "reviews": 38,
      "stock": 14,
      "featured": false,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "table",
        "furniture"
      ],
      "description": "Extendable walnut dining table for 8.",
      "specs": {
        "Material": "Walnut",
        "Seats": "8",
        "Size": "200-280cm"
      },
      "images": ["furniture-5.jpg"],
      "image": "furniture-5.jpg",
      "status": "active"
    },
{
      "id": "p99",
      "name": "Vanguard Bar Stool",
      "category": "furniture",
      "brand": "Vanguard",
      "price": 240,
      "salePrice": 192,
      "rating": 4.4,
      "reviews": 46,
      "stock": 38,
      "featured": true,
      "bestSeller": false,
      "newArrival": false,
      "colors": [
        "#111",
        "#c9a24b"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "stool",
        "furniture"
      ],
      "description": "Counter-height stool with a swivel base.",
      "specs": {
        "Material": "Velvet/Steel",
        "Height": "75cm",
        "Swivel": "Yes"
      },
      "images": ["furniture-6.jpg"],
      "image": "furniture-6.jpg",
      "status": "active"
    },
{
      "id": "p100",
      "name": "Zenith Bed Frame",
      "category": "furniture",
      "brand": "Zenith",
      "price": 1560,
      "salePrice": 0,
      "rating": 4.8,
      "reviews": 33,
      "stock": 10,
      "featured": false,
      "bestSeller": true,
      "newArrival": true,
      "colors": [
        "#7a4b2b",
        "#111"
      ],
      "sizes": [
        "One Size"
      ],
      "tags": [
        "bed",
        "furniture"
      ],
      "description": "Upholstered platform bed with storage.",
      "specs": {
        "Material": "Linen",
        "Size": "Queen",
        "Storage": "Yes"
      },
      "images": ["furniture-11.jpg"],
      "image": "furniture-11.jpg",
      "status": "active"
    }
  ];

  const seedCoupons = [
    { code: 'LUX10', type: 'percent', value: 10, min: 0, active: true, expires: '2026-12-31' },
    { code: 'WELCOME20', type: 'percent', value: 20, min: 200, active: true, expires: '2026-12-31' },
    { code: 'FLAT50', type: 'flat', value: 50, min: 300, active: true, expires: '2026-12-31' }
  ];

  const seedReviews = [
    { id: 'r1', productId: 'p3', name: 'Sophia M.', rating: 5, title: 'Exquisite craftsmanship', comment: 'The watch exceeds every expectation. Flawless finish.', date: '2026-05-12', status: 'approved' },
    { id: 'r2', productId: 'p10', name: 'Liam K.', rating: 5, title: 'Best ANC I have used', comment: 'Sound is rich and the noise cancellation is incredible.', date: '2026-05-20', status: 'approved' },
    { id: 'r3', productId: 'p7', name: 'Emma R.', rating: 4, title: 'Beautiful scent', comment: 'Lasts all day, subtle and elegant.', date: '2026-06-01', status: 'approved' },
    { id: 'r4', productId: 'p13', name: 'Noah T.', rating: 5, title: 'Stunning ring', comment: 'The diamond sparkles beautifully. Worth every penny.', date: '2026-06-10', status: 'pending' }
  ];

  const seedSettings = {
    storeName: 'LUXORA',
    tagline: 'Luxury Fashion & Lifestyle',
    logo: 'images/misc/logo.svg',
    currency: 'USD',
    taxRate: 8,
    shippingFlat: 15,
    freeShippingOver: 500,
    contactEmail: 'care@luxora.com',
    contactPhone: '+1 (800) 555-0199',
    address: '500 Luxury Ave, New York, NY 10001',
    social: { instagram: '#', twitter: '#', facebook: '#', pinterest: '#' },
    theme: 'dark'
  };

  // ---- storage helpers ----
  function read(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // Normalize a single product record to the current schema. This migrates
  // legacy/old-format entries (different field names, missing fields) into the
  // canonical shape used everywhere, and drops unrecoverable "ghost" records
  // (no id or no name) so they can never linger as undeletable orphans.
  function normalizeProduct(p, i) {
    if (!p || typeof p !== 'object') return null;
    // Ghost detection: a product MUST have an id and a name to be usable.
    const id = (p.id != null && String(p.id).trim() !== '') ? String(p.id).trim() : null;
    const name = (p.name != null && String(p.name).trim() !== '') ? String(p.name).trim()
               : (p.title != null && String(p.title).trim() !== '') ? String(p.title).trim() : null;
    if (!id || !name) return null;

    const toArr = (v) => Array.isArray(v) ? v.map(String) : (typeof v === 'string' && v.trim() !== '')
      ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
    const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? d : n; };

    return {
      id,
      name,
      brand: (p.brand != null && String(p.brand).trim() !== '') ? String(p.brand)
           : (p.brandName != null ? String(p.brandName) : 'LUXORA'),
      category: (p.category != null && String(p.category).trim() !== '') ? String(p.category)
              : (p.cat != null ? String(p.cat) : 'uncategorized'),
      status: (p.status === 'active' || p.status === 'out') ? p.status : (num(p.stock, 0) > 0 ? 'active' : 'out'),
      price: num(p.price != null ? p.price : p.cost, 0),
      salePrice: num(p.salePrice, 0),
      stock: Math.max(0, Math.floor(num(p.stock, 0))),
      rating: Math.min(5, Math.max(0, num(p.rating, 4.5))),
      reviews: Math.max(0, Math.floor(num(p.reviews, 0))),
      description: p.description != null ? String(p.description) : '',
      colors: toArr(p.colors),
      sizes: toArr(p.sizes),
      tags: toArr(p.tags),
      featured: !!p.featured,
      bestSeller: !!p.bestSeller,
      newArrival: !!p.newArrival,
      image: p.image || (Array.isArray(p.images) && p.images[0]) || 'shoes-0.jpg',
      images: Array.isArray(p.images) && p.images.length ? p.images
            : [p.image || 'shoes-0.jpg']
    };
  }

  // Repair/validate every stored collection on startup. This guarantees the
  // app never runs on corrupt or orphaned localStorage data (a common cause of
  // "badge says 3 but cart is empty" and ghost product references). All fixes
  // are derived from the single product source of truth.
  function repairStorage() {
    const products = read(STORAGE_KEYS.products, []);
    const validIds = new Set(products.filter(p => p && p.id).map(p => p.id));

    // cart: keep only items whose product still exists; ensure shape is valid.
    const cart = read(STORAGE_KEYS.cart, []);
    if (Array.isArray(cart)) {
      const fixed = cart
        .filter(i => i && i.productId && validIds.has(i.productId))
        .map(i => ({
          key: i.key || (i.productId + '|' + (i.variant ? JSON.stringify(i.variant) : '')),
          productId: i.productId,
          qty: Math.max(1, parseInt(i.qty, 10) || 1),
          variant: i.variant || null
        }));
      if (fixed.length !== cart.length) write(STORAGE_KEYS.cart, fixed);
    } else write(STORAGE_KEYS.cart, []);

    // wishlist: keep only ids that still exist.
    const wish = read(STORAGE_KEYS.wishlist, []);
    if (Array.isArray(wish)) {
      const fixed = wish.filter(id => validIds.has(id));
      if (fixed.length !== wish.length) write(STORAGE_KEYS.wishlist, fixed);
    } else write(STORAGE_KEYS.wishlist, []);

    // compare: keep only ids that still exist.
    const cmp = read('luxora_compare', []);
    if (Array.isArray(cmp)) {
      const fixed = cmp.filter(id => validIds.has(id));
      if (fixed.length !== cmp.length) write('luxora_compare', fixed);
    } else write('luxora_compare', []);

    // orders / customers: ensure they are arrays.
    if (!Array.isArray(read(STORAGE_KEYS.orders, null))) write(STORAGE_KEYS.orders, []);
    if (!Array.isArray(read(STORAGE_KEYS.customers, null))) write(STORAGE_KEYS.customers, []);
  }

  // Ensure seed data exists. IMPORTANT: we must NEVER overwrite an existing
  // stored catalog. Previously this re-seeded whenever the stored count dropped
  // below the seed count (100), which silently wiped admin-created products and
  // restored deleted seeds on every page load -> "Product not found" errors.
  // Now we only seed when there is no stored catalog at all.
  function init() {
    const storedProducts = read(STORAGE_KEYS.products, null);
    if (!storedProducts || !Array.isArray(storedProducts) || storedProducts.length === 0) {
      write(STORAGE_KEYS.products, seedProducts);
    } else {
      // Migrate legacy entries and purge ghost records so there is always
      // exactly ONE clean, canonical product source. We ALWAYS write the
      // normalized result back: a legacy record may normalize successfully
      // (same length) yet still need its fields rewritten, and a ghost record
      // must be purged. Skipping the write when counts match would leave raw,
      // broken objects in storage (e.g. "undefined" rows, undeletable ghosts).
      const cleaned = storedProducts.map((p, i) => normalizeProduct(p, i)).filter(Boolean);
      const seen = new Set();
      const deduped = cleaned.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
      write(STORAGE_KEYS.products, deduped);
    }
    if (!localStorage.getItem(STORAGE_KEYS.categories)) write(STORAGE_KEYS.categories, seedCategories);
    if (!localStorage.getItem(STORAGE_KEYS.brands)) write(STORAGE_KEYS.brands, seedBrands);
    if (!localStorage.getItem(STORAGE_KEYS.coupons)) write(STORAGE_KEYS.coupons, seedCoupons);
    if (!localStorage.getItem(STORAGE_KEYS.reviews)) write(STORAGE_KEYS.reviews, seedReviews);
    if (!localStorage.getItem(STORAGE_KEYS.settings)) write(STORAGE_KEYS.settings, seedSettings);
    if (!localStorage.getItem(STORAGE_KEYS.cart)) write(STORAGE_KEYS.cart, []);
    if (!localStorage.getItem(STORAGE_KEYS.wishlist)) write(STORAGE_KEYS.wishlist, []);
    if (!localStorage.getItem(STORAGE_KEYS.orders)) write(STORAGE_KEYS.orders, []);
    if (!localStorage.getItem(STORAGE_KEYS.customers)) write(STORAGE_KEYS.customers, []);
    if (!localStorage.getItem(STORAGE_KEYS.currency)) write(STORAGE_KEYS.currency, 'USD');
    // Repair/validate all collections AFTER products are normalized so orphan
    // references can be detected against the clean product list.
    repairStorage();
  }

  const DB = {
    STORAGE_KEYS,
    init,
    read,
    write,
    getProducts: () => read(STORAGE_KEYS.products, seedProducts),
    getCategories: () => read(STORAGE_KEYS.categories, seedCategories),
    getBrands: () => read(STORAGE_KEYS.brands, seedBrands),
    getCoupons: () => read(STORAGE_KEYS.coupons, seedCoupons),
    getReviews: () => read(STORAGE_KEYS.reviews, seedReviews),
    getSettings: () => read(STORAGE_KEYS.settings, seedSettings),
    getOrders: () => read(STORAGE_KEYS.orders, []),
    getCustomers: () => read(STORAGE_KEYS.customers, []),
    getCart: () => read(STORAGE_KEYS.cart, []),
    getWishlist: () => read(STORAGE_KEYS.wishlist, []),
    setProducts: (v) => write(STORAGE_KEYS.products, v),
    setCategories: (v) => write(STORAGE_KEYS.categories, v),
    setBrands: (v) => write(STORAGE_KEYS.brands, v),
    setCoupons: (v) => write(STORAGE_KEYS.coupons, v),
    setReviews: (v) => write(STORAGE_KEYS.reviews, v),
    setSettings: (v) => write(STORAGE_KEYS.settings, v),
    setOrders: (v) => write(STORAGE_KEYS.orders, v),
    setCustomers: (v) => write(STORAGE_KEYS.customers, v),
    setCart: (v) => write(STORAGE_KEYS.cart, v),
    setWishlist: (v) => write(STORAGE_KEYS.wishlist, v),
    getProduct: (id) => read(STORAGE_KEYS.products, seedProducts).find(p => p.id === id),
    // Remove a product AND every reference to it from cart, wishlist and
    // compare. Keeps all collections consistent with the single source of
    // truth so no orphan IDs (ghost entries) can remain.
    removeProductReferences: (id) => {
      const cart = read(STORAGE_KEYS.cart, []).filter(i => i.productId !== id);
      write(STORAGE_KEYS.cart, cart);
      const wish = read(STORAGE_KEYS.wishlist, []).filter(w => w !== id);
      write(STORAGE_KEYS.wishlist, wish);
      const cmp = read('luxora_compare', []).filter(c => c !== id);
      write('luxora_compare', cmp);
    },
    seedProducts, seedCategories, seedBrands, seedCoupons, seedReviews, seedSettings
  };

  window.LUXORA_DB = DB;
})();
