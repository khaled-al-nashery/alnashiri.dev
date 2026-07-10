---

title: "Service Discovery in Microservices Explained With Examples"
description: "Learn how service discovery helps microservices find healthy service instances using registries, request flows, gateways, and examples."
pubDatetime: 2026-07-09T12:00:00Z
modDatetime: null
tags: ["Microservices", "Service Discovery", "Software Architecture", "System Design", "Backend Architecture", "Distributed Systems"]
draft: true
---

## Introduction: Why Hardcoded Service Addresses Break in Microservices

In a monolithic application, different parts of the system usually call each other inside the same codebase. The order module can call the payment module directly. The user module can call the notification module through an internal function or class. Everything is packaged, deployed, and scaled as one application.

Microservices change that model.

In a microservices architecture, services run as separate processes. They may run on different hosts, containers, nodes, or managed platforms. Each service owns a focused responsibility, such as users, orders, payments, inventory, notifications, or reporting. If you are still new to the idea, start with this guide on [what microservices are](/posts/what-are-microservices/).

That separation creates a practical problem: how does one service find another service?

Hardcoding `payment-service:8080` may work in a small local demo. It breaks down when the Payment Service has several instances, one restarts, another fails health checks, and the system needs to avoid broken instances.

The problem becomes clearer after adding an API Gateway. As explained in the guide to [API Gateway in microservices](/posts/api-gateway-in-microservices/), the gateway can decide which backend service should handle a client request. But after it decides that a request should go to Order Service or Payment Service, the system still needs to find a running instance that can receive the request.

That is where service discovery fits.

**Direct answer:**
Service discovery in microservices is the process of finding the current network location of a service instance at runtime. Instead of hardcoding IP addresses and ports, services use a registry, DNS, gateway, load balancer, or platform mechanism to locate healthy service instances dynamically.

---

## What Is Service Discovery in Microservices?

Service discovery in microservices helps services find other services without relying on fixed physical addresses.

A microservice is a small, independently deployable service that owns a specific business capability. A service instance is one running copy of that service. For example, if Payment Service is scaled to three running copies, each copy is a separate service instance.

The main idea is simple:

A caller asks for a logical service name, such as `payment-service`, and receives the network location of an available instance that can handle the request.

Instead of saying:

```text
Call 10.0.1.12:8080
```

the caller can work with a service name:

```text
Call payment-service
```

The discovery mechanism resolves that name to one or more running instances.

Service discovery may be implemented using a service registry, DNS, an API Gateway, a load balancer, a container orchestration platform, or a managed cloud mechanism. The implementation can vary, but the architecture problem is the same: services need a reliable way to find each other as the system changes.

This is why service discovery is usually listed as one of the core [components of microservices architecture](/posts/main-components-of-microservices-architecture/). Without it, growing microservices systems often become full of manual configuration and fragile routing assumptions.

> **Key takeaway:** Service discovery helps microservices find service instances dynamically instead of relying on hardcoded IP addresses.

---

## Why Service Discovery Is Important

Service discovery matters because microservices are not static. Services move, scale, fail, recover, and change over time.

### Services are dynamic

In a real system, a service instance can start, stop, restart, move to another host, or fail health checks. Containers may be replaced. Virtual machines may be recreated. A managed platform may move workloads behind the scenes.

If callers depend on fixed addresses, every change becomes risky. A caller may continue sending requests to an instance that no longer exists.

### Scaling creates multiple instances

One service may have several running instances.

For example, during normal traffic, the Payment Service may run with two instances. During a promotion or seasonal spike, it may scale to eight. After traffic drops, it may scale back down.

The caller should not need to know all of those addresses manually. It should ask for the service and receive available instances from the discovery mechanism.

### Failures must be avoided

Service discovery is not only about finding any instance. It should help avoid instances that are not ready for traffic.

A health check is a test that confirms whether a service instance can receive requests. A heartbeat is a repeated signal that tells the registry or platform that an instance is still alive.

If `payment-2` is running but failing health checks, the discovery mechanism should stop returning it to callers.

### Manual configuration does not scale

Manual addresses become painful when the system has many services, multiple environments, frequent deployments, and autoscaling.

Every manual address becomes another thing to update, test, and remember.

### Discovery reduces coupling

Service discovery reduces coupling between callers and physical network locations.

