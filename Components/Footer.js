"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 text-sm border-t">
      {/*  Top Black Bar */}
      <div className="bg-black text-center text-white py-4 relative overflow-hidden">
        <p className="text-xs md:text-sm">Don't Know Which Destination To Choose?</p>
        <p className="text-lg font-semibold mt-1">
          Call Us <span className="text-yellow-400">+92 3340420618</span>
        </p>
      </div>

      {/*  Main Footer Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-8 px-6">
        
        {/*  Column 1 */}
        <div>
          <h3 className="font-semibold text-md mb-2 text-gray-900">Make your Trip</h3>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Start exploring and create unforgettable journeys with just a few clicks!
          </p>
          <div className="flex gap-3 text-gray-500">
            <a href="#"><FaFacebookF size={16} className="hover:text-indigo-600" /></a>
            <a href="#"><FaTwitter size={16} className="hover:text-indigo-600" /></a>
            <a href="#"><FaInstagram size={16} className="hover:text-indigo-600" /></a>
            <a href="#"><FaYoutube size={16} className="hover:text-indigo-600" /></a>
          </div>
        </div>

        {/*  Column 2 */}
        <div>
          <h3 className="font-semibold text-md mb-2 text-gray-900">Destinations</h3>
          <ul className="space-y-1 text-xs text-gray-600">
            <li><Link href="#">Lahore</Link></li>
            <li><Link href="#">Islamabad</Link></li>
            <li><Link href="#">Karachi</Link></li>
            <li><Link href="#">Multan</Link></li>
            <li><Link href="#">Dubai</Link></li>
          </ul>
        </div>

        {/*  Column 3 */}
        <div>
          <h3 className="font-semibold text-md mb-2 text-gray-900">Useful Links</h3>
          <ul className="space-y-1 text-xs text-gray-600">
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Travel Blog</Link></li>
            <li><Link href="#">Be Our Partner</Link></li>
            <li><Link href="#">F.A.Q</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>

        {/*  Column 4 */}
        <div>
          <h3 className="font-semibold text-md mb-2 text-gray-900">Contact</h3>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-center gap-2"><FiPhone size={14} /> +92 3340420618</li>
            <li className="flex items-center gap-2"><FiMail size={14} /> bc220202204mhu@vu.edu.pk</li>
            <li className="flex items-center gap-2"><FiMapPin size={14} /> Sialkot Pakistan</li>
          </ul>
        </div>
      </div>

      {/*  Bottom Bar */}
      <div className="bg-gray-100 py-2 text-center text-[11px] text-gray-500 border-t">
        © VoyagiQ 2025. Designed by <span className="font-medium text-gray-700">M. Husnain</span>
      </div>
    </footer>
  );
};

export default Footer;
