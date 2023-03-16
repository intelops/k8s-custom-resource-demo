import {Request, Response, Router} from 'express';
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from '../store/employee-store';
import {
  CreateEmployeeError,
  CreateEmployeeResponse,
  DeleteEmployeeError,
  EmployeeEntity,
  UpdateEmployeeError,
  UpdateEmployeeResponse,
} from './models';

const employeesRouter = Router();

// delete employee by id for given user
employeesRouter.delete('/:id', async (request: Request, response: Response) => {
  const employeeId = request.params.id;
  const isDeleted = await deleteEmployee(employeeId);
  if (isDeleted) {
    const message = `'${employeeId}' employee deleted successfully.`;
    console.log(message);
    return response.status(204).json({message: message});
  }
  const message = `'${employeeId}' employee couldn't be deleted.`;
  console.log(message);
  return response.status(500).json(getDeleteEmployeeError(message));
});

// get employee by id for given user
employeesRouter.get('/:name', async (request: Request, response: Response) => {
  const employeeName = request.params.name;
  const employeeEntity: EmployeeEntity = await getEmployee(employeeName);
  if (employeeEntity.name.length !== 0) {
    const message = `${employeeEntity.name} employee is retrieved.`;
    return response.status(200).json(getCreateEmployeeResponse(employeeEntity, message));
  }
  return response.status(404).json();
});

// list all employees for given user
employeesRouter.get('/', async (request: Request, response: Response) => {
  return response.status(200).json(await listEmployees());
});

// create employee with details given in request
employeesRouter.post('/', async (request: Request, response: Response) => {
  const employeeEntity: EmployeeEntity = request.body;
  const savedEmployeeEntity: EmployeeEntity = await createEmployee(employeeEntity);
  if (savedEmployeeEntity.name.length !== 0) {
    const message = `${savedEmployeeEntity.name} employee is created.`;
    return response.status(200).json(getCreateEmployeeResponse(employeeEntity, message));
  }
  const message = `${savedEmployeeEntity.name} employee couldn't be created.`;
  console.log(message);
  return response.status(500).json(getCreateEmployeeError(message));
});

// update employee with details given in request
employeesRouter.put('/:name', async (request: Request, response: Response) => {
  const employeeName = request.params.name;
  const employeeEntity: EmployeeEntity = request.body;
  const updatedEmployeeEntity = await updateEmployee(employeeName, employeeEntity);
  if (updatedEmployeeEntity.name.length !== 0) {
    const message = `${employeeEntity.name} employee is updated.`;
    return response.status(200).json(getUpdateEmployeeResponse(updatedEmployeeEntity, message));
  }
  const message = `[${employeeEntity.name}] employee couldn't be updated.`;
  console.log(message);
  return response.status(500).json(getUpdateEmployeeError(message));
});

const getCreateEmployeeResponse = (employeeEntity: EmployeeEntity, message: string) => {
  const createEmployeeResponse: CreateEmployeeResponse = {
    employee: employeeEntity,
    message: message,
  };
  return createEmployeeResponse;
};

const getCreateEmployeeError = (message: string) => {
  const createEmployeeError: CreateEmployeeError = {
    message: message,
  };
  return createEmployeeError;
};

const getUpdateEmployeeResponse = (employeeEntity: EmployeeEntity, message: string) => {
  const updateEmployeeResponse: UpdateEmployeeResponse = {
    employee: employeeEntity,
    message: message,
  };
  return updateEmployeeResponse;
};

const getUpdateEmployeeError = (message: string) => {
  const updateEmployeeError: UpdateEmployeeError = {
    message: message,
  };
  return updateEmployeeError;
};

const getDeleteEmployeeError = (message: string) => {
  const deleteEmployeeError: DeleteEmployeeError = {
    message: message,
  };
  return deleteEmployeeError;
};

export default employeesRouter;
