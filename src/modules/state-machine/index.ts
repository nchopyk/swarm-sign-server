import Errors from '../../errors';
import stateMachineErrors from './state-machine.errors';
import { StateMachineConfig, State, IStateMachine, IStateMachineEntity, StateTransition, StateMachineContext } from './state-machine.types';


class StateMachineEntity<T> implements IStateMachineEntity<T> {
  private currentState: State;
  private readonly originEntity: T;
  private context: StateMachineContext;

  constructor(
    private readonly stateMachine: IStateMachine<T>,
    private entity: T,
  ) {
    this.currentState = stateMachine.getStateFrom(entity);
    this.originEntity = Object.assign({}, entity);
    this.context = {};
  }

  public withContext(context: StateMachineContext): StateMachineEntity<T> {
    this.context = context;

    return this;
  }

  public async can(transitionName: string): Promise<boolean> {
    const transition = this.getTransition(transitionName);
    if (!transition) return false;

    const isTransitionFromCurrentStatePossible = transition.from.includes(this.currentState);
    if (!isTransitionFromCurrentStatePossible) return false;

    if (transition.validate) return transition.validate(this.entity, this.context);

    return true;
  }

  public async canThrow(transitionName: string): Promise<void> {
    const transitionPossible = await this.can(transitionName);

    if (!transitionPossible) {
      throw new Errors.InternalError(stateMachineErrors.transitionCannotBeAppliedFromState({ transitionName, state: this.currentState }));
    }
  }

  public async to(transitionName: string): Promise<void> {
    await this.canThrow(transitionName);
    await this.apply(transitionName);
  }

  public async apply(transitionName: string): Promise<void> {
    const transition = this.getTransition(transitionName);
    if (!transition) throw new Errors.InternalError(stateMachineErrors.transitionNotDefinedInStateMachineConfig({ transitionName }));

    try {
      if (transition.preHandler) {
        await transition.preHandler(this.entity, this.context, this);
      }

      this.currentState = transition.to;
      this.entity = this.setStateTo(this.entity, transition.to);

      await this.persistStateFor(this.entity, transition.to);

      if (transition.postHandler) {
        await transition.postHandler(this.entity, this.context, this);
      }

      if (transition.success) {
        transition.success(this.entity, this.context);
      }
    } catch (error) {
      if (transition.failure) {
        transition.failure(error as Error, this.originEntity as T, this.entity as T, this.context);
        return;
      }

      throw error;
    }
  }

  private setStateTo(entity: T, state: State): T {
    return this.stateMachine.getConfig().setState(entity, state);
  }

  private persistStateFor(entity: T, state: State): void | Promise<void> {
    return this.stateMachine.getConfig().persist(entity, state, this.context);
  }

  private getTransition(transitionName: string): StateTransition<T> | undefined {
    return this.stateMachine.getConfig().transitions[transitionName];
  }
}


class StateMachine<T> implements IStateMachine<T> {
  constructor(private readonly config: StateMachineConfig<T>) {
  }

  public from(entity: T) {
    return new StateMachineEntity<T>(this, entity);
  }

  public getStateFrom(entity: T): State {
    return this.config.getState(entity);
  }

  public getConfig(): StateMachineConfig<T> {
    return this.config;
  }
}


export default StateMachine;
