import mongoose from 'mongoose';
import { RoleModel } from '../models/roleModel.js';

export const createRoleQuery = async (user_data) => {
    try {
        return await RoleModel.create(user_data);
    } catch (error) {
        console.error('Error in create query:', error);
        throw error;
    }
}

export const roleDetailQuery = async (role_id) => {
    try {
        return await RoleModel.findOne({ '_id': role_id }).lean();
    } catch (error) {
        console.error('Error in roleDetailQuery query:', error);
        throw error;
    }
}

export const updateRoleQuery = async (role_id, access_modules) => {
    try {
        const id = new mongoose.Types.ObjectId(role_id);
        return await RoleModel.findByIdAndUpdate(id, {$set: {access_modules: access_modules}}, {new: true});
    } catch (error) {
        console.error('Error in updateRoleQuery query:', error);
        throw error;
    }
}

export const deleteRoleQuery = async (role_id) => {
    try {
        return await RoleModel.deleteOne({ _id: new mongoose.Types.ObjectId(role_id) });
    } catch (error) {
        console.error('Error in deleteRoleQuery:', error);
        throw error;
    }
}

export const getAllRolesQuery = async () => {
    try {
        return await RoleModel.find().lean();
    } catch (error) {
        console.error('Error in getAllRolesQuery:', error);
        throw error;
    }
}

export const getAccessModulesQuery = async (role_id) => {
    try {
        return await RoleModel.findOne({_id: new mongoose.Types.ObjectId(role_id)}).lean();
    } catch (error) {
        console.error('Error in getAccessModulesQuery:', error);
        throw error;
    }
}