import {
  type User,
  type InsertUser,
  type Feature,
  type InsertFeature,
  type ValidationMethod,
  type InsertValidationMethod,
  type Competitor,
  type InsertCompetitor,
  type CompetitiveFeature,
  type InsertCompetitiveFeature,
  type Milestone,
  type InsertMilestone,
  type Kpi,
  type InsertKpi,
  type FlowDiagram,
  type InsertFlowDiagram,
  type Project,
  type InsertProject,
  type MvpPlan,
  type InsertMvpPlan,
  users,
  projects,
  features,
  validationMethods,
  competitors,
  competitiveFeatures,
  milestones,
  kpis,
  flowDiagrams,
  mvpPlans
} from "@shared/schema";
import { eq, like } from 'drizzle-orm';
import { db } from './db';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Feature methods
  getFeaturesByProjectId(projectId: number): Promise<Feature[]>;
  createFeature(feature: InsertFeature): Promise<Feature>;
  updateFeature(id: number, feature: Partial<Feature>): Promise<Feature | undefined>;
  deleteFeature(id: number): Promise<boolean>;

  // Validation methods
  getValidationMethodsByProjectId(projectId: number): Promise<ValidationMethod[]>;
  createValidationMethod(method: InsertValidationMethod): Promise<ValidationMethod>;
  updateValidationMethod(id: number, method: Partial<ValidationMethod>): Promise<ValidationMethod | undefined>;
  deleteValidationMethod(id: number): Promise<boolean>;

  // Competitor methods
  getCompetitorsByProjectId(projectId: number): Promise<Competitor[]>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  updateCompetitor(id: number, competitor: Partial<Competitor>): Promise<Competitor | undefined>;
  deleteCompetitor(id: number): Promise<boolean>;

  // Competitive feature methods
  getCompetitiveFeaturesById(projectId: number): Promise<CompetitiveFeature[]>;
  createCompetitiveFeature(feature: InsertCompetitiveFeature): Promise<CompetitiveFeature>;
  updateCompetitiveFeature(id: number, feature: Partial<CompetitiveFeature>): Promise<CompetitiveFeature | undefined>;
  deleteCompetitiveFeature(id: number): Promise<boolean>;

  // Milestone methods
  getMilestonesByProjectId(projectId: number): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: number, milestone: Partial<Milestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: number): Promise<boolean>;

  // KPI methods
  getKpisByProjectId(projectId: number): Promise<Kpi[]>;
  createKpi(kpi: InsertKpi): Promise<Kpi>;
  updateKpi(id: number, kpi: Partial<Kpi>): Promise<Kpi | undefined>;
  deleteKpi(id: number): Promise<boolean>;

  // Flow diagram methods
  getFlowDiagramsByProjectId(projectId: number): Promise<FlowDiagram[]>;
  createFlowDiagram(diagram: InsertFlowDiagram): Promise<FlowDiagram>;
  updateFlowDiagram(id: number, diagram: Partial<FlowDiagram>): Promise<FlowDiagram | undefined>;
  deleteFlowDiagram(id: number): Promise<boolean>;
  
  // MVP Plan methods
  getMvpPlan(id: number): Promise<MvpPlan | undefined>;
  getMvpPlansByName(name: string): Promise<MvpPlan[]>;
  getAllMvpPlans(): Promise<MvpPlan[]>;
  createMvpPlan(plan: InsertMvpPlan): Promise<MvpPlan>;
  updateMvpPlan(id: number, plan: Partial<MvpPlan>): Promise<MvpPlan | undefined>;
  deleteMvpPlan(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.id);
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values({
      ...insertProject,
      lastUpdated: new Date()
    }).returning();
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({
        ...projectUpdate,
        lastUpdated: new Date()
      })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }

  // Feature methods
  async getFeaturesByProjectId(projectId: number): Promise<Feature[]> {
    return await db.select().from(features).where(eq(features.projectId, projectId));
  }

  async createFeature(insertFeature: InsertFeature): Promise<Feature> {
    const [feature] = await db.insert(features).values(insertFeature).returning();
    return feature;
  }

  async updateFeature(id: number, featureUpdate: Partial<Feature>): Promise<Feature | undefined> {
    const [updated] = await db
      .update(features)
      .set(featureUpdate)
      .where(eq(features.id, id))
      .returning();
    return updated;
  }

  async deleteFeature(id: number): Promise<boolean> {
    await db.delete(features).where(eq(features.id, id));
    return true;
  }

  // Validation methods
  async getValidationMethodsByProjectId(projectId: number): Promise<ValidationMethod[]> {
    return await db.select().from(validationMethods).where(eq(validationMethods.projectId, projectId));
  }

  async createValidationMethod(insertMethod: InsertValidationMethod): Promise<ValidationMethod> {
    const [method] = await db.insert(validationMethods).values(insertMethod).returning();
    return method;
  }

  async updateValidationMethod(id: number, methodUpdate: Partial<ValidationMethod>): Promise<ValidationMethod | undefined> {
    const [updated] = await db
      .update(validationMethods)
      .set(methodUpdate)
      .where(eq(validationMethods.id, id))
      .returning();
    return updated;
  }

  async deleteValidationMethod(id: number): Promise<boolean> {
    await db.delete(validationMethods).where(eq(validationMethods.id, id));
    return true;
  }

  // Competitor methods
  async getCompetitorsByProjectId(projectId: number): Promise<Competitor[]> {
    return await db.select().from(competitors).where(eq(competitors.projectId, projectId));
  }

  async createCompetitor(insertCompetitor: InsertCompetitor): Promise<Competitor> {
    const [competitor] = await db.insert(competitors).values(insertCompetitor).returning();
    return competitor;
  }

  async updateCompetitor(id: number, competitorUpdate: Partial<Competitor>): Promise<Competitor | undefined> {
    const [updated] = await db
      .update(competitors)
      .set(competitorUpdate)
      .where(eq(competitors.id, id))
      .returning();
    return updated;
  }

  async deleteCompetitor(id: number): Promise<boolean> {
    await db.delete(competitors).where(eq(competitors.id, id));
    return true;
  }

  // Competitive feature methods
  async getCompetitiveFeaturesById(projectId: number): Promise<CompetitiveFeature[]> {
    return await db.select().from(competitiveFeatures).where(eq(competitiveFeatures.projectId, projectId));
  }

  async createCompetitiveFeature(insertFeature: InsertCompetitiveFeature): Promise<CompetitiveFeature> {
    const [feature] = await db.insert(competitiveFeatures).values(insertFeature).returning();
    return feature;
  }

  async updateCompetitiveFeature(id: number, featureUpdate: Partial<CompetitiveFeature>): Promise<CompetitiveFeature | undefined> {
    const [updated] = await db
      .update(competitiveFeatures)
      .set(featureUpdate)
      .where(eq(competitiveFeatures.id, id))
      .returning();
    return updated;
  }

  async deleteCompetitiveFeature(id: number): Promise<boolean> {
    await db.delete(competitiveFeatures).where(eq(competitiveFeatures.id, id));
    return true;
  }

  // Milestone methods
  async getMilestonesByProjectId(projectId: number): Promise<Milestone[]> {
    return await db.select().from(milestones).where(eq(milestones.projectId, projectId));
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const [milestone] = await db.insert(milestones).values(insertMilestone).returning();
    return milestone;
  }

  async updateMilestone(id: number, milestoneUpdate: Partial<Milestone>): Promise<Milestone | undefined> {
    const [updated] = await db
      .update(milestones)
      .set(milestoneUpdate)
      .where(eq(milestones.id, id))
      .returning();
    return updated;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    await db.delete(milestones).where(eq(milestones.id, id));
    return true;
  }

  // KPI methods
  async getKpisByProjectId(projectId: number): Promise<Kpi[]> {
    return await db.select().from(kpis).where(eq(kpis.projectId, projectId));
  }

  async createKpi(insertKpi: InsertKpi): Promise<Kpi> {
    const [kpi] = await db.insert(kpis).values(insertKpi).returning();
    return kpi;
  }

  async updateKpi(id: number, kpiUpdate: Partial<Kpi>): Promise<Kpi | undefined> {
    const [updated] = await db
      .update(kpis)
      .set(kpiUpdate)
      .where(eq(kpis.id, id))
      .returning();
    return updated;
  }

  async deleteKpi(id: number): Promise<boolean> {
    await db.delete(kpis).where(eq(kpis.id, id));
    return true;
  }

  // Flow diagram methods
  async getFlowDiagramsByProjectId(projectId: number): Promise<FlowDiagram[]> {
    return await db.select().from(flowDiagrams).where(eq(flowDiagrams.projectId, projectId));
  }

  async createFlowDiagram(insertDiagram: InsertFlowDiagram): Promise<FlowDiagram> {
    const [diagram] = await db.insert(flowDiagrams).values(insertDiagram).returning();
    return diagram;
  }

  async updateFlowDiagram(id: number, diagramUpdate: Partial<FlowDiagram>): Promise<FlowDiagram | undefined> {
    const [updated] = await db
      .update(flowDiagrams)
      .set(diagramUpdate)
      .where(eq(flowDiagrams.id, id))
      .returning();
    return updated;
  }

  async deleteFlowDiagram(id: number): Promise<boolean> {
    await db.delete(flowDiagrams).where(eq(flowDiagrams.id, id));
    return true;
  }

  // MVP Plan methods
  async getMvpPlan(id: number): Promise<MvpPlan | undefined> {
    const [plan] = await db.select().from(mvpPlans).where(eq(mvpPlans.id, id));
    return plan;
  }

  async getMvpPlansByName(name: string): Promise<MvpPlan[]> {
    return await db.select().from(mvpPlans).where(like(mvpPlans.name, `%${name}%`));
  }

  async getAllMvpPlans(): Promise<MvpPlan[]> {
    return await db.select().from(mvpPlans).orderBy(mvpPlans.createdAt);
  }

  async createMvpPlan(insertPlan: InsertMvpPlan): Promise<MvpPlan> {
    const [plan] = await db.insert(mvpPlans).values(insertPlan).returning();
    return plan;
  }

  async updateMvpPlan(id: number, planUpdate: Partial<MvpPlan>): Promise<MvpPlan | undefined> {
    const [updated] = await db
      .update(mvpPlans)
      .set(planUpdate)
      .where(eq(mvpPlans.id, id))
      .returning();
    return updated;
  }

  async deleteMvpPlan(id: number): Promise<boolean> {
    await db.delete(mvpPlans).where(eq(mvpPlans.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();