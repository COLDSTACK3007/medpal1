require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GramCare AI Backend is running' });
});

// Endpoint for offline mobile records syncing
app.post('/api/sync', (req, res) => {
  const { records } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid records format' });
  }

  // Basic mock sync logic
  console.log(`Received ${records.length} records for sync.`);

  // Here we would typically insert these into our central database
  // For MVP, simulating success
  res.json({ status: 'success', message: 'Records synced successfully', count: records.length });
});

// Symptom Checker Triage Endpoint
app.post('/api/symptom-check', async (req, res) => {
  const { symptoms, language } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: 'Symptoms are required' });
  }

  try {
    // Mocking an AI triage layer for MVP
    console.log(`Analyzing symptoms: ${symptoms} in language: ${language || 'en'}`);

    // Simple rule-based mock for demonstration
    let riskLevel = 'Low';
    let diagnosis = 'Possible minor infection or fatigue.';
    let advice = 'Rest and hydrate. Consult a CHW if symptoms persist.';

    const lowerSymptoms = symptoms.toLowerCase();

    if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('difficulty breathing') || lowerSymptoms.includes('severe')) {
      riskLevel = 'High';
      diagnosis = 'Potential emergency condition.';
      advice = 'Seek immediate medical attention or use the Emergency Alert System.';
    } else if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('cough')) {
      riskLevel = 'Medium';
      diagnosis = 'Possible respiratory infection or flu.';
      advice = 'Monitor temperature. Schedule a telemedicine consultation.';
    }

    res.json({
      riskLevel,
      diagnosis,
      advice,
      disclaimer: 'This is an AI generated triage and not a substitute for professional medical advice.'
    });

  } catch (error) {
    console.error('Error in symptom check:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
