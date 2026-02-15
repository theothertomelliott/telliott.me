---
title: "How to fix Domain Restricted Sharing errors for Google Cloud Run"
slug: "how-to-fix-domain-restricted-sharing"
pubDate: 2024-11-15
description: "GCP provides a wealth of security options, but with this flexibility it can be very easy to accidentally paint yourself into a corner. This post explores how to get out of one such corner."
author: "Tom Elliott"
image:
  url: "https://substack-post-media.s3.amazonaws.com/public/images/09e9bd2c-d9a2-4156-bafe-991339e499fd_5472x3648.jpeg"
  alt: "A phone, book, laptop and mouse locked up with a chain"
  caption: "A phone, book, laptop and mouse locked up with a chain"
---

I was recently experimenting with [Google Cloud Run](https://cloud.google.com/run?hl=en) and almost immediately hit a really confusing error when deploying a publicly available service as in GCP’s [quickstart guide](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service).

```
ERROR: (gcloud.projects.set-iam-policy) FAILED_PRECONDITION:
One or more users named in the policy do not belong to a permitted customer.
```

And attempting to visit the service URL resulted in a 403 error in the browser:

```
Error: Forbidden
Your client does not have permission to get URL / from this server.
```

A little research revealed that this error is a result of [Domain Restricted Sharing](https://cloud.google.com/resource-manager/docs/organization-policy/restricting-domains), a security measure that limits who can be granted permissions on your cloud resources. This is intended as a guardrail to prevent third parties from being granted access to view (or worse) modify cloud resources - an important control to protected against social engineering, among other things.

In my case, this seemed to be enabled by default because my domain was attached to a Google Workspace account, and the setting was inherited by all my projects.

I also found that this error could also manifest in the UI as the slightly less vague error:

```
Policy update failed

A domain restriction organization policy is in place. Only members of allowed domains can be added as members of the policy. Correct the member emails and try again.
```

I found a few resources with instructions on how to change these settings, but had to bounce around them to get all the pieces I need. So in this post I’ll be sharing the process I had to go through in my account just in case anyone else finds themself in the same predicament.

# Make sure you can edit org policies

This first step was the big missing piece for me and the one that I found most confusing.

By default, administrators in a GCP account don’t have permission to change policies like Domain Restricted Sharing. But they do have the ability to grant themselves this permission.

Assuming you’re an admin, you can grant yourself permission by:

1.  Opening the [IAM admin page](https://console.cloud.google.com/iam-admin/iam) for the top-level project in your account - note that you can’t set this permission separately in your child projects.
    
2.  Selecting the principal with your email address and clicking the edit icon on the right.
    
3.  Click “Add Another Role“ and choose “Organization Policy Administrator”
    
4.  Click “Save”.
    

# Allow all domains for an org

**A warning**: Once complete this step, you will be able to grant permissions on the resources in this account to anyone, so mistakes could be costly. At the very least, I would recommend creating a dedicated project for your public resources. I’ve included a link to a more robust solution later in this post.

1.  Select the project where you want to deploy Cloud Run Services, and open the [Organization Policies page](https://console.cloud.google.com/iam-admin/orgpolicies/list). This is an option under the IAM & Admin section if you want to click through to it.
    
2.  Enter “Domain restricted sharing” in the filter box and select that policy.
    
3.  Click “Manage Policy” in the top right. If this is disabled, you should double check you have the policy admin role we assigned in the previous section.
    
4.  Ensure “Override parent’s policy” is selected.
    
5.  Delete any exisiting rules, and click “Add a Rule”
    
6.  Select “Allow All” under “Policy values” and click “Done”
    
7.  Click “Set Policy” to save your changes.
    

You should now be able to deploy publicly-available Cloud Run Services in this project!

# More robust approaches

Since I’m currently working on my project solo and only wanted to deploy a few services, the above approach was fine for me. But if you’re in a larger organization with stricter security requirements, you will want to configure something a little more robust.  
  
Google put out a great, comprehensive article on the subject, which provides great recommendations for how to work with this setting: [How to create public Cloud Run services when Domain Restricted Sharing is enforced](https://cloud.google.com/blog/topics/developers-practitioners/how-create-public-cloud-run-services-when-domain-restricted-sharing-enforced).
