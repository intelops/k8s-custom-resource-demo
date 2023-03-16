export interface Employee {
  apiVersion: string;
  kind: string;
  metadata: any;
  spec: any;
}

export interface ResourceList {
  apiVersion: string;
  kind: string;
  metadata: any;
  items: Employee[];
}

export interface EmployeeResource {
  apiVersion: string;
  kind: string;
  metadata: EmployeeResourceMetadata;
  spec: EmployeeResourceSpec;
}

export interface EmployeeResourceMetadata {
  name: string;
  namespace: string;
}


export interface EmployeeResourceSpec {
  role: string;
  department: string;
}

export interface EmployeeResourceList {
  apiVersion: string;
  kind: string;
  metadata: string;
  items: EmployeeResource[];
}

// employee
export const employee_group = 'intelops.ai';
export const employee_version = 'v1alpha1';
export const employee_plural = 'employees';
export const employee_kind = 'Employee';