The Order Service should know that it needs Payment Service. It should not need to know that Payment Service currently lives at `10.0.1.12:8080`.

Logical service names are stable. Physical locations are not.

> **Key takeaway:** Service discovery keeps service communication flexible as instances scale, restart, fail, and move.

---

## What Is a Service Registry?

A service registry is a live directory of available service instances.

It stores information about services that are currently running and can be discovered by other parts of the system. You can think of it as a catalog that answers questions like:

* Which instances of `payment-service` are available?
* What address and port should be used?
* Which instances are healthy?
* Which version, zone, or metadata belongs to each instance?

A service registry in microservices commonly stores:

* Service name
* Instance ID
* Address
* Port
* Health status
* Metadata
* Version
* Zone or region, when useful

Registration is the process where a service instance adds itself to the registry when it starts. Deregistration is the process where the instance is removed when it stops, shuts down, or becomes unavailable.

Health checks and heartbeats help keep the registry fresh. Without them, the registry may return stale data and send callers to dead or unhealthy instances.

Example registry data may look like this:

| Service name      | Instance    | Address        | Health    |
| ----------------- | ----------- | -------------- | --------- |
| payment-service   | payment-1   | 10.0.1.12:8080 | Healthy   |
| payment-service   | payment-2   | 10.0.1.13:8080 | Unhealthy |
| inventory-service | inventory-1 | 10.0.2.10:8080 | Healthy   |

The registry should not treat every running process as safe for traffic. A process may be alive but unable to serve requests correctly. That is why health information is part of the discovery flow.

> **Key takeaway:** A service registry maps service names to running service instances and their health status.

---

## How Service Discovery Works

A basic service discovery request flow usually follows this pattern:

1. A service instance starts.
2. It registers with the service registry.
3. The registry stores the service name, address, health status, and metadata.
4. A calling service or API Gateway asks for a target service.
5. The registry returns healthy instance information.
6. The request is sent to the selected service instance.
7. Health checks update the registry.
8. Unhealthy instances are removed or ignored.

For example, the Order Service may need to call Payment Service. It does not need to know every running Payment Service IP address. It asks the registry for `payment-service`, receives a healthy instance, and sends the request there.

![Service registry request flow in microservices](/assets/blog/service-discovery-in-microservices/service-discovery-request-flow.webp)

*A service registers itself, callers look up healthy instances, and the registry updates health status over time.*

The diagram shows two different actions that often happen at different times.

First, the Payment Service instance registers itself. The registry now knows that this instance exists and can track its health.

Later, the Order Service asks for a healthy Payment Service instance. The registry returns an address, and the Order Service sends the request.

The heartbeat keeps the registry updated. If the Payment Service stops sending heartbeats or fails health checks, the registry can mark it as unhealthy or remove it.

This flow belongs inside the broader [microservices architecture diagram](/posts/microservices-architecture-diagram/) because it explains how requests move between services after the system is split into separate components.

> **Key takeaway:** Service discovery depends on registration, health updates, and fresh instance data.

---

## Service Discovery Architecture Diagram

A service discovery architecture diagram usually includes three main parts:

* A caller, such as an API Gateway or another service
* A service registry
* Multiple service instances

The registry tracks which service instances are available and healthy. The gateway or service caller can use that information to find a safe target.

![Service discovery architecture diagram showing a service registry and healthy microservice instances](/assets/blog/service-discovery-in-microservices/service-discovery-architecture-diagram.webp)

*Service discovery lets callers find healthy service instances dynamically instead of using hardcoded addresses.*

This diagram keeps the idea simple. The API Gateway receives the external request, but it does not need to keep a hardcoded list of every service instance.

The Service Registry knows which User Service and Payment Service instances exist. It also receives health information from those instances.

In a real system, the gateway may query the registry directly, use platform-level discovery, or send traffic through a router or load balancer that uses discovery behind the scenes. The implementation can vary. The principle stays the same: callers should find service instances dynamically.

---

## Client-Side Service Discovery

Client-side service discovery means the calling service queries the registry directly.

The registry returns available instances, and the caller chooses which instance to call. That choice may include simple client-side load balancing, such as selecting one healthy instance from a list.

Example:

The Order Service asks the Service Registry for `payment-service`. The registry returns available Payment Service instances. The Order Service selects one and sends the request.

Pros:

* More control for the caller.
* Fewer infrastructure layers.
* Flexible service-specific routing.

