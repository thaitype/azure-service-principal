import { execa, Options as ExecaOption } from 'execa';

/**
 * Service principal
 */
export interface ServicePrincipal {
  appId: string;
  displayName: string;
  /**
   * The output includes credentials that you must protect. Be sure that you do not include these credentials in your code or check the credentials into your source control.
   */
  password: string;
  tenant: string;
}

/**
 * Service principal for SDK authentication
 *
 * Output format when using `--json-auth` or `--sdk-auth` flag
 */
export interface ServicePrincipalForSdkAuth {
  /**
   * The client ID for the service principal.
   */
  clientId: string;
  /**
   * The client secret for the service principal.
   *
   * The output includes credentials that you must protect. Be sure that you do not include these credentials in your code or check the credentials into your source control.
   */
  clientSecret: string;
  /**
   * The subscription ID.
   */
  subscriptionId: string;
  /**
   * The tenant ID.
   */
  tenantId: string;
  /**
   * The active directory endpoint.
   *
   * @default 'https://login.microsoftonline.com'
   */
  activeDirectoryEndpointUrl: string;
  /**
   * The resource manager endpoint.
   *
   * @default 'https://management.azure.com/'
   */
  resourceManagerEndpointUrl: string;
  /**
   * The active directory graph resource ID.
   *
   * @default 'https://graph.windows.net/'
   */
  activeDirectoryGraphResourceId: string;
  /**
   * The SQL management endpoint.
   *
   * @default 'https://management.core.windows.net:8443/'
   */
  sqlManagementEndpointUrl: string;
  /**
   * The gallery endpoint.
   *
   * @default 'https://gallery.azure.com/'
   */
  galleryEndpointUrl: string;
  /**
   * The management endpoint.
   *
   * @default 'https://management.core.windows.net/'
   */
  managementEndpointUrl: string;
}

export interface ServicePrincipalCreateParameters<TJsonAuth extends boolean> {
  /**
   * Display name of the service principal. If not present, default to azure-cli-%Y-%m-%d-%H-%M-%S where the suffix is the time of creation.
   */
  name?: string;
  /**
   * Role of the service principal.
   */
  role?: string;
  /**
   * list of scopes the service principal's role assignment applies
   */
  scopes?: string[];
  /**
   * Number of years for which the credentials will be valid. Default: 1 year.
   */
  years?: number;
  /**
   * Output service principal credential along with cloud endpoints in JSON format
   */
  jsonAuth?: TJsonAuth;
  /**
   * Output service principal credential along with cloud endpoints in JSON format
   *
   * @deprecated Use `jsonAuth` instead.
   */
  sdkAuth?: TJsonAuth;
}

export type ServicePrincipalResult<TJsonAuth extends boolean> = TJsonAuth extends true
  ? ServicePrincipalForSdkAuth
  : ServicePrincipal;

/**
 * Create a service principal and configure its access to Azure resources.
 * Command line wrapper for `az ad sp create-for-rbac`
 *
 * Due to this issue: https://github.com/Azure/azure-sdk-for-go/issues/596
 * Azure REST API does not provide a high-level API like the Azure CLI does. As `az ad sp create-for-rbac`
 * @see https://learn.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac()
 *
 * In order to create a service principal, we need to access Microsoft Graph API.
 * @see https://learn.microsoft.com/en-us/graph/api/serviceprincipal-post-serviceprincipals?view=graph-rest-1.0&tabs=javascript
 *
 * @note Compitable with Azure CLI 2.52.0 or above
 *
 */
export async function createServicePrincipalAndAssignRole<TJsonAuth extends boolean = false>(
  config: ServicePrincipalCreateParameters<TJsonAuth>,
  option?: {
    extraArgs?: string[];
    execaOption?: ExecaOption;
  }
) {
  const name: string[] = config.name ? ['--name', config.name] : [];
  const role: string[] = config.role ? ['--role', config.role] : [];
  const scopes: string[] = config.scopes ? ['--scopes', ...config.scopes] : [];
  const years: string[] = config.years ? ['--years', config.years.toString()] : [];
  const jsonAuth: string[] = config.jsonAuth ? ['--json-auth'] : [];
  const sdkAuth: string[] = config.sdkAuth ? ['--sdk-auth'] : [];
  const extraArgs: string[] = option?.extraArgs ?? [];
  const { stdout } = await execa(
    'az',
    ['ad', 'sp', 'create-for-rbac', ...name, ...role, ...scopes, ...years, ...jsonAuth, ...sdkAuth, ...extraArgs],
    option?.execaOption
  );
  const servicePrincipal = JSON.parse(stdout) as ServicePrincipalResult<TJsonAuth>;
  return servicePrincipal;
}
