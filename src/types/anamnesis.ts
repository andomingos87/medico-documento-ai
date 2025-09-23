type AnamneseFormData = {
    // Dados pessoais
    full_name: string;
    cpf: string;
    phone: string;
    email: string;
    birth_date: Date | undefined;
    
    // Questionário
    chronic_disease: string;
    chronic_disease_other?: string;
    continuous_medication: string;
    continuous_medication_list?: string;
    allergies_medication: string;
    allergies_medication_detail?: string;
    previous_aesthetic_procedures: string;
    previous_procedures_list: string[];
    procedure_complications: string;
    procedure_complications_detail?: string;
    desired_procedure: string;
    procedure_knowledge_level: string;
    medical_reaction: string;
    pain_tolerance: string;
    results_awareness: string;
  };