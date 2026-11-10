const usernameInput = document.getElementById("username");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

//Reusable function for fetching API data
function fetchData(url) {
    return fetch(url)
        .then(response => {
            if(response.status === 403) {
                throw new Error("GitHub API rate limit exceeded. Please try again later.");
            }

            if(response.status === 404) {
                throw new Error("GitHub user not found.");
            }

            if(!response.ok) {
                throw new Error("Something went wrong. Please try again.");
            }

            return response.json();
        })
}

analyzeBtn.addEventListener("click", function() {
    const username = usernameInput.value.trim();

    if(username === "") {
        result.textContent = "Please enter a username.";
        return;
    }

    const url = `https://api.github.com/users/${username}`
    const reposUrl = `https://api.github.com/users/${username}/repos`

    if(analyzeBtn.disabled) {
        return;
    }

    // Disable button while analyzing
    analyzeBtn.textContent = "Analyzing..."
    analyzeBtn.disabled = true;

    //Fetch Profile Data
    fetchData(url)
        .then(data => {

            // Fetch repositories
            return fetchData(reposUrl)
                .then(repos => {
                    return {
                        data: data,
                        repos: repos
                    }
                })
        })
        .then(combinedData => {
            const profile = combinedData.data
            const repositories = combinedData.repos

            //Profile
            const ratio = profile.following === 0 ? profile.followers : (profile.followers/profile.following).toFixed(2);

            //Fetch languages used in repositories
            const languagesRequests = repositories.map(repo => {
                const languagesUrl = `https://api.github.com/repos/${profile.login}/${repo.name}/languages`

                return fetchData(languagesUrl)
            })

            let totalBytes = 0;
            let languageHTML = "";

            
            Promise.all(languagesRequests) 
                // Display profile and analysis results
                .then(allLanguages => {
                    const languageTotals = {};
                    

                    for(const languages of allLanguages) {
                        for(const [language, bytes] of Object.entries(languages)) {
                            languageTotals[language] = (languageTotals[language] || 0) + bytes;
                            totalBytes += bytes;
                        }
                    }

                    const sortedLanguages = Object.entries(languageTotals);

                    sortedLanguages.sort((a, b) => b[1] - a[1]);

                    for (const [language, bytes] of sortedLanguages) {
                        const percentage = ((bytes / totalBytes) * 100).toFixed(2);


                        languageHTML += `
                                <div class="language-item">
                                    <div class="language-info">
                                        <span>${language}</span>
                                        <span>${percentage}%</span>
                                    </div>

                                    <div class="language-bar">
                                        <div class="language-progress" style="--progress: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;

                            console.log(languageHTML);
                    }

                    let totalForks = 0
                    let totalStars = 0

                    let mostStarredRepo = null
                    let maxStars = 0

                    for(const repo of repositories) {
                        totalStars += repo.stargazers_count
                        totalForks += repo.forks_count

                        if(repo.stargazers_count > maxStars) {
                            maxStars = repo.stargazers_count
                            mostStarredRepo = repo
                        }

                    }


                    //Display the Profile and Details
                    result.innerHTML = `
                            <div class="profile">
                                <div class="profile-header">
                                    <img src="${profile.avatar_url}" class="avatar">

                                    <div class="profile-info">
                                        <h2>Login: ${profile.login}</h2>
                                        <p>Bio: ${profile.bio || "No Bio is Available"}</p>
                                        <div class="stats">
                                            <h2>Followers: ${profile.followers}</h2>
                                            <h2>Following: ${profile.following}</h2>
                                            <h2>Public Repositories: ${profile.public_repos}</h2>
                                        </div>
                                        
                                        <h2>Follower/Following Ratio: ${ratio}</h2>
                                        <p><a href="${profile.html_url}" target="_blank">View GitHub Profile</a></p>
                                    </div>
                                </div>

                                <div class="analysis">
                                    <h3>GitHub Analysis</h3>
                                    <div class="analysis-stats">
                                        <p>Total Stars: ${totalStars}</p>
                                        <p>Total Forks: ${totalForks}</p>
                                    </div>
                                    <p>Most-Starred Repository: ${mostStarredRepo === null ? "Not Found" : mostStarredRepo.name}</p>
                                    <p>Stars: ${maxStars}</p>

                                    <div class="languages">
                                        <h3>Languages:</h3>
                                        ${languageHTML}
                                    </div>
                                </div>
                            </div>
                        `

                });
        })
        .catch(error => {
            result.textContent = error.message
        })
        .finally(() => {
            analyzeBtn.textContent = "Analyze";
            analyzeBtn.disabled = false; // Re-enable button after analysis
        })
            
})

//Respond to the Enter Key
usernameInput.addEventListener("keydown", function(event) {
    if(event.key === "Enter") {
        analyzeBtn.click();
    }
})

