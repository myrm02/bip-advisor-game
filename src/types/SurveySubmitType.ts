type CustomAttributes = {
  string: string,
}

export type SurveySubmitResponse = {
  firstName: string,
  lastName: string, 
  preferredLanguage: string,
  tags: string[],
  customAttributes: CustomAttributes,
}