"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";

import { Progress } from "../components/ui/progress";

const HomePage: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	// Estado para almacenar los resultados procesados
	const [processedData, setProcessedData] = useState<{
		money?: number;
		date?: string;
		medio_payment?: string;
		name_person?: string;
		operation?: string;
		resultimage?: string;
	} | null>(null);

	// Estado para el mensaje de error
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Estado para controlar la visibilidad de la alerta
	const [showAlert, setShowAlert] = useState<boolean>(false);

	// Estado para el progreso de carga
	const [progress, setProgress] = useState<number>(0);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	// Manejar la selección de una imagen
	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setSelectedImage(reader.result as string);
			reader.readAsDataURL(file);

			// Subir automáticamente la imagen a Firebase y procesarla
			await processImage(file);
		}
	};

	// Procesar la imagen
	const processImage = async (file: File) => {
		try {
			// Inicializar el progreso
			setProgress(0);
			setIsProcessing(true);

			// Simular progreso de carga inicial
			setTimeout(() => setProgress(30), 500);

			// Subir la imagen a Firebase
			const fileName = `${Date.now()}_voucher.png`;
			const imageRef = ref(storage, "room-design/" + fileName);
			await uploadBytes(imageRef, file);
			const imageUrl = await getDownloadURL(imageRef);

			console.log("Image URL:", imageUrl);

			// Simular progreso al 60%
			setTimeout(() => setProgress(60), 500);
			const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

			// Enviar la URL al backend
			const response = await fetch(`${backendUrl}/api/vouchers`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ image: imageUrl }),
			});

			// Simular progreso al 90%
			setTimeout(() => setProgress(90), 500);

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(
					`Error: Upps, No pudimos procesar la imagen. Inténtalo nuevamente subiendo otra imagen o la misma imagen. ${errorData.message}`
				);
				setProcessedData(null);

				// Mostrar alerta
				setShowAlert(true);

				// Ocultar alerta después de 10 segundos
				setTimeout(() => {
					setShowAlert(false);
				}, 10000);

				setIsProcessing(false);
				return;
			}

			const data = await response.json();
			console.log("Data from AI:", data);

			// Simular progreso al 100%
			setTimeout(() => setProgress(100), 500);

			// Actualizar el estado con los datos procesados
			setProcessedData({
				money: data.money,
				date: data.date,
				medio_payment: data.medio_payment,
				name_person: data.name_person,
				operation: data.operation,
				resultimage: data.resultimage,
			});

			// Limpiar cualquier error previo
			setErrorMessage(null);
			setShowAlert(false);
		} catch (error: unknown) {
			console.error("Error processing image:", error);

			// Actualizar el mensaje de error
			setErrorMessage(
				"Upps, No pudimos procesar la imagen. Inténtalo nuevamente subiendo otra imagen o la misma imagen."
			);

			// Mostrar alerta
			setShowAlert(true);

			// Ocultar alerta después de 10 segundos
			setTimeout(() => {
				setShowAlert(false);
			}, 10000);

			setProcessedData(null);
		} finally {
			// Ocultar el progreso y finalizar el estado de procesamiento
			setTimeout(() => {
				setProgress(0);
				setIsProcessing(false);
			}, 1000);
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

			{/* Alerta debajo del Navbar */}
			{showAlert && (
				<div className="w-full bg-red-50 py-4 px-6 flex justify-center">
					<Alert variant="destructive" className="max-w-4xl w-full">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{errorMessage}</AlertDescription>
					</Alert>
				</div>
			)}

			{/* Main Content */}
			<main className="flex-grow container mx-auto p-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold">Gestión de Vouchers</h2>
					<p className="text-gray-600">Sube un voucher para procesar con IA.</p>
				</div>

				{isProcessing && (
					<div className="flex justify-center mb-4">
						<Progress value={progress} className="w-[60%]" />
					</div>
				)}

				<div className="flex justify-center gap-8">
					{/* Upload Area */}
					<div className="flex flex-col items-center border-dashed border-2 p-4 rounded-lg">
						{selectedImage ? (
							<Image
								src={selectedImage}
								alt="Preview"
								width={450}
								height={450}
								className="mb-4 object-contain"
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
