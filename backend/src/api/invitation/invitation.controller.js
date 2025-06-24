import ApiError from "../../utils/api.error.js";
class InvitationController {
    constructor(invitationService){
        this.invitationService = invitationService
    }

    createInvitation = async (req, res, next) => {
        try {
            const { boardId, toUserEmail } = req.body
            const fromUserId = req.user.id

            const invitation = await this.invitationService.createInvitation(boardId, fromUserId, toUserEmail)
            res.status(201).json({
                message: 'Invitation created successfully',
                data: invitation
            })
        } catch (error) {
            if(error.code === 11000){
                next(new ApiError(400, 'This user has already been invited to this board.'));
            }else{
                next(error)
            }
        }
    }

    getMyInvitations = async (req, res, next) => {
        try {
            const userEmail = req.user.email
            const invitations = await this.invitationService.getMyInvitations(userEmail)
            res.status(200).json({
                message: 'Invitations fetched successfully',
                data: invitations,
            })
        } catch (error) {
            next(error)
        }
    }

    acceptInvitation = async (req, res, next) => {
        try {
            const { invitationId } = req.params
            const userId = req.user.id

            const result = await this.invitationService.acceptInvitation(invitationId, userId)
            res.status(200).json({
                result
            })
        } catch (error) {
            next(error)
        }
    }

    declineInvitation = async (req, res, next) => {
        try {
            const { invitationId } = req.params
            const userId = req.user.id
            const result = await this.invitationService.declineInvitation(invitationId, userId)
            res.status(200).json({
                result
            })
        } catch (error) {
            next(error)
        }
    }
}

export default InvitationController;