import { FaInstagram, FaLinkedinIn, FaFacebookF, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-brand">
        <strong>ZOVA</strong>
        <span>Reach out to us</span>
      </div>

      <div className="footer-socials">
        <a href="#" aria-label="Instagram">
          <FaInstagram />
        </a>

        <a href="#" aria-label="LinkedIn">
          <FaLinkedinIn />
        </a>

        <a href="#" aria-label="Facebook">
          <FaFacebookF />
        </a>

        <a href="mailto:support@zova.com" aria-label="Email">
          <FaEnvelope />
        </a>
      </div>

      <Link to="/help" className="footer-help">
        Help Center
      </Link>

      <p className="footer-copy">
        © 2026 ZOVA. All rights reserved.
      </p>

    </footer>
  );
}

export default Footer;