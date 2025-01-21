import React from "react";

interface ResultsDisplayProps {
	processedData: {
		money?: number;
		date?: string;
		medio_payment?: string;
		name_person?: string;
		operation?: string;
		resultimage?: string;
	} | null;
	errorMessage: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
	processedData,
	errorMessage,
}) => {
	if (errorMessage) {
		return <p className="mt-4 text-red-600">{errorMessage}</p>;
	}

	if (!processedData) {
		return (
			<p className="mt-4 text-gray-600">Esperando análisis de la imagen...</p>
		);
	}

	return (
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
	);
};

export default ResultsDisplay;
