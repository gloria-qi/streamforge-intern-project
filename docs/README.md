# Creator Match - Take-Home Project

## Overview

This take-home project asks you to build a "Creator Match" dashboard - a tool that helps brands find suitable gaming influencers for their marketing campaigns across platforms like Twitch, YouTube, and TikTok.

The project should take approximately 1-2 hours to complete and tests your ability to work with:
- Vue.js frontend development with Tailwind CSS
- Node.js backend API implementation
- Data filtering and processing algorithms
- UI/UX decision making

## Project Requirements

### Core Features

1. **Creator Filtering Interface:**
   - Design and implement a filtering sidebar from scratch
   - Allow filtering creators by platform (Twitch, YouTube, TikTok)
   - Filter by follower count range
   - Filter by content categories (FPS, MOBA, RPG, etc.)
   - Sort by match score or follower count
   - Implement additional filters (regions, verified status, etc.)

2. **Campaign Configuration:**
   - Use the existing campaign settings form
   - Connect the settings to the backend API for match score calculations
   - Ensure the UI reflects changes in match scores when settings are updated

3. **Creator Match Algorithm:**
   - Analyze the existing algorithm implementation
   - Suggest and implement improvements to the algorithm
   - Optimize for different campaign objectives

4. **Creator Card Design:**
   - Design and implement the creator card component from scratch
   - Display critical information that would matter to marketers
   - Create a visually appealing and informative layout
   - Show the calculated match score prominently

5. **Future Improvements:**
   - In your submission, include a section describing what you would add or improve given more time
   - Consider features, UX improvements, or technical enhancements

## Technical Requirements

### Frontend
- Use the provided Vue.js skeleton with Vite
- TailwindCSS is pre-configured
- Design and implement the filter sidebar component from scratch
- Design and implement the creator card component from scratch
- Keep the UI responsive and user-friendly
- Implement proper state management for filters and campaign settings

### Backend
- The backend API endpoints are already implemented
- Review and understand the match score algorithm implementation
- Suggest improvements to the algorithm based on different campaign types

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

## Evaluation Criteria

Your submission will be evaluated based on:

1. **Code Quality**
   - Clean, readable, and well-organized code
   - Proper component structure and reusability
   - Effective use of Vue.js and Node.js patterns

2. **Functionality**
   - Correct implementation of the match score algorithm
   - Working filters and sorting
   - Proper frontend-backend integration

3. **UI/UX**
   - Intuitive interface
   - Responsive design
   - Quality of your creator card design
   - Thoughtful component layouts

4. **Creativity**
   - Novel approaches to UI challenges
   - Quality of your future improvements suggestions
   - Extensions beyond the base requirements

## Submission

Please submit via email:
1. Your complete codebase (excluding node_modules)
2. A brief write-up (< 1 page) explaining your approach and any decisions/tradeoffs you made
3. A section on potential future improvements you would make to the project
4. Instructions for running your solution if different from what's provided

Good luck!