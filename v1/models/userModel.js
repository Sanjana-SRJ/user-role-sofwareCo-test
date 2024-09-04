
import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const UserSchema = new mongoose.Schema({
    first_name: { type: String, default: "" , trim: true },
    last_name: { type: String, default: "" , trim: true },
    email: { type: String, default: "", trim: true },
    password: { type: String, default: "" },
    is_registered: { type: Boolean, default: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }
});

UserSchema.plugin(timestamps);
UserSchema.index({ "email": 1 }, { name: "unique for data" });

export const UserModel = mongoose.model("User", UserSchema);
