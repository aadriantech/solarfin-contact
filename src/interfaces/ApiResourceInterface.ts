import ResourceParameterInterface from '@/interfaces/ResourceParameterInterface';
import ContactApiResource from '@/api/ContactApiResource';

interface ApiResourceInterface {
  params?: object;
  resource: object;
  resourcePathName: string;

  /**
   * Assigns parameter values to property
   *
   * @param params object required parameters of the API endpoint
   * @returns {ContactApiResource}
   */
  setParams(params: ResourceParameterInterface): ContactApiResource;

  /**
   * Assigns the resource url of API endpoint to property
   *
   * @param resourcePathName string
   * @returns {ContactApiResource}
   */
  setResourcePath(resourcePathName: string): ApiResourceInterface;

  /**
   * Retrieves contact from the API Endpoint
   *
   * @returns {Promise<*>}
   */
  get(): Promise<any>;

  /**
   * Posts contact from the API Endpoint
   *
   * @returns {Promise<*>}
   */
  post(): Promise<any>;

}

export default ApiResourceInterface;
