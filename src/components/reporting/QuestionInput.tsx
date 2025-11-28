import { Question } from '@/types/radpilot';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  question: Question;
  value: string | number | boolean | string[] | undefined;
  onChange: (value: string | number | boolean | string[]) => void;
}

export default function QuestionInput({ question, value, onChange }: Props) {
  switch (question.type) {
    case 'radio':
      return (
        <RadioGroup
          value={value as string}
          onValueChange={onChange}
          className="space-y-3"
        >
          {question.options?.map((option) => (
            <div key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="flex-1 cursor-pointer text-base">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'dropdown':
      return (
        <Select value={value as string} onValueChange={onChange}>
          <SelectTrigger className="w-full h-12 text-base">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option) => (
              <SelectItem key={option} value={option} className="text-base">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'numeric':
      return (
        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <Input
              type="number"
              value={value as number || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="text-lg h-12"
              placeholder="Enter value..."
            />
            {question.unit && (
              <span className="text-gray-500 font-medium">{question.unit}</span>
            )}
          </div>
        </div>
      );

    case 'text':
      return (
        <Input
          type="text"
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          className="text-base h-12"
          placeholder="Enter your answer..."
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[150px] text-base"
          placeholder="Enter detailed information..."
        />
      );

    default:
      return null;
  }
}
