import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { validateMessageInput } from '../middlewares/validation.middleware';

const router = Router();

router.post('/message', validateMessageInput, ChatController.handleMessage);
router.get('/history/:sessionId', ChatController.getHistory);

export default router;
