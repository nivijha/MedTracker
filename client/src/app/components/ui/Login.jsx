import { Github, Mail } from "lucide-react";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">MedTracker</h1>
        <p className="text-gray-600 text-center mt-2">
          Sign in to your account
        </p>

        {/* Form */}
        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900"
          >
            Sign In
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR CONTINUE WITH</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <button className="w-full flex items-center justify-center space-x-2 border px-4 py-2 rounded-lg hover:bg-gray-50">
          <Github className="h-5 w-5" />
          <span>Github</span>
        </button>
        <button className="w-full flex items-center justify-center space-x-2 border px-4 py-2 mt-2 rounded-lg hover:bg-gray-50">
          <Mail className="h-5 w-5" />
          <span>Google</span>
        </button>

        {/* Forgot Password */}
        <p className="text-center text-gray-600 mt-4">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;