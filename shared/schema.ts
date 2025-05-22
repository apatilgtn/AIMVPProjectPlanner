import { pgTable, text, serial, integer, boolean, json, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Feature schema
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  priority: text("priority").notNull(),
  difficulty: text("difficulty").notNull(),
  includeInMvp: boolean("include_in_mvp").notNull().default(true),
});

export const insertFeatureSchema = createInsertSchema(features).omit({
  id: true,
});

export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;

// Validation method schema
export const validationMethods = pgTable("validation_methods", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  method: text("method").notNull(),
  isSelected: boolean("is_selected").notNull().default(false),
});

export const insertValidationMethodSchema = createInsertSchema(validationMethods).omit({
  id: true,
});

export type InsertValidationMethod = z.infer<typeof insertValidationMethodSchema>;
export type ValidationMethod = typeof validationMethods.$inferSelect;

// Competitor schema
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
});

export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;

// Competitive feature comparison schema
export const competitiveFeatures = pgTable("competitive_features", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  yourMvp: boolean("your_mvp").notNull().default(false),
  competitorsHasFeature: json("competitors_has_feature").notNull().default("{}"),
});

export const insertCompetitiveFeatureSchema = createInsertSchema(competitiveFeatures).omit({
  id: true,
});

export type InsertCompetitiveFeature = z.infer<typeof insertCompetitiveFeatureSchema>;
export type CompetitiveFeature = typeof competitiveFeatures.$inferSelect;

// Timeline milestone schema
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(),
  order: integer("order").notNull(),
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
});

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

// Key Performance Indicator schema
export const kpis = pgTable("kpis", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  target: text("target"),
  timeframe: text("timeframe"),
});

export const insertKpiSchema = createInsertSchema(kpis).omit({
  id: true,
});

export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type Kpi = typeof kpis.$inferSelect;

// Flow diagram schema
export const flowDiagrams = pgTable("flow_diagrams", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  data: json("data").notNull(),
});

export const insertFlowDiagramSchema = createInsertSchema(flowDiagrams).omit({
  id: true,
});

export type InsertFlowDiagram = z.infer<typeof insertFlowDiagramSchema>;
export type FlowDiagram = typeof flowDiagrams.$inferSelect;

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  audience: text("audience").notNull(),
  problemStatement: text("problem_statement"),
  keyBenefits: json("key_benefits").notNull().default("[]"),
  additionalNotes: text("additional_notes"),
  currentStep: text("current_step").notNull().default("projectInfo"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  lastUpdated: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// MVP Plan schema
export const mvpPlans = pgTable("mvp_plans", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  userId: integer("user_id"), // Add userId to associate with users
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  audience: text("audience").notNull(),
  problemStatement: text("problem_statement"),
  executiveSummary: text("executive_summary"),
  valueProposition: text("value_proposition"),
  mvpScope: text("mvp_scope"),
  keyFeatures: jsonb("key_features").notNull().default("[]"),
  successCriteria: text("success_criteria"),
  potentialChallenges: text("potential_challenges"),
  nextSteps: text("next_steps"),
  featuresData: jsonb("features_data"),
  milestonesData: jsonb("milestones_data"),
  kpisData: jsonb("kpis_data"),
  diagramsData: jsonb("diagrams_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMvpPlanSchema = createInsertSchema(mvpPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertMvpPlan = z.infer<typeof insertMvpPlanSchema>;
export type MvpPlan = typeof mvpPlans.$inferSelect;
