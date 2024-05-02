const mongoose = require("mongoose");
const { statuses, fund_types } = require("../constants");

const FundingOpportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    funding_manager_email: {
        type: String,
        required: true
    },
    admin_status: {
        type: String,
        enum: [statuses.PENDING, statuses.ACCEPTED, statuses.REJECTED],
        default: statuses.PENDING
    },
    type: {
        type: String,
        enum: [fund_types.EDUCATIONAL, fund_types.BUSINESS, fund_types.EVENT],
        required: true
    },
    funding_opportunity_id: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type
        index: true, // Optional: Add an index for faster lookups
        auto: true // Automatically generate an ObjectId
    },
    // Features to be added later
    funding_amount: {
        type: Number,
        required: true
    },
    available_slots: { //the amount of people who will recieve it. IF budget = R10000, and funding_amount = R1000, then count = 10
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    
    description: {
        type: String,
        default: "Apply for this funding Opportunity now! And start your journey of SUCCESS! You. Can. Do It."
    }
    // status: {
    //     type: String,
    //     enum: [statuses.ACTIVE, statuses.INACTIVE],
    //     default: statuses.ACTIVE
    // },
    
    //funding_amount history will be added later
});

module.exports = mongoose.model("Funding_Opportunity", FundingOpportunitySchema);