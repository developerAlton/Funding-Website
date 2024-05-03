

const requestSection = document.querySelector(".requests")

const loadOpportunities = async (query_params) => {
    requestSection.textContent = ""
    let response
    try {
        response = await axios.get("api/v1/funding-opportunities" + query_params)
    } catch (error) {
        alert("Sorry, couldnt load the funding opportunities")
        console.log(error.message)
        return
    }
    const fundingOpportunities = response.data

    if (fundingOpportunities.length <= 0){
        alert("There are currently no funding opportunities.")
        return
    }

    fundingOpportunities.forEach((fundingOpportunity) => {
        let { title,
            company_name,
            funding_manager_email,
            admin_status,
            type,
            funding_opportunity_id,
            deadline,
            description,
            funding_amount,
            available_slots } = fundingOpportunity

        deadline = deadline.slice(0, deadline.indexOf("T")) // Just get the day, month, year and skip the time

        const requestCard = document.createElement("div")
        requestCard.classList.add("request-card")
        const requestCardInnerHTML = `<div class="card-left">
                    <img src="https://www.topgear.com/sites/default/files/2022/03/TopGear%20-%20Tesla%20Model%20Y%20-%20003.jpg?w=976&h=549" alt="Image">
                </div>
                <div class="card-right">
                    <h3>
                        <span id="title">${title}</span>
                        <span id="expDate">Expiry Date: ${deadline}</span>
                        <span id="compName">Company: ${company_name}</span>
                        <span id="category">Category: ${type}</span>
                    </h3>
                    <p id="amount">Amount: R${funding_amount} [${available_slots} available]</p>
                    <p id="description">Description: ${description} </p>
                    <div class="button-container">
                        <button class="approve-btn">Approve</button>
                        <button class="deny-btn">Deny</button>
                        
                    </div>
                </div>`

        requestCard.innerHTML = requestCardInnerHTML
        requestSection.appendChild(requestCard);


        // APPROVE AND DENY OF CURRENT BUTTONS [still in forEach]
        const approveButton = requestCard.querySelector(".approve-btn")
        const denyButton = requestCard.querySelector(".deny-btn")

        approveButton.addEventListener("click", async (event) => {
            console.log("Approve button clicked")

            try {
                await axios.put(`/api/v1/funding-opportunity/${funding_opportunity_id}`, {
                    admin_status: "Approved"
                })
                requestCard.remove()
            } catch (error) {
                console.log(error.message)
                alert("Sorry, could not approve this funding opportunity. Please try again later.")
            }
        })

        denyButton.addEventListener("click", async (event) => {
            console.log("Deny button clicked")

            try {
                await axios.put(`/api/v1/funding-opportunity/${funding_opportunity_id}`, {
                    admin_status: "Rejected"
                })
                requestCard.remove()
            } catch (error) {
                alert("Sorry, could not reject this funding opportunity. Please try again later.")
                console.log(error.message)
            }
        })

        approveButton.setAttribute("funding_opportunity_id", funding_opportunity_id) //incase needed later

        // requestSection.appendChild(document.createElement("br"))
    }) //END: ForEach
}

const categoryDropDown = document.querySelector("#category-dropdown")
categoryDropDown.addEventListener("input", async (event) => {

    console.log(categoryDropDown.value)

    if (categoryDropDown.value === "All Options") {
        const query_params = `?admin_status=Pending`
        await loadOpportunities(query_params)
        return
    }

    const query_params = `?admin_status=Pending&type=${categoryDropDown.value}`
    await loadOpportunities(query_params)

})

// When page loads:
const query_params = "?admin_status=Pending"
loadOpportunities(query_params)




// const PENDING = "Pending";
// const ACCEPTED = "Accepted";
// const REJECTED = "Rejected";
// const APPROVED = "Approved";