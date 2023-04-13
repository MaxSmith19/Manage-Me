const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {decodeJWT, generateToken} = require("../middleware/authMiddleware")
const Social = require("../models/socialMediaModel")
const crypto = require("crypto")
const axios = require("axios")

const etsyRedirectUrl= "http://localhost:5000/api/Socials/etsyCallback"
const base64URLEncode = (str) =>
    str
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

const etsyCallback = asyncHandler(async(req, res) => {
    const code = req.query.code;
    const verifier = req.cookies.code_verifier;
    console.log(req.cookies)
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    
    const config = {
        method: "post",
        url: tokenUrl,
        data: `grant_type=authorization_code
        &client_id=uapiuzi36a2v2pdub362s2sn
        &redirect_uri=${etsyRedirectUrl}
        &code=${code}
        &code_verifier=${verifier}`,
        //Very different to the rest of the programs data requests, but axios broke unless this call
        //was written this way.
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };      
      
    axios.request(config)
    .then((response) => {

        const tokenData = response.data;
        const data=writeToSocials(tokenData,req.cookies.token)
        console.log(data)
        res.redirect("http://localhost:3000/marketing")
    })
    .catch((error) => {
        res.send(error.message)
    })
    })

const writeToSocials = asyncHandler(async(tokenData,userToken)=>{
    const userID = jwt.verify(userToken, process.env.JWT_SECRET)
    const socialsToChange = await Social.findOne({userID:userID.id})
    let social = ""
    if(socialsToChange===null){
        social = await Social.create(
            {userID:userID.id,
            etsyAccessToken: tokenData.access_token,
            etsyRefreshToken: tokenData.refresh_token});
    }else{
        social = await Social.findByIdAndUpdate(socialsToChange,
            {etsyAccessToken: tokenData.access_token,
            etsyRefreshToken: tokenData.refresh_token});
    }
    return socialsToChange;
})
const generatePKCE = asyncHandler(async (req, res) =>{

    const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest();
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const state = Math.random().toString(36).substring(7);
    res.status(200).json({state: state, challenge:codeChallenge,verifier: codeVerifier});

})

const getSocials = asyncHandler(async (req, res) => {
    const token=decodeJWT(req,res)

    const Socials = await Social.findOne({userID: token.id})
    res.status(200).json(Socials)
  })
const registerSocials = asyncHandler(async (req, res) => {
    const token = decodeJWT(req,res)
    const Socials = await Social.create({
        userID: token.id,
        etsyOAUTH: req.params.eOAuth
    })
    res.status(200).json(Socials)
})
const updateSocials = asyncHandler(async (req, res) => {
    const token = decodeJWT(req, res)
    const Socials = await Social.updateOne()

})
module.exports ={
    getSocials,
    generatePKCE,
    etsyCallback,
    registerSocials
}