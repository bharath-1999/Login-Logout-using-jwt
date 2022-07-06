
const User=require('../models/users')
const jwt=require('jsonwebtoken')
//handle errors
const handleErrors=(err)=>{
 let errors={email:'',password:''};
 //incorrect email
 if(err.message==='incorrect email'){
   errors.email='that email is not registered';
 }
 if(err.message==='incorrect password'){
   errors.password='that password is not correct';
 }
 //duplication error code
 if(err.code===11000){
   errors.email='the given email already exists';
   return(errors);
 }
 //validation error
 if(err.message.includes('user validation failed:')){
   Object.values(err.errors).forEach(({properties})=>{
     errors[properties.path]=properties.message;
   })


 }
 return(errors);
}
const maxAge=3*24*60*60
const createToken=(id)=>{
  return jwt.sign({id},'net ninja demo secret',{
    expiresIn:maxAge
  });
}
const signup_get=(req,res)=>{
res.render('signup');
//  res.send('new signnup;')
};
const login_get=(req,res)=>{
  res.render('login');

};
const signup_post=async (req,res)=>{

  const {email,password}=req.body;
  try{
        const user=await User.create(req.body);
        const token=createToken(user._id)
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
          console.log("ikkada")
        res.status(201).json({user:user._id});
  }
  catch(err){
    console.log(err);
      const errors=handleErrors(err);
          res.status(400).json({errors});
  }
};
const login_post=async (req,res)=>{
  const {email,password}=req.body;
  try{
  const user=await User.login(email,password);
  const token=createToken(user._id)
  res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
  res.status(200).json({user:user._id});
}
catch(err){
  const errors=handleErrors(err);
      res.status(400).json({errors});
}
};

const logout_get=(req,res)=>{
  res.cookie('jwt','',{maxAge:1});
  res.redirect('/');
  return;
}

module.exports={
  signup_get,
login_get,
signup_post,
login_post,
logout_get
}
