/**
 * @module getControllers/getFundingController
 * 
 */
const { asyncWrapper } = require("../../middleware");
const { FundingOpportunity } = require("../../models");

/**
 * Retrieves funding opportunities based on the provided query parameters.
 * @function getFundingController
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
const getFundingController = asyncWrapper(async (req, res) => {

    let fundingOpportunities = await FundingOpportunity.find({});

    const query = req.query; // when browser url is ...?property=value&property2=value

    console.log(query);

    if (Object.values(query).length <= 0) {
        res.status(200).json(fundingOpportunities);
        return;
    }

    for (let key in query) {
        fundingOpportunities = fundingOpportunities.filter((fundingOpportunity) => {

            if (fundingOpportunity.available_slots <= 0) {
                return
            }

            if (key.includes(".")) {
                const keys = key.split(".");
                console.log(keys);

                if (fundingOpportunity[keys[0]][keys[1]]?.toString() == query[key]) {
                    return fundingOpportunity;
                }
            }
            if (fundingOpportunity[key]?.toString() === query[key]) {
                return fundingOpportunity;
            }
        });
    }

    res.status(200).json(fundingOpportunities);
});

module.exports = getFundingController;