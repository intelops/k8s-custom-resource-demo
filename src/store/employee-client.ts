import {createObject, deleteObject, getObject, listObjects, patchObject} from "./kube-client";
import {employee_group, employee_plural, employee_version, EmployeeResource, Employee} from "./models";

// createEmployeeResource creates employee resource
export const createEmployeeResource = async (namespace: string, payload: string) => {
    const object = await createObject({
        group: employee_group,
        version: employee_version,
        plural: employee_plural
    }, namespace, payload);
    const employeeResource: EmployeeResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return employeeResource;
}

// patchEmployeeResource patches employee resource
export const patchEmployeeResource = async (namespace: string, name: string, payload: string) => {
    const patch = [{
        "op": "replace",
        "path": "/spec",
        "value": JSON.parse(payload)
    }];

    const object = await patchObject({
        group: employee_group,
        version: employee_version,
        plural: employee_plural
    }, namespace, name, JSON.stringify(patch));
    const employeeResource: EmployeeResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return employeeResource;
}

// deleteEmployeeResource deletes user resource
export const deleteEmployeeResource = async (namespace: string, employeeId: string) => {
    await deleteObject({
        group: employee_group,
        version: employee_version,
        plural: employee_plural
    }, namespace, employeeId);
}

// getEmployeeResource gets user resource
export const getEmployeeResource = async (namespace: string, employeeName: string) => {
    const object: Employee = await getObject({
        group: employee_group,
        version: employee_version,
        plural: employee_plural
    }, namespace, employeeName);
    const employeeResource: EmployeeResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return employeeResource;
}

// listEmployeeResources lists employee resources
export const listEmployeeResources = async (namespace: string, labelSelector: string) => {
    const objects = await listObjects({
        group: employee_group,
        version: employee_version,
        plural: employee_plural
    }, namespace, labelSelector);
    const employeeResources: EmployeeResource[] = [];
    for (let i = 0; i < objects.items.length; i++) {
        let uR = objects.items[i];
        const employeeResource: EmployeeResource = {
            kind: uR.kind,
            apiVersion: uR.apiVersion,
            spec: uR.spec,
            metadata: uR.metadata
        };
        employeeResources.push(employeeResource);
    }
    return employeeResources;
}