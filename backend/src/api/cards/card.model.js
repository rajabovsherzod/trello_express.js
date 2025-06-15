import { Schema, model } from 'mongoose'

const CardSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Card name is required'],
        trim: true,
        maxlength: [100, 'Card cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [1000, 'Card description cannot be more than 1000 characters']
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
})

const CardModel = model('Card', CardSchema)

export default CardModel