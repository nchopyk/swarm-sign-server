import { ApiError } from '../../errors/error.types';

const stateMachineErrors = {
  transitionCannotBeAppliedFromState: (context: { transitionName: string, state: string }): ApiError => ({
    errorType: 'internal.transitionCannotBeAppliedFromState',
    message: `Transition '${context.transitionName}' cannot be applied from state '${context.state}'`,
    context
  }),

  transitionNotDefinedInStateMachineConfig: (context: { transitionName: string }): ApiError => ({
    errorType: 'internal.transitionNotDefinedInStateMachineConfig',
    message: `Transition '${context.transitionName}' not defined in state machine config`,
    context
  }),
};


export default stateMachineErrors;
