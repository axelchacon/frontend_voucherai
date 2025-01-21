"use client";

import React, { useState } from "react";
import Navbar from "./_components/Navbar";
import AlertNotification from "./_components/AlertNotification";
import UploadArea from "./_components/UploadArea";
import ResultsDisplay from "./_components/ResultsDisplay";
import Footer from "./_components/Footer";
import { Progress } from "../components/ui/progress";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebaseConfig";

const HomePage: React.FC = () => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [processedData, setProcessedData] = useState<{
		money?: number;
		date?: string;
		medio_payment?: string;
		name_person?: string;
		operation?: string;
		resultimage?: string;
	} | null>(null);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setSelectedImage(reader.result as string);
			reader.readAsDataURL(file);
			await processImage(file);
		}
	};

	const processImage = async (file: File) => {
		try {
			setProgress(0);
			setIsProcessing(true);
			setTimeout(() => setProgress(30), 500);

			const fileName = `${Date.now()}_voucher.png`;
			const imageRef = ref(storage, "room-design/" + fileName);
			await uploadBytes(imageRef, file);
			const imageUrl = await getDownloadURL(imageRef);
			console.log("imageUrl", imageUrl);

			setTimeout(() => setProgress(60), 500);
			const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

			const response = await fetch(`${backendUrl}/api/vouchers`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ image: imageUrl }),
			});

			setTimeout(() => setProgress(90), 500);

			if (!response.ok) {
				const errorData = await response.json();

				setErrorMessage(
					`Error: Upps, No pudimos procesar la imagen. ${errorData.message}`
				);
				setTimeout(() => setErrorMessage(null), 10000); // Elimina el mensaje de error después de 10s
				setIsProcessing(false);
				return;
			}

			const data = await response.json();
			console.log("data", data);
			setTimeout(() => setProgress(100), 500);
			setProcessedData(data);
			setErrorMessage(null);
		} catch {
			setErrorMessage("Error al procesar la imagen.");
			setTimeout(() => setErrorMessage(null), 10000); // Elimina el mensaje de error después de 10s
		} finally {
			setTimeout(() => {
				setProgress(0);
				setIsProcessing(false);
			}, 1000);
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<AlertNotification errorMessage={errorMessage} />
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
					<UploadArea
						selectedImage={selectedImage}
						handleImageChange={handleImageChange}
					/>
					<div className="flex flex-col items-center border p-4 rounded-lg w-1/2">
						<h3 className="text-lg font-bold">Resultado</h3>
						<ResultsDisplay
							processedData={processedData}
							errorMessage={errorMessage}
						/>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default HomePage;
