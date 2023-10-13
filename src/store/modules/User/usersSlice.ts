import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import serviceAPI from '../../../configs/services/integration.api';
import { CreateUser, User } from '../../../pages/Login/types/user';
import { showNotification } from '../Notification/notificationSlice';

export const createUser = createAsyncThunk(
	'users/createUser',
	async (newUser: CreateUser, { dispatch }) => {
		try {
			const response = await serviceAPI.post('/users/signup', {
				name: newUser.name,
				email: newUser.email,
				password: newUser.password,
			});

			dispatch(
				showNotification({
					message: 'Usurário criado com sucesso!',
					success: true,
				}),
			);

			return response.data;
		} catch (erro: any) {
			dispatch(
				showNotification({
					message:
						'E-mail já utilizado por outro usuário. Tente novamente!',
					success: false,
				}),
			);
			return erro.response.data;
		}
	},
);

export const loginUser = createAsyncThunk(
	'users/login',
	async (infoLogin: User, { dispatch }) => {
		try {
			const response = await serviceAPI.post('/users/signin', {
				email: infoLogin.email,
				password: infoLogin.password,
			});

			dispatch(
				showNotification({
					message: 'Requisição efetuada com sucesso!',
					success: true,
				}),
			);

			return response.data;
		} catch (error: any) {
			console.log(error);
			dispatch(
				showNotification({
					message:
						'O usuário não foi encontrado pelo E-mail informado.',
					success: false,
				}),
			);
			return error.response.data;
		}
	},
);

const initialState = {
	user: {
		name: '',
		id: '',
	},
	loading: false,
};

const usersSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: () => {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		// CREATE USER
		builder.addCase(createUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(createUser.fulfilled, (state) => {
			state.loading = false;
		});
		builder.addCase(createUser.rejected, (state) => {
			state.loading = false;
		});

		// LOGIN USER
		builder.addCase(loginUser.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(loginUser.fulfilled, (state, action) => {
			state.loading = false;

			if (action.payload.success) {
				state.user.id = action.payload.data.id;
				state.user.name = action.payload.data.name;
			}
		});
		builder.addCase(loginUser.rejected, (state) => {
			state.loading = false;
		});
	},
});

export const { logout } = usersSlice.actions;

export default usersSlice.reducer;
