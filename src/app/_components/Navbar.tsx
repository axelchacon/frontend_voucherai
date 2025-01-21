import React from "react";
import Image from "next/image";

const Navbar: React.FC = () => {
	return (
		<nav className="bg-gray-800 p-4 flex justify-center">
			<Image
				src="/Modern Creative Logo Instagram Post.png"
				alt="Logo"
				width={150}
				height={50}
			/>
		</nav>
	);
};

export default Navbar;
