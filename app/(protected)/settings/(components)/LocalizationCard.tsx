import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const LocalizationCard = () => {
  return (
    <div className="w-full flex flex-col gap-8 bg-background rounded-lg hover:shadow-lg transition-shadow my-8 p-6">
      <div>
        <div className="flex items-center gap-2">
          <Globe />
          <h2 className="text-md border-b-0 pb-0">Localization</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Set your preferred currency and timezone.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Currency */}
        <Field>
          <Label>Currency</Label>
          <Select>
            <SelectTrigger>
              <SelectValue defaultValue="IDR" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="IDR">IDR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        {/* Timezone */}
        <Field>
          <Label>Language</Label>
          <Select>
            <SelectTrigger>
              <SelectValue defaultValue="IDR" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="IDR">IDR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
};

export default LocalizationCard;
