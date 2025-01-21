"use client";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AlertNotificationProps {
	errorMessage: string | null;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({
	errorMessage,
}) => {
	if (!errorMessage) return null;

	return (
		<div className="w-full bg-red-50 py-4 px-6 flex justify-center">
			<Alert variant="destructive" className="max-w-4xl w-full">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{errorMessage}</AlertDescription>
			</Alert>
		</div>
	);
};

export default AlertNotification;
