import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';

interface SnackBarMessageProps {
	open: boolean;
	handleClose: () => void;
	mode: 'error' | 'success' | 'info' | 'warning';
	message: string;
}

export const SnackBarComp: React.FC<SnackBarMessageProps> = ({
	open,
	handleClose,
	mode,
	message,
}) => {
	return (
		<div>
			<Snackbar
				open={open}
				onClose={handleClose}
				autoHideDuration={3000}
				sx={{ position: 'static' }}
			>
				<Alert onClose={handleClose} severity={mode}>
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
};
