import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatRupeesExact } from '../../utils/healthCheckInsights';
import { readField, CORE_RULES, RULES } from '../../utils/kundli/kundliInputs';
import {
  ASSET_KEYS,
  ASSETS,
  ASSUMPTIONS,
  CORE_CHOICES,
  CORE_FIELDS,
  DISCLOSURES,
  GOALS,
  LIABILITIES,
  LIABILITY_KEYS,
  LOAN_KEYS,
  RETIREMENT,
  STATES,
} from '../../utils/kundli/kundliCopy';
import { AnswerField, CheckboxRow, ChoiceField, ErrorText } from './KundliFields';
import { linkButton } from './kundliStyles';

import { fid } from './kundliIds';

function Core({ name, a, dispatch, errors }) {
  const rule = CORE_RULES[name];
  return (
    <AnswerField
      id={fid(name)}
      label={CORE_FIELDS[name].label}
      help={CORE_FIELDS[name].help}
      field={a.fields[name]}
      allow={rule.allow}
      onType={(raw) => dispatch({ type: 'typed', path: ['fields', name], raw })}
      onState={(state) => dispatch({ type: 'state', path: ['fields', name], state })}
      error={errors[name]}
    />
  );
}

const Stack = ({ children }) => <div className="grid gap-7">{children}</div>;

function Checklist({ listName, copy, keys, a, dispatch, errors }) {
  const list = a[listName];
  if (list.skipped) {
    return (
      <div className="rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] p-4 text-[14.5px] text-[#475569]">
        <p>{copy.skippedNote}</p>
        <button type="button" className={`${linkButton} mt-2`} onClick={() => dispatch({ type: 'skip', list: listName, value: false })}>
          {copy.undoSkip}
        </button>
      </div>
    );
  }
  return (
    <Stack>
      <fieldset>
        <legend className="block font-serif-luxury text-[16px] font-bold text-[#0F1F45]">{copy.heading}</legend>
        <p className="mt-1 text-[13.5px] leading-relaxed text-[#5B6B84]">{copy.instruction}</p>
        {copy.precedence && <p className="mt-1 text-[13.5px] font-semibold leading-relaxed text-[#1A3170]">{copy.precedence}</p>}
        <div className="mt-3 grid gap-2.5">
          {keys.map((k) => (
            <CheckboxRow key={k} id={fid(`${listName}.tick.${k}`)} checked={list.ticked[k]} onChange={() => dispatch({ type: 'tick', list: listName, key: k })}>
              {copy.items[k].label}
            </CheckboxRow>
          ))}
        </div>
      </fieldset>
      <div>
        <CheckboxRow id={fid(`${listName}.confirm`)} checked={list.confirmed} onChange={(e) => dispatch({ type: 'confirm', list: listName, value: e.target.checked })}>
          <strong className="font-semibold text-[#0F1F45]">{copy.confirm}</strong>
        </CheckboxRow>
        <ErrorText id={`${fid(`${listName}.confirm`)}-err`}>{errors[`${listName}.confirm`]}</ErrorText>
      </div>
      <div>
        <button type="button" className={linkButton} onClick={() => dispatch({ type: 'skip', list: listName, value: true })}>
          {copy.skip}
        </button>
      </div>
      {listName === 'assets' && <p className="text-[13px] text-[#5B6B84]">{ASSETS.cashNote}</p>}
    </Stack>
  );
}

function Amounts({ listName, copy, keys, a, dispatch, errors }) {
  const list = a[listName];
  return (
    <Stack>
      <h3 className="font-serif-luxury text-[16px] font-bold text-[#0F1F45]">{copy.amountsHeading}</h3>
      {keys
        .filter((k) => list.ticked[k])
        .map((k) => (
          <AnswerField
            key={k}
            id={fid(`${listName}.${k}`)}
            label={copy.items[k].amountLabel}
            help={copy.items[k].help}
            field={list.amounts[k]}
            allow={['not-sure']}
            onType={(raw) => dispatch({ type: 'typed', path: [listName, 'amounts', k], raw })}
            onState={(state) => dispatch({ type: 'state', path: [listName, 'amounts', k], state })}
            error={errors[`${listName}.${k}`]}
          />
        ))}
    </Stack>
  );
}

