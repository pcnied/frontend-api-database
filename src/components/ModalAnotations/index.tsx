import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Grid,
	TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	createAnotation,
	deleteAnotation,
	updateAnotation,
} from '../../store/modules/Anotations/anotationsSlice';
import { hideModal } from '../../store/modules/ModalAnotations';
import { Anotations } from '../../types/anotations';

interface ModalAnotationsProps {
	anotationSelected?: Anotations;
	context: 'create' | 'update' | 'delete';
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalAnotations: React.FC<ModalAnotationsProps> = ({
	anotationSelected,
	context,
	open,
	setOpen,
}) => {
	const userId = useAppSelector((state) => state.users.user.id);
	const [title, setTitle] = useState(anotationSelected?.title || '');
	const [description, setDescription] = useState(
		anotationSelected?.description || '',
	);

	useEffect(() => {
		console.log(anotationSelected);
	}, [anotationSelected]);

	const dispatch = useAppDispatch();

	const handleConfirm = () => {
		dispatch(hideModal());
		switch (context) {
			case 'create': {
				const newAnotation: Omit<Anotations, 'id'> = {
					title: title,
					description: description,
					userId: userId,
				};

				dispatch(createAnotation(newAnotation));

				clearInputs();
				setOpen(false);
				break;
			}
			case 'update':
				if (anotationSelected) {
					dispatch(
						updateAnotation({
							id: anotationSelected.id,
							userId: anotationSelected.userId,
							title: title,
							description: description,
							archived: anotationSelected.archived,
						}),
					);
				}
				setOpen(false);
				break;

			case 'delete':
				if (anotationSelected) {
					dispatch(
						deleteAnotation({
							userId: anotationSelected.userId,
							idAnotation: anotationSelected.id,
						}),
					);
				}
				break;
		}
	};

	const clearInputs = () => {
		setTitle('');
		setDescription('');
	};

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{context === 'create' && 'Criar Anotação'}
				{context === 'update' && 'Modificar Anotação'}
				{context === 'delete' && 'Deletar Anotação'}
			</DialogTitle>
			<Divider />
			<DialogContent>
				{context !== 'delete' && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								onChange={(event) =>
									setTitle(event.target.value)
								}
								value={title}
								fullWidth
								label="Título"
								type="text"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								onChange={(event) =>
									setDescription(event.target.value)
								}
								value={description}
								fullWidth
								label="Descrição"
								type="text"
							/>
						</Grid>
					</Grid>
				)}

				{context === 'delete' && (
					<DialogContentText id="alert-dialog-description">
						Deseja realmente excluir? Essa ação não poderá ser
						modificada.
					</DialogContentText>
				)}
			</DialogContent>
			<DialogActions>
				<Button variant="outlined" onClick={() => setOpen(false)}>
					Cancelar
				</Button>
				<Button variant="contained" onClick={handleConfirm} autoFocus>
					Concluir
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ModalAnotations;
