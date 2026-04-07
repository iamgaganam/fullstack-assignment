import {
  GithubLogo,
  LinkedinLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react";

interface FooterProps {
  isDark: boolean;
}

export function Footer({ isDark }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t transition-colors ${
        isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span
                className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Management
              </span>
            </div>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Modern employee and department management system.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={`transition-colors hover:text-blue-500 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors hover:text-blue-500 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors hover:text-blue-500 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={`transition-colors hover:text-blue-500 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors hover:text-blue-500 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`transition-colors hover:text-blue-500 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h3
              className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Connect
            </h3>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                aria-label="GitHub"
              >
                <GithubLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                aria-label="Email"
              >
                <EnvelopeSimple size={20} weight="fill" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className={`border-t pt-8 ${isDark ? "border-slate-800" : "border-slate-200"} flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm`}
        >
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            © {currentYear} Management System. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="#"
              className={`transition-colors hover:text-blue-500 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className={`transition-colors hover:text-blue-500 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
