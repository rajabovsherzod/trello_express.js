import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BoardModel from '../src/api/boards/board.model.js';

// .env faylidagi o'zgaruvchilarni yuklash (skript backend papkasidan ishga tushiriladi deb hisoblaymiz)
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error('Xatolik: MONGO_URL .env faylida topilmadi. backend/.env faylini yaratib, unga MONGO_URL=... kiriting.');
    process.exit(1);
}

const migrate = async () => {
    try {
        console.log('MongoDB ga ulanish...');
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB ga muvaffaqiyatli ulanildi.');

        console.log('Doskalarni qidirish va yangilash boshlandi...');
        
        const boards = await BoardModel.find({});
        
        let updatedCount = 0;
        const promises = boards.map(async (board) => {
            if (board.owner && !board.members.includes(board.owner)) {
                board.members.push(board.owner);
                await board.save();
                console.log(`- "${board.title}" (ID: ${board._id}) doskasi yangilandi.`);
                updatedCount++;
            }
        });

        await Promise.all(promises);

        if (updatedCount === 0) {
            console.log("Barcha doskalar to'g'ri. Hech qanday o'zgarish kiritilmadi.");
        } else {
            console.log(`\nJami ${updatedCount} ta doska muvaffaqiyatli yangilandi.`);
        }

    } catch (error) {
        console.error('\nMigratsiya jarayonida xatolik yuz berdi:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB dan uzildi.');
    }
};

migrate(); 