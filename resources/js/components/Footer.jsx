import { Zap, Play, MapPin, Mail, Phone } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Footer() {
  return (
    <footer className="bg-[#041a12] text-white pt-24 pb-8 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-800 pb-16 mb-8">
          
          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-8 h-8 fill-primary text-primary" />
              <span className="text-2xl font-bold tracking-tight">Solarkon</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-2 font-medium text-primary">
              Nature Produces &amp; We Deliver
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Solar energy solutions for your home, business, and agricultural land.
              Leading Pakistan&apos;s transition toward a clean energy future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-dark-bg transition-colors duration-300">
                <span className="font-bold text-sm">fb</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-dark-bg transition-colors duration-300">
                <span className="font-bold text-sm">in</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-dark-bg transition-colors duration-300">
                <span className="font-bold text-sm">ig</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>About Us</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Our Projects</Link></li>
              <li><Link href="/solutions" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Solutions</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Residential Solar</li>
              <li className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Commercial Solar</li>
              <li className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Industrial Solar</li>
              <li className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 cursor-pointer"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Agricultural Solar</li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-4 items-start">
                <div className="bg-gray-800 p-2 rounded-lg mt-1">
                  <MapPin className="text-primary w-5 h-5" /> 
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-1">Location</p>
                  <p className="text-sm text-gray-300">94-C J1 Johar Town, Phase 2 Lahore</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-gray-800 p-2 rounded-lg mt-1">
                  <Mail className="text-primary w-5 h-5" /> 
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-1">Email</p>
                  <p className="text-sm text-gray-300">info@solarkon.org</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-gray-800 p-2 rounded-lg mt-1">
                  <Phone className="text-primary w-5 h-5" /> 
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-1">Phone</p>
                  <p className="text-sm text-gray-300">
                    +92 306 2935768
                    <br />
                    042-36449602
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 Solarkon. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
