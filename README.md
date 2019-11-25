# Game server 

Run locally with
```
npm i
nodeamon index.js
```
or build with Docker.
```
docker build -t game-server . 
docker run -p 8080:8080 -d game-server
```

## Deployment instructions

Tag Docker container and push to OCIR
```
docker tag game-server:latest fra.ocir.io/orasealps/wuzzler/game-server:1.1
docker push fra.ocir.io/orasealps/wuzzler/game-server:1.1
```

### Create Kubernetes cluster in OKE

Head to OKE, create a new cluster, choose `Quick Create` and for the Subnets choose `Public`. Follow instructions "Access kubeconfig" to connect `kubectl` from your local machine.

#### Add Docker registry secret to cluster

Once `kubectl` is successfully connected (test with `kubectl version`) we supply the Kubernetes cluster with Docker repository credentials.
```
export DOCKER_REGISTRY_SERVER=fra.ocir.io
export DOCKER_USER=orasealps/oracleidentitycloudservice/<your-email-address>
export DOCKER_PASSWORD=<your-api-key>

kubectl create secret docker-registry ocirkey \                     
  --docker-server=$DOCKER_REGISTRY_SERVER \
  --docker-username=$DOCKER_USER \
  --docker-password=$DOCKER_PASSWORD
```

#### Deploy the application

Deploy the application with `kubectl create -f deployment.yml` (to update application use `kubectl apply -f deployment.yml`). Once the pods have been successfully deployed (test with `kubectl get all`, `kubectl get pods`).

#### Expose the application

Expose the application with a loadbalancer

```
kubectl expose deployment wuzzler-game-server-deployment --type="LoadBalancer"
```
