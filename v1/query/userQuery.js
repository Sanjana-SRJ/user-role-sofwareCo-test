import mongoose from 'mongoose';
import {UserModel} from '../models/userModel.js';

export const create = async (user_data) => {
    try {
        return await UserModel.create(user_data);
    } catch (error) {
        console.error('Error in create query:', error);
        throw error;
    }
}

export const userDetailQuery = async (email) => {
    try {
        return await UserModel.findOne({ 'email': email, 'is_registered': true }).lean();
    } catch (error) {
        console.error('Error in userDetailQuery:', error);
        throw error;
    }
}

export const getAllUserDetailsQuery = async (regex) => {
    try {
        const pipeline = [
            {
                $match: {
                    is_registered: true,
                    $or: [
                        { first_name: { $regex: regex } },
                        { last_name: { $regex: regex } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role_id',
                    foreignField: '_id',
                    as: 'role_data'
                }
            },
            {
                $unwind: {
                    path: '$role_data',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    first_name: 1,
                    last_name: 1,
                    email: 1, 
                    role_id: "$role_data._id",
                    access_modules: "$role_data.access_modules"
                }
            }
        ];

        return await UserModel.aggregate(pipeline);
    } catch (error) {
        console.error('Error in getAllUserDetailsQuery:', error);
        throw error;
    }
}

export const updateUserProfileQuery = async (user_id, updateFields) => {
    try {
        return await UserModel.findByIdAndUpdate(
            user_id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );
    } catch (error) {
        console.error('Error in updateUserProfileQuery:', error);
        throw error;
    }
}

export const deleteUserProfileQuery = async (user_id) => {
    try {
        return await UserModel.deleteOne({ _id: new mongoose.Types.ObjectId(user_id) });
    } catch (error) {
        console.error('Error in deleteUserProfileQuery:', error);
        throw error;
    }
}

export const checkIfUserHasAccessToModuleQuery = async (user_id, module) => {
    try {
        const userWithAccess = await UserModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(user_id) }
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role_id',
                    foreignField: '_id',
                    as: 'role_data'
                }
            },
            {
                $unwind: '$role_data'
            },
            {
                $match: { 'role_data.access_modules': module }
            },
            {
                $project: { _id: 1 }
            }
        ]);
        return userWithAccess.length > 0;
    } catch (error) {
        console.error('Error in checkIfUserHasAccessToModuleQuery:', error);
        throw error;
    }
}

export const updateAllUserProfileQuery = async (updateFields) => {
    try {
        return await UserModel.updateMany(
            {},
            { $set: updateFields },
            { runValidators: true }
        );
    } catch (error) {
        console.error('Error in updateAllUserProfileQuery:', error);
        throw error;
    }
}

export const updateMultipleUsersQuery = async (updates) => {
    try {
        const operations = updates.map(update => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(update.user_id) },
                update: { $set: update.updateFields }
            }
        }));

        return await UserModel.bulkWrite(operations, { ordered: false });
    } catch (error) {
        console.error('Error in updateMultipleUsersQuery:', error);
        throw error;
    }
}

