const Assessment = require('../models/Assessment');

exports.saveAssessment = async (req, res) => {
  try {
    const { email, domain, level, percentage, totalScore, maxPossibleScore, recommendation, strengths, areas_for_improvement, next_steps } = req.body;

    if (!email || !domain) {
      return res.status(400).json({ success: false, message: 'Email and domain are required' });
    }

    // Upsert assessment based on user's email
    const filter = { email };
    const update = { domain, level, percentage, totalScore, maxPossibleScore, recommendation, strengths, areas_for_improvement, next_steps };

    const assessment = await Assessment.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true
    });

    res.status(200).json({ success: true, assessment });
  } catch (error) {
    console.error('Error in saveAssessment:', error);
    res.status(500).json({ success: false, message: 'Server error saving assessment' });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const assessment = await Assessment.findOne({ email });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({ success: true, assessment });
  } catch (error) {
    console.error('Error in getAssessment:', error);
    res.status(500).json({ success: false, message: 'Server error fetching assessment' });
  }
};
