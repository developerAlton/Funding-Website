const asyncWrapper = require("../middleware/asyncWrapper");

const {
    PLATFORM_ADMIN,
    FUNDING_MANAGER,
    APPLICANT
} = require("../constants/roles")

const Applicant = require("../models/Applicant")
const FundingManager = require("../models/FundingManager")
const User = require("../models/User");

const updateApplicant = asyncWrapper(async (req, res) => {

    const { email } = req.params

    if (!email) {
        res.status(400).json({ message: "Please include email in url. e.g: api/v1/applicant/example@gmail.com", status: 400 })
        return
    }

    if (Object.keys(req.body).length <= 0) {
        res.status(400).json({ message: "Please include a body of the properties you want to modify", status: 400 })
        return
    }

    const applicant = await Applicant.findOne({ email })

    //prevent overiding of account_details object
    let newAccountDetails
    if (req.body.account_details) {
        newAccountDetails = { ...applicant.account_details, ...req.body.account_details }
    }

    if (newAccountDetails) {
        req.body.account_details = newAccountDetails
    }

    await Applicant.updateOne({ email }, req.body)
    await User.updateOne({ email }, req.body)

    res.status(200).json({ message: "successfully updated", success: true, data: req.body });

})

const updateFundingManager = asyncWrapper(async (req, res) => {

    const { email } = req.params

    if (!email) {
        res.status(400).json({ message: "Please include email in url. e.g: api/v1/funding-manager/example@gmail.com", status: 400 })
        return
    }

    if (Object.keys(req.body).length <= 0) {
        res.status(400).json({ message: "Please include a body of the properties you want to modify", status: 400 })
        return
    }

    const fundingManger = await FundingManager.findOne({ email })

    //prevent overiding of account_details object
    let newAccountDetails
    if (req.body.account_details) {
        newAccountDetails = { ...fundingManger.account_details, ...req.body.account_details }
    }
    if (newAccountDetails) {
        req.body.account_details = newAccountDetails
    }

    await FundingManager.updateOne({ email }, req.body)
    await User.updateOne({ email }, req.body) // if the property doesnt axist in User, it wont add it

    res.status(200).json({ message: "successfully updated", success: true, data: req.body });

})
module.exports = { updateApplicant, updateFundingManager }