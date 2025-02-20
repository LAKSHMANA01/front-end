import React from "react";
import { Wifi } from "lucide-react";

const Footer = ({
  companyName = "TelecomFieldOps",
  year = new Date().getFullYear(),
  description = "Bangalore-based telecom operations management since 2023",
  solutions = [
    { name: "Fault Management", link: "#" },
    { name: "Safety Compliance", link: "#" },
    { name: "Workforce Tracking", link: "#" },
  ],
  companyLinks = [
    { name: "About Us", link: "#" },
    { name: "Careers", link: "#" },
    { name: "Contact", link: "#" },
  ],
  legalLinks = [
    { name: "Privacy Policy", link: "#" },
    { name: "Terms of Service", link: "#" },
    { name: "Security", link: "#" },
  ],
}) => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Wifi className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">{companyName}</span>
            </div>
            <p className="text-sm">{description}</p>
          </div>

          {/* Solutions */}
          <FooterSection title="Solutions" links={solutions} />

          {/* Company */}
          <FooterSection title="Company" links={companyLinks} />

          {/* Legal */}
          <FooterSection title="Legal" links={legalLinks} />
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>© {year} {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, links }) => (
  <div>
    <h4 className="text-white font-semibold mb-4">{title}</h4>
    <ul className="space-y-2">
      {links.map((item, index) => (
        <li key={index}>
          <a href={item.link} className="hover:text-blue-400">{item.name}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
