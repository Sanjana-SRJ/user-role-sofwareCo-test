import dotenv from "dotenv"
import {validationResult} from "express-validator"
import bcrypt from "bcrypt"
import mongoose from 'mongoose';
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../utils/response.js"
import { createRoleQuery, deleteRoleQuery, getAllRolesQuery, roleDetailQuery, updateRoleQuery } from "../query/roleQuery.js";

dotenv.config();

export const createRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let {role_name, access_modules} = req.body
        const existingRole = await roleDetailQuery(role_name);
        if (existingRole) {
            return errorResponse(res, '', 'Role with this name already exists');
        }
        const roleData = {
            role_name,
            access_modules
        };
        await createRoleQuery(roleData)
        return successResponse(res, "", 'Role added successfully');
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
}

export const getAllRoles = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const data = await getAllRolesQuery()
        return successResponse(res, data, 'Role fetched successfully');
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
}

export const updateRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let {access_modules, remove_module} = req.body
        const role_id = req.params.role_id
        const existingRole = await roleDetailQuery(role_id);
        if (!existingRole) {
            return errorResponse(res, '', 'Role with this id does not exists');
        }

        if (access_modules && access_modules.length > 0) {
            access_modules = [...new Set([...existingRole.access_modules, ...access_modules])];
        } else {
            access_modules = existingRole.access_modules;
        }
        // Remove one value from access_modules
        if (remove_module) {
            access_modules = access_modules.filter(module => module !== remove_module);
        }
        const data = await updateRoleQuery(role_id, access_modules)
        return successResponse(res, data, 'Role updated successfully');
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
}

export const deleteRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        const role_id = req.params.role_id
        const existingRole = await roleDetailQuery(role_id);
        if (!existingRole) {
            return errorResponse(res, '', 'Role with this id does not exists');
        }
        await deleteRoleQuery(role_id)
        return successResponse(res, "", 'Role deleted successfully');
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
}