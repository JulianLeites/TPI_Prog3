import { Router } from 'express';
import { 
    assignMembershipToUser,
    cancelMembership
} from '../controllers/userMembershipController.js';

const router = Router();

router.post('/users/:user_id/memberships/:membership_id', assignMembershipToUser);
router.put('/users/:user_id/memberships/cancel', cancelMembership);

export default router;