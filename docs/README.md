# Creator Match - Write-up

## Getting Started

1. The `/frontend` directory contains a Vue.js Vite application
2. The `/backend` directory contains a Node.js Express server
3. The `/data` directory contains sample creator data

### Running the Frontend

```
cd frontend
npm install
npm run dev
```

### Running the Backend

```
cd backend
npm install
npm start
```

### Using the program

Navigate to the "Campaign Settings" tab in the sidebar and select your compaign settings. Once you click "Update Match Scores," the creator cards should update with a nice visual representation of creators in the database and their compatibility with your campaign. Click on any creator to view in more detail.

Navigate to "Filters" in the side bar and select any filters you want to search with. Click "Apply Filters" or "Reset" to revert to no filters.

When in a narrow viewport, the sidebar will collapse onto the right side. Click "Filters" to see both the filters and campaign settings.

Adjust the sorting parameters by toggling the options in the top right of the screen.

## My approach

### Introduction

This project involves developing a creator matching platform with dynamic scoring based on campaign objectives. The goal was to design a flexible system where marketers can efficiently find influencers based on platform suitability, budget, engagement, and other campaign factors. Some major challenges I faced included learning Vue for the first time and managing time constraints due to exams, leading to some unresolved bugs.

### Frontend Implementation

**State Management:** Filters and campaign settings were handled through Vue's reactive data system. I used props and events for clean data flow between components, ensuring the UI remained responsive to user input.

**UX Decisions:** I focused on an intuitive layout for creators and filter settings. The interface allows users to easily view and apply filters, though some UI adjustments remain due to time constraints.

**UI Implementation:** TailwindCSS was used for styling, with the component structure imitating VueShadCN components. There is a responsive design across screen sizes. The sidebar collapses when the window size is narrow, suitable for mobile devices. It can be accessed with a button when it is in this state. When clicking on a creator card, a more detailed creator overview window pops up. This allows marketers to have both a summarized view of creators, as well as analyze them more in depth. The UI was structured to display creators and filters clearly, although some adjustments, like the narrow viewport filter sidebar and match score in the detailed creator popups, remain unresolved.

### Backend Implementation

**API Design:** The API was structured with RESTful endpoints. Filters were implemented in the /api/creators/filter endpoint, supporting various query parameters. Proper error handling was incorporated to manage invalid requests.

**Match Algorithm:** The match score was calculated based on multiple factors, including budget, content relevance, audience fit, and platform suitability. I incorporated dynamic platform weighting based on campaign objectives, such as higher weight for TikTok in brand awareness campaigns.

### Problem Solving

**Testing and Validation:** Unit Testing and Integration Testing: Basic unit testing was implemented to ensure core functions worked as expected. Full integration testing was limited due to time constraints.

**Manual Testing:** Manual testing was conducted to verify filter functionality and match score calculations, though some bugs, like the narrow viewport issue, weren't resolved in time.

### Challenges and Trade-offs

A major challenge was learning Vue for the first time while balancing a busy exam schedule. This caused significant time constraints, resulting in some bugs remaining unresolved, such as issues with the narrow viewport filter sidebar and parts of the match algorithm. The trade-off was prioritizing core functionality and the ability to dynamically adjust match scores for different campaign types over bug fixes and UI polishing.

I also had quite a learning curve trying to install actualy Vue ShadCN component libraries which took a lot of time, until I realized that wasn't necessary and I just needed to implement them using TailwindCSS in an efficient way. I definitely learned some new terminology and best practices along the way that I won't forget.

### Future Improvements

**Include Tags at the Top of the Screen Listing Active Filter/Campaign Settings:** To enhance user experience, I would add tags that display the active filter and campaign settings at the top of the screen. This will give marketers a clear, real-time summary of the criteria they’re using, helping them easily track their search parameters and make adjustments if needed.

**Add Creator Profile Photos and Platform Icons:** To improve the visual appeal and usability, I would integrate profile photos for creators and platform icons to make it easier for marketers to quickly identify creators by platform. This will enhance the user experience and streamline the selection process.

**Resolve Bugs in Algorithm and Sidebar and Creator Detail:** I would focus on fixing existing bugs such as the narrow viewport issue with the filter sidebar and ensure that the creator detail view works seamlessly. Additionally, the match algorithm would be fine-tuned to handle edge cases and improve accuracy.

**Make Campaign Settings Even More Customizable:** I would extend the campaign settings to allow marketers to specify the importance of certain characteristics (e.g., budget, engagement, content relevance) for their campaign. The algorithm will then adjust dynamically to weight these factors according to the marketer’s priorities, offering more flexibility in the search process.

**Make More Scalable in Case Creator Database Grows Exponentially:** To ensure the platform remains efficient as the creator database grows, I would work on optimizing the backend and algorithm. This could involve implementing more efficient data structures, utilizing caching, or considering pagination and batch processing for filtering and match score calculations to maintain performance.

### Conclusion

This project provided valuable experience in developing a dynamic and responsive matching system for influencer campaigns. Despite time constraints, I was able to create a cohesive UI and implement the core algorithm, ensuring flexibility across different campaign types. The project highlighted the importance of adaptability in both frontend and backend design, and I look forward to refining it further. This coding challenge was largely a learning experience for me, and I am confident that in my next Vue project, I will be much quicker resolving similar issues I had this time around, but I also look forward to facing many more bugs and opportunities for creative solutions.
