/**
 * Request Access Endpoint
 * 
 * Handles form submissions from /request-access.html
 * Stores submissions in a JSON file for lead collection
 * 
 * Add this to your Express API server:
 * 
 * import { setupRequestAccessEndpoint } from './api-request-access-endpoint';
 * setupRequestAccessEndpoint(app);
 */

import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

const SUBMISSIONS_FILE = path.join(process.cwd(), 'data', 'request-access-submissions.json');

// Ensure data directory exists
function ensureDataDirectory() {
    const dataDir = path.dirname(SUBMISSIONS_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
    }
}

// Load existing submissions
function loadSubmissions(): any[] {
    try {
        ensureDataDirectory();
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Save submissions
function saveSubmissions(submissions: any[]) {
    ensureDataDirectory();
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

// Setup endpoint
export function setupRequestAccessEndpoint(app: Express) {
    // POST /api/request-access
    app.post('/api/request-access', async (req, res) => {
        try {
            const { company, role, useCase, region, email, telegram, source } = req.body;

            // Validate required fields
            if (!company || !role || !useCase || !email) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: company, role, useCase, email'
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid email format'
                });
            }

            // Create submission object
            const submission = {
                id: Date.now().toString(),
                company,
                role,
                useCase,
                region: region || null,
                email,
                telegram: telegram || null,
                source: source || null,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            // Load existing submissions
            const submissions = loadSubmissions();

            // Check for duplicate email (optional - you might want to allow multiple submissions)
            // const existing = submissions.find(s => s.email === email);
            // if (existing) {
            //     return res.status(400).json({
            //         success: false,
            //         error: 'Email already registered'
            //     });
            // }

            // Add new submission
            submissions.push(submission);

            // Save to file
            saveSubmissions(submissions);

            // Log submission (optional)
            console.log(`[Request Access] New submission from ${email} (${company})`);

            // Return success
            res.json({
                success: true,
                message: 'Request submitted successfully',
                id: submission.id
            });

        } catch (error: any) {
            console.error('[Request Access] Error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    });

    // GET /api/request-access (optional - for admin viewing)
    app.get('/api/request-access', (req, res) => {
        try {
            const submissions = loadSubmissions();
            res.json({
                success: true,
                count: submissions.length,
                submissions: submissions
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    });

    console.log('✅ Request Access endpoint configured at /api/request-access');
}
