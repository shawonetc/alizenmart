const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Automatically load environment variables from .env.local in Node.js 20.6.0+
if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile(path.resolve(__dirname, '../.env.local'));
    } catch (error) {
        console.warn('Could not load .env.local file automatically:', error.message);
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const defaultStaticCategories = [
    { name: "Gadgets", slug: "gadgets", sort_order: 1 },
    { name: "Smart Electronics", slug: "smart-electronics", sort_order: 2 },
    { name: "Home & Lifestyle", slug: "home-lifestyle", sort_order: 3 },
    { name: "Beauty & Personal", slug: "beauty-personal", sort_order: 4 },
    { name: "Healthy Food", slug: "healthy-food", sort_order: 5 },
    { name: "Fashion", slug: "fashion", sort_order: 6 },
    { name: "Mom & Baby", slug: "mom-baby", sort_order: 7 },
    { name: "Home & Kitchen", slug: "home-kitchen", sort_order: 8 },
    { name: "Appliances", slug: "appliances", sort_order: 9 },
    { name: "Fitness & Health", slug: "fitness-health", sort_order: 10 },
    { name: "Smart Watch", slug: "smart-watch", sort_order: 11 },
    { name: "Religious", slug: "religious", sort_order: 12 },
    { name: "Peripherals", slug: "peripherals", sort_order: 13 },
    { name: "Smart Furniture", slug: "smart-furniture", sort_order: 14 },
    { name: "Books", slug: "books", sort_order: 15 },
    { name: "Others", slug: "others", sort_order: 16 }
];

const products = [
    { title: "Airpods Case", price: 160, oldPrice: 180, image: "/airpods_case.png", category: "Gadgets", stock: 50, description: "High quality Airpods case." },
    { title: "৭টি গুরুত্বপূর্ণ ইসলামিক বইয়ের কম্বো প্যাকেজ", price: 980, oldPrice: 1755, image: "/islamic_books.png", category: "Books", stock: 50, description: "A combo of 7 important Islamic books." },
    { title: "ঈদ আয়োজনে ১০% ডিসকাউন্টে বাবা/ছেলে ম্যাচিং পাঞ্জাবী", price: 1040, oldPrice: null, image: "/matching_panjabi.png", category: "Fashion", stock: 50, description: "Matching panjabi for father and son." },
    { title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে পাঞ্জাবী", price: 1030, oldPrice: null, image: "/soft_katan_panjabi.png", category: "Fashion", stock: 50, description: "Comfortable soft katan panjabi for adults." },
    { title: "ছোটদের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 1962, oldPrice: 2180, image: "/kids_koti_panjabi.png", category: "Fashion", stock: 50, description: "Kids matching koti panjabi." },
    { title: "বড়দের শীতের আরামদায়ক সফট কাতান কাপড়ে ম্যাচিং-কটি পাঞ্জাবী", price: 2990, oldPrice: 3320, image: "/soft_katan_panjabi.png", category: "Fashion", stock: 50, description: "Adults matching koti panjabi." },
    { title: "প্রিমিয়াম সিজন ফ্রেশ মিক্স খেজুর কম্বো প্যাকেজ", price: 1760, oldPrice: null, image: "/fresh_dates.png", category: "Healthy Food", stock: 50, description: "Premium season fresh mix dates combo." },
    { title: "আকর্ষণীয় এম্ব্রয়ডারী ডিজাইনের নতুন কালেকশন", price: 690, oldPrice: null, image: "/embroidery_dress.png", category: "Fashion", stock: 50, description: "Attractive embroidery design new collection." },
    { title: "ঈদের আনন্দে বাবা ছেলে একসাথে আকর্ষণীয় ডিজাইনের ম্যাচিং পাঞ্জাবী", price: 980, oldPrice: null, image: "/matching_panjabi.png", category: "Fashion", stock: 50, description: "Father son matching panjabi for Eid." },
    { title: "প্রিমিয়াম কটন ফেব্রিক পাঞ্জাবী", price: 1380, oldPrice: null, image: "/soft_katan_panjabi.png", category: "Fashion", stock: 50, description: "Premium cotton fabric panjabi." },
    { title: "কাফ হাতা ডিজাইনে প্রিমিয়াম ব্ল্যাক পাঞ্জাবী", price: 1150, oldPrice: null, image: "/black_panjabi_cuff.png", category: "Fashion", stock: 50, description: "Premium black panjabi with cuff design." },
    { title: "ফ্যামিলি ম্যাচিং থ্রি পিস/টু-পিস", price: 1490, oldPrice: null, image: "/family_matching.png", category: "Fashion", stock: 50, description: "Family matching three piece/two piece." },
    { title: "প্রিমিয়াম কোয়ালিটির বাবা ছেলের ম্যাচিং পাঞ্জাবী", price: 880, oldPrice: null, image: "/matching_panjabi.png", category: "Fashion", stock: 50, description: "Premium quality father son matching panjabi." },
    { title: "ফ্যামিলি ম্যাচিং থ্রি পিস এবং পাঞ্জাবি", price: 1520, oldPrice: null, image: "/family_matching.png", category: "Fashion", stock: 50, description: "Family matching three piece and panjabi." },
    { title: "ফ্যামিলি ম্যাচিং আধুনিক ডিজাইনে ঈদ কালেকশন", price: 980, oldPrice: null, image: "/family_matching.png", category: "Fashion", stock: 50, description: "Family matching modern design Eid collection." },
    { title: "কিউট ও স্টাইলিশ ইয়ারমাফ", price: 250, oldPrice: null, image: "/earmuffs.png", category: "Fashion", stock: 50, description: "Cute and stylish earmuffs." }
];

async function seed() {
    console.log("1. Seeding categories...");
    for (const cat of defaultStaticCategories) {
        const { error } = await supabase.from('categories').upsert([cat], { onConflict: 'slug' });
        if (error) {
            console.error('Error inserting category', cat.name, error);
        } else {
            console.log('Category seeded:', cat.name);
        }
    }

    console.log("\n2. Seeding settings...");
    const { error: settingsError } = await supabase.from('settings').upsert([{
        id: 1,
        hero_main_slider: "/images/hero/ads.png",
        hero_main_slider_2: "/images/hero/ads2.png",
        hero_main_slider_3: "",
        hero_side_banner_1: "",
        hero_side_banner_2: "",
        updated_at: new Date().toISOString()
    }]);
    if (settingsError) {
        console.error('Error seeding settings:', settingsError);
    } else {
        console.log('Default settings seeded successfully.');
    }

    console.log("\n3. Seeding products...");
    for (const product of products) {
        const { error } = await supabase.from('products').insert([{
            ...product,
            created_at: new Date().toISOString()
        }]);
        if (error) {
            console.error('Error inserting product:', product.title, error);
        } else {
            console.log('Inserted product:', product.title);
        }
    }
    console.log("\nSeeding process completed.");
}

seed();
