import dotenv from "dotenv"
import {validationResult} from "express-validator"
import bcrypt from "bcrypt"
import mongoose from 'mongoose';
import { successResponse, errorResponse, notFoundResponse, unAuthorizedResponse, internalServerErrorResponse } from "../../utils/response.js"
import { checkIfUserHasAccessToModuleQuery, create, deleteUserProfileQuery, getAllUserDetailsQuery, updateAllUserProfileQuery, updateMultipleUsersQuery, updateUserProfileQuery, userDetailQuery } from "../query/userQuery.js";

dotenv.config();

export const userRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }

        let {first_name, last_name, email, password, role_id} = req.body
        const existingUser = await userDetailQuery(email);
        if (existingUser) {
            return errorResponse(res, '', 'User with this email already exists.');
        }
        password = await bcrypt.hash(password.toString(), 12);
        const userData = {
            first_name,
            last_name,
            email,
            password,
            role_id
        };
        const data = await create(userData)
        return successResponse(res, data, 'User successfully registered');

    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
}

export const userLogin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        
        const { email, password } = req.body;
        const existingUser = await userDetailQuery(email);
        if (!existingUser) {
            return errorResponse(res, '', 'User not found');
        }
        
        let message = '';
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid) {
            message = 'You are successfully logged in';
        } else {
            return unAuthorizedResponse(res, '', 'Password is not correct. Please try again.');
        }
        return successResponse(res, { user_id: existingUser._id, username: existingUser.first_name + " " + existingUser.last_name , email: email }, message);
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
};

export const getAllUserDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const query = req.query.search
        const regex = new RegExp(query, 'i');
        const data = await getAllUserDetailsQuery(regex);
        return successResponse(res, data, "Data Fetched Successfully");
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
};

export const updateUserDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {first_name, last_name, password, role_id} = req.body
        const user_id = req.params.user_id
        let updated_fields = {};
        if (first_name !== undefined) updated_fields.first_name = first_name;
        if (last_name !== undefined) updated_fields.last_name = last_name;
        if (password !== undefined){ 
            let password_hash = await bcrypt.hash(password.toString(), 12);
            updated_fields.password = password_hash;
        }
        if (role_id !== undefined) updated_fields.role_id = role_id;

        const data = await updateUserProfileQuery(user_id, updated_fields);
        return successResponse(res, data, "User detail updated successfully");
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
};

export const deleteUserDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const user_id = req.params.user_id

        const data = await deleteUserProfileQuery(user_id);
        return successResponse(res, data, "User deleted Successfully");
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
};

export const userAccessModuleCheck = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        let message;
        const user_id = req.params.user_id
        const {module_to_check} = req.body 

        const data = await checkIfUserHasAccessToModuleQuery(user_id, module_to_check);
        if(!data){
            message = `User does not access to ${module_to_check}`;
        }else{
            message = `User has access to ${module_to_check}`;
        }
        return successResponse(res, data, message);
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
};

export const updateAllUserDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
        const {first_name, last_name, role_id} = req.body
        let updated_fields = {};
        if (first_name !== undefined) updated_fields.first_name = first_name;
        if (last_name !== undefined) updated_fields.last_name = last_name;
        if (role_id !== undefined) updated_fields.role_id = role_id;

        const data = await updateAllUserProfileQuery(updated_fields);
        return successResponse(res, data, "User detail updated successfully");
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
};

export const updateMultipleUsersDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, errors.array(), "")
        }
       const {updates} = req.body
        const data = await updateMultipleUsersQuery(updates);
        return successResponse(res, data, "User detail updated successfully");
    } catch (error) {
        console.error(error);
        return internalServerErrorResponse(res, error)
    }
};