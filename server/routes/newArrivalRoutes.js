const express = require('express');

const router = express.Router();

const {
  createNewArrival,
  getNewArrivals,
  getNewArrivalById,
  updateNewArrival,
  deleteNewArrival
} = require('../controllers/arrivalController');

router.post('/', createNewArrival);

router.get('/', getNewArrivals);

router.get('/:id', getNewArrivalById);

router.put('/:id', updateNewArrival);

router.delete('/:id', deleteNewArrival);

module.exports = router;