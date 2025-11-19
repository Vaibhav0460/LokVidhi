import { Router, Request, Response } from 'express';

const router = Router();

// Define a simple severance logic (simplified for development)
// RULE: 15 days of salary for every completed year of service.
// This is often based on the Industrial Disputes Act, but we simplify it here.
function calculateSeverance(
    state: string, // Future use for state-specific rules
    monthlySalary: number,
    yearsOfService: number
): { amount: number, rule: string } {
    
    // Safety check
    if (monthlySalary <= 0 || yearsOfService < 1) {
        return { amount: 0, rule: "Years of service must be 1 or more, and salary must be positive." };
    }

    // Assumptions for a simplified calculation:
    // 1. Daily rate = Monthly Salary / 26 (Standard industry practice for 15 days calculation)
    // 2. Severance = (Daily Rate * 15 days) * Years of Service
    const dailyRate = monthlySalary / 26;
    const severanceAmount = Math.round(dailyRate * 15 * yearsOfService);

    const rule = `Based on a simplified 15 days' pay per year rule (common in Indian labor law), calculated using a 26-day working month for a total of ${yearsOfService} completed years in ${state}.`;

    return { amount: severanceAmount, rule: rule };
}

// POST /api/calculator/severance
router.post('/severance', (req: Request, res: Response): void => {
    try {
        const { state, monthlySalary, yearsOfService } = req.body;

        // Basic validation
        if (!state || typeof monthlySalary !== 'number' || typeof yearsOfService !== 'number' || monthlySalary < 0 || yearsOfService < 0) {
            res.status(400).json({ error: "Missing or invalid input fields (state, monthlySalary, yearsOfService)." });
            return;
        }

        const result = calculateSeverance(state, monthlySalary, yearsOfService);

        res.json({
            ...result,
            input: { monthlySalary, yearsOfService }
        });

    } catch (err) {
        console.error('Severance Calculator Error:', err);
        res.status(500).json({ error: 'Server failed to calculate severance.' });
    }
});

export default router;