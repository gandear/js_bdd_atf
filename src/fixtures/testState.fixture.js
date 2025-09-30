// src/fixtures/testState.fixture.js

export const testStateFixtures = {
    // Scenario Context definition
    testState: async ({}, use) => {
        // The 'state' object is isolated for each test
        const state = { 
            // API Data
            res: null,       // Stores the last Response object
            json: null,      // Stores the last JSON body of the response
            error: null,     // Stores the API error
            authToken: null, // Stores the session token

            // Shared Data (UI/API)
            currentUser: null,  // Object for the generated user
            currentURL: null,   // Current URL (if needed)

            // Other data (e.g., UI messages, resource IDs)
            message: null,
            resourceId: null
        };
        await use(state);
    },
};