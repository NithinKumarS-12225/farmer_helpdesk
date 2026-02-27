'use client';

import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const creators = [
    { name: 'Nithin', role: 'Full Stack Developer' },
    { name: 'Lewin', role: 'UI/UX Designer' },
    { name: 'Harsha', role: 'Backend Engineer' },
    { name: 'Lakshmana', role: 'AI Integration' },
    { name: 'Lishanth', role: 'DevOps & Deployment' },
  ];

  return (
    <footer className="border-t border-border bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Kisan Helpdesk</h3>
                <p className="text-xs text-muted-foreground">One-stop-solution</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering farmers with AI-driven insights, real-time information, and expert guidance for sustainable agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">• AI-Powered Chat Assistant</li>
              <li className="hover:text-primary transition-colors cursor-pointer">• Expert Directory</li>
              <li className="hover:text-primary transition-colors cursor-pointer">• Farmer Marketplace</li>
              <li className="hover:text-primary transition-colors cursor-pointer">• Weather Analysis</li>
              <li className="hover:text-primary transition-colors cursor-pointer">• Government Schemes</li>
              <li className="hover:text-primary transition-colors cursor-pointer">• Loan Calculator</li>
            </ul>
          </div>

          {/* Creator Team */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Created by BROGRAMMERS</h4>
            <p className="text-xs text-muted-foreground mb-3 font-medium">The Oxford College of Engineering</p>
            <div className="space-y-2">
              {creators.map((creator) => (
                <div key={creator.name} className="text-xs">
                  <p className="font-semibold text-foreground">{creator.name}</p>
                  <p className="text-muted-foreground text-xs">{creator.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left Side - Copyright & Info */}
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              © 2026 Kisan Helpdesk - One-stop-solution. All rights reserved by{' '}
              <span className="font-semibold text-foreground">BROGRAMMERS</span>.
            </p>
            <p className="flex items-center gap-2">
              Made with <Heart className="h-4 w-4 text-red-500" /> for Indian Farmers
            </p>
          </div>

          {/* Right Side - Social Links & Version */}
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <a
                href="https://github.com/NithinKumarS-12225"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                title="Visit GitHub Repository"
                aria-label="Github Profile"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/nithin-kumar-s-/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                title="Connect on LinkedIn"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:nithinkumar12225@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full"
                title="Send Email"
                aria-label="Email Contact"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted">
              v1.0.0
            </div>
          </div>
        </div>

        {/* Innovation Badge */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
            <span className="text-xs font-semibold text-primary">✨ Powered by Advanced AI & Modern Web Technologies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
