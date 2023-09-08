import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello World', status: 200, data: null });
});

export default router;
