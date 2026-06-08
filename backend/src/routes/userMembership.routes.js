import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { 
    assignMembershipToUser,
    cancelMembership,
    getUserActiveMembership
} from '../controllers/userMembershipController.js';

const router = Router();

router.post('/memberships/assign/:membership_id', verifyToken, assignMembershipToUser);
router.put('/profile/memberships', verifyToken, cancelMembership);

router.get('/profile/membership', verifyToken, getUserActiveMembership)

export default router;