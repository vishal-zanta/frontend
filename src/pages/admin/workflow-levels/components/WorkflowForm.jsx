import MySelect from '@/components/inputs/MySelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, X } from 'lucide-react'
import React from 'react'

const WorkflowForm = ({editLevel,roleOptions, dialog, setDialog, handleSaveLevel, isPending }) => {
  return (
      <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">
                  {editLevel ? "Edit Level" : "Add Workflow Level"}
                </h3>
                <button
                  onClick={() => setDialog(null)}
                  className="p-1.5 hover:bg-muted rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="mb-1.5 block">Role <span className="text-red-500">*</span></Label>
                  <MySelect
                    options={roleOptions}
                    value={dialog.role || ""}
                    onValueChange={(val) => setDialog({ ...dialog, role: val })}
                    placeholder="Select Role..."
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Description</Label>
                  <Input
                    value={dialog.description || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, description: e.target.value })
                    }
                    placeholder="Description..."
                  />
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSaveLevel}
                  disabled={isPending}
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>
  )
}

export default WorkflowForm