Cons:

* Discovery logic must exist in the calling service.
* More client complexity.
* Possible language or framework coupling.

![Client-side service discovery pattern diagram](/assets/blog/service-discovery-in-microservices/client-side-service-discovery.webp)

*In client-side discovery, the calling service queries the registry and chooses which instance to call.*

The important detail in this diagram is who performs the lookup. The Order Service talks to the registry directly.

After it receives healthy instances, it decides which Payment Service instance should receive the request.

Client-side discovery can work well, but it should stay consistent. If every service implements discovery differently, the system becomes harder to maintain.

---

## Server-Side Service Discovery

Server-side service discovery means the caller sends a request to a known router, gateway, load balancer, or platform endpoint. That layer handles the lookup and forwards the request to a healthy service instance.

The caller does not need to know about the registry. It only needs to know the stable entry point.

Pros:

* Simpler clients.
* Centralized routing and discovery logic.
* Good fit for gateways, routers, and managed platforms.

Cons:

* Adds another infrastructure dependency.
* The router or gateway must be reliable.
* It can become a bottleneck if poorly designed.

![Server-side service discovery pattern diagram](/assets/blog/service-discovery-in-microservices/server-side-service-discovery.webp)

*In server-side discovery, the client calls a known router or gateway, and that component finds the target instance.*

This diagram shows that the client does not query the registry directly. It sends the request to a known layer.

The router, gateway, or load balancer performs the service lookup and forwards the request to a selected instance.

This approach is common when teams want simpler clients or when the platform already provides discovery and routing behavior.

---

## Client-Side vs Server-Side Service Discovery

Client-side service discovery and server-side service discovery are both valid patterns. The right choice depends on your architecture, platform, team skills, runtime environment, and operational needs.

| Feature                   | Client-side discovery               | Server-side discovery                   |
| ------------------------- | ----------------------------------- | --------------------------------------- |
| Who queries the registry? | Calling service                     | Router, gateway, or load balancer       |
| Who chooses the instance? | Calling service                     | Router, gateway, or load balancer       |
| Client complexity         | Higher                              | Lower                                   |
| Extra network hop         | Usually fewer                       | Usually one extra hop                   |
| Best for                  | Service-specific routing logic      | Simpler clients and centralized routing |
| Main risk                 | Coupling callers to discovery logic | Router or gateway dependency            |

Client-side discovery gives each caller more control, but that control comes with more client responsibility.

Server-side discovery hides discovery behind infrastructure, but that infrastructure must be available, monitored, and designed carefully.

For most beginner-to-intermediate architecture discussions, the key question is not which tool to use. The key question is where discovery happens and who chooses the instance.

> **Key takeaway:** Client-side discovery puts lookup and instance selection inside the caller. Server-side discovery moves that responsibility to a gateway, router, load balancer, or platform layer.

---

## Service Discovery and API Gateway

An API Gateway and service discovery are related, but they are not the same thing.

An API Gateway is the external entry point for clients. It often handles request routing, authentication, rate limiting, API composition, protocol translation, and client-facing API concerns.

Service discovery helps the gateway or internal services find backend instances.

A common flow looks like this:

1. Client calls API Gateway.
2. Gateway identifies the target service.
3. Gateway uses service discovery or platform routing to find an instance.
4. Gateway forwards the request.

For example, a request to `GET /orders/123` may arrive at the gateway. The gateway knows this request belongs to the Order Service. Service discovery helps find a running Order Service instance.

This is why service discovery naturally follows the [API Gateway in microservices](/posts/api-gateway-in-microservices/) topic in the learning path.

![API Gateway using service discovery to route requests](/assets/blog/service-discovery-in-microservices/api-gateway-service-discovery-flow.webp)

*The API Gateway decides which service should handle the request; service discovery helps find a healthy instance of that service.*

The gateway handles the external API request. The registry helps locate the backend service instance.

This separation keeps responsibilities clear. The gateway should not become a place where every backend address is manually hardcoded.

| Concept           | Main job                                             | Example question it answers                               |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| API Gateway       | Entry point and request routing for external clients | Which backend service should handle this API request?     |
| Service Discovery | Locates healthy service instances dynamically        | Where is a healthy instance of Payment Service right now? |

A gateway can use service discovery, but service discovery is not a gateway. Discovery is about finding service instances. The gateway is about managing the client-facing entry point and routing request traffic.

