import { Router } from "express";
import authMiddleware from '../../middlewares/auth.middleware.js';
import InvitationController from './invitation.controller.js';
import InvitationService from "./invitation.service.js";

const router = Router();

router.use(authMiddleware);

const invitationService = new InvitationService();
const invitationController = new InvitationController(invitationService);


router.post('/', invitationController.createInvitation); // Yangi taklifnoma yaratish (doska ID'si bilan birga)
router.get('/my', invitationController.getMyInvitations); // Menga kelgan taklifnomalarni olish
router.post('/:invitationId/accept', invitationController.acceptInvitation); // Taklifni qabul qilish
// router.post('/:invitationId/decline', InvitationController.declineInvitation); // Taklifni rad etish


export default router;