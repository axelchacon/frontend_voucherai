"use client";

import React, { useState } from "react";
import Image from "next/image"; // Importamos el componente Image de Next.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig"; // Asegúrate de tener tu configuración de Firebase correctamente

const HomePage: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [ocrResult, setOcrResult] = useState<string>(
		"Simulated OCR result: Extracted text goes here."
	);

	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setImageFile(file); // Guardamos el archivo para subirlo a Firebase
			const reader = new FileReader();
			reader.onload = () => {
				setSelectedImage(reader.result as string); // Mostramos la imagen seleccionada
			};
			reader.readAsDataURL(file);

			// Subir automáticamente la imagen a Firebase
			await uploadImageToFirebase(file);
		}
	};

	const uploadImageToFirebase = async (file: File) => {
		try {
			const fileName = `${Date.now()}_raw_pagos.png`;
			const imageRef = ref(storage, "room-design/" + fileName);

			// Subir la imagen a Firebase Storage
			await uploadBytes(imageRef, file);

			// Obtener la URL de descarga de la imagen (si necesitas usarla en el futuro)
			const URLFilePago = await getDownloadURL(imageRef);
			console.log(URLFilePago);

			// Actualizar el mensaje de resultado
			setOcrResult("Okok, imagen subida");
		} catch (error) {
			console.error("Error subiendo la imagen a Firebase: ", error);
			setOcrResult("Error al subir la imagen.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navbar */}
			<nav className="bg-gray-800 p-4 flex justify-center">
				<Image
					src="/Modern Creative Logo Instagram Post.png" // Ruta de la imagen en la carpeta public
					alt="Logo"
					width={150}
					height={50}
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
