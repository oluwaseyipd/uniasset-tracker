import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Function to call when modal state changes */
  onOpenChange: (open: boolean) => void;
  /** Title of the confirmation modal */
  title: string;
  /** Description/message for the confirmation */
  description: string;
  /** Function to call when user confirms */
  onConfirm: () => void;
  /** Text for the confirm button (default: "Delete") */
  confirmText?: string;
  /** Text for the cancel button (default: "Cancel") */
  cancelText?: string;
  /** Variant for the confirm button (default: "destructive") */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Whether the confirm action is loading */
  loading?: boolean;
  /** Type of confirmation (affects icon and styling) */
  type?: "delete" | "warning" | "info";
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  loading = false,
  type = "delete",
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Trash2 className="h-6 w-6 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "info":
        return <AlertTriangle className="h-6 w-6 text-blue-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-destructive" />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={confirmVariant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ConfirmationTriggerProps {
  /** The trigger element (usually a button) */
  children: React.ReactNode;
  /** Title of the confirmation modal */
  title: string;
  /** Description/message for the confirmation */
  description: string;
  /** Function to call when user confirms */
  onConfirm: () => void;
  /** Text for the confirm button (default: "Delete") */
  confirmText?: string;
  /** Text for the cancel button (default: "Cancel") */
  cancelText?: string;
  /** Variant for the confirm button (default: "destructive") */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Whether the confirm action is loading */
  loading?: boolean;
  /** Type of confirmation (affects icon and styling) */
  type?: "delete" | "warning" | "info";
}

/**
 * A convenience component that combines a trigger with the confirmation modal.
 * Useful when you want a button that directly opens the confirmation modal.
 */
export function ConfirmationTrigger({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmVariant = "destructive",
  loading = false,
  type = "delete",
}: ConfirmationTriggerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        onConfirm={onConfirm}
        confirmText={confirmText}
        cancelText={cancelText}
        confirmVariant={confirmVariant}
        loading={loading}
        type={type}
      />
    </>
  );
}
