# Creator Match Score Algorithm

## Overview

The match score algorithm is a critical component of this project. The backend already has an implementation that calculates a percentage (0-100%) indicating how well a creator matches the current campaign settings. Your task is to analyze this algorithm and suggest improvements.

## Current Implementation

The existing algorithm considers the following factors:

1. **Budget Fit**
   - How well does the creator's hourly rate fit within the campaign's budget range?
   - Creators outside the budget range should receive lower scores
   - Creators inside the range should be scored based on where they fall in the range

2. **Content Relevance**
   - How well do the creator's content categories match the campaign's target genres?
   - More overlap = better score
   - Prioritize exact matches

3. **Audience Demographics**
   - Consider the creator's audience age and gender distribution
   - Implement demographic targeting (this is intentionally vague - you decide how to implement!)

4. **Engagement Quality**
   - Balance follower count with engagement rate
   - A smaller creator with higher engagement might be more valuable than a larger creator with lower engagement

5. **Previous Performance**
   - Take into account the creator's previous campaign performance score

## Enhancement Opportunities

You can enhance the existing algorithm in the following ways:

1. Adjust weights based on campaign objective (brand awareness might value reach more, while conversions might value engagement more)
2. Consider platform-specific strengths (TikTok may be better for certain demographics)
3. Implement dynamic weighting based on campaign requirements
4. Add relevance decay for creators who have been used for too many campaigns recently
5. Consider cross-regional effectiveness for global campaigns

## Evaluation Guidelines

Your algorithm improvements will be evaluated based on:

1. Your understanding of the existing implementation
2. The creativity and reasoning behind your enhancements
3. How well you adapt the algorithm for different campaign objectives
4. Your explanation of the tradeoffs in your design decisions

## Evaluation Criteria

Your algorithm implementation will be evaluated based on:

1. Correctness of implementation
2. Code clarity and quality
3. Handling of edge cases
4. Creative approach to balancing different factors
5. Performance and efficiency