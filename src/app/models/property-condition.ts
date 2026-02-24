interface StatusCondition {
    novo: string;
    usado: string;
    inacabado: string;
    em_ruina: string;
}

export const STATUS_CONDITION: StatusCondition = {
    novo: "NOVO", 
    usado: "USADO", 
    inacabado: "INACABADO", 
    em_ruina: "EM_RUINA"
};
