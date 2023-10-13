import { Divider, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
	getAnotation,
	listAllAnotations,
} from '../../store/modules/Anotations/anotationsSlice';
import ItemAnotation from '../ItemAnotations';

export interface ArchivedProps {
	archived: boolean;
}

const ColumnAnotation: React.FC<ArchivedProps> = ({ archived }) => {
	const dispatch = useAppDispatch();
	const listAnotations = useAppSelector(listAllAnotations);

	const userId = useAppSelector((state) => state.users.user.id);

	useEffect(() => {
		dispatch(
			getAnotation({
				archived: archived,
				userId,
			}),
		);
		console.log(listAnotations);
	}, []);

	return (
		<>
			<Grid item xs={12}>
				<Typography
					variant="h3"
					sx={{ display: 'flex', justifyContent: 'center' }}
				>
					ANOTAÇÕES
				</Typography>
			</Grid>

			<Divider />

			{listAnotations
				.filter(
					(anotation) =>
						anotation.userId && anotation.archived === archived,
				)
				.map((anotation) => {
					return (
						<Grid
							key={anotation.id}
							item
							xs={12}
							md={3}
							padding={2}
						>
							<ItemAnotation
								key={anotation.id}
								anotation={anotation}
							/>
						</Grid>
					);
				})}
		</>
	);
};

export default ColumnAnotation;
