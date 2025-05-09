import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Project from "./projectmodel.js";
import Employee from "./addpersonalmodel.js";

const ProjectTeam = sequelize.define("ProjectTeam", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Project,
      key: "project_id"
    },
    onDelete: "CASCADE"
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Employee,
      key: "employee_id"
    },
    onDelete: "CASCADE"
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["Lead", "Project Manager", "Technical Lead", "Member"]]
    }
  },
  joined_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "project_team_members",
  timestamps: true
});

// Set up many-to-many relationship
Project.belongsToMany(Employee, {
  through: ProjectTeam,
  foreignKey: "project_id",
  as: "teamMembers"
});

Employee.belongsToMany(Project, {
  through: ProjectTeam,
  foreignKey: "employee_id",
  as: "assignedProjects"
});

// Add specialized associations for different roles
Project.belongsToMany(Employee, {
  through: {
    model: ProjectTeam,
    scope: {
      role: "Project Manager"
    }
  },
  foreignKey: "project_id",
  as: "projectManagers"
});

Project.belongsToMany(Employee, {
  through: {
    model: ProjectTeam,
    scope: {
      role: "Technical Lead"
    }
  },
  foreignKey: "project_id",
  as: "technicalLeads"
});

export default ProjectTeam;