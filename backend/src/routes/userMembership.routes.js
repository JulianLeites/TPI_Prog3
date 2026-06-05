import { Router } from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { 
    assignMembershipToUser,
    cancelMembership
} from '../controllers/userMembershipController.js';

const router = Router();

router.post('/users/:user_id/memberships/:membership_id', verifyToken, assignMembershipToUser);
router.put('/users/:user_id/memberships/cancel', verifyToken, cancelMembership);

export default router;