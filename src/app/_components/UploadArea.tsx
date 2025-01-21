"use client";

import React from "react";
import Image from "next/image";

interface UploadAreaProps {
	selectedImage: string | null;
	handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
	selectedImage,
	handleImageChange,
}) => {
	return (
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
				<p className="text-gray-500 mb-4">No se ha seleccionado una imagen.</p>
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
	);
};

export default UploadArea;
