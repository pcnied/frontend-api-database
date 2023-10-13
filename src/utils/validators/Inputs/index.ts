import { emailRegex } from '../regexDados';

export const emailValidator = (email: string): boolean => {
	if (!email) {
		return false;
	}

	if (!emailRegex.test(email)) {
		return false;
	}

	return true;
};

export const senhaValidator = (senha: string): boolean => {
	if (!senha) {
		return false;
	}

	if (senha.length < 6) {
		return false;
	}

	return true;
};
