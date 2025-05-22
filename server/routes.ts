import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertProjectSchema, 
  insertFeatureSchema, 
  insertValidationMethodSchema,
  insertCompetitorSchema,
  insertCompetitiveFeatureSchema,
  insertMilestoneSchema,
  insertKpiSchema,
  insertFlowDiagramSchema,
  insertMvpPlanSchema
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./auth";
import aiRouter from "./routes/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Users endpoints
  app.get("/api/users", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const username = req.user?.username;
      
      // Only admin can see all users
      if (username !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin privileges required."
        });
      }
      
      const users = await storage.getAllUsers();
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users"
      });
    }
  });
  
  // Register AI routes
  app.use('/api/ai', aiRouter);
  // Project routes
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      // For demo, not requiring auth, but in production would filter by user
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      let projects;
      
      if (userId) {
        projects = await storage.getProjectsByUserId(userId);
      } else {
        // Get all projects (for demo purposes only)
        projects = [];
        for (let i = 1; i <= 100; i++) {
          const project = await storage.getProject(i);
          if (project) projects.push(project);
        }
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });

  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project" });
    }
  });

  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating project" });
    }
  });

  app.patch("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating project" });
    }
  });

  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting project" });
    }
  });

  // Feature routes
  app.get("/api/projects/:projectId/features", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const features = await storage.getFeaturesByProjectId(projectId);
      res.json(features);
    } catch (error) {
      res.status(500).json({ message: "Error fetching features" });
    }
  });

  app.post("/api/features", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFeatureSchema.parse(req.body);
      const feature = await storage.createFeature(validatedData);
      res.status(201).json(feature);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid feature data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating feature" });
    }
  });

  app.patch("/api/features/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertFeatureSchema.partial().parse(req.body);
      const feature = await storage.updateFeature(id, validatedData);
      
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      
      res.json(feature);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid feature data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating feature" });
    }
  });

  app.delete("/api/features/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteFeature(id);
      
      if (!success) {
        return res.status(404).json({ message: "Feature not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting feature" });
    }
  });

  // Validation methods routes
  app.get("/api/projects/:projectId/validation-methods", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const methods = await storage.getValidationMethodsByProjectId(projectId);
      res.json(methods);
    } catch (error) {
      res.status(500).json({ message: "Error fetching validation methods" });
    }
  });

  app.post("/api/validation-methods", async (req: Request, res: Response) => {
    try {
      const validatedData = insertValidationMethodSchema.parse(req.body);
      const method = await storage.createValidationMethod(validatedData);
      res.status(201).json(method);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid validation method data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating validation method" });
    }
  });

  app.patch("/api/validation-methods/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertValidationMethodSchema.partial().parse(req.body);
      const method = await storage.updateValidationMethod(id, validatedData);
      
      if (!method) {
        return res.status(404).json({ message: "Validation method not found" });
      }
      
      res.json(method);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid validation method data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating validation method" });
    }
  });

  // Competitor routes
  app.get("/api/projects/:projectId/competitors", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const competitors = await storage.getCompetitorsByProjectId(projectId);
      res.json(competitors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching competitors" });
    }
  });

  app.post("/api/competitors", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCompetitorSchema.parse(req.body);
      const competitor = await storage.createCompetitor(validatedData);
      res.status(201).json(competitor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competitor data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating competitor" });
    }
  });

  app.patch("/api/competitors/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertCompetitorSchema.partial().parse(req.body);
      const competitor = await storage.updateCompetitor(id, validatedData);
      
      if (!competitor) {
        return res.status(404).json({ message: "Competitor not found" });
      }
      
      res.json(competitor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competitor data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating competitor" });
    }
  });

  // Competitive features routes
  app.get("/api/projects/:projectId/competitive-features", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const features = await storage.getCompetitiveFeaturesById(projectId);
      res.json(features);
    } catch (error) {
      res.status(500).json({ message: "Error fetching competitive features" });
    }
  });

  app.post("/api/competitive-features", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCompetitiveFeatureSchema.parse(req.body);
      const feature = await storage.createCompetitiveFeature(validatedData);
      res.status(201).json(feature);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competitive feature data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating competitive feature" });
    }
  });

  app.patch("/api/competitive-features/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertCompetitiveFeatureSchema.partial().parse(req.body);
      const feature = await storage.updateCompetitiveFeature(id, validatedData);
      
      if (!feature) {
        return res.status(404).json({ message: "Competitive feature not found" });
      }
      
      res.json(feature);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid competitive feature data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating competitive feature" });
    }
  });

  // Milestone routes
  app.get("/api/projects/:projectId/milestones", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const milestones = await storage.getMilestonesByProjectId(projectId);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: "Error fetching milestones" });
    }
  });

  app.post("/api/milestones", async (req: Request, res: Response) => {
    try {
      const validatedData = insertMilestoneSchema.parse(req.body);
      const milestone = await storage.createMilestone(validatedData);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid milestone data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating milestone" });
    }
  });

  app.patch("/api/milestones/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertMilestoneSchema.partial().parse(req.body);
      const milestone = await storage.updateMilestone(id, validatedData);
      
      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      
      res.json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid milestone data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating milestone" });
    }
  });

  // KPI routes
  app.get("/api/projects/:projectId/kpis", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const kpis = await storage.getKpisByProjectId(projectId);
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Error fetching KPIs" });
    }
  });

  app.post("/api/kpis", async (req: Request, res: Response) => {
    try {
      const validatedData = insertKpiSchema.parse(req.body);
      const kpi = await storage.createKpi(validatedData);
      res.status(201).json(kpi);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid KPI data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating KPI" });
    }
  });

  app.patch("/api/kpis/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertKpiSchema.partial().parse(req.body);
      const kpi = await storage.updateKpi(id, validatedData);
      
      if (!kpi) {
        return res.status(404).json({ message: "KPI not found" });
      }
      
      res.json(kpi);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid KPI data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating KPI" });
    }
  });

  // Flow diagram routes
  app.get("/api/projects/:projectId/flow-diagrams", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const diagrams = await storage.getFlowDiagramsByProjectId(projectId);
      res.json(diagrams);
    } catch (error) {
      res.status(500).json({ message: "Error fetching flow diagrams" });
    }
  });

  app.post("/api/flow-diagrams", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFlowDiagramSchema.parse(req.body);
      const diagram = await storage.createFlowDiagram(validatedData);
      res.status(201).json(diagram);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid flow diagram data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating flow diagram" });
    }
  });

  app.patch("/api/flow-diagrams/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertFlowDiagramSchema.partial().parse(req.body);
      const diagram = await storage.updateFlowDiagram(id, validatedData);
      
      if (!diagram) {
        return res.status(404).json({ message: "Flow diagram not found" });
      }
      
      res.json(diagram);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid flow diagram data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating flow diagram" });
    }
  });

  // Export generation endpoints
  app.get("/api/projects/:projectId/export/powerpoint", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Generate a simple HTML as a placeholder for PowerPoint
      // In a real app, we would use a library to generate actual PPTX
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${project.name} - MVP Presentation</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #4338ca; }
            h2 { color: #6366f1; margin-top: 30px; }
            p { line-height: 1.5; }
            .slide { margin-bottom: 40px; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="slide">
            <h1>${project.name}</h1>
            <p>MVP Presentation</p>
          </div>
          <div class="slide">
            <h2>Problem Statement</h2>
            <p>${project.problemStatement || 'No problem statement provided.'}</p>
          </div>
          <div class="slide">
            <h2>Solution Overview</h2>
            <p>This MVP aims to address the identified problem with an innovative solution.</p>
          </div>
          <div class="slide">
            <h2>Thank You</h2>
            <p>Questions and feedback are welcome!</p>
          </div>
        </body>
        </html>
      `;
      
      // Set content type and attachment header for download
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/\s+/g, '-')}-MVP-Presentation.html"`);
      
      // Send the actual content for download
      res.send(htmlContent);
    } catch (error) {
      res.status(500).json({ message: "Error generating presentation file" });
    }
  });

  app.get("/api/projects/:projectId/export/readme", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Generate README content based on project data
      const features = await storage.getFeaturesByProjectId(projectId);
      
      // Simplified README generation example
      const readmeContent = `# ${project.name}\n\n` +
        `## Overview\n\n${project.problemStatement || 'No problem statement provided.'}\n\n` +
        `## Features\n\n${features.filter(f => f.includeInMvp).map(f => `- ${f.name}: ${f.description}`).join('\n')}\n\n` +
        `## Installation\n\nInstallation instructions here.\n\n` +
        `## Usage\n\nUsage guidelines here.\n\n` +
        `## License\n\nMIT\n`;
      
      // Set content type and attachment header for download
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="README.md"`);
      
      // Send the actual content for download
      res.send(readmeContent);
    } catch (error) {
      res.status(500).json({ message: "Error generating README file" });
    }
  });

  app.get("/api/projects/:projectId/export/flowdiagram", async (req: Request, res: Response) => {
    try {
      const projectId = Number(req.params.projectId);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const diagrams = await storage.getFlowDiagramsByProjectId(projectId);
      
      if (diagrams.length === 0) {
        // Create a simple placeholder SVG if no diagrams found
        const simpleSvg = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="white"/>
          <text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="#666">
            ${project.name} - Flow Diagram
          </text>
          <text x="400" y="340" font-family="Arial" font-size="16" text-anchor="middle" fill="#999">
            No diagram data available
          </text>
        </svg>
        `;
        
        // Set content type and attachment header for download
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/\s+/g, '-')}-Flow-Diagram.svg"`);
        
        // Send the SVG
        return res.send(simpleSvg);
      }
      
      // If we have diagram data, use it to create an SVG
      const diagramData = diagrams[0].data;
      
      // Create a simple SVG from the diagram data
      // In a real app, this would be more sophisticated
      const svgContent = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <text x="400" y="50" font-family="Arial" font-size="24" text-anchor="middle" fill="#444">
          ${project.name} - Flow Diagram
        </text>
        <g transform="translate(100, 100)">
          ${typeof diagramData === 'string' ? diagramData : JSON.stringify(diagramData)}
        </g>
      </svg>
      `;
      
      // Set content type and attachment header for download
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/\s+/g, '-')}-Flow-Diagram.svg"`);
      
      // Send the SVG
      res.send(svgContent);
    } catch (error) {
      res.status(500).json({ message: "Error exporting flow diagram" });
    }
  });

  // MVP Plans endpoints
  app.get("/api/mvp-plans", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Get plans for the logged-in user
      // Since isAuthenticated middleware ensures req.user exists,
      // we can safely check for it, but add a fallback just in case
      const userId = req.user?.id;
      const username = req.user?.username;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      let plans = await storage.getAllMvpPlans();
      
      // If admin, show all plans
      // Otherwise filter plans by userId
      if (username !== 'admin') {
        plans = plans.filter(plan => plan.userId === userId);
      }
      
      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      console.error("Error fetching MVP plans:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch MVP plans"
      });
    }
  });
  
  app.get("/api/mvp-plans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getMvpPlan(id);
      
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "MVP plan not found"
        });
      }
      
      res.json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error("Error fetching MVP plan:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch MVP plan"
      });
    }
  });
  
  app.post("/api/mvp-plans", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Since isAuthenticated middleware ensures req.user exists,
      // we can safely check for it, but add a fallback just in case
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }
      
      const validatedData = insertMvpPlanSchema.parse({
        ...req.body,
        userId: userId // Associate the plan with the logged-in user
      });
      
      const plan = await storage.createMvpPlan(validatedData);
      
      res.status(201).json({
        success: true,
        data: plan
      });
    } catch (error) {
      console.error("Error creating MVP plan:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid MVP plan data", 
          errors: error.errors 
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to create MVP plan"
      });
    }
  });
  
  // DELETE endpoint for MVP plans
  app.delete("/api/mvp-plans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMvpPlan(id);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: "MVP plan deleted successfully"
        });
      } else {
        res.status(404).json({
          success: false,
          message: "MVP plan not found"
        });
      }
    } catch (error) {
      console.error("Error deleting MVP plan:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete MVP plan"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
