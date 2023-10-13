import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../..';
import serviceAPI from '../../../configs/services/integration.api';
import {
	Anotations,
	CreateAnotation,
	DeleteAnotation,
	FilterAnotations,
} from '../../../types/anotations';
import { showNotification } from '../Notification/notificationSlice';

const anotationsAdapter = createEntityAdapter<Anotations>({
	selectId: (anotation) => anotation.id,
});

export const createAnotation = createAsyncThunk(
	'anotations/createAnotation',
	async (anotation: CreateAnotation, { dispatch }) => {
		const { userId, title, description } = anotation;

		try {
			const response = await serviceAPI.post(
				`users/${userId}/anotation`,
				{
					title: title,
					description: description,
				},
			);

			dispatch(
				showNotification({
					message: 'Anotação criada com sucesso!',
					success: true,
				}),
			);

			return response.data;
		} catch (error: any) {
			dispatch(
				showNotification({
					message:
						'Anotação inválida/incompleta. Tente criar novamente.',
					success: false,
				}),
			);
			return error.response.data;
		}
	},
);

export const updateAnotation = createAsyncThunk(
	'anotations/updateAnotation',
	async (anotation: Anotations, { dispatch }) => {
		const { userId, id, title, description, archived } = anotation;

		try {
			const response = await serviceAPI.put(
				`/users/${userId}/anotation/${id}`,
				{
					title: title,
					description: description,
					archived: archived,
				},
			);

			dispatch(
				showNotification({
					message: 'Recado atualizado com sucesso!',
					success: true,
				}),
			);

			return response.data;
		} catch (error: any) {
			dispatch(
				showNotification({
					message: 'Recado não pode ser atualizado. Tente novamente!',
					success: false,
				}),
			);
			return error.response.data;
		}
	},
);

export const deleteAnotation = createAsyncThunk(
	'anotations/deleteAnotation',
	async (deleteParam: DeleteAnotation, { dispatch }) => {
		const { userId, anotationId } = deleteParam;
		try {
			const response = await serviceAPI.delete(
				`/users/${userId}/anotation/${anotationId}`,
			);

			dispatch(
				showNotification({
					message: 'Anotação deletada com sucesso!',
					success: true,
				}),
			);
			return response.data;
		} catch (error: any) {
			dispatch(
				showNotification({
					message:
						'Anotação não encontrada para este usuário. Tente novamente!',
					success: false,
				}),
			);
			return error.response.data;
		}
	},
);

export const getAnotation = createAsyncThunk(
	'anotations/listAnotation',
	async (filterParam: FilterAnotations) => {
		try {
			console.log(filterParam);

			const response = await serviceAPI.get(
				`/users/${filterParam.userId}/anotation`,
				{
					params: {
						archived: filterParam.archived,
						title: filterParam.title,
					},
				},
			);
			return response.data;
		} catch (error: any) {
			return error.response.data;
		}
	},
);

const anotationsSlice = createSlice({
	name: 'anotation',
	initialState: anotationsAdapter.getInitialState({
		loading: false,
	}),
	reducers: {},
	extraReducers: (builder) => {
		// CREATE ANOTATION
		builder.addCase(createAnotation.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(createAnotation.fulfilled, (state, action) => {
			state.loading = false;

			if (action.payload.success) {
				anotationsAdapter.addOne(state, action.payload.anotation);
			}
		});
		builder.addCase(createAnotation.rejected, (state) => {
			// Erro no servidor
			state.loading = false;
		});

		// UPDATE ANOTATION
		builder.addCase(updateAnotation.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(updateAnotation.fulfilled, (state, action) => {
			state.loading = false;

			if (action.payload.success) {
				anotationsAdapter.updateOne(state, {
					id: action.payload.anotation.id,
					changes: {
						title: action.payload.anotation.title,
						description: action.payload.anotation.description,
						createdAt: action.payload.anotation.createdAt,
						archived: action.payload.anotation.archived,
					},
				});
			}
		});
		builder.addCase(updateAnotation.rejected, (state) => {
			// Erro no servidor
			state.loading = false;
		});

		// DELETE ANOTATION
		builder.addCase(deleteAnotation.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(deleteAnotation.fulfilled, (state, action) => {
			state.loading = false;

			if (action.payload.success) {
				anotationsAdapter.removeOne(state, action.payload.anotation.id);
			}
		});
		builder.addCase(deleteAnotation.rejected, (state) => {
			// Erro no servidor
			state.loading = false;
		});

		// GET ANOTATION
		builder.addCase(getAnotation.fulfilled, (state, action) => {
			(state.loading = false),
				anotationsAdapter.setAll(state, action.payload.anotations);
		});
		builder.addCase(getAnotation.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getAnotation.rejected, (state) => {
			// Erro no servidor
			state.loading = false;
		});
	},
});

export const { selectAll: listAllAnotations } = anotationsAdapter.getSelectors(
	(state: RootState) => state.anotations,
);
export default anotationsSlice.reducer;
