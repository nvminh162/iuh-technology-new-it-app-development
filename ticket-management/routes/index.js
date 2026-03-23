const { Router } = require('express');
const multer = require('multer');
const { controller } = require('../controllers')

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', controller.getAll)
router.get('/ticket/:id', controller.getById)
router.get('/upsert', controller.getUpsertForm)
router.get('/upsert/:id', controller.getUpsertForm)
router.post('/upsert', upload.single('image'), controller.upsert)
router.post('/upsert/:id', upload.single('image'), controller.upsert)
router.post('/delete/:id', controller.remove)

module.exports = router;