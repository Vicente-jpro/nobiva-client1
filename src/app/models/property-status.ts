interface StatusPost {
    aprovado: string;
    pendente: string;
    bloqueado: string;
    reprovado: string;
}

export const STATUS_POST: StatusPost = {
    aprovado: "APROVADO", 
    pendente: "PENDENTE", 
    bloqueado: "BLOQUEADO", 
    reprovado: "REPROVADO"
};