---

## Service Discovery and Load Balancing

Service discovery and load balancing are related, but they answer different questions.

Service discovery answers:

> Where are the available instances?

Load balancing answers:

> Which available instance should receive this request?

If the registry returns three healthy Payment Service instances, something still needs to choose where the next request goes. That selection may happen in the calling service, a gateway, a router, or a load balancer.

| Concept           | Main job                                       |
| ----------------- | ---------------------------------------------- |
| Service discovery | Finds current available service instances      |
| Load balancer     | Distributes traffic across available instances |

In client-side discovery, the caller may receive a list of healthy instances and choose one. In server-side discovery, the gateway, router, or load balancer may combine discovery and traffic distribution.

Keep the distinction simple: discovery finds the options; load balancing chooses among them.

---

## Service Discovery Example in an E-commerce App

Imagine an e-commerce app where a customer places an order.

The system may include:

* API Gateway
* Order Service
* Payment Service
* Inventory Service
* A service registry
* Separate databases for each service

The flow may look like this:

1. Client sends an order request to API Gateway.
2. API Gateway routes the request to Order Service.
3. Order Service needs Payment Service.
4. Order Service asks the registry for `payment-service`.
5. Registry returns a healthy Payment Service instance.
6. Order Service calls Payment Service.
7. Order Service needs Inventory Service.
8. Order Service asks the registry for `inventory-service`.
9. Registry returns a healthy Inventory Service instance.
10. Order Service calls Inventory Service.
11. If an instance is unhealthy, the registry should not return it.

![E-commerce service discovery example with order payment and inventory services](/assets/blog/service-discovery-in-microservices/ecommerce-service-discovery-example.webp)

*In an e-commerce app, Order Service can discover Payment Service and Inventory Service dynamically at runtime.*

This example shows why service discovery is not just an infrastructure detail. It affects how business flows move across services.

The Order Service should not hardcode every Payment Service or Inventory Service location. It should depend on stable service names and fresh discovery data.

The databases in the diagram also point to the next architecture topic: the **Database per Service pattern**. After services can find each other, each service also needs clear ownership of its data.

---

## Common Service Discovery Mistakes

Service discovery solves a real problem, but poor design can create new problems.

### 1. Hardcoding IP addresses or ports

Hardcoded addresses break when services move, scale, restart, or fail. Use logical service names and discovery mechanisms instead.

### 2. Not using health checks

A registry should know more than whether an instance exists. It should know whether that instance can receive traffic.

### 3. Returning unhealthy instances

If unhealthy instances stay in discovery results, callers may keep failing even when healthy instances exist.

### 4. Letting registry data become stale

Stale registry data sends callers to old or wrong locations. Heartbeats, deregistration, timeouts, and health checks help reduce this risk.

### 5. Making the registry a single point of failure

If the whole system depends on one registry and that registry fails, service communication may fail too. Production systems need resilience around discovery.

### 6. Not using timeouts or retries

Service discovery does not remove network failures. Callers still need timeouts, retry rules, and failure handling.

### 7. Confusing service discovery with API Gateway routing

The gateway decides where an external request should go at the service level. Discovery helps find the current instance.

### 8. Using inconsistent service names

If one team uses `payment-service`, another uses `payments`, and another uses `billing-service`, discovery becomes confusing.

### 9. Overengineering discovery for a tiny system

A small MVP with one service and one database may not need a full registry setup.

### 10. Treating Kubernetes or managed discovery as magic

Managed platforms can hide much of the discovery work, but developers should still understand the flow. That knowledge helps when debugging routing, health, and network failures.

---

## When You May Not Need Service Discovery

Service discovery is useful, but it is not always required.

You may not need dedicated service discovery when:

* You have a small MVP.
* You have a small monolith.
* You have one or two services.
* Deployment is static and endpoints are stable.
* A simple reverse proxy or config file is enough.
* Your managed platform already handles discovery.
* The added complexity is larger than the problem.

This is one reason it helps to understand [microservices vs monolithic architecture](/posts/microservices-vs-monolithic-architecture/) before adding microservices infrastructure.

A monolith does not usually need service discovery because its modules live inside one deployable application. A small static system may also be fine with simple configuration.

Architecture should solve real problems. Do not add Consul, Eureka, or another registry just because a diagram shows one.

