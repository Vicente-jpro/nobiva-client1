interface Role {
  readonly proprietario: string;
  readonly cliente: string;
  readonly adminstrador: string;
  readonly superAdminstrador: string;
}

export const UserRole: Role = { 
	proprietario: "PROPRIETARIO", 
	cliente: "CLIENTE", 
	adminstrador: "ADMINSTRADOR",
	superAdminstrador: "SUPER_ADMINSTRADOR"
};