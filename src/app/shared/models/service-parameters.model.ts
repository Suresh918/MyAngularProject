
export interface ServiceParameters {
  services: Service[];
}

export interface Service {
  'name': string;
  'label': string;
  'categories': Category [];
}

export interface Category {
  'name': string ;
  'parameters': Parameter[];
}

export interface Parameter {
  'name': string;
  'values': Value[];
}

export interface Value {
  type?: string;
  name: string;
  label: string;
  locale: string;
  sequence: number;
  help?: string;
}

export interface FormFieldConfiguration {
  service: ConcreteServiceType[];
}

export interface ConcreteServiceType {
  'ID'?: string;
  'name': string;
  'label'?: string;
  'group': ConcreteGroupType[];
}

export interface ConcreteGroupType {
  'ID'?: string;
  'name': string;
  'label': string;
  'parameter': ConcreteParameterType[];
}

export interface ConcreteParameterType {
  'ID'?: string;
  'name': string;
  'label'?: string;
  'placeHolder'?: string;
  'help'?: any;
}
