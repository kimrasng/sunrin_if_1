const express = require('express');
const router = express.rout();

router.get('/', (req, res) => {
    res.send('chat')
});

module.exports = router;