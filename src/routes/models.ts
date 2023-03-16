// EmployeeEntity is for transferring info about employees from client to server
export interface EmployeeEntity {
    department: string;
    name: string;
    role: string;
}

export interface CreateEmployeeResponse {
    employee: EmployeeEntity;
    message: string;
}

export interface UpdateEmployeeResponse {
    employee: EmployeeEntity;
    message: string;
}

export interface CreateEmployeeError {
    message: string;
}

export interface UpdateEmployeeError {
    message: string;
}

export interface DeleteEmployeeError {
    message: string;
}

export const initializeEmptyEmployeeEntity = () => {
    const employeeEntity: EmployeeEntity = {
        name: "",
        department: "",
        role: "",
    }
    return employeeEntity
}