function EmiNotes({ a }) {
  const emi = readField(a.fields.emi, CORE_RULES.emi);
  const l = a.liabilities;
  if (l.skipped || !l.confirmed || emi.error) return null;
  const anyLoan = LOAN_KEYS.some((k) => l.ticked[k]);
  const note = emi.value > 0 && !anyLoan ? LIABILITIES.emiNoLoan : anyLoan && emi.value === 0 ? LIABILITIES.loanNoEmi : null;
  if (!note) return null;
  return <p className="rounded-xl border border-[#C9A04F]/40 bg-[#C9A04F]/10 p-4 text-[14px] text-[#0F1F45]">{note}</p>;
}

function GoalCard({ g, index, dispatch, errors }) {
  const p = (key) => `goal.${g.id}.${key}`;
  return (
    <div className="rounded-2xl border border-[#E4E8F0] bg-[#F7F8FB] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif-luxury text-[16px] font-bold text-[#0F1F45]">{GOALS.goalHeading(index + 1)}</h3>
        <button type="button" className={`${linkButton} gap-1.5 text-red-700`} onClick={() => dispatch({ type: 'removeGoal', id: g.id })}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {GOALS.remove}
        </button>
      </div>
      <div className="mt-4 grid gap-6">
        <ChoiceField
          id={fid(p('type'))}
          label={GOALS.type}
          options={GOALS.types}
          value={g.type}
          onChange={(value) => dispatch({ type: 'goalProp', id: g.id, key: 'type', value })}
          error={errors[p('type')]}
        />
        {g.type === 'other' && (
          <div>
            <label htmlFor={fid(p('name'))} className="block font-serif-luxury text-[15px] font-bold text-[#0F1F45]">
              {GOALS.name}
            </label>
            <input
              id={fid(p('name'))}
              type="text"
              maxLength={60}
              autoComplete="off"
              value={g.name}
              onChange={(e) => dispatch({ type: 'goalProp', id: g.id, key: 'name', value: e.target.value })}
              aria-invalid={errors[p('name')] ? 'true' : undefined}
              aria-describedby={errors[p('name')] ? `${fid(p('name'))}-err` : undefined}
              className={`mt-3 w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-[#0F1F45] focus:outline-none focus:ring-2 focus:ring-[#2F5BC7]/25 ${errors[p('name')] ? 'border-red-400' : 'border-[#E4E8F0]'}`}
            />
            <ErrorText id={`${fid(p('name'))}-err`}>{errors[p('name')]}</ErrorText>
          </div>
        )}
        <AnswerField
          id={fid(p('cost'))}
          label={GOALS.cost}
          help={GOALS.costHelp}
          field={g.cost}
          allow={RULES.goalCost.allow}
          onType={(raw) => dispatch({ type: 'typed', path: ['goal', g.id, 'cost'], raw })}
          onState={(state) => dispatch({ type: 'state', path: ['goal', g.id, 'cost'], state })}
          error={errors[p('cost')]}
        />
        <AnswerField
          id={fid(p('years'))}
          label={GOALS.years}
          kind="whole"
          suffix="years"
          field={g.years}
          allow={RULES.goalYears.allow}
          onType={(raw) => dispatch({ type: 'typed', path: ['goal', g.id, 'years'], raw })}
          onState={(state) => dispatch({ type: 'state', path: ['goal', g.id, 'years'], state })}
          error={errors[p('years')]}
        />
        <AnswerField
          id={fid(p('saved'))}
          label={GOALS.saved}
          help={GOALS.savedHelp}
          field={g.saved}
          allow={RULES.goalSaved.allow}
          noneLabel={STATES.nothingYet}
          onType={(raw) => dispatch({ type: 'typed', path: ['goal', g.id, 'saved'], raw })}
          onState={(state) => dispatch({ type: 'state', path: ['goal', g.id, 'saved'], state })}
          error={errors[p('saved')]}
        />
      </div>
    </div>
  );
}

