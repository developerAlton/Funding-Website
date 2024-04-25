/**
 * Notes for user creation:
 * 1. User creation requires a name, email and password.
 * 2. The email must be unique.
 * 3. Being a Funding Manager or an Applicant depends on whether a company name was provided
 * 4. If a user wishes to be a funding manager, the front end will force them to provide a company name.
 */

// imports
const User = require("../models/User");
const Applicant = require("../models/Applicant");
const FundingManager = require("../models/FundingManager");
const asyncWrapper = require("../middleware/asyncWrapper");

const registerController = asyncWrapper(async (req, res) => {
    const { name, email, password, company, role } = req.body;

    if (!name || !password || !email) {
        res.status(400).json({ message: "Please ensure you have entered your Name, Email and Password", status: 400 });
        return;
    }

    const duplicateUser = await User.findOne({ email: email }).exec();

    //Check if email is already taken
    if (duplicateUser) {
        res.status(409).json({ message: `The email: '${duplicateUser.email}' is already taken :)`, status: 409 })
        return
    }

    //Role of user depends on existence of company
    if (company) {
        await User.create({
            name: name,
            email: email,
            password: password,
            role: role
        });
        const newUser = await User.findOne({ email: email }).exec();
        await FundingManager.create({
            user: newUser._id,
            name: name,
            email: email,
            company: company
        });
    } else {
        await User.create({
            name: name,
            email: email,
            password: password
        });
        const newUser = await User.findOne({ email: email }).exec();
        await Applicant.create({
            user: newUser._id,
            name: name,
            email: email
        });
    }

    res.status(201).json({ message: `${email} has been successfully registered.`, status: 201 });
});

module.exports = registerController;