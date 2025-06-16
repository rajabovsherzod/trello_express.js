import { Schema, model} from "mongoose"

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const TokenModel = model('Token', tokenSchema)

export default TokenModel