export interface Anotations {
	userId: string;
	id: string;
	title?: string;
	description?: string;
	createdAt?: string;
	archived?: boolean;
}

export type FilterAnotations = {
	userId: string;
	archived?: boolean;
	title?: string;
};

export type CreateAnotation = Omit<Anotations, 'id'>;

export type DeleteAnotation = {
	userId: string;
	anotationId: string;
};
