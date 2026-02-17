import { useState } from "react"

const Login = ({ onLoginSuccess }) => {
  const [hovered, setHovered] = useState(false)

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="relative w-full max-w-sm">

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center shadow-sm">

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L13.09 8.26L19 7L14.74 11.74L21 13L14.74 14.26L19 19L13.09 17.74L12 24L10.91 17.74L5 19L9.26 14.26L3 13L9.26 11.74L5 7L10.91 8.26L12 2Z"
                fill="#6366f1"
              />
            </svg>
          </div>

          <h1 className="text-gray-900 text-2xl font-semibold tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm mb-8 text-center">
            Sign in to continue to your account
          </p>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${
              hovered
                ? "bg-gray-50 border-gray-300 text-gray-900 shadow-sm scale-[1.02]"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-300 text-xs">secure sign-in</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Terms */}
          <p className="text-gray-400 text-xs text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login