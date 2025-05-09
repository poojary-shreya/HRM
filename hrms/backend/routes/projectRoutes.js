import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getEmployeesForProjectSelection,
  addMemberToProject,
  removeMemberFromProject
} from "../controller/projectController.js";

const router = express.Router();

// Project CRUD routes
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Team member management routes
router.get("/employees/selection", getEmployeesForProjectSelection);
router.post("/members", addMemberToProject);
router.delete("/:projectId/members/:employeeId", removeMemberFromProject);

export default router;