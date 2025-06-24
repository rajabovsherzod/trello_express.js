import InvitationModel from "./invitation.model.js";
import BoardModel from "../boards/board.model.js";
import UserModel from "../users/user.model.js";
import ApiError from "../../utils/api.error.js";
import EmailService from "../../utils/email.service.js";
import { createInvitationEmailTemplate } from "../../templates/invitation.template.js";

class InvitationService {
    async createInvitation(boardId, fromUserId, toUserEmail){
        const board = await BoardModel.findById(boardId)
        if(!board){
            throw new ApiError(404, 'Board not found');
        }

        const fromUser = await UserModel.findById(fromUserId)
        if(!fromUser){
            throw new ApiError(404, 'Inviting user not found.');
        }

        const memberIds = board.members.map(id => id.toString());
        if(!memberIds.includes(fromUserId)){
            throw new ApiError(403, 'You must be a member of the board to invite others.');
        }

        const userToInvite = await UserModel.findOne({email: toUserEmail})
        if(!userToInvite){
            throw new ApiError(404, `User with email "${toUserEmail}" is not registered.`);
        }

        if(userToInvite._id.toString() === fromUserId.toString()){
            throw new ApiError(400, 'You cannot invite yourself to a board.');
        }

        if(memberIds.includes(userToInvite._id.toString())){
            throw new ApiError(400, 'This user is already a member of the board.');
        }

        const invitation = await InvitationModel.create({
            boardId,
            fromUser: fromUserId,
            toUserEmail
        })

        const subject = `${fromUser.username} has invited you to collaborate on Trello`;
        const html = createInvitationEmailTemplate(
            board.name, 
            fromUser.username, 
            'http://localhost:5173/invitations' // Bu havolani keyinchalik to'g'rilaymiz
        );

        await EmailService.send(toUserEmail, subject, html)

        return invitation
    }

    async getMyInvitations(userEmail){
        const invitations = await InvitationModel.find({
            toUserEmail: userEmail,
            status: 'pending'
        })
        .sort({ createdAt: -1 })
        .populate('fromUser', 'username email')
        .populate('boardId', 'name backgroundColor')

        return invitations
    }

    async acceptInvitation(invitationId, userId){
        const invitation = await InvitationModel.findById(invitationId)
        if(!invitation){
            throw new ApiError(404, 'Invitation not found.');
        }
        
        const user = await UserModel.findById(userId)
        if(invitation.toUserEmail !== user.email){
            throw new ApiError(403, 'This invitation is not for you.');
        }

        if(invitation.status !== 'pending'){
            throw new ApiError(400, `This invitation has already been ${invitation.status}.`)
        }

        await BoardModel.updateOne(
            {_id: invitation.boardId},
            {$addToSet: {members: userId}}
        )

        invitation.status = 'accepted'
        await invitation.save()

        return {
            message: 'Invitation accepted successfully',
        }
    }

    async declineInvitation(invitationId, userId){
        const invitation = await InvitationModel.findById(invitationId)
        if(!invitation){
            throw new ApiError(404, 'Invitation not found.');
        }

        const user = await UserModel.findById(userId)
        if(invitation.toUserEmail !== user.email){
            throw new ApiError(403, 'This invitation does not belong to you.');
        }

        if(invitation.status !== 'pending'){
            throw new ApiError(400, `This invitation has already been ${invitation.status}.`)
        }

        invitation.status = 'declined'
        await invitation.save()

        return {
            message: 'Invitation declined successfully',
        }
    }
}

export default InvitationService;