
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ModerationSettingsProps {
  autoMod: boolean;
  onUpdate: (key: string, value: any) => void;
}

const ModerationSettings = ({ autoMod, onUpdate }: ModerationSettingsProps) => {
  return (
    <div id="moderation" className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold">Moderation</h2>
        <p className="text-trioguard-dark/70 text-sm">
          Configure automated moderation and protection
        </p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Auto Moderation</h3>
            <p className="text-sm text-trioguard-dark/70">
              Automatically detect and handle spam, inappropriate content, and raids
            </p>
          </div>
          <Switch
            checked={autoMod}
            onCheckedChange={(checked) => onUpdate('autoMod', checked)}
          />
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              <h3 className="font-medium">Advanced Moderation Settings</h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Anti-Spam Sensitivity</h4>
                  <ToggleGroup type="single" defaultValue="medium">
                    <ToggleGroupItem value="low">Low</ToggleGroupItem>
                    <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
                    <ToggleGroupItem value="high">High</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Filter Profanity</h4>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Anti-Raid Protection</h4>
                  <Switch defaultChecked />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ModerationSettings;
