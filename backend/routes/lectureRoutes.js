const express = require('express');
const router = express.Router();
const { updateLecture, deleteLecture } = require('../controllers/lectureController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.put('/:id', protectAdmin, updateLecture);
router.delete('/:id', protectAdmin, deleteLecture);

module.exports = router;
