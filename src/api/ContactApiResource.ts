import Repository from '../repositories/Repository';
import ApiResourceInterface from '@/interfaces/ApiResourceInterface';
import ContactParamsInterface from '@/interfaces/ContactParamsInterface';
import ContactDataInterface from '@/interfaces/ContactDataInterface';
import ResourceParameterInterface from '@/interfaces/ResourceParameterInterface';

export default class ContactApiResource implements ApiResourceInterface {
  public params?: ContactParamsInterface;
  public resource: ContactDataInterface;
  public resourcePathName: string;

  constructor() {
    this.params = {};
    this.resource = {};
    this.resourcePathName = '';
  }

  /**
   * Assigns parameter values to property
   * @param params ResourceParameterInterface
   *
   * @return ContactApiResource
   */
  public setParams(params?: ResourceParameterInterface): ContactApiResource {
    if (params) {
      this.params = params.resource;
    }

    return this;
  }

  /**
   * Assigns the resource url of API endpoint to property
   *
   * @param resourcePathName string
   * @returns {ContactApiResource}
   */
  public setResourcePath(resourcePathName: string): ContactApiResource {
    this.resourcePathName = resourcePathName;

    return this;
  }

  /**
   * Retrieves resource from the API Endpoint
   *
   * @returns {Promise<*>}
   */
  public async delete(): Promise<any> {
    this.resource = await Repository.delete(
      `${this.resourcePathName}/${this.params.id}`);
  }

  /**
   * Retrieves resource from the API Endpoint
   *
   * @returns {Promise<*>}
   */
  public async get(): Promise<any> {
    this.resource = await Repository.get(`${this.resourcePathName}`,
      {
        params: this.params,
      },
    );

    return this.resource;
  }

  public async patch(): Promise<any> {
    this.resource = await Repository.patch(
      `${this.resourcePathName}`,
      this.params,
    );
  }

  /**
   * Retrieves resource from the API Endpoint
   *
   * @returns {Promise<*>}
   */
  public async post(): Promise<any> {
    this.resource = await Repository.post(
      `${this.resourcePathName}`,
      this.params,
    );

    return this.resource;
  }
}
