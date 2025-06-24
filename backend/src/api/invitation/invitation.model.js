import mongoose from "mongoose";
import { Schema } from "mongoose";

const InvitationSchema = new Schema({
    boardId: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    fromUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending"
    }
}, { timestamps: true })

InvitationSchema.index({ boardId: 1, toUserEmail: 1 }, { unique: true });

const InvitationModel = mongoose.model("Invitation", InvitationSchema);

export default InvitationModel;