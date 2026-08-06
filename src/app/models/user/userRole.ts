interface Role {
  readonly proprietario: string;
  readonly empresa: string;
  readonly adminstrador: string;
  readonly superAdminstrador: string;
}

export const UserRole: Role = { 
	proprietario: "PROPRIETARIO", 
	empresa: "EMPRESA", 
	adminstrador: "ADMINSTRADOR",
	superAdminstrador: "SUPER_ADMINSTRADOR"
};