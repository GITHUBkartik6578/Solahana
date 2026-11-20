/**
 * Financial Kundli answer state: a plain reducer over the answer model in kundliInputs.js. Browser memory only.
 *
 * Field paths are arrays: ['fields', 'income'], ['assets', 'amounts', 'MF'], ['goal', id, 'cost'], ['ret', 'age'], ['asm', 'inf'].
 */
import { emptyAnswers, blankField, blankGoal } from './kundliInputs.js';
import { GOALS } from './kundliCopy.js';

function readPath(a, path) {
  if (path[0] === 'goal') return a.goals.find((g) => g.id === path[1])?.[path[2]];
  return path.reduce((node, key) => node?.[key], a);
}

function writePath(a, path, value) {
  if (path[0] === 'goal') {
    return { ...a, goals: a.goals.map((g) => (g.id === path[1] ? { ...g, [path[2]]: value } : g)) };
  }
  const [head, ...rest] = path;
  if (rest.length === 0) return { ...a, [head]: value };
  return { ...a, [head]: writePath(a[head], rest, value) };
}

const resetChecklist = (list) => ({
  skipped: false,
  confirmed: false,
  ticked: Object.fromEntries(Object.keys(list.ticked).map((k) => [k, false])),
  amounts: Object.fromEntries(Object.keys(list.amounts).map((k) => [k, blankField()])),
});

export const initialState = () => emptyAnswers();

export function kundliReducer(a, action) {
  switch (action.type) {
    case 'typed': {
      const field = readPath(a, action.path);
      if (!field) return a;
      // Typing always means "entered"; a typed retirement spend loses its button source.
      const next = { ...field, raw: action.raw, state: '' };
      if ('source' in field) next.source = 'typed';
      return writePath(a, action.path, next);
    }
    case 'state': {
      const field = readPath(a, action.path);
      if (!field) return a;
      const next = { ...field, raw: action.state ? '' : field.raw, state: action.state };
      if ('source' in field) next.source = 'typed'; // a button-filled retirement spend is no longer button-filled
      return writePath(a, action.path, next);
    }
    case 'choice':
      return { ...a, [action.key]: action.value };
    case 'tick': {
      const list = a[action.list];
      const ticked = !list.ticked[action.key];
      // Any change to the checklist resets the confirmation; unticking removes that item's amount.
      return {
        ...a,
        [action.list]: {
          ...list,
          confirmed: false,
          ticked: { ...list.ticked, [action.key]: ticked },
          amounts: ticked ? list.amounts : { ...list.amounts, [action.key]: blankField() },
        },
      };
    }
    case 'confirm':
      return { ...a, [action.list]: { ...a[action.list], confirmed: !!action.value, skipped: false } };
    case 'skip':
      return { ...a, [action.list]: action.value ? { ...resetChecklist(a[action.list]), skipped: true } : resetChecklist(a[action.list]) };
    case 'goalsGate': {
      if (action.value !== 'yes') return { ...a, goalsGate: action.value, goals: [] };
      return { ...a, goalsGate: 'yes', goals: a.goals.length ? a.goals : [blankGoal()] };
    }
    case 'addGoal':
      return a.goals.length >= GOALS.max ? a : { ...a, goals: [...a.goals, blankGoal()] };
    case 'removeGoal': {
      const goals = a.goals.filter((g) => g.id !== action.id);
      return { ...a, goals, goalsGate: goals.length ? a.goalsGate : '' };
    }
    case 'goalProp':
      return { ...a, goals: a.goals.map((g) => (g.id === action.id ? { ...g, [action.key]: action.value } : g)) };
    case 'retGate': {
      const fresh = emptyAnswers().ret;
      return { ...a, retGate: action.value, ret: action.value === 'yes' ? a.ret : fresh };
    }
    case 'fillSpend':
      return { ...a, ret: { ...a.ret, spend: { raw: action.raw, state: '', source: action.source } } };
    case 'load':
      return action.answers;
    case 'reset':
      return emptyAnswers();
    default:
      return a;
  }
}

/** True once anything has been answered (used for the leave-page warning). */
export function hasAnswers(a) {
  return JSON.stringify(a) !== JSON.stringify(emptyAnswers());
}
