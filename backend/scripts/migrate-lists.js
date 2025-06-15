// backend/scripts/migrate-lists.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Modellarni import qilish ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Modellarga yo'lni to'g'ri ko'rsating
import ListModel from '../src/api/lists/list.model.js';
import BoardModel from '../src/api/boards/board.model.js';

// --- Muhit o'zgaruvchilarini sozlash ---
// .env fayli loyihaning asosiy papkasida ekanligiga ishonch hosil qiling
dotenv.config({ path: path.join(__dirname, '../.env') }); 

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
    console.error('Xatolik: MONGO_URI muhit o\'zgaruvchisi topilmadi. .env faylini tekshiring.');
    process.exit(1);
}

const migrate = async () => {
    try {
        // 1. Ma'lumotlar bazasiga ulanish
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB ga muvaffaqiyatli ulanildi.');

        // 2. Eskirgan listlarni topish (createdBy maydoni yo'q bo'lganlar)
        const oldLists = await ListModel.find({ createdBy: { $exists: false } });

        if (oldLists.length === 0) {
            console.log('Migratsiya uchun eski listlar topilmadi. Hamma narsa joyida!');
            return;
        }

        console.log(`${oldLists.length} ta eski list topildi. Migratsiya boshlanmoqda...`);

        let updatedCount = 0;
        // 3. Har bir eski listni yangilash
        for (const list of oldLists) {
            // List tegishli bo'lgan doskani topamiz
            const board = await BoardModel.findById(list.boardId);

            if (board && board.owner) {
                // Listning maydonlarini doska egasi bilan to'ldiramiz
                list.createdBy = board.owner;
                list.updatedBy = board.owner;
                await list.save();
                console.log(`List (ID: ${list._id}) muvaffaqiyatli yangilandi.`);
                updatedCount++;
            } else {
                console.warn(`List (ID: ${list._id}) uchun tegishli doska yoki doska egasi topilmadi. O'tkazib yuborildi.`);
            }
        }

        console.log(`Migratsiya yakunlandi. ${updatedCount} ta list muvaffaqiyatli yangilandi.`);

    } catch (error) {
        console.error('Migratsiya jarayonida xatolik yuz berdi:', error);
    } finally {
        // 4. Ulanishni yopish
        await mongoose.disconnect();
        console.log('MongoDB bilan ulanish uzildi.');
    }
};

// Skriptni ishga tushirish
migrate();