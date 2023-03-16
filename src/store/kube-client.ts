import * as k8s from "@kubernetes/client-node";

import {client} from "../app";
import {Employee, ResourceList} from "./models";

export const initializeKubeClient = () => {
    const kubeConfig = new k8s.KubeConfig();
    if (process.env.NODE_ENV === 'development') {
        kubeConfig.loadFromDefault();
    } else {
        kubeConfig.loadFromCluster();
    }
    return kubeConfig.makeApiClient(k8s.CustomObjectsApi);
}

export const deleteObject = async ({
                                       group,
                                       version,
                                       plural
                                   }: { group: string, version: string, plural: string }
    , namespace: string, name: string) => {
    try {
        await client.deleteNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            name
        );
    } catch (e: any) {
        console.debug("error while deleting custom object : ", e?.body)
        // console.log("error while getting custom object : ", e?.body?.reason)
    }
}

export const getObject = async ({
                                    group,
                                    version,
                                    plural
                                }: { group: string, version: string, plural: string }
    , namespace: string, name: string) => {
    try {
        const object = await client.getNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            name
        );
        const resource: Employee = JSON.parse(JSON.stringify(object.body))
        return resource
    } catch (e: any) {
        console.debug("error while getting custom object : ", e?.body)
        // console.log("error while getting custom object : ", e?.body?.reason)
        const resource: Employee = {apiVersion: "", kind: "", metadata: undefined, spec: undefined}
        return resource
    }
}

export const patchObject = async ({
                                      group,
                                      version,
                                      plural
                                  }: { group: string, version: string, plural: string }
    , namespace: string, name: string, patch: string) => {
    const options = {"headers": {"Content-type": k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH}};
    try {
        const object = await client.patchNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            name,
            JSON.parse(patch), undefined, undefined, undefined, options
        );
        const resource: Employee = JSON.parse(JSON.stringify(object.body))
        return resource
    } catch (e: any) {
        console.debug("error while patching custom object : ", e?.body)
        // console.log("error while patching custom object : ", e?.body?.reason)
        const resource: Employee = {apiVersion: "", kind: "", metadata: undefined, spec: undefined}
        return resource
    }
}

export const createObject = async ({
                                       group,
                                       version,
                                       plural
                                   }: { group: string, version: string, plural: string }
    , namespace: string, payload: string) => {
    try {
        const object = await client.createNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            JSON.parse(payload)
        );
        const resource: Employee = JSON.parse(JSON.stringify(object.body))
        return resource
    } catch (e: any) {
        console.debug("error while creating custom object : ", e)
        // console.log("error while creating custom object : ", e?.body?.reason)
        const resource: Employee = {apiVersion: "", kind: "", metadata: undefined, spec: undefined}
        return resource
    }
}

export const listObjects = async ({
                                      group,
                                      version,
                                      plural
                                  }: { group: string, version: string, plural: string }
    , namespace: string, labelSelector?: string) => {
    if (labelSelector) {
        try {
            const object = await client.listNamespacedCustomObject(
                group,
                version,
                namespace,
                plural,
                "true",
                false,
                "",
                "",
                labelSelector
            );

            const resources: ResourceList = JSON.parse(JSON.stringify(object.body))
            return resources
        } catch (e: any) {
            console.debug("error while listing custom object : ", e?.body)
            // console.log("error while listing custom object : ", e?.body?.reason)
            const resources: ResourceList = {apiVersion: "", items: [], kind: "", metadata: undefined}
            return resources
        }
    } else {
        try {
            const object = await client.listNamespacedCustomObject(
                group,
                version,
                namespace,
                plural,
            );
            const resources: ResourceList = JSON.parse(JSON.stringify(object.body))
            return resources
        } catch (e: any) {
            console.debug("error while listing custom object : ", e?.body)
            // console.log("error while listing custom object : ", e?.body?.reason)
            const resources: ResourceList = {apiVersion: "", items: [], kind: "", metadata: undefined}
            return resources
        }
    }
}