function GoalsScreen({ a, dispatch, errors }) {
  const gateOptions = [
    { value: 'yes', label: GOALS.gateYes },
    { value: 'no', label: GOALS.gateNo },
  ];
  const setGate = (value) => {
    if (value !== 'yes' && a.goals.length > 0 && typeof window !== 'undefined' && !window.confirm(GOALS.removeAllConfirm)) return;
    dispatch({ type: 'goalsGate', value });
  };
  return (
    <Stack>
      <ChoiceField id={fid('goalsGate')} label={GOALS.gate} options={gateOptions} value={a.goalsGate} onChange={setGate} error={errors.goalsGate} />
      {a.goalsGate === 'yes' && (
        <>
          {a.goals.map((g, i) => (
            <GoalCard key={g.id} g={g} index={i} dispatch={dispatch} errors={errors} />
          ))}
          {a.goals.length < GOALS.max ? (
            <button
              type="button"
              onClick={() => dispatch({ type: 'addGoal' })}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-dashed border-[#2F5BC7]/50 bg-white px-5 text-[14.5px] font-semibold text-[#1A3170] hover:bg-[#EEF2FB]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {GOALS.add}
            </button>
          ) : (
            <p className="text-[13.5px] text-[#5B6B84]">{GOALS.maxNote}</p>
          )}
        </>
      )}
    </Stack>
  );
}

function RetirementScreen({ a, dispatch, errors }) {
  const gateOptions = [
    { value: 'yes', label: RETIREMENT.gateYes },
    { value: 'retired', label: RETIREMENT.gateRetired },
    { value: 'no', label: RETIREMENT.gateNo },
  ];
  const touched = ['age', 'at', 'until', 'spend'].some((k) => a.ret[k].raw || a.ret[k].state);
  const setGate = (value) => {
    if (value !== 'yes' && touched && typeof window !== 'undefined' && !window.confirm(RETIREMENT.removeConfirm)) return;
    dispatch({ type: 'retGate', value });
  };
  const fixed = readField(a.fields.expenses, CORE_RULES.expenses);
  const other = readField(a.fields.other, CORE_RULES.other);
  const otherKnown = other.status === 'entered' || other.status === 'none';
  const rupees = (paise) => formatRupeesExact(paise);
  const age = (key, label, help) => (
    <AnswerField
      id={fid(`ret.${key}`)}
      label={label}
      help={help}
      kind="whole"
      suffix="years"
      field={a.ret[key]}
      onType={(raw) => dispatch({ type: 'typed', path: ['ret', key], raw })}
      onState={() => {}}
      error={errors[`ret.${key}`]}
    />
  );
  return (
    <Stack>
      <ChoiceField id={fid('retGate')} label={RETIREMENT.gate} options={gateOptions} value={a.retGate} onChange={setGate} error={errors.retGate} />
      {a.retGate === 'retired' && <p className="rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] p-4 text-[14.5px] text-[#475569]">{RETIREMENT.retiredNote}</p>}
      {a.retGate === 'yes' && (
        <>
          {age('age', RETIREMENT.age)}
          {age('at', RETIREMENT.at)}
          {age('until', RETIREMENT.until, RETIREMENT.untilHelp)}
          <AnswerField
            id={fid('ret.spend')}
            label={RETIREMENT.spend}
            help={RETIREMENT.spendHelp}
            field={a.ret.spend}
            allow={RULES.retSpend.allow}
            onType={(raw) => dispatch({ type: 'typed', path: ['ret', 'spend'], raw })}
            onState={(state) => dispatch({ type: 'state', path: ['ret', 'spend'], state })}
            error={errors['ret.spend']}
          >
            {a.ret.spend.state !== 'not-sure' && !fixed.error && fixed.value > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'fillSpend', raw: String(fixed.value / 100), source: 'fixed' })}
                  className={`min-h-[48px] rounded-xl border px-4 py-2.5 text-left text-[14px] font-semibold ${a.ret.spend.source === 'fixed' ? 'border-[#2F5BC7] bg-[#EEF2FB] text-[#1A3170]' : 'border-[#E4E8F0] bg-white text-[#0F1F45] hover:border-[#2F5BC7]/50'}`}
                >
                  {RETIREMENT.fixedButton(rupees(fixed.value))}
                </button>
                <div>
                  <button
                    type="button"
                    disabled={!otherKnown}
                    aria-describedby={!otherKnown ? 'k-plus-other-why' : undefined}
                    onClick={() => dispatch({ type: 'fillSpend', raw: String((fixed.value + other.value) / 100), source: 'fixedPlusOther' })}
                    className={`min-h-[48px] w-full rounded-xl border px-4 py-2.5 text-left text-[14px] font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${a.ret.spend.source === 'fixedPlusOther' ? 'border-[#2F5BC7] bg-[#EEF2FB] text-[#1A3170]' : 'border-[#E4E8F0] bg-white text-[#0F1F45] hover:border-[#2F5BC7]/50'}`}
                  >
                    {RETIREMENT.fixedPlusOtherButton(otherKnown ? rupees(fixed.value + other.value) : '—')}
                  </button>
                  {!otherKnown && (
                    <p id="k-plus-other-why" className="mt-1 text-[12.5px] text-[#5B6B84]">
                      {RETIREMENT.plusOtherDisabled}
                    </p>
                  )}
                </div>
              </div>
            )}
            {(a.ret.spend.source === 'fixed' || a.ret.spend.source === 'fixedPlusOther') && (
              <p className="mt-2 text-[13px] font-semibold text-[#A67C2E]">{STATES.estimate}</p>
            )}
          </AnswerField>
          <p className="rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] p-4 text-[14px] text-[#475569]">{RETIREMENT.savingsNote}</p>
        </>
      )}
    </Stack>
  );
}