---

## Service Discovery Best Practices

Good service discovery design keeps service communication flexible without making the system harder to operate than necessary.

### 1. Use logical service names

Call services by stable names such as `payment-service`, `order-service`, or `inventory-service`.

### 2. Avoid hardcoded IP addresses

Physical addresses change. Service names should remain stable.

### 3. Register and deregister instances automatically

Instances should register when they start and deregister when they stop. Manual registration creates stale data and mistakes.

### 4. Use health checks and heartbeats

Health checks confirm whether an instance can serve traffic. Heartbeats tell the registry the instance is still alive.

### 5. Keep the registry highly available

If discovery is critical to communication, the registry or discovery layer should not be a fragile single instance.

### 6. Use timeouts and retries

Discovery tells you where to send a request. It does not guarantee the request will succeed.

### 7. Cache discovery results carefully

Caching can reduce registry calls, but stale cache data can send traffic to dead instances.

### 8. Monitor registry health

If discovery is slow, stale, or unavailable, services may fail in confusing ways.

### 9. Keep service naming consistent

Document service names and make them part of the architecture.

### 10. Understand what your platform already provides

Some platforms already provide DNS-based or managed discovery. Understand what exists before adding another tool.

### 11. Document service names and ownership

Every service should have a clear name, purpose, owner, and communication contract.

---

## Common Service Discovery Tools

Common service discovery tools in microservices include Consul, Eureka, Kubernetes Services and DNS, etcd, ZooKeeper, AWS Cloud Map, and platform or service mesh discovery mechanisms.

These tools solve similar discovery problems in different environments. Some are registries. Some are built into orchestration platforms. Some are part of broader infrastructure stacks.

Tool choice depends on your deployment platform, team skills, runtime environment, reliability needs, and whether your system already runs on Kubernetes or a managed platform.

This article is not a Consul, Eureka, Kubernetes, or AWS Cloud Map tutorial. For now, focus on the architecture idea: services need a way to find healthy instances dynamically.

---

## FAQ

### 1. What is service discovery in microservices?

Service discovery in microservices is the process of finding the current network location of a service instance at runtime. It helps callers use logical service names instead of hardcoded IP addresses and ports.

### 2. Why do microservices need service discovery?

Microservices need service discovery because service instances can scale, restart, fail, and move. Discovery helps callers find available instances without manual configuration.

### 3. What is a service registry?

A service registry is a live directory of service instances. It stores service names, addresses, ports, instance IDs, health status, and metadata.

### 4. How do microservices find each other?

Microservices find each other through a discovery mechanism such as a service registry, DNS, API Gateway, load balancer, orchestration platform, or managed service discovery system.

### 5. What is the difference between client-side and server-side service discovery?

In client-side service discovery, the calling service queries the registry and chooses the instance. In server-side service discovery, a gateway, router, load balancer, or platform layer performs the lookup and forwards the request.

### 6. Is service discovery the same as load balancing?

No. Service discovery finds available service instances. Load balancing distributes traffic across available instances.

### 7. Is service discovery the same as an API Gateway?

No. An API Gateway is an external entry point and routing layer for client requests. Service discovery helps locate backend service instances dynamically.

### 8. Is Kubernetes service discovery enough?

It can be enough for many Kubernetes-based systems, because Kubernetes provides service names and DNS-based discovery. But teams still need to understand health, routing, readiness, and how services are resolved inside their platform.

---

## Conclusion

Service discovery in microservices solves the dynamic-location problem.

Service instances start, stop, scale, fail, recover, and move. Hardcoded addresses make that movement difficult to manage.

Service discovery helps callers find service instances without depending on fixed IP addresses or ports. A service registry stores service names, instance locations, and health information. Health checks and heartbeats help keep that data fresh.

Client-side service discovery lets the caller query the registry and choose an instance. Server-side service discovery moves that responsibility to a gateway, router, load balancer, or platform layer.

Service discovery works closely with API Gateway and load balancing, but it is not the same thing. The gateway handles the client-facing entry point. Discovery finds service instances. Load balancing chooses how to distribute traffic across available instances.

It is useful for dynamic systems, but not every project needs a dedicated registry from day one. Small systems, static deployments, and managed platforms may not need extra discovery infrastructure.

The next logical topic is the **Database per Service pattern**. After services can find each other, each service also needs clear ownership of its data.
