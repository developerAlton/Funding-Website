
const checkStatusButton = document.getElementById("checkStatusBtn");

const requestSection = document.querySelector(".requests")

const loadOpportunities = async (query_params) => {
    requestSection.textContent = "" // Clear it

    let response
    try {
        response = await axios.get("api/v1/funding-opportunities" + query_params)
    } catch (error) {
        alert("Sorry, couldnt load the funding opportunities")
        console.log(error.message)
        return
    }
    const fundingOpportunities = response.data

    if (fundingOpportunities.length <= 0) {
        alert("There are currently no funding opportunities :(")
        return
    }

    fundingOpportunities.forEach(async (fundingOpportunity) => {
        let { title,
            company_name,
            funding_manager_email,
            admin_status,
            type,
            _id,
            deadline,
            description,
            funding_amount,
            available_slots, image_data } = fundingOpportunity

        deadline = deadline.slice(0, deadline.indexOf("T")) // Just get the day, month, year and skip the time

        // Check if application already exists
        let response
        let applications = []
        let applyButtonMessage = "Apply";

        try {
            response = await axios.get(`api/v1/application?funding_opportunity_id=${_id}&applicant_email=${userEmail}`)
            applications = response.data
            if (applications.length > 0) {
                applyButtonMessage = "Already Applied ✔"
            } else {
                applyButtonMessage = "Apply"
            }
        } catch (error) {
        }


        const requestCard = document.createElement("div")
        requestCard.classList.add("request-card")
        const requestCardInnerHTML = `<div class="card-left">
                    <img class="ad-image" src="https://www.topgear.com/sites/default/files/2022/03/TopGear%20-%20Tesla%20Model%20Y%20-%20003.jpg?w=976&h=549" alt="Image">
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
                    <button class="apply-btn">${applyButtonMessage}</button>
                </div>`

        requestCard.innerHTML = requestCardInnerHTML

        // Disable apply button if already applied
        if (applications.length > 0) {
            requestCard.querySelector(".apply-btn").disabled = true;
        }

        let adImage = requestCard.querySelector(".ad-image");
        if (!image_data) {
            adImage.src = "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg";

            // adImage.src = "https://www.topgear.com/sites/default/files/2022/03/TopGear%20-%20Tesla%20Model%20Y%20-%20003.jpg?w=976&h=549"
        } else {
            adImage.src = image_data

        }

        requestSection.appendChild(requestCard);


        // APPLY FOR CURRENT BUTTON [still in forEach]
        const applyButton = requestCard.querySelector(".apply-btn")


        applyButton.setAttribute("funding_opportunity_id", _id) //incase needed later

        applyButton.addEventListener("click", async (event) => {
            // Add logic here... 

            document.cookie = `funding_opportunity_id=${applyButton.getAttribute("funding_opportunity_id")}; path=/`;
            window.location.href = "Applicant-Pages/AppPage_Apply.html";
        })


        // requestSection.appendChild(document.createElement("br"))
    }) //END: ForEach

}

const categoryDropDown = document.querySelector("#category-dropdown")
categoryDropDown.addEventListener("input", async (event) => {

    console.log(categoryDropDown.value)

    if (categoryDropDown.value === "All Options") {
        const query_params = `?admin_status=Approved`
        await loadOpportunities(query_params)
        return
    }

    const query_params = `?admin_status=Approved&type=${categoryDropDown.value}`
    await loadOpportunities(query_params)

})

// When page loads:
const query_params = `?admin_status=Approved`
loadOpportunities(query_params)

const cookies = document.cookie; // Get all cookies as a single string
const cookieArray = cookies.split('; '); // Split into an array of individual cookies
let userName;
let userEmail;
for (const cookie of cookieArray) {
    const [name, value] = cookie.split('=');
    console.log(value)
    if (name === 'name') {
        userName = value
    }
    if (name === 'email') {
        userEmail = value
    }
}

document.querySelector(".welcome-h2").textContent = `Welcome, ${userName} :)`


// CHECKING STATUS BUTTON
let applications;
let fundingOpportunities;
const getApplications = async () => {
    try {
        let response = await axios.get(`api/v1/applications?applicant_email=${userEmail}`);
        applications = response.data;
        response = await axios.get(`api/v1/funding-opportunities`);
        fundingOpportunities = response.data;
    } catch (error) {
        alert("Could not get your applications statuses, please try again later.");
        return;
    }
}
getApplications();

checkStatusButton.addEventListener("click", event => {

    if (applications.length <= 0) {
        alert("You have no applications at the moment.");
        return;
    }

    let status = "Statuses for your applications: \n";

    applications.forEach(application => {
        let fundingOpportunity = fundingOpportunities.find(funding => {
            return funding._id == application.funding_opportunity_id;
        })
        fundingOpportunity = fundingOpportunity;
        status += fundingOpportunity.title + ": " + application.status + "  \n";
    })

    alert(status);

})

