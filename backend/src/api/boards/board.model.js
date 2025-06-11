import { Schema, model } from 'mongoose'

const boardSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Board name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    visibility: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    background: {
        type: String,
        default: '#0079BF'
    }
}, {
    timestamps: true
})


boardSchema.pre('save', function(next){
    if(this.isNew && !this.members.includes(this.owner)){
        this.members.push(this.owner)
    }
    next()
})

const BoardModel = model('Board', boardSchema)
export default BoardModel