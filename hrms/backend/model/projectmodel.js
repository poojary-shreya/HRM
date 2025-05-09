import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Employee from "./addpersonalmodel.js";

const Project = sequelize.define("Project", {
  project_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Z0-9]{2,10}$/
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
 
  lead_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Employee,
      key: "employee_id"
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Active",
    validate: {
      isIn: [["Active", "Completed", "On Hold", "Cancelled", "Not Started"]]
    }
  }
}, {
  tableName: "projects",
  timestamps: true
});

// Define the direct association with the project lead
Project.belongsTo(Employee, {
  foreignKey: "lead_id",
  as: "projectLead"
});

export default Project;