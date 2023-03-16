# k8s-custom-resource-demo
Demo for k8s-custom-resource in nodejs.

- To run this code, please clone this repository using below commands.
```shell
git clone https://github.com/intelops/k8s-custom-resource-demo.git
```
- Navigate to the directory `k8s-custom-resource-demo`
```shell
cd k8s-custom-resource-demo
```
### Setup k8s cluster on local computer
- Make sure you have a valid KubeConfig set in your shell. You can try a KinD cluster for the demo.
  - Install KinD from https://kind.sigs.k8s.io/docs/user/quick-start/#installing-from-release-binaries
  - Create KinD cluster https://kind.sigs.k8s.io/docs/user/quick-start/#creating-a-cluster
  - Check if you can access the cluster created in previous step, and you are able to list down the pods.
- Now, fire below command to apply the employee CRD.
```shell
kubectl apply -f crds/
```
- Once you have installed the CRD on your cluster, you should be able to list down employees by following command. As there are no employees yet created, you can expect `No resources found` as a response.
```shell
kubectl get employees -A
```
- Let's try creating an employee manually with below specification. Create mahendra.yaml with below content.
```yaml
apiVersion: intelops.ai/v1alpha1
kind: Employee
metadata:
  name: mahendra
  namespace: employee-system
spec:
  department: IT
  role: developer
```
```shell
kubectl apply -f mahendra.yaml
```
The above command will produce `employee.intelops.ai/mahendra created`. We can now check by listing employees using below command.
```shell
kubectl get employees -n employee-system
```
This will produce below output:
```shell
NAME       AGE
mahendra   68s
```
### Run code on local
- Fire `npm install` in the directory.
- Let's run the code now with below command.
```shell
npm run dev
```
- You can try creating an employee by calling POST REST api like below.
```shell
curl -X POST -H "Content-Type: application/json" -d '{"department":"IT","name": "mahendra", "role": "developer"}' http://localhost:5000/employees
```
- You should see the below output when the call is successful.
```json
{
   "employee":{
      "department":"IT",
      "name":"mahendra",
      "role":"developer"
   },
   "message":"john employee is created."
}
```
- Similarly, you can call other REST apis, e.g. GET api
```shell
curl -X GET -H "Content-Type: application/json"  http://localhost:5000/employees
```
- The above command shall produce.
```json
[
   {
      "department":"IT",
      "name":"mahendra",
      "role":"developer"
   }
]
```
