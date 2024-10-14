import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../../context/UserContext";
import { getAxiosInstance } from "../../utils/axiosInstance";
interface LoginModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const axiosInstance = getAxiosInstance("v2", false);
  const { setUserData } = useUserContext();

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login/", {
        email: formData.email,
        password: formData.password,
      });
      toast.success("Login successful");
      setUserData(response.data.user, response.data.accessToken);
      setIsModalVisible(false);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Login"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      className="rounded-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-emerald-600">
            Email
          </label>
          <Input
            id="email"
            prefix={<UserOutlined />}
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="rounded-md border-emerald-500"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-emerald-600">
            Password
          </label>
          <Input.Password
            id="password"
            prefix={<LockOutlined />}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="rounded-md border-emerald-500"
          />
        </div>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full bg-emerald-500"
        >
          Login
        </Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
