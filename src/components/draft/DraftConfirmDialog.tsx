
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DraftConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlayerName: string | undefined;
  currentTeam: 'A' | 'B';
  onConfirm: () => void;
  onCancel: () => void;
}

const DraftConfirmDialog: React.FC<DraftConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedPlayerName,
  currentTeam,
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Selection</DialogTitle>
          <DialogDescription>
            Team {currentTeam} Captain, do you want to draft {selectedPlayerName}?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DraftConfirmDialog;
