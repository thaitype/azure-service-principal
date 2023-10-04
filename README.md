# @thaitype/azure-service-principal

`az ad sp` command line wrapper with Type Support (Azure AD Service Principal)

## Feature
- Wrapper with Azure CLI command
- Using `execa` for manage subprocess command

## Install

```
npm install @thaitype/azure-service-principal
```

## Docs

### az ad sp create-for-rbac

Manage Azure Active Directory service principals for automation authentication.

See: https://learn.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac()

```typescript
import { createServicePrincipalAndAssignRole } from '@thaitype/azure-service-principal';

const data = await createServicePrincipalAndAssignRole({
  name: 'local test run from nodejs 1',
  role: 'Contributor',
  scopes: ['/subscriptions/49d194b0-8953-432d-abec-cfcab142e7d1/resourceGroups/my-group'],
});
console.log(data);
// {
//   appId: 'f3ae9842-64d0-4b59-8af4-b29dde4441ac';
//   displayName: 'local test run from nodejs 1';
//   password: 'secret';
//   tenant: '1953aeab-cf38-4de1-8397-442f12f331a3';
// }

const data2 = await createServicePrincipalAndAssignRole({
  name: 'local test run from nodejs 2',
  role: 'Contributor',
  scopes: ['/subscriptions/49d194b0-8953-432d-abec-cfcab142e7d1/resourceGroups/my-group'],
  jsonAuth: true,
});

console.log(data2);
// {
//   clientId: 'fc826c62-6269-11ee-8c99-0242ac120002';
//   clientSecret: 'secret';
//   subscriptionId: '49d194b0-8953-432d-abec-cfcab142e7d1';
//   tenantId: '1953aeab-cf38-4de1-8397-442f12f331a3';
//   activeDirectoryEndpointUrl: 'https://login.microsoftonline.com';
//   resourceManagerEndpointUrl: 'https://management.azure.com/';
//   activeDirectoryGraphResourceId: 'https://graph.windows.net/';
//   sqlManagementEndpointUrl:  'https://management.core.windows.net:8443/';
//   galleryEndpointUrl: 'https://gallery.azure.com/';
//   managementEndpointUrl: 'https://management.core.windows.net/';
// }
```