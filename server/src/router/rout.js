const express = require('express');
const { signUp, login, getUser, userDelete, userUpdate } = require('../controller/user');

const router = express.Router();

router.post('/create',signUp);
router.post('/login',login)
router.get('/user',getUser);
router.put('/update/:id',userUpdate)
router.delete('/delete/:id',userDelete)



module.exports = router