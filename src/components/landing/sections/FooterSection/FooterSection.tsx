import { Github, Linkedin, Mail, Heart } from "lucide-react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-secondary-800 text-white relative">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/60 to-primary" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-2">Alireza Bagheri</h3>
              <p className="text-white/60 text-sm">Senior Frontend Developer</p>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/alirezab7394"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-lg hover:bg-primary/50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/alireza-bagheri-a6aaa681/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-lg hover:bg-primary/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:alireza7394@gmail.com"
                className="p-3 bg-white/10 rounded-lg hover:bg-primary/50 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            {/* Contact */}
            <div className="text-center md:text-right">
              <p className="text-white/60 text-sm mb-1">Get in touch</p>
              <a href="mailto:alireza7394@gmail.com" className="text-primary hover:text-primary/80 font-medium transition-colors">
                alireza7394@gmail.com
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10 my-8" />

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>
              &copy; {currentYear} Alireza Bagheri. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> using Next.js & TypeScript
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
