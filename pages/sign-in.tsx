// clerk-frontend/pages/sign-in.tsx
import { useState } from "react";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  User,
  Stethoscope,
  Clock,
  Star,
} from "lucide-react";

const HeartbeatLoader = ({ size = 24 }: { size?: number }) => (
  <div className="flex items-center justify-center">
    <Heart
      className="text-white animate-pulse"
      style={{
        width: size,
        height: size,
        animation: "heartbeat 1.2s ease-in-out infinite",
      }}
    />
    <style jsx>{`
      @keyframes heartbeat {
        0% { transform: scale(1);   opacity:1; }
        25% { transform: scale(1.2); opacity:0.8; }
        50% { transform: scale(1);   opacity:1; }
        75% { transform: scale(1.2); opacity:0.8; }
        100%{ transform: scale(1);   opacity:1; }
      }
    `}</style>
  </div>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <div className="group bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.03]">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 group-hover:from-indigo-600 group-hover:to-purple-600 transition-colors">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
    </div>
    <p className="text-gray-300">{description}</p>
  </div>
);

const TestimonialCard = ({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-200 italic mb-4">“{quote}”</p>
    <p className="text-white font-semibold">{author}</p>
    <p className="text-gray-300 text-sm">{role}</p>
  </div>
);

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-violet-900 to-cyan-800 flex overflow-hidden relative">
      {/* Floating blobs */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-700/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Left panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center px-16 relative z-10">
        <div className="space-y-12 max-w-lg">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-2xl">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              HealthAI
            </h1>
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            Elevate Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
              Health Experience
            </span>
          </h2>
          <p className="text-gray-300 text-lg">
            AI-powered insights, professional guidance, and 24/7 accessibility —
            all in one modern interface.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <FeatureCard
              icon={Stethoscope}
              title="Smart Diagnosis"
              description="Real-time symptom analysis with pinpoint accuracy."
            />
            <FeatureCard
              icon={Shield}
              title="HIPAA-Grade Security"
              description="End-to-end encryption protecting your personal data."
            />
            <FeatureCard
              icon={Clock}
              title="Always On"
              description="Instant access to guidance, day or night."
            />
          </div>

          <TestimonialCard
            quote="HealthAI provided me quick insights and helped me find the right specialist!"
            author="Dr. Sarah Chen"
            role="MD, Internal Medicine"
          />
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo (mobile) */}
          <div className="lg:hidden text-center">
            <Heart className="mx-auto w-12 h-12 text-white mb-4" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
              HealthAI
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            {isSignUp && (
              <div className="relative">
                <label className="sr-only">Full Name</label>
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 border border-transparent focus:border-indigo-400 focus:bg-white focus:ring-0 transition"
                />
              </div>
            )}
            <div className="relative">
              <label className="sr-only">Email</label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 border border-transparent focus:border-indigo-400 focus:bg-white focus:ring-0 transition"
              />
            </div>
            <div className="relative">
              <label className="sr-only">Password</label>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/20 border border-transparent focus:border-indigo-400 focus:bg-white focus:ring-0 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all"
            >
              {loading ? (
                <HeartbeatLoader size={20} />
              ) : (
                <>
                  {isSignUp ? "Sign Up" : "Sign In"}{" "}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-gray-300">
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp((v) => !v)}
                className="text-cyan-300 hover:text-cyan-200 font-medium"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>

            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-cyan-300" />
              <span className="text-gray-300 text-sm">
                Secure, HIPAA-compliant
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
