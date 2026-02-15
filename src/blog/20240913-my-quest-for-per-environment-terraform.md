---
title: "My quest for per-environment Terraform state"
slug: "my-quest-for-per-environment-terraform"
pubDate: 2024-09-13
description: "I'm getting up and running with infrastructure for a new project, and had to make a big decision: how should I manage the state for all my different environments?"
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/95df6876-aa9e-4317-a048-511a521e9c70_4752x3168.jpeg"
  alt: "Man with a backpack embarking down a road"
  caption: "Man with a backpack embarking down a road"
---

I’ve reached a point with [Ocuroot](https://www.ocuroot.com/) where I’m ready to start deploying to some “real” environments, rather than just running everything locally. So my first step is to create some kubernetes clusters - granted I could do this with something serverless, or drop a binary on a VM, but since I’m building a deployment tool for larger teams, I’ve gotta build up that k8s muscle!

In this early stage, Ocuroot is effectively on-prem only, so I’m going to potentially need a lot of environments for various testing scenarios and demos. To manage cost, most of these environments would also be ephemeral, possibly only existing while I’m prepping and recording a demo or running a test.

I chose [Civo](https://www.civo.com/) for hosting, both because of their low cost, and the quick start time for their k8s clusters (typically as low as 90 seconds!). So far they’ve been great on the support side, with questions in Slack getting really quick responses.

# An immediate stumbling block

Initially, I thought “great, I’ll just pass in the environment name as variable, then I can set them up and tear them down at-will". I imagined a workflow for creating and disposing of a demo cluster looking something like:

```
$ TF_VAR_environment=demo1 terraform apply —auto-approve
…
$ TF_VAR_environment=demo1 terraform destroy —auto-approve
```

So I set up an object store and configured the backend in my _terraform.tf_:

```
terraform {
    # ...
    backend "s3" {
        endpoints = {
            s3 = "https://objectstore.nyc1.civo.com"
        }

        bucket = "example-terraform-backends"
        key = "${var.environment}/state.tfstate"

        # Deactivate a few AWS-specific checks
        # ...
        region                      = "NYC1"
    }
}

variable environment {
    type = string
}
```

This would separate out the state for each environment into its own path within the bucket. But as soon as I ran `terraform init`, I was greeted with an error:

```
Initializing the backend...
╷
│ Error: Variables not allowed
│ 
│   on terraform.tf line 17, in terraform:
│   17:         key = "${var.environment}/state.tfstate"
│ 
│ Variables may not be used here.
╵
```

Whelp, back to the drawing board. I needed a new approach.

I ended up exploring three different solutions before settling on my favorite.

# GitOps-y Shared State

The first option I considered was to consolidate the state for each environment and manage them with modules, so the object store key would be static:

```
bucket = "example-terraform-backends"
key = "state.tfstate"
```

And there would be a module call for each desired environment, along the lines of:

```
module "demo1" {
  source = "./cluster"
  nodes  = 2
}

module "staging" {
  source = "./cluster"
  nodes  = 3
}

module "production" {
  source = "./cluster"
  nodes  = 6
}
```

This approach would result in having a clear definition for every cluster, and would provide GitOps-like control over my exact intent for the infrastructure, which could be updated with a single call to `terraform apply`.

Having all the state in a single place creates some serious limitations.

Running any Terraform operation would require you to have access to every cluster, which could be a problem for larger teams with strong security requirements.  
  
More applicable for my solo endeavors, having every cluster tied to the same module means that it will be difficult to try out changes to the module itself within a staging environment before promoting it to production. It could be done by having the module in a separate, versioned repo, but releasing any module change would then require multiple cycles of editing the cluster definitions and re-applying.

On to the next option.

# Workspaces

[Terraform Workspaces](https://developer.hashicorp.com/terraform/cli/workspaces) allow you to create separate instances of state for a single module and switch between them on-demand. This would allow me to create a workspace for each cluster and update them separately. So you could create and provision a new cluster like the below:

```
$ terraform workspace new demo2
$ terraform workspace select demo2
$ terraform apply --auto-approve 
```

You can then refer to the name of the workspace using `${terraform.workspace}`.

Hashicorp’s own documentation lists [some caveats](https://developer.hashicorp.com/terraform/cli/workspaces#when-not-to-use-multiple-workspaces) as to when workspaces are not a suitable choice. The most glaring one being similar to one of the problems of pure shared state - everyone has to have access to everything.

In my case, I moved on from this option for a very subtle reason: having to create a new workspace explicitly. Assuming I set up a CI pipeline to provision each environment, I would need to either ignore errors from `terraform workspace new`, or do a little dance to check if the workspace existed before creating it.

This brings us to our final option, and the one I eventually went with.

# My choice: Partial Backend Configs

Terraform allows you to provide [partial configuration](https://developer.hashicorp.com/terraform/language/backend#partial-configuration) for backends, primarily to avoid storing credentials in your `.tf` files - “variables not allowed” goes for your credentials too!

Partial configuration allows you to provide the state key at initialization time on the command line:

```
terraform init \
  --backend-config="access_key=$CIVO_TF_BACKEND_ACCESS_KEY" \
  --backend-config="secret_key=$CIVO_TF_BACKEND_SECRET_KEY" \
  --backend-config="key=$TF_VAR_environment/terraform.tfstate" \
  -reconfigure
```

So the `environment` var can be used both to select your state and provide the environment name to the underlying resources. If you need to switch environments, you change `$TF_VAR_environment` and re-run the initialization command, with the `-reconfigure` flag working the magic to update your configuration.

This ticked off most of the items on my list: it allows me to re-use the same Terraform code for each environment, I can easily switch between environments in CI, and for later on, provides really nice separation of the different states.  
  
Of course, no solution is foolproof and this approach opens you up to potential issues like changing `$TF_VAR_environment` and forgetting to re-initialize - which would at best result in an error, at worst rebuild a cluster with the wrong name. But with a little care and a well-crafted CI setup, I think it will serve me well!

# What’s your approach?

Thanks for following my little quest for better state management. I found what worked for me, but maybe you do things differently. Do you prefer one of the other solutions? Maybe you use a fourth option! I’d love to hear more in the comments.
