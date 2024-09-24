import * as H from '@pagopa/handler-kit';

const isValidationError = (e: Error): e is H.ValidationError =>
  e.name === 'ValidationError';

export const errorToProblemJson = (
  error: Error,
): H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode> => {
  if (isValidationError(error))
    return H.problemJson({
      detail: 'Your request is not valid',
      status: 422,
      title: 'Validation Error',
      type: '/problem/validation-error',
      violations: error.violations,
    });
  else
    return H.problemJson({
      detail: error.name,
      status: 500,
      title: 'Internal Server Error',
    });
};