function AssumptionsScreen({ a, dispatch, errors }) {
  const rate = (key, label, help) => (
    <AnswerField
      id={fid(`asm.${key}`)}
      label={label}
      help={help}
      kind="percent"
      suffix="%"
      field={a.asm[key]}
      allow={RULES[key].allow}
      onType={(raw) => dispatch({ type: 'typed', path: ['asm', key], raw })}
      onState={(state) => dispatch({ type: 'state', path: ['asm', key], state })}
      error={errors[`asm.${key}`]}
    />
  );
  return (
    <Stack>
      {rate('inf', ASSUMPTIONS.inf, ASSUMPTIONS.infHelp)}
      {rate('ret', ASSUMPTIONS.ret, ASSUMPTIONS.retHelp)}
      <div className="rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] p-4 text-[13.5px] leading-relaxed text-[#475569]">
        <p>{DISCLOSURES.sipTiming}</p>
        <p className="mt-2">{DISCLOSURES.savedGrowth}</p>
      </div>
    </Stack>
  );
}

/** The fields of one questionnaire screen. */
export default function KundliScreen({ screen, a, dispatch, errors }) {
  const props = { a, dispatch, errors };
  switch (screen) {
    case 'income':
      return (
        <Stack>
          {['income', 'expenses', 'emi', 'other'].map((n) => (
            <Core key={n} name={n} {...props} />
          ))}
        </Stack>
      );
    case 'savings':
      return (
        <Stack>
          <Core name="savings" {...props} />
          <Core name="investments" {...props} />
        </Stack>
      );
    case 'protection':
      return (
        <Stack>
          <Core name="termCover" {...props} />
          <Core name="healthCover" {...props} />
        </Stack>
      );
    case 'habits':
      return (
        <Stack>
          {['overlap', 'business'].map((k) => (
            <ChoiceField
              key={k}
              id={fid(k)}
              label={CORE_CHOICES[k].label}
              help={CORE_CHOICES[k].help}
              options={CORE_CHOICES[k].options}
              value={a[k]}
              onChange={(value) => dispatch({ type: 'choice', key: k, value })}
              error={errors[k]}
            />
          ))}
        </Stack>
      );
    case 'ownList':
      return <Checklist listName="assets" copy={ASSETS} keys={ASSET_KEYS} {...props} />;
    case 'ownAmounts':
      return <Amounts listName="assets" copy={ASSETS} keys={ASSET_KEYS} {...props} />;
    case 'oweList':
      return (
        <Stack>
          <Checklist listName="liabilities" copy={LIABILITIES} keys={LIABILITY_KEYS} {...props} />
          <EmiNotes a={a} />
        </Stack>
      );
    case 'oweAmounts':
      return (
        <Stack>
          <Amounts listName="liabilities" copy={LIABILITIES} keys={LIABILITY_KEYS} {...props} />
          <EmiNotes a={a} />
        </Stack>
      );
    case 'goals':
      return <GoalsScreen {...props} />;
    case 'retirement':
      return <RetirementScreen {...props} />;
    case 'assumptions':
      return <AssumptionsScreen {...props} />;
    default:
      return null;
  }
}

