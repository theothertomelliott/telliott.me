---
title: "The Importance of Secrets in CI/CD"
slug: "the-importance-of-secrets-in-cicd"
pubDate: 2024-12-27
description: "By their nature, CI/CD systems will be making changes to sensitive systems. You need a way to provide your tools with the right access, safely. This makes secrets are a key part of any CI/CD platform."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/d2507ecf-0be8-4bed-b9c1-3f15219e990b_3461x2530.jpeg"
  alt: "Photo by Noelle Otto"
  caption: "Photo by Noelle Otto: https://www.pexels.com/photo/photography-of-person-peeking-906018/"
---

Deploying changes to production requires a level of access to production that could potentially cause serious problems. If this access fell into the wrong hands, a bad actor could modify or steal data, or even shut down your services entirely. Restricting this access to the right people and the appropriate CI services is critical.

There are a few different ways to manage access from automated systems, but they all pretty much boil down to the automated system having a piece of data that nobody else does. In other words, keeping something secret. Turn this adjective into a noun, and we’re talking about managing secrets.

# What makes a secret, secret?

The absolute minimum requirement for considering data a “secret” is only that it is identified as such. This distinction will encouraging developers to take care with their use and storage (like not putting them in a source repo), and the system may also provide a permissions model to limit access. This is where [kubernetes secrets](https://kubernetes.io/docs/concepts/configuration/secret/) lie by default, being a separate resource type whose access isn’t restricted (and aren’t encrypted at rest) until explicitly configured as such.

Storing secrets in an encrypted manner is a common additional requirement, and often demanded by compliance and security teams. This helps prevent secrets from being exposed if an underlying database is breached.

It is also common to redact secrets in the UI or logs, so they cannot be accidentally exposed through regular use. Within a UI, interactions with secrets may also be limited. Some UIs will only allow you to write to secrets and not read them, others will permit writing and verifying existing values, but some may permit someone with appropriate access to read and write secrets as they see fit.

# Secrets in CI platforms

Most CI platforms will have their own options for managing secrets. For example, GitHub Actions permits configuring write-only secrets at the repo or organization level. These secrets can then be passed in to individual steps of a workflow, and are redacted in the logs.

You may also see a separate mechanism for storing variables that are not secret. This allows you to keep a similar mental model for managing settings without having to treat everything as a sensitive value. When there is no such option, I’ve seen engineers resort to storing all kinds of configuration values in secrets, right down to hostnames. This can cause confusion and frustration when you suddenly find that URLs are redacted in your logs!

# Third Party Secret Storage

Even if your CI platform provides secret management tools, it’s highly unlikely it will be the only service you’ll be managing that needs to use secrets. So you may want to rely on a third-party service as a central place for managing your secrets.

There are a number of options available for secrets management. There are the aforementioned built-in secrets in Kubernetes, and [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets), a controller that allows you to encrypt secrets so they could even be stored in Git repos.

The big cloud providers all have their own in-built secret management services (along with very robust access control in general). AWS has [Secrets Manager](https://docs.aws.amazon.com/secretsmanager/), GCP has (drum roll) [Secrets Manager](https://cloud.google.com/security/products/secret-manager?hl=en), and Azure has [Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview).

There are also third party offerings with hosted and self-hosted options, like [Infisical](https://infisical.com/) and [Hashicorp Vault](https://www.hashicorp.com/products/vault).

# There’s a lot more to it!

When building your CI/CD solution, you will undoubtedly have to deal with secrets, and this post provided a very high level overview of why secrets are important, how to evaluate your options and some of the options that are available.  
  
But there’s way more to the topic, including structuring access to secrets for large teams, rotation practices for credentials, and how to prevent, detect and handle the accidental exposure of secrets. Be sure to subscribe for future posts on these and other topics!
