import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleQuickLogin = async () => {
    try {
      setUsername("kunkun");
      setPassword("password");
      await login("kunkun", "password");
      navigate("/");
    } catch (err) {
      console.error("Quick login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-400 to-primary-500 py-8 px-6 text-center text-white">
          <h1 className="text-2xl font-bold mb-1">欢迎回来</h1>
          <p className="text-primary-50">登录找到您的项目</p>
        </div>

        <form className="py-8 px-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
              <button
                onClick={clearError}
                className="float-right text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                记住我
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-primary-500 hover:text-primary-600">
                忘记密码?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              登录
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            没有账号?{" "}
            <Link
              to="#"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              创建账号
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
