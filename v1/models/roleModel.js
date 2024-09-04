
import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const RoleSchema = new mongoose.Schema({
    role_name: { type: String, default: "" , trim: true},
    access_modules: { type: Array },
    active : { type: Boolean, default: true}
});

RoleSchema.plugin(timestamps);
RoleSchema.index({ "role_name": 1 }, { name: "unique for data" });

export const RoleModel = mongoose.model("Role", RoleSchema);
