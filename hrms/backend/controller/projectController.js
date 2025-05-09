import Project from "../model/projectmodel.js";
import ProjectTeam from "../model/projectteammodel.js";
import Employee from "../model/addpersonalmodel.js";
import { sequelize } from "../config/db.js";

// Helper function to find employee by name
const findEmployeeByName = async (name) => {
  const nameParts = name.split(' ');
  let employee;
  
  if (nameParts.length > 1) {
    // If name has multiple parts, assume first name and last name
    employee = await Employee.findOne({
      where: {
        firstName: nameParts[0],
        lastName: nameParts[1]
      }
    });
  } else {
    // If only one name part, check first name
    employee = await Employee.findOne({
      where: {
        firstName: nameParts[0]
      }
    });
  }
  
  return employee;
};

// Get all projects with their team information
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: Employee,
          as: "projectLead",
          attributes: ["employee_id", "firstName", "lastName"]
        },
        {
          model: Employee,
          as: "projectManagers",
          attributes: ["employee_id", "firstName", "lastName"],
          through: { attributes: [] } // Don't include junction table fields
        },
        {
          model: Employee,
          as: "technicalLeads",
          attributes: ["employee_id", "firstName", "lastName"],
          through: { attributes: [] } // Don't include junction table fields
        },
        {
          model: Employee,
          as: "teamMembers",
          attributes: ["employee_id", "firstName", "lastName"],
          through: { attributes: ["role"] }
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message
    });
  }
};

// Create a new project with team assignments
export const createProject = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      name,
      key,
      type,
      description,
   
      projectLead,
      projectManagers,
      technicalLeads,
      teamMembers,
      startDate,
      endDate
    } = req.body;
    
    // Find project lead employee
    const leadEmployee = await findEmployeeByName(projectLead);
    if (!leadEmployee) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Project lead '${projectLead}' not found in the system`
      });
    }
    
    // Create the project
    const project = await Project.create({
      name,
      key,
      type,
      description,
   
      lead_id: leadEmployee.employee_id,
      start_date: startDate,
      end_date: endDate
    }, { transaction });
    
    // Add project managers
    if (projectManagers && projectManagers.length > 0) {
      for (const managerName of projectManagers) {
        const manager = await findEmployeeByName(managerName);
        if (manager) {
          await ProjectTeam.create({
            project_id: project.project_id,
            employee_id: manager.employee_id,
            role: "Project Manager"
          }, { transaction });
        }
      }
    }
    
    // Add technical leads
    if (technicalLeads && technicalLeads.length > 0) {
      for (const leadName of technicalLeads) {
        const techLead = await findEmployeeByName(leadName);
        if (techLead) {
          await ProjectTeam.create({
            project_id: project.project_id,
            employee_id: techLead.employee_id,
            role: "Technical Lead"
          }, { transaction });
        }
      }
    }
    
    // Add team members
    if (teamMembers && teamMembers.length > 0) {
      for (const memberName of teamMembers) {
        const member = await findEmployeeByName(memberName);
        if (member) {
          await ProjectTeam.create({
            project_id: project.project_id,
            employee_id: member.employee_id,
            role: "Member"
          }, { transaction });
        }
      }
    }
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        project_id: project.project_id,
        name: project.name,
        key: project.key
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: error.message
    });
  }
};

// Get employees for project team selection
export const getEmployeesForSelection = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: {
        employmentStatus: "Active"
      },
      attributes: ["employee_id", "firstName", "lastName", "companyemail"]
    });
    
    // Format employees for frontend selection
    const formattedEmployees = employees.map(emp => ({
      id: emp.employee_id,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.companyemail,
      role: "" // Role will be assigned when added to project
    }));
    
    res.status(200).json({
      success: true,
      data: formattedEmployees
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message
    });
  }
};

// Get project details by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "projectLead",
          attributes: ["employee_id", "firstName", "lastName"]
        },
        {
          model: Employee,
          as: "projectManagers",
          attributes: ["employee_id", "firstName", "lastName"],
          through: { attributes: [] }
        },
        {
          model: Employee,
          as: "technicalLeads",
          attributes: ["employee_id", "firstName", "lastName"],
          through: { attributes: [] }
        },
        {
          model: Employee,
          as: "teamMembers",
          attributes: ["employee_id", "firstName", "lastName"],
          through: { attributes: ["role"] }
        }
      ]
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project details",
      error: error.message
    });
  }
};

// Update project details
export const updateProject = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      name,
      description,
   
      projectLead,
      projectManagers,
      technicalLeads,
      teamMembers,
      startDate,
      endDate,
      status
    } = req.body;
    
    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    // Update project fields
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
  
    if (startDate) updateData.start_date = startDate;
    if (endDate) updateData.end_date = endDate;
    if (status) updateData.status = status;
    
    // Update project lead if provided
    if (projectLead) {
      const leadEmployee = await findEmployeeByName(projectLead);
      if (!leadEmployee) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Project lead '${projectLead}' not found in the system`
        });
      }
      updateData.lead_id = leadEmployee.employee_id;
    }
    
    await project.update(updateData, { transaction });
    
    // Update team members if provided
    if (projectManagers || technicalLeads || teamMembers) {
      // Remove existing team members
      await ProjectTeam.destroy({
        where: { project_id: id },
        transaction
      });
      
      // Add project managers
      if (projectManagers && projectManagers.length > 0) {
        for (const managerName of projectManagers) {
          const manager = await findEmployeeByName(managerName);
          if (manager) {
            await ProjectTeam.create({
              project_id: project.project_id,
              employee_id: manager.employee_id,
              role: "Project Manager"
            }, { transaction });
          }
        }
      }
      
      // Add technical leads
      if (technicalLeads && technicalLeads.length > 0) {
        for (const leadName of technicalLeads) {
          const techLead = await findEmployeeByName(leadName);
          if (techLead) {
            await ProjectTeam.create({
              project_id: project.project_id,
              employee_id: techLead.employee_id,
              role: "Technical Lead"
            }, { transaction });
          }
        }
      }
      
      // Add team members
      if (teamMembers && teamMembers.length > 0) {
        for (const memberName of teamMembers) {
          const member = await findEmployeeByName(memberName);
          if (member) {
            await ProjectTeam.create({
              project_id: project.project_id,
              employee_id: member.employee_id,
              role: "Member"
            }, { transaction });
          }
        }
      }
    }
    
    await transaction.commit();
    
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: {
        project_id: project.project_id,
        name: project.name,
        key: project.key
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    // Delete project (will cascade delete team members due to foreign key constraint)
    await project.destroy();
    
    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message
    });
  }
};

