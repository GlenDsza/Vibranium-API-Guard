import pkg from '@stoplight/spectral-core';
const { Spectral, isOpenApiv2, isOpenApiv3 } = pkg; // Destructure the imports from the package
import { oas } from '@stoplight/spectral-rulesets'; // OpenAPI ruleset

// Define the lint function as an Express route handler
export const lint = async (req, res) => {
    try {
        const { spec } = req.body;

        // Create a new Spectral instance
        const spectral = new Spectral();

        // Register formats (OpenAPI v2 and v3)
        // spectral.registerFormat('oas2', isOpenApiv2);
        // spectral.registerFormat('oas3', isOpenApiv3);

        // Load OpenAPI ruleset (or use custom rules if provided)
        await spectral.setRuleset(oas); // Can replace `oas` with `schema` if you have custom rules

        // Run Spectral on the provided spec
        const results = await spectral.run(spec);
        
        // check if there are any errors
        if (results.length === 0) {
            res.status(200).json({ message: 'No errors found' });
            return;
        } else {
            // Return the linting results
            res.status(400).json(results);
            return
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
