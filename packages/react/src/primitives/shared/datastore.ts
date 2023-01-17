import {
  PersistentModel,
  RecursiveModelPredicateExtender,
  RecursiveModelPredicate,
  RecursiveModelPredicateAggregateExtender,
  PredicateFieldType,
} from '@aws-amplify/datastore';
import { DataStorePredicateObject } from '../types/datastore';

/**
 * Given an array of predicates, compose them in sequential order
 */
const mergePredicates = <Model extends PersistentModel>(
  predicates: RecursiveModelPredicateExtender<Model>[]
): RecursiveModelPredicateAggregateExtender<Model> => {
  return (model) => predicates.map((predicate) => predicate(model));
};

/**
 * Creates a DataStore compatible predicate function from an object representation
 * @internal
 */
export const createDataStorePredicate = <Model extends PersistentModel>(
  predicateObject: DataStorePredicateObject
): RecursiveModelPredicateExtender<Model> => {
  const {
    and: groupAnd,
    or: groupOr,
    field,
    operator,
    operand,
  } = predicateObject;

  if (Array.isArray(groupAnd)) {
    const predicates = groupAnd.map((condition) =>
      createDataStorePredicate<Model>(condition)
    );

    return (p: RecursiveModelPredicate<Model>) =>
      p.and(mergePredicates(predicates));
  }

  if (Array.isArray(groupOr)) {
    const predicates = groupOr.map((condition) =>
      createDataStorePredicate<Model>(condition)
    );

    return (p: RecursiveModelPredicate<Model>) =>
      p.or(mergePredicates(predicates));
  }

  return (p: RecursiveModelPredicate<Model>) => {
    const fieldValue = field
      ? (p?.[field] as RecursiveModelPredicate<
          PredicateFieldType<Model[string]>
        >)
      : null;
    const finalOperator =
      operator && fieldValue
        ? fieldValue?.[
            operator as keyof RecursiveModelPredicate<
              PredicateFieldType<Model[string]>
            >
          ]
        : null;
    if (finalOperator !== null) {
      return (finalOperator as Function)(
        operand
      ) as RecursiveModelPredicate<Model>;
    }

    return p;
  };
};