// Get employees for project selection
export const getEmployeesForProjectSelection = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: [
        "employee_id", 
        "firstName", // Corrected from "first_name"
        "lastName",  // Corrected from "last_name"
        "companyemail", // Corrected from "email"
     
      ],
      where: {
        employmentStatus: "Active"
      }
    });
    
    const formattedEmployees = employees.map(emp => ({
      id: emp.employee_id,
      name: `${emp.firstName} ${emp.lastName || ''}`.trim(),
      email: emp.companyemail, // Corrected from emp.email
      avatar: '/api/placeholder/40/40',
    
    }));
    
    return res.status(200).json({
      success: true,
      count: formattedEmployees.length,
      data: formattedEmployees
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message
    });
  }
};

// Add member to project
export const addMemberToProject = async (req, res) => {
  try {
    const { projectId, employeeId, role } = req.body;
    
    if (!projectId || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Project ID and Employee ID are required"
      });
    }
    
    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }
    
    // Check if employee is already in the project
    const existingMember = await ProjectTeam.findOne({
      where: {
        project_id: projectId,
        employee_id: employeeId
      }
    });
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Employee is already a member of this project"
      });
    }
    
    // Add employee to project
    const newMember = await ProjectTeam.create({
      project_id: projectId,
      employee_id: employeeId,
      role: role || "Member"
    });
    
    return res.status(201).json({
      success: true,
      message: "Member added to project successfully",
      data: newMember
    });
  } catch (error) {
    console.error("Error adding member to project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add member to project",
      error: error.message
    });
  }
};

// Remove member from project
export const removeMemberFromProject = async (req, res) => {
  try {
    const { projectId, employeeId } = req.params;
    
    if (!projectId || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Project ID and Employee ID are required"
      });
    }
    
    // Check if membership exists
    const membership = await ProjectTeam.findOne({
      where: {
        project_id: projectId,
        employee_id: employeeId
      }
    });
    
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Employee is not a member of this project"
      });
    }
    
    // Remove membership
    await membership.destroy();
    
    return res.status(200).json({
      success: true,
      message: "Member removed from project successfully",
      data: {}
    });
  } catch (error) {
    console.error("Error removing member from project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove member from project",
      error: error.message
    });
  }
};