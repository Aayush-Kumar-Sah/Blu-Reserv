const express = require('express');
const router = express.Router();

router.post('/callback', async (req, res) => {
  const { code } = req.body;

  // For now, just log it
  console.log('Received auth code:', code);

  // Later: exchange code with w3id token endpoint

  res.json({ success: true });
});

module.exports = router;
