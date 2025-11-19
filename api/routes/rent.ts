import { Router, Request, Response } from 'express';

const router = Router();

// Define simplified, state-specific rules for rent deposits and notice periods
const RENT_RULES: { [key: string]: { depositCap: number, noticePeriod: number, law: string } } = {
    'DELHI': { depositCap: 2, noticePeriod: 30, law: "Delhi Rent Control Act / Tenancy Act" },
    'KARNATAKA': { depositCap: 6, noticePeriod: 60, law: "Karnataka Rent Act / Model Tenancy Act principles" },
    'MAHARASHTRA': { depositCap: 3, noticePeriod: 30, law: "Maharashtra Rent Control Act" },
    'OTHER': { depositCap: 3, noticePeriod: 30, law: "Standard contract law principles" } // Default fallback
};

// POST /api/calculator/rent/deposit
router.post('/deposit', (req: Request, res: Response): void => {
    try {
        const { state, monthlyRent, initialDepositMonths } = req.body;

        // Basic validation and sanitation
        const cleanState = (state || 'OTHER').toUpperCase();
        const rent = parseFloat(monthlyRent);
        const depositMonths = parseInt(initialDepositMonths, 10);

        if (isNaN(rent) || rent <= 0 || isNaN(depositMonths) || depositMonths < 0) {
            res.status(400).json({ error: "Invalid rent or deposit figures." });
            return;
        }

        const rules = RENT_RULES[cleanState] || RENT_RULES['OTHER'];
        
        // --- CALCULATION ---
        const totalDeposit = rent * depositMonths;

        let liability = {
            totalDeposit: totalDeposit,
            refundLiability: totalDeposit, // Simple assumption for now: tenant gets full deposit back
            isDepositLegal: depositMonths <= rules.depositCap,
            noticePeriodDays: rules.noticePeriod
        };
        
        // --- RESPONSE ---
        res.json({
            ...liability,
            // --- FIX: Return the input parameter ---
            initialDepositMonths: depositMonths, 
            // ------------------------------------
            state: cleanState,
            legalRule: rules.law,
            depositCap: rules.depositCap,
            message: `Your total deposit was ₹${totalDeposit.toLocaleString()}. The legal cap in ${cleanState} is ${rules.depositCap} months' rent. The minimum notice period for eviction/vacation is ${rules.noticePeriod} days.`
        });

    } catch (err) {
        console.error('Rent Calculator Error:', err);
        res.status(500).json({ error: 'Server failed to calculate rent details.' });
    }
});

export default router;