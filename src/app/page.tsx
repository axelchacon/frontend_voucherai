"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig";

const HomePage: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);

	// Estado para almacenar los resultados procesados
	const [processedData, setProcessedData] = useState<{
		money?: number;
		date?: string;
		medio_payment?: string;
		name_person?: string;
		operation?: string;
		resultimage?: string;
	} | null>(null);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onload = () => setSelectedImage(reader.result as string);
			reader.readAsDataURL(file);

			// Subir automáticamente la imagen a Firebase y procesarla
			await processImage(file);
		}
	};

	const processImage = async (file: File) => {
		try {
			// Subir la imagen a Firebase
			const fileName = `${Date.now()}_voucher.png`;
			const imageRef = ref(storage, "room-design/" + fileName);
			await uploadBytes(imageRef, file);
			const imageUrl = await getDownloadURL(imageRef);

			// Enviar la URL al backend
			const response = await fetch("http://localhost:4000/api/vouchers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ image: imageUrl }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(`Error: ${errorData.message}`);
				setProcessedData(null);
				return;
			}

			const data = await response.json();
			console.log("Data from AI:", data);

			// Actualizar el estado con los datos procesados
			setProcessedData({
				money: data.money,
				date: data.date,
				medio_payment: data.medio_payment,
				name_person: data.name_person,
				operation: data.operation,
				resultimage: data.resultimage,
			});

			setErrorMessage(null); // Limpiar cualquier error previo
		} catch (error) {
			console.error("Error processing image:", error);
			setErrorMessage("Error procesando la imagen.");
			setProcessedData(null);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			{/* Navbar */}
			<nav className="bg-gray-800 p-4 flex justify-center">
				<Image
					src="/Modern Creative Logo Instagram Post.png"
					alt="Logo"
					width={150}
					height={50}
				/>
			</nav>

			{/* Main Content */}
			<main className="flex-grow container mx-auto p-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold">Gestión de Vouchers</h2>
					<p className="text-gray-600">Sube un voucher para procesar con IA.</p>
				</div>

				<div className="flex justify-center gap-8">
					{/* Upload Area */}
					<div className="flex flex-col items-center border-dashed border-2 p-4 rounded-lg">
						{selectedImage ? (
							<img
								src={selectedImage}
								alt="Preview"
								className="mb-4 w-64 h-64 object-contain"
							/>
						) : (
							<p className="text-gray-500 mb-4">
								No se ha seleccionado una imagen.
							</p>
						)}
						<label
							htmlFor="image-upload"
							className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-md">
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

					{/* Display Results */}
					<div className="flex flex-col items-center border p-4 rounded-lg w-1/2">
						<h3 className="text-lg font-bold">Resultado</h3>
						{errorMessage ? (
							<p className="mt-4 text-red-600">{errorMessage}</p>
						) : processedData ? (
							<ul className="mt-4 text-gray-600 text-left">
								<li>
									<strong>Monto:</strong> {processedData.money} soles
								</li>
								<li>
									<strong>Fecha:</strong> {processedData.date}
								</li>
								<li>
									<strong>Medio de Pago:</strong> {processedData.medio_payment}
								</li>
								<li>
									<strong>Nombre:</strong> {processedData.name_person}
								</li>
								<li>
									<strong>Operación:</strong> {processedData.operation}
								</li>
								<li>
									<strong>Tipo de Imagen:</strong> {processedData.resultimage}
								</li>
							</ul>
						) : (
							<p className="mt-4 text-gray-600">
								Esperando análisis de la imagen...
							</p>
						)}
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-gray-800 p-4 text-center text-white">
				Todos los derechos reservados.
			</footer>
		</div>
	);
};

export default HomePage;
