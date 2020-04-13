import {
  isObject, isFunction, isString, isArray, isNil, isEmpty, every,
} from 'lodash';
import { IS_DEV } from '@utils';
import defaultReporter, { isReporter, JobStatuses, ResultDetailTypes } from '@core/workflow/reporter';

export * from '@core/workflow/reporter';
export { default as defaultReporter } from '@core/workflow/reporter';
export { default as createStepper } from '@core/workflow/stepper';

// Some texts.
const Strings = {
  VALIDATE_CONFIGURATIONS: 'core.validateConfigurations',
  NO_JOB_CONFIGURED: 'no job configured',
};

/**
 * @typedef {object} Job A workflow job.
 *
 * @property {string} name The job's name.
 * @property {() => any} validate The job's validate function.
 * @property {(object) => any} run The job's run function.
 */

/**
 * @typedef {import('@core/workflow/reporter').Reporter} Reporter
 * @typedef {import('@core/workflow/stepper').Progress} Progress
 */

/**
 * Create a workflow job.
 *
 * @param {string} name The job's name.
 * @param {() => any} validate The job's validate function.
 * @param {(object) => any)} run The job's run function.
 * @param {object} args The job's arguments.
 * @returns {Job} The created job.
 */
export function createJob(name, validate, run, args) {
  if (IS_DEV) { // Validate arguments.
    if (!isString(name)) throw new TypeError('createJob.name must be a string.');
    if (!isNil(validate) && !isFunction(validate)) {
      throw new TypeError('createJob.validate must be a function or nullish.');
    }
    if (!isFunction(run)) throw new TypeError('createJob.run must be a function.');
    if (!isObject(args)) throw new TypeError('createJob.args must be an object.');
  }

  return {
    name,
    validate: validate ? () => validate(args) : undefined,
    run: (opts = {}) => run(args, opts),
  };
}

/**
 * Check if an object is a valid job.
 *
 * @param {any} obj The object to check.
 * @returns {boolean} Whether the object is a valid job.
 */
export function isJob(obj) {
  return isObject(obj)
    && isString(obj.name)
    && (isNil(obj.validate) || isFunction(obj.validate))
    && isFunction(obj.run);
}

/**
 * Run a workflow, which essentially is a list of jobs.
 *
 * @param {Job[]} jobs The array of jobs to run.
 * @param {object} opts Options.
 * @param {Reporter} opts.reporter A reporter for the workflow to report progress, errors and
 * results.
 * @returns {boolean} Whether the workflow run succeeded or not. A workflow is considered succeeded
 * if all of its jobs succeeded, otherwise it's considered failed.
 */
export default function runWorkflow(jobs, { reporter } = { reporter: defaultReporter }) {
  if (IS_DEV) { // Validate arguments.
    if (!isArray(jobs) || !every(jobs, isJob)) throw new TypeError('runWorkflow.jobs must be an array of jobs.');
    if (!isReporter(reporter)) throw new TypeError('runWorkflow.opts.reporter must be a reporter.');
  }

  // Run all jobs' validations.
  reporter.newJob({ name: Strings.VALIDATE_CONFIGURATIONS });

  if (isEmpty(jobs)) {
    // Fail if there's no job.
    reporter.endJob({
      status: JobStatuses.FAILED,
      description: Strings.NO_JOB_CONFIGURED,
    });
    return false;
  }

  // An array to keep all jobs' validation errors.
  const errors = [];

  jobs.forEach((job) => {
    // Ignore if the job doesn't have validation.
    if (!job.validate) return;

    // Report validating.
    reporter.updateJob({ description: job.name });

    // Run the job's validation.
    const jobErrors = job.validate();
    if (isNil(jobErrors)) return; // No error.

    if (IS_DEV) { // Validate the job's validate return(s).
      if (!isObject(jobErrors) || !every(
        Object.values(jobErrors), (errs) => every(errs, isString),
      )) {
        throw new TypeError(`Job '${job.name}''s \`validate\` function returned invalid data. `
          + 'All jobs\' `validate` functions must return errors as an object of array of error '
          + 'messages or `undefined` if there\'s no error.');
      }
    }

    // Map the job's validation errors into a single array of validation errors.
    Object.entries(jobErrors).forEach(([arg, errs]) => {
      errors.push(...errs.map((err) => ({
        type: ResultDetailTypes.VALIDATION_ERROR,
        job: job.name,
        argument: arg,
        message: err,
      })));
    });
  });

  if (errors.length > 0) {
    // If validation has error(s), report the errors and fail.
    reporter.endJob({
      status: JobStatuses.FAILED,
      details: errors,
    });
    return false;
  }

  // Report that validation has finished successfully.
  reporter.endJob({ status: JobStatuses.SUCCEEDED });

  // Run all jobs, fails if any job fails, succeeds if all jobs succeed.
  let result = true;
  jobs.forEach((job) => {
    // Report that a new job is in run.
    reporter.newJob({ name: job.name });

    // Build progress object for the job to report its progress.
    /** @type {Progress} */
    const progress = {
      set description(description) { reporter.updateJob({ name: job.name, description }); },
    };

    try {
      job.run({ progress });

      // Report job succeeded.
      reporter.endJob({ status: JobStatuses.SUCCEEDED });
    } catch (err) {
      // One job failed, keep running other jobs but workflow is now considered failed.
      result = false;

      // Report that the current job has failed.
      reporter.endJob({
        status: JobStatuses.FAILED,
        description: err.message,
      });
    }
  });

  return result;
}
