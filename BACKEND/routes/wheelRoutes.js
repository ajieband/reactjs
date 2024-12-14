const express = require('express');
const {
  createWheel,
  getWheel,
  spinWheel,
  getAllWheels,
  saveWinner,
  getWheelDetails,
  updateWheel,
  deleteWheel,
  getWinnersByWheelId,
} = require('../controllers/wheelController');

const router = express.Router();

// Tambahkan rute yang sudah ada
router.get('/:id', getWheel);
router.post('/create', createWheel);
router.post('/spin', spinWheel);
router.get('/', getAllWheels);

// Tambahkan rute untuk fungsi lainnya
router.post('/save-winner', saveWinner);
router.get('/details/:id', getWheelDetails);
router.put('/update/:id', updateWheel);
router.delete('/delete/:id', deleteWheel);
router.get('/:id/details', getWheelDetails);
router.get('/:id/winners', getWinnersByWheelId);


module.exports = router;
