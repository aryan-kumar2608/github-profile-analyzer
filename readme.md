# GitHub Profile Analyzer

A web application that analyzes a GitHub profile and displays profile statistics, repository statistics, and programming language usage.

## Features

- Display GitHub profile information
- Display repository statistics
- Calculate total stars and forks
- Find the most-starred repository
- Analyze programming language usage
- Calculate follower/following ratio
- Loading state during analysis
- Error handling for invalid requests and API limits

## Tech Stack

1. HTML
2. CSS
3. JavaScript
4. GitHub REST API

## How It Works

1. The user enters a GitHub username.
2. The application checks that the username field is not empty.
3. The application sends an API request to GitHub to fetch the user's profile data.
4. GitHub returns the profile data in JSON format.
5. The application fetches the user's repositories and their details, such as stars and forks.
6. The application fetches the programming languages used in each repository.
7. The language data is combined to calculate the usage percentage of each language.
8. The application calculates repository statistics such as total stars, total forks, and the most-starred repository.
9. The results are displayed on the webpage.
10. While the analysis is running, the Analyze button is disabled and shows a loading state.
11. After the analysis is completed, the button is enabled again.

## Project Structure

| File | Description |
|---|---|
| `index.html` | Contains the structure and UI of the webpage. |
| `style.css` | Handles the styling and design of the UI. |
| `script.js` | Contains the application logic, API requests, data processing, and dynamic UI updates. |

## Setup & Installation

1. Clone the repository.
2. Open the project folder in VS Code.
3. Open `index.html` using Live Server, or open the HTML file directly in a browser.
4. Make sure you have an active internet connection so the application can communicate with the GitHub API.

## API Used

This project uses the GitHub REST API to fetch data from GitHub.

The API is used to retrieve:

- GitHub profile information
- Repository details such as stars and forks
- Programming languages used in repositories

## Error Handling

1. User Not Found
2. API Rate Limit Exceeded
3. Empty Username
4. General API/Request Error

## Future Improvements

1. Repository Activity Analysis
2. Contribution Statistics
3. More Detailed Repository Insights
4. Better Visualizations and Charts
5. Improved GitHub API Rate-Limit Handling
6. Improved Mobile Responsiveness
7. Profile-Based Suggestions
8. Profile Rating and Scoring