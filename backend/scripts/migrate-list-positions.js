// scripts/migrate-list-positions.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ListModel from '../src/api/lists/list.model.js'; // Modelimizga to'g'ri yo'lni ko'rsating

// .env faylidagi o'zgaruvchilarni yuklash
dotenv.config();

// Ma'lumotlar bazasiga ulanish funksiyasi
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDBga muvaffaqiyatli ulanildi.');
    } catch (err) {
        console.error('MongoDBga ulanishda xatolik:', err.message);
        process.exit(1); // Xatolik bo'lsa, skriptni to'xtatish
    }
};

// Asosiy migratsiya mantiqi
const migrate = async () => {
    await connectDB();

    try {
        console.log('Migratsiya boshlandi...');

        // Faqat `position` maydoni mavjud bo'lmagan listlarni topamiz
        const listsToMigrate = await ListModel.find({ position: { $exists: false } }).sort({ createdAt: 'asc' });

        if (listsToMigrate.length === 0) {
            console.log('Migratsiya uchun listlar topilmadi. Hammasi joyida!');
            return;
        }

        console.log(`${listsToMigrate.length} ta list migratsiya qilinadi...`);

        // Har bir list uchun `position`ni belgilab, saqlaymiz
        for (let i = 0; i < listsToMigrate.length; i++) {
            const list = listsToMigrate[i];
            list.position = i;
            await list.save();
            console.log(`"${list.name}" listi uchun position=${i} o'rnatildi.`);
        }

        console.log('Migratsiya muvaffaqiyatli yakunlandi!');

    } catch (error) {
        console.error('Migratsiya davomida xatolik yuz berdi:', error);
    } finally {
        // Ish tugagach, bazadan uzilamiz
        await mongoose.disconnect();
        console.log('MongoDBdan uzildi.');
    }
};

// Skriptni ishga tushirish
migrate();