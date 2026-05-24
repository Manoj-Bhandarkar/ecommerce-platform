"use client";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 mt-10">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Manoj Cart. All rights reserved.
      </div>
    </footer>
  );
};
export default Footer;