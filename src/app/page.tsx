"use client";

import React, { useState } from "react";
import Image from "next/image"; // Importamos el componente Image de Next.js

const HomePage: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [ocrResult, setOcrResult] = useState<string>(
		"Simulated OCR result: Extracted text goes here."
	);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedImage(reader.result as string); // Guardamos la imagen en formato Base64
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navbar */}
			<nav className="bg-gray-800 p-4 flex justify-center">
				{/* Logo reemplazado */}
				<Image
					src="/Modern Creative Logo Instagram Post.png" // Ruta de la imagen en la carpeta public
					alt="Logo"
					width={150} // Ajusta el ancho según necesites
					height={50} // Ajusta la altura según necesites
					className="object-contain"
				/>
			</nav>

			{/* Main Content */}
			<main className="flex-grow container mx-auto p-8">
				<div className="text-center mb-8">
					<p className="text-gray-600 font-medium">
						Powered by Axel Diego Chacón Pérez y Groq con LLama Vision
					</p>
				</div>

				<div className="text-center mb-4">
					<h2 className="text-2xl font-bold">
						OCR: Solo en formato de imágenes to Markdown
					</h2>
				</div>

				<div className="text-center mb-8">
					<p className="text-gray-600">
						Sube una imagen para convertirla en formato Markdown estructurado :)
					</p>
				</div>

				{/* Upload Section */}
				<div className="flex justify-center gap-8">
					{/* Upload Area */}
					<div className="flex flex-col items-center border-dashed border-2 border-gray-300 p-4 rounded-lg">
						{selectedImage ? (
							<img
								src={selectedImage}
								alt="Uploaded preview"
								className="mb-4 object-contain w-68 h-68"
							/>
						) : (
							<p className="text-gray-500 mb-4">No image selected</p>
						)}

						<label
							htmlFor="image-upload"
							className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
							Seleccionar imagen
						</label>
						<input
							id="image-upload"
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
						/>
						{selectedImage && (
							<p className="mt-2 text-gray-500">Imagen seleccionada</p>
						)}
					</div>

					{/* OCR Result */}
					<div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg w-1/2">
						<h3 className="text-lg font-bold mb-4">Resultado OCR</h3>
						<div className="bg-gray-100 p-4 rounded-lg w-full">
							<p className="text-gray-600 text-sm">{ocrResult}</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-gray-800 p-4 text-center text-white">
				Todos los derechos reservados por Axel Diego Chacón Pérez
			</footer>
		</div>
	);
};

export default HomePage;
