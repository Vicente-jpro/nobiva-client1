interface Role {
  readonly inclino: string;
  readonly proprietario: string;
  readonly empresa: string;
  readonly adminstrador: string;
  readonly superAdminstrador: string;
}

export const UserRole: Role = { 
	inclino: "INCLINO", 
	proprietario: "PROPRIETARIO", 
	empresa: "EMPRESA", 
	adminstrador: "ADMINSTRADOR",
	superAdminstrador: "SUPER_ADMINSTRADOR"
};