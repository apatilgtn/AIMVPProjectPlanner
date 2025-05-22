import { Router, Request, Response } from 'express';
import { 
  generateMvpPlan, 
  generateFeatureIdeas, 
  generateMilestones, 
  generateKpis,
  generateFlowDiagram
} from '../services/anthropic';

const aiRouter = Router();

// Generate MVP Plan
aiRouter.post('/generate-plan', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits,
      additionalNotes,
      features,
      competitors
    } = req.body;

    // Validate required fields
    if (!projectName || !industry || !targetAudience || !problemStatement || !keyBenefits) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await generateMvpPlan({
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits,
      additionalNotes,
      features,
      competitors
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in generate-plan route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Generate Features
aiRouter.post('/generate-features', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits,
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!projectName || !industry || !targetAudience || !problemStatement || !keyBenefits) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await generateFeatureIdeas({
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits,
      additionalNotes
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in generate-features route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Generate Milestones
aiRouter.post('/generate-milestones', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits,
      additionalNotes,
      features
    } = req.body;

    // Validate required fields
    if (!projectName || !industry || !problemStatement) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await generateMilestones({
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits: keyBenefits || [],
      additionalNotes,
      features
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in generate-milestones route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Generate KPIs
aiRouter.post('/generate-kpis', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits,
      additionalNotes
    } = req.body;

    // Validate required fields
    if (!projectName || !industry || !targetAudience || !problemStatement) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await generateKpis({
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits: keyBenefits || [],
      additionalNotes
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in generate-kpis route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// Generate Flow Diagrams
aiRouter.post('/generate-diagrams', async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits,
      additionalNotes,
      features
    } = req.body;

    // Validate required fields
    if (!projectName || !industry || !problemStatement) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await generateFlowDiagram({
      projectName,
      industry,
      targetAudience,
      problemStatement,
      keyBenefits: keyBenefits || [],
      additionalNotes,
      features
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in generate-diagrams route:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default aiRouter;