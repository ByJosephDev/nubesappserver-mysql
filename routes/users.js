var express = require('express');
const User = require('../models/User');
const imageRepository = require('../repository/aws');
const aws = new imageRepository();
var router = express.Router();
const multer  = require('multer');
const upload = multer();

router.get('/', (req, res, next) => {
  User.findAll().then(users => {
    console.log(users);
    res.render('index', { title: 'Sistema-Contacto', docs: users });
  })
});

router.get('/updateUser/:idUser', function(req, res, next) {


  const { idUser } = req.params

  User.findOne({
    where: { id: idUser}
  }).then(user => {
    console.log(user);
    res.render('update', { title: 'Sistema-Contacto', docs: user });
  })

});

router.post('/create', async (req, res) => {

  const body = req.body

  await User.create({
    name: body.name,
    lastName: body.lastName,
    email: body.email,
    birthDate: body.birthDate,
    image: body.image
  }).then(user => {
    console.log(user);
    res.redirect('/')
  });

});



router.post('/delete/:idUser', async (req, res) => {

  const { idUser } = req.params

  const key = req.body.imagendelete;

  if(key != 'none'){
    await aws.deleteImage(key);
  }

  await User.destroy({
    where: {
      id: idUser
    }
  }).then(user => {
    console.log(user);
    res.redirect('/');
  });

});

router.post('/update/:idUser', async (req, res) => {

  const { idUser } = req.params

  const body = req.body

  await User.update({
    name: body.name,
    lastName: body.lastName,
    email: body.email,
    birthDate: body.birthDate,
  }, {
    where: {
      id: idUser
    }
  }).then(user => {
    console.log(user);
    res.redirect('/');
  });

});

router.post('/uploadImage/:idUser',upload.single('image'), async(req, res, next) =>{
  const { idUser } = req.params
  const imagen = req.file.buffer; 
  const type = req.file.mimetype
  const key = `${idUser}.${type.split('/')[1]}`
  //const imageUrl = `https://s9mybucket.s3.amazonaws.com/${key}`
  await aws.uploadImage(idUser,imagen,type);

  await User.update({
    image: key,
  }, {
    where: {
      id: idUser
    }
  }).then(user => {
    console.log(user);
    res.redirect('/');
  });

});

router.post('/updateImage/:idUser',upload.single('imagenupdate'), async(req, res, next) =>{
  const { idUser } = req.params
  const imagen = req.file.buffer;
  const type = req.file.mimetype
  const key = `${idUser}.${type.split('/')[1]}`
  const keydelete = req.body.imagendelete;

  await aws.deleteImage(keydelete)

  await aws.uploadImage(idUser,imagen,type);

  await User.update({
    image: key,
  }, {
    where: {
      id: idUser
    }
  }).then(user => {
    console.log(user);
    res.redirect('/');
  });

});

module.exports = router;
