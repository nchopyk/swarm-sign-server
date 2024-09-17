
export type State = string;

export type StateMachineContext = Record<string, unknown>;

export interface IStateMachineEntity<T> {
  withContext(context: StateMachineContext): IStateMachineEntity<T>;

  can(transitionName: string): Promise<boolean>;

  canThrow(transitionName: string): Promise<void>;

  to(transitionName: string): Promise<void>;

  apply(transitionName: string): Promise<void>;
}


export interface StateTransition<T> {
  from: State[];
  to: State;
  validate?: (entity: T, context: StateMachineContext) => boolean | Promise<boolean>;
  preHandler?: (entity: T, context: StateMachineContext, machine: IStateMachineEntity<T>) => void | Promise<void>;
  postHandler?: (entity: T, context: StateMachineContext, machine: IStateMachineEntity<T>) => void | Promise<void>;
  success?: (entity: T, context: StateMachineContext) => void | Promise<void>;
  failure?: (error: Error, originEntity: T, entity: T, context: StateMachineContext) => void | Promise<void>;
}


export interface StateMachineConfig<T> {
  getState: (entity: T) => State;
  setState: (entity: T, state: State) => T;
  persist: (entity: T, state: State, context: StateMachineContext) => void | Promise<void>;
  states: State[];
  transitions: { [key: string]: StateTransition<T> };
}

export interface IStateMachine<T> {
  from(entity: T): IStateMachineEntity<T>;

  getStateFrom(entity: T): State;

  getConfig(): StateMachineConfig<T>;
}


