import express, { Router } from 'express';
import { deleteUserDetails, getAllUserDetails, updateAllUserDetails, updateMultipleUsersDetails, updateUserDetails, userAccessModuleCheck, userLogin, userRegister } from '../controllers/userController.js';
import { createRole, deleteRole, getAllRoles, updateRole } from '../controllers/roleController.js';

const app = express()
const router = Router();

//user routes
app.post('/register', userRegister);
app.post('/login', userLogin);
app.get('/get-all-user-details', getAllUserDetails);
app.put('/update-user-details/:user_id', updateUserDetails);
app.delete('/delete-user/:user_id', deleteUserDetails);
app.post('/check-user-has-access-to-a-module/:user_id', userAccessModuleCheck);
app.post('/update-all-users', updateAllUserDetails);
app.post('/update-multiple-users', updateMultipleUsersDetails);

//role routes
app.post('/add-new-role', createRole);
app.get('/get-all-roles', getAllRoles);
app.put('/update-role-details/:role_id', updateRole);
app.delete('/delete-role/:role_id', deleteRole);

app.use("/", router);

export default app;