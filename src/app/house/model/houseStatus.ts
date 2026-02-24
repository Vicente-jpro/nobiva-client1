interface StatusPost {
    aprovado: string;
    pendente: string;
    bloqueado: string;
    reprovado: string;
}

interface StatusCondition {
    novo: string;
	usado: string;
	inacabado: string;
	em_ruina: string;
}


interface TypeNegotiation {
	arredamento: string;
	venda: string;
}

interface Tipology{
    T1: string;
	T2: string;
	T3: string;
	T4: string;
	T5: string;
	T6: string;
	T7: string;
	T8: string;
	T9: string;
	Tn: string;
}

const statusPost: StatusPost = {
    aprovado: "APROVADO", 
	pendente: "PENDENTE", 
	bloqueado: "BLOQUEADO", 
	reprovado: "REPROVADO"
}

const statusCondition: StatusCondition = {
    novo: "NOVO", 
    usado: "USADO", 
    inacabado: "INACABADO", 
    em_ruina: "EM_RUINA"
}

const typeNegotiation: TypeNegotiation = {
    arredamento: "ARRENDAMENTO",
    venda: "VENDA"
}

const tipology: Tipology = {
    T1: "T1",
    T2: "T2",
    T3: "T3",
    T4: "T4",
    T5: "T5",
    T6: "T6",
    T7: "T7",
    T8: "T8",
    T9: "T9",
    Tn: "TN"
}