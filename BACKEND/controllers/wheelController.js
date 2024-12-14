// controllers/wheelController.js
const Wheel = require('../models/Wheel');
const Winner = require('../models/Winner');
const mongoose = require('mongoose'); // Tambahkan import mongoose
require('dotenv').config()

// Create a new Wheel
const createWheel = async (req, res) => {
  const { title, options, numOptions } = req.body;

  try {
    // Validate number of options
    if (options.length !== numOptions) {
      throw Error('Number of options does not match specified amount');
    }

    // Validate that each option has text and code
    options.forEach((option, index) => {
      if (!option.text || !option.code) {
        throw Error(`Option ${index + 1} must have both text and code`);
      }
      option.position = index; // Add position to each option
    });

    const wheel = await Wheel.create({
      title,
      numOptions,
      options,
      link: `${process.env.FRONTEND_URL}/wheel/${Date.now()}` // Generate unique link
    });

    res.status(201).json(wheel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Spin wheel with code
const spinWheel = async (req, res) => {
  const { wheelId, code } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(wheelId)) {
      throw Error('Invalid wheel ID format');
    }

    const wheel = await Wheel.findById(wheelId);
    if (!wheel) {
      throw Error('Wheel not found');
    }

    // Find the option matching the code
    const matchingOption = wheel.options.find(opt => opt.code === code);
    if (!matchingOption) {
      throw Error('Invalid code');
    }

    res.status(200).json({
      success: true,
      result: matchingOption,
      message: 'Wheel spun successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get wheel by ID
const getWheel = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid wheel ID format' });
    }

    const wheel = await Wheel.findById(id);

    if (!wheel) {
      return res.status(404).json({ error: 'Wheel not found' });
    }

    // Transform wheel data to hide sensitive information (like codes)
    const sanitizedWheel = {
      _id: wheel._id,
      title: wheel.title,
      numOptions: wheel.numOptions,
      options: wheel.options.map(option => ({
        text: option.text,
        position: option.position
      })),
      createdAt: wheel.createdAt,
      updatedAt: wheel.updatedAt
    };

    res.status(200).json(sanitizedWheel);
  } catch (error) {
    console.error('Error in getWheel:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getAllWheels = async (req, res) => {
  try {
    const wheels = await Wheel.find().sort({ createdAt: -1 }); // -1 untuk descending order
    res.status(200).json(wheels);
  } catch (error) {
    console.error('Error in getAllWheels:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


// Tambahkan ke exports yang ada
const saveWinner = async (req, res) => {
  const { wheelId, username, code, prize } = req.body;
  
  try {
    const winner = await Winner.create({
      wheelId,
      username,
      code,
      prize
    });
    
    res.status(201).json(winner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWheelDetails = async (req, res) => {
  const { id } = req.params;
  
  try {
    const wheel = await Wheel.findById(id);
    if (!wheel) {
      return res.status(404).json({ error: 'Wheel not found' });
    }
    
    const winners = await Winner.find({ wheelId: id }).sort({ createdAt: -1 });
    
    res.status(200).json({ wheel, winners });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


const updateWheel = async (req, res) => {
  const { id } = req.params;
  const { title, options } = req.body;
  
  try {
    const wheel = await Wheel.findByIdAndUpdate(
      id, 
      { 
        title, 
        options,
        numOptions: options.length 
      },
      { new: true }
    );
    
    if (!wheel) {
      return res.status(404).json({ error: 'Wheel not found' });
    }
    
    res.status(200).json(wheel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteWheel = async (req, res) => {
  const { id } = req.params;
  
  try {
    const wheel = await Wheel.findByIdAndDelete(id);
    await Winner.deleteMany({ wheelId: id });
    
    if (!wheel) {
      return res.status(404).json({ error: 'Wheel not found' });
    }
    
    res.status(200).json({ message: 'Wheel deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getWinnersByWheelId = async (req, res) => {
  const { id } = req.params;

  try {
    // Validasi format ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid wheel ID format' });
    }

    // Cari wheel berdasarkan ID
    const wheel = await Wheel.findById(id);
    if (!wheel) {
      return res.status(404).json({ error: 'Wheel not found' });
    }

    // Ambil pemenang berdasarkan wheelId
    const winners = await Winner.find({ wheelId: id }).sort({ createdAt: -1 });

    if (winners.length === 0) {
      return res.status(404).json({ error: 'No winners found for this wheel' });
    }

    res.status(200).json({ winners });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { createWheel, spinWheel, getWheel, getAllWheels, saveWinner, getWheelDetails, updateWheel, deleteWheel, getWinnersByWheelId };