import { Schema, model } from 'mongoose'

const ListSchema = new Schema({
    name: {
        type: String,
        required: [true, 'List name is required'],
        trim: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: [true, 'Board id is required']
    },
    position: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const ListModel = model('List', ListSchema)

export default ListModel