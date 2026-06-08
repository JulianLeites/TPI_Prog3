import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { 
    assignMembershipToUser,
    cancelMembership,
    getUserActiveMembership,
    adminCancelUserMembership
} from '../controllers/userMembershipController.js';

console.log('se esat ejecutando')
const router = Router();

router.put('/memberships/cancel', verifyToken, cancelMembership);
router.put('/memberships/cancel/:userId', verifyToken, adminCancelUserMembership);
router.post('/memberships/assign/:membership_id', verifyToken, assignMembershipToUser);

router.get('/memberships', verifyToken, getUserActiveMembership)
router.get('/memberships/user/:id', verifyToken, getUserActiveMembership)


export default router;