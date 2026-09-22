import { RotateCcw } from 'lucide-react';
import GenderSelector from './GenderSelector';
import CountrySelector from './CountrySelector';
import LanguageSelector from './LanguageSelector';
import InterestSelector from './InterestSelector';
import Button from './Button';
import { GENDERS, GENDER_PREFS } from '../utils/constants';

const defaults = { gender: '', preferred_gender: 'Anyone', country: 'Any', language: 'Any', interests: [] };

export default function FilterPanel({ value, onChange, onApply, showApply = false }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-6">
      <GenderSelector label="You are" value={value.gender} onChange={(v) => set('gender', v)} options={GENDERS} />
      <GenderSelector label="Match me with" value={value.preferred_gender} onChange={(v) => set('preferred_gender', v)} options={GENDER_PREFS} />
      <div className="grid sm:grid-cols-2 gap-4">
        <CountrySelector value={value.country} onChange={(v) => set('country', v)} />
        <LanguageSelector value={value.language} onChange={(v) => set('language', v)} />
      </div>
      <InterestSelector value={value.interests} onChange={(v) => set('interests', v)} />
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="ghost" size="sm" onClick={() => onChange(defaults)} leftIcon={<RotateCcw className="w-4 h-4" />}>
          Reset filters
        </Button>
        {showApply && <Button size="sm" onClick={onApply}>Apply</Button>}
      </div>
    </div>
  );
}
