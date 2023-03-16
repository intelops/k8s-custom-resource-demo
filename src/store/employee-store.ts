import {EmployeeEntity, initializeEmptyEmployeeEntity} from '../routes/models';

import {
  employee_group,
  employee_kind,
  employee_version,
  EmployeeResource,
  EmployeeResourceSpec,
} from './models';
import {NAMESPACE} from '../util/constants';
import {
  createEmployeeResource,
  deleteEmployeeResource,
  getEmployeeResource,
  listEmployeeResources,
  patchEmployeeResource,
} from './employee-client';

// convertEmployeeEntityToEmployeeResourceSpec creates employeeResourceSpec on k8s cluster.
const convertEmployeeEntityToEmployeeResourceSpec = (employeeEntity: EmployeeEntity) => {
  const employeeResourceSpec: EmployeeResourceSpec = {
    role: employeeEntity.role,
    department: employeeEntity.department,
  };
  return employeeResourceSpec;
};

// convertEmployeeResourceToEmployeeEntity converts employeeResource to employeeEntity
const convertEmployeeResourceToEmployeeEntity = (employeeResource: EmployeeResource) => {
  const employeeEntity: EmployeeEntity = {
    department: employeeResource.spec.department,
    name: employeeResource.metadata.name,
    role: employeeResource.spec.role,
  };
  return employeeEntity;
};

// convertListOfEmployeeResourceToListOfEmployeeEntity converts employeeResourceList to EmployeeEntityList
const convertListOfEmployeeResourceToListOfEmployeeEntity = (employeeResources: EmployeeResource[]) => {
  let employeeEntities: EmployeeEntity[] = [];
  for (let i = 0; i < employeeResources.length; i++) {
    const employeeEntity = convertEmployeeResourceToEmployeeEntity(employeeResources[i]);
    employeeEntities.push(employeeEntity);
  }
  return employeeEntities;
};

// getEmployees returns all employees for userName supplied
export const listEmployees = async () => {
  let listOfEmployeeResource = await listEmployeeResources(NAMESPACE, '');
  if (listOfEmployeeResource) {
    return convertListOfEmployeeResourceToListOfEmployeeEntity(JSON.parse(JSON.stringify(listOfEmployeeResource)));
  }
  return [];
};

// deleteEmployee deletes employee for userName and employeeId supplied
export const deleteEmployee = async (employeeId: string) => {
  await deleteEmployeeResource(NAMESPACE, employeeId);
  return true;
};

// getEmployee returns employee for employeeId supplied.
export const getEmployee = async (employeeName: string) => {
  const employeeResource = await getEmployeeResource(NAMESPACE, employeeName);
  return convertEmployeeResourceToEmployeeEntity(employeeResource);
};

// prepareEmployeeResource prepares EmployeeResource containing the employee details.
const prepareEmployeeResource = (employeeName: string, employeeResourceSpec: EmployeeResourceSpec) => {
  // create employeeResource
  const employeeResource: EmployeeResource = {
    apiVersion: employee_group + '/' + employee_version,
    kind: employee_kind,
    spec: employeeResourceSpec,
    metadata: {
      name: employeeName,
      namespace: NAMESPACE,
    },
  };
  return employeeResource;
};

// createEmployee creates employeeResource on k8s cluster.
export const createEmployee = async (employeeEntity: EmployeeEntity) => {
  const employeeResourceSpec = convertEmployeeEntityToEmployeeResourceSpec(employeeEntity);
  const employeeResource = prepareEmployeeResource(employeeEntity.name, employeeResourceSpec);
  let savedEmployeeResource = await createEmployeeResource(NAMESPACE, JSON.stringify(employeeResource));
  if (savedEmployeeResource.metadata?.name){
    return convertEmployeeResourceToEmployeeEntity(savedEmployeeResource);
  }
  return initializeEmptyEmployeeEntity();
};

// updateEmployee updates employeeResource on k8s cluster.
export const updateEmployee = async (employeeName: string,  employeeEntity: EmployeeEntity) => {
  const existingEmployeeResource = await getEmployeeResource(NAMESPACE, employeeName);
  // for non-existent resources apiVersion is empty.
  if (existingEmployeeResource.apiVersion) {
    if (employeeEntity.role) {
      existingEmployeeResource.spec.role = employeeEntity.role;
    }
    if (employeeEntity.department) {
      existingEmployeeResource.spec.department = employeeEntity.department;
    }

    // send spec only as the called method considers updating specs only.
    // existingEmployeeResource.metadata.name = employeeName here
    const patchedEmployeeResource = await patchEmployeeResource(NAMESPACE, existingEmployeeResource.metadata.name, JSON.stringify(existingEmployeeResource.spec));
    console.log(patchedEmployeeResource);
    if (patchedEmployeeResource.apiVersion) {
      return convertEmployeeResourceToEmployeeEntity(patchedEmployeeResource);
    }
  }
  return initializeEmptyEmployeeEntity();
};