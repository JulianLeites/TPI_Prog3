import { Router } from 'express';
import { 
    assignMembershipToUser
} from '../controllers/userMembershipController.js';

const router = Router();

router.post('/users/:user_id/memberships/:membership_id', assignMembershipToUser);

export default router;