import React from "react";

interface ProfileFormProps {
  email?: string | undefined;
  username?: string | undefined;
  id?: number | undefined;
  role?: string | undefined;
  category?: string | undefined;
}

const ProfileForm = ({ email, username, id, role ,category}: ProfileFormProps = {}) => {
  return (
    <form className="flex flex-col space-y-4  [&_input]:p-2 [&_label]:text-sm [&_label]:text-gray-500 [&_div]:border-2 [&_div]:border-gray-300 [&_div]:rounded [&_div]:p-4 [&_div]:mx-1 [&_div]:flex [&_div]:items-center [&_input]:flex-grow">
      {/* <div>
        <label htmlFor="id">ID:</label>
        <input type="text" id="id" value={id} readOnly onFocus={(e) => e.target.blur()} />
      </div> */}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          readOnly
          onFocus={(e) => e.target.blur()}
        />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          readOnly
          onFocus={(e) => e.target.blur()}
        />
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          value={role}
          readOnly
          onFocus={(e) => e.target.blur()}
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          readOnly
          onFocus={(e) => e.target.blur()}
        />
      </div>
    </form>
  );
};

export default ProfileForm;

