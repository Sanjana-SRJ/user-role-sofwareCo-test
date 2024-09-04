# user-role-softwareCo-test
A simple user and role module access versioning of backend work.

**Description of Work Done for User CRUD and Role Access Modules CRUD**
In my project, I have developed a comprehensive User and Role management system that includes full CRUD operations and advanced functionalities. Below is a summary of the key features and modules implemented:

**Role Module**
**Fields:**

roleName: A string representing the name of the role.
access_modules: A list of modules that can be accessed by users assigned this role.
createdAt: A timestamp indicating when the role was created.
active: A boolean flag to indicate whether the role is active.
**Features:**

CRUD Operations: Create, read, update, and delete operations for managing roles.
Access Modules Management:
Unique Insertion: Ensures that only unique values are added to the access_modules list.
Value Removal: Allows for the removal of specific access modules from the list.
**User Module**
**Fields:**

Basic User Details: Includes fields such as first_name, last_name, email, etc.
role: A reference field linking each user to a specific role in the Role module.
**Features:**

**CRUD Operations**: Full CRUD operations for managing users.
**Role Population**: In the user list API, the roleName and access_modules fields from the Role module are populated.
**Search Functionality:** Implements a search feature that returns results matching partial or full strings in user-related fields, such as username.
Additional Functionalities
Login and Signup APIs: Implemented user authentication with login and signup endpoints.
**Access Control**:
Module Access Check: A function to verify if a user has access to a specific module based on their role.
**Bulk Update Operations**:
Uniform Data Update: Allows updating the same field (e.g., last_name) for multiple users in a single operation.
Diverse Data Update: Supports updating different fields (e.g., first_name for one user and last_name or email for another) for multiple users in a single database